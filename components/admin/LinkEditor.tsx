// ============================================================
// VIEW LAYER — components/admin/LinkEditor.tsx
// Form for creating or editing a LinkItem.
// Handles icon selection, image type, and image upload/URL.
// ============================================================

import React, { useState, useRef } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { LinkItem, IconKey, ImageType } from '../../types';
import { ICON_MAP } from '../../icons';
import IconRenderer from '../IconRenderer';

interface LinkEditorProps {
  initial?: Partial<LinkItem>;
  onSave: (data: Omit<LinkItem, 'id' | 'order'>) => void;
  onCancel: () => void;
}

const EMPTY_FORM: Omit<LinkItem, 'id' | 'order'> = {
  title: '',
  url: '',
  iconKey: 'link',
  imageType: 'none',
  imageUrl: '',
  highlight: false,
  active: true,
};

const LinkEditor: React.FC<LinkEditorProps> = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState<Omit<LinkItem, 'id' | 'order'>>({
    ...EMPTY_FORM,
    ...initial,
  });
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `images/${Date.now()}_${file.name}`;
      const fileRef2 = storageRef(storage, path);
      await uploadBytes(fileRef2, file);
      const url = await getDownloadURL(fileRef2);
      set('imageUrl', url);
    } catch (err) {
      console.error('Upload falhou:', err);
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Título obrigatório';
    if (!form.url.trim()) errs.url = 'URL obrigatória';
    else if (!/^https?:\/\/.+/.test(form.url.trim())) errs.url = 'URL deve começar com http:// ou https://';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  const inputClass = "w-full bg-black border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-green transition-colors";
  const labelClass = "block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="bg-neutral-900 border border-white/10 p-6 space-y-5">
      {/* Title */}
      <div>
        <label className={labelClass}>Título *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          className={inputClass}
          placeholder="Nome do link"
          style={{ borderRadius: '2px' }}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      {/* URL */}
      <div>
        <label className={labelClass}>URL *</label>
        <input
          type="url"
          value={form.url}
          onChange={e => set('url', e.target.value)}
          className={inputClass}
          placeholder="https://..."
          style={{ borderRadius: '2px' }}
        />
        {errors.url && <p className={errorClass}>{errors.url}</p>}
      </div>

      {/* Icon Selector */}
      <div>
        <label className={labelClass}>Ícone</label>
        <div className="grid grid-cols-6 gap-2">
          {(Object.keys(ICON_MAP) as IconKey[]).map(key => (
            <button
              key={key}
              type="button"
              title={ICON_MAP[key].label}
              onClick={() => set('iconKey', key)}
              className={`flex flex-col items-center justify-center p-2 border transition-all gap-1 ${
                form.iconKey === key
                  ? 'border-brand-green bg-brand-green/10 text-brand-green'
                  : 'border-white/10 text-neutral-500 hover:border-white/30 hover:text-white'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <IconRenderer iconKey={key} size={18} />
              <span className="text-[9px] uppercase tracking-wider leading-none">{ICON_MAP[key].label.split('/')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Type */}
      <div>
        <label className={labelClass}>Imagem no Link</label>
        <div className="flex gap-2">
          {(['none', 'avatar', 'banner'] as ImageType[]).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => set('imageType', type)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                form.imageType === type
                  ? 'border-brand-green bg-brand-green/10 text-brand-green'
                  : 'border-white/10 text-neutral-500 hover:text-white hover:border-white/30'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {type === 'none' ? 'Sem imagem' : type === 'avatar' ? 'Avatar (esquerda)' : 'Banner (topo)'}
            </button>
          ))}
        </div>
      </div>

      {/* Image Input — shown only when imageType !== 'none' */}
      {form.imageType !== 'none' && (
        <div>
          <label className={labelClass}>Imagem</label>
          <div className="flex gap-2 mb-2">
            {(['url', 'upload'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setImageInputMode(mode)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                  imageInputMode === mode
                    ? 'border-brand-green text-brand-green bg-brand-green/10'
                    : 'border-white/10 text-neutral-500 hover:text-white'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {mode === 'url' ? 'Por URL' : 'Upload'}
              </button>
            ))}
          </div>

          {imageInputMode === 'url' ? (
            <input
              type="url"
              value={form.imageUrl || ''}
              onChange={e => set('imageUrl', e.target.value)}
              className={inputClass}
              placeholder="https://exemplo.com/imagem.jpg"
              style={{ borderRadius: '2px' }}
            />
          ) : (
            <div
              className="border border-dashed border-white/20 p-4 text-center cursor-pointer hover:border-brand-green transition-colors"
              style={{ borderRadius: '2px' }}
              onClick={() => !uploading && fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                  <p className="text-neutral-400 text-xs uppercase tracking-wider">Enviando...</p>
                </div>
              ) : form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="max-h-24 mx-auto object-contain" />
              ) : (
                <p className="text-neutral-500 text-xs uppercase tracking-wider">Clique para selecionar imagem</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.highlight || false}
            onChange={e => set('highlight', e.target.checked)}
            className="w-4 h-4 accent-brand-green"
          />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Destaque</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => set('active', e.target.checked)}
            className="w-4 h-4 accent-brand-green"
          />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ativo</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-brand-green text-brand-black font-black uppercase tracking-widest py-2.5 text-sm hover:bg-white transition-colors"
          style={{ borderRadius: '2px' }}
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-neutral-800 text-white font-bold uppercase tracking-wider text-sm hover:bg-neutral-700 transition-colors border border-white/10"
          style={{ borderRadius: '2px' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default LinkEditor;
