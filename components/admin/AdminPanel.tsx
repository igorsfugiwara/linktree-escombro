// ============================================================
// VIEW LAYER + CONTROLLER — components/admin/AdminPanel.tsx
// Full CMS dashboard: link management, background config,
// drag-to-reorder, and site settings.
// ============================================================

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { useCMSStore } from '../../store/useCMSStore';
import { useAuth } from '../../hooks/useAuth';
import { LinkItem } from '../../types';
import LinkEditor from './LinkEditor';
import IconRenderer from '../IconRenderer';

type Tab = 'links' | 'background' | 'preview';

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    links,
    siteConfig,
    profile,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    toggleLinkActive,
    updateSiteConfig,
    updateProfile,
  } = useCMSStore();

  const [tab, setTab] = useState<Tab>('links');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [bgInputMode, setBgInputMode] = useState<'url' | 'upload'>('url');
  const [bgUrlInput, setBgUrlInput] = useState(
    siteConfig.backgroundType === 'url' ? siteConfig.backgroundValue : ''
  );
  const bgFileRef = useRef<HTMLInputElement>(null);
  const [bgUploading, setBgUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // --- Drag & Drop ---
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      reorderLinks(dragIndex, index);
      setDragIndex(index);
    }
  };
  const handleDragEnd = () => setDragIndex(null);

  // --- Save link ---
  const handleSaveNew = (data: Omit<LinkItem, 'id' | 'order'>) => {
    addLink(data);
    setIsAdding(false);
    showToast('Link adicionado!');
  };

  const handleSaveEdit = (id: string, data: Omit<LinkItem, 'id' | 'order'>) => {
    updateLink(id, data);
    setEditingId(null);
    showToast('Link atualizado!');
  };

  // --- Background ---
  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgUploading(true);
    try {
      const path = `backgrounds/${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      updateSiteConfig({ backgroundType: 'upload', backgroundValue: url });
      showToast('Background atualizado!');
    } catch (err) {
      console.error('Upload falhou:', err);
      showToast('Erro no upload da imagem.');
    } finally {
      setBgUploading(false);
    }
  };

  const handleBgUrlSave = () => {
    updateSiteConfig({ backgroundType: 'url', backgroundValue: bgUrlInput });
    showToast('Background atualizado!');
  };

  const tabClass = (t: Tab) =>
    `px-4 py-2.5 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${
      tab === t
        ? 'border-brand-green text-brand-green'
        : 'border-transparent text-neutral-500 hover:text-white'
    }`;

  const inputClass = "w-full bg-black border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-green transition-colors";

  return (
    <div className="min-h-screen bg-brand-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="./assets/logo_branco_2.png" alt="Escombro" className="h-7 w-auto" />
            <span className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-neutral-500 hover:text-white uppercase tracking-wider font-bold transition-colors"
            >
              Ver Site
            </a>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-xs text-red-500 hover:text-red-400 uppercase tracking-wider font-bold transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 border-b border-white/10">
        <div className="flex gap-1">
          <button className={tabClass('links')} onClick={() => setTab('links')}>Links</button>
          <button className={tabClass('background')} onClick={() => setTab('background')}>Background</button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* ── LINKS TAB ───────────────────────────────────── */}
        {tab === 'links' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-neutral-300">
                {links.length} links cadastrados
              </h2>
              <button
                onClick={() => { setIsAdding(true); setEditingId(null); }}
                className="bg-brand-green text-brand-black text-xs font-black uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors flex items-center gap-2"
                style={{ borderRadius: '2px' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                Novo Link
              </button>
            </div>

            {/* New link form */}
            {isAdding && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-green mb-3">Novo Link</h3>
                <LinkEditor
                  onSave={handleSaveNew}
                  onCancel={() => setIsAdding(false)}
                />
              </div>
            )}

            {/* Links list */}
            <div className="space-y-2">
              {sortedLinks.map((link, index) => (
                <div key={link.id}>
                  {editingId === link.id ? (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-green mb-3">Editando</h3>
                      <LinkEditor
                        initial={link}
                        onSave={data => handleSaveEdit(link.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <div
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={e => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 p-3 border transition-all cursor-grab active:cursor-grabbing ${
                        dragIndex === index
                          ? 'border-brand-green bg-brand-green/5'
                          : link.active
                          ? 'border-white/10 bg-neutral-900/50 hover:border-white/20'
                          : 'border-white/5 bg-neutral-950 opacity-50'
                      }`}
                      style={{ borderRadius: '2px' }}
                    >
                      {/* Drag handle */}
                      <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                      </svg>

                      {/* Icon */}
                      {link.iconKey && (
                        <div className="text-neutral-400 flex-shrink-0">
                          <IconRenderer iconKey={link.iconKey} size={16} />
                        </div>
                      )}

                      {/* Title + URL */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{link.title}</p>
                        <p className="text-xs text-neutral-600 truncate">{link.url}</p>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {link.highlight && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-brand-green border border-brand-green/30 px-1.5 py-0.5">
                            Destaque
                          </span>
                        )}
                        {link.imageType !== 'none' && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 border border-white/10 px-1.5 py-0.5">
                            {link.imageType}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleLinkActive(link.id)}
                          title={link.active ? 'Desativar' : 'Ativar'}
                          className={`p-1.5 transition-colors ${link.active ? 'text-brand-green hover:text-white' : 'text-neutral-600 hover:text-brand-green'}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.active ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'} />
                          </svg>
                        </button>
                        <button
                          onClick={() => { setEditingId(link.id); setIsAdding(false); }}
                          title="Editar"
                          className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Apagar "${link.title}"?`)) {
                              deleteLink(link.id);
                              showToast('Link removido.');
                            }
                          }}
                          title="Apagar"
                          className="p-1.5 text-neutral-600 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BACKGROUND TAB ──────────────────────────────── */}
        {tab === 'background' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-neutral-300">Background do Site</h2>

            {/* Current preview */}
            {siteConfig.backgroundValue && (
              <div
                className="w-full h-32 border border-white/10 relative overflow-hidden"
                style={{ borderRadius: '2px' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${siteConfig.backgroundValue})`,
                    backgroundSize: siteConfig.backgroundType === 'upload' ? 'cover' : 'auto',
                    opacity: 1 - siteConfig.backgroundOverlay / 100,
                  }}
                />
                <div className="absolute inset-0 bg-black" style={{ opacity: siteConfig.backgroundOverlay / 100 }} />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <span className="text-white text-xs uppercase tracking-widest font-bold opacity-60">Preview</span>
                </div>
              </div>
            )}

            {/* Input mode toggle */}
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Tipo de Imagem</label>
              <div className="flex gap-2">
                {(['url', 'upload'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setBgInputMode(mode)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider border transition-all ${
                      bgInputMode === mode
                        ? 'border-brand-green text-brand-green bg-brand-green/10'
                        : 'border-white/10 text-neutral-500 hover:text-white'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {mode === 'url' ? 'URL' : 'Upload'}
                  </button>
                ))}
                <button
                  onClick={() => { updateSiteConfig({ backgroundType: 'none', backgroundValue: '' }); showToast('Background removido.'); }}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider border border-white/10 text-neutral-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                  style={{ borderRadius: '2px' }}
                >
                  Remover
                </button>
              </div>
            </div>

            {bgInputMode === 'url' ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">URL da Imagem</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={bgUrlInput}
                    onChange={e => setBgUrlInput(e.target.value)}
                    className={inputClass}
                    placeholder="https://exemplo.com/bg.jpg"
                    style={{ borderRadius: '2px' }}
                  />
                  <button
                    onClick={handleBgUrlSave}
                    className="px-4 bg-brand-green text-brand-black font-black text-xs uppercase tracking-wider hover:bg-white transition-colors flex-shrink-0"
                    style={{ borderRadius: '2px' }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Upload de Imagem</label>
                <div
                  className="border border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-brand-green transition-colors"
                  style={{ borderRadius: '2px' }}
                  onClick={() => !bgUploading && bgFileRef.current?.click()}
                >
                  <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                  {bgUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                      <p className="text-neutral-400 text-xs uppercase tracking-wider">Enviando...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-neutral-500 text-xs uppercase tracking-wider">Clique para selecionar imagem</p>
                      <p className="text-neutral-700 text-xs mt-1">JPG, PNG, WebP recomendados</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Overlay opacity */}
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Overlay Escuro: {siteConfig.backgroundOverlay}%
              </label>
              <input
                type="range"
                min="0"
                max="95"
                value={siteConfig.backgroundOverlay}
                onChange={e => updateSiteConfig({ backgroundOverlay: Number(e.target.value) })}
                className="w-full accent-brand-green"
              />
              <div className="flex justify-between text-xs text-neutral-700 mt-1">
                <span>Transparente</span>
                <span>Escuro</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-green text-brand-black px-6 py-2 text-xs font-black uppercase tracking-wider shadow-xl" style={{ borderRadius: '2px' }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
