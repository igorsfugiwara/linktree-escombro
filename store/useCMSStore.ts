// ============================================================
// CONTROLLER LAYER — store/useCMSStore.ts
// Central state via React Context backed by Firebase RTDB.
// All writes go to Firebase; all reads stream from Firebase
// so any device sees the same data in real time.
// ============================================================

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { ref, onValue, set, update, remove } from 'firebase/database';
import { db } from '../firebase';
import { LinkItem, SiteConfig, UserProfile } from '../types';

// --- Default Data (used only when the database is empty) ---
const DEFAULT_LINKS: LinkItem[] = [
  {
    id: '1',
    title: 'ESCOMBRO, FIM DA AURORA, MILITIA, ZANGA na A PORTA MALDITA',
    url: 'https://www.sympla.com.br/evento/a-porta-maldita-escombro-militia-fim-da-aurora-zanga/3269624',
    iconKey: 'ticket',
    imageType: 'none',
    highlight: true,
    active: true,
    order: 0,
  },
  {
    id: '2',
    title: '⚠️ ⛓️ VIDA VAZIA ⛓️ ⚠️',
    url: 'https://fanlink.tv/escombro',
    iconKey: 'link',
    imageType: 'none',
    highlight: false,
    active: true,
    order: 1,
  },
  {
    id: '3',
    title: 'LOJA HEART MERCH',
    url: 'https://heartmerch.com.br/collections/escombro/',
    iconKey: 'cart',
    imageType: 'none',
    highlight: false,
    active: true,
    order: 2,
  },
  {
    id: '4',
    title: 'Escombro no Spotify',
    url: 'https://open.spotify.com/artist/11PXwcpndk1zz25pgz8uDY',
    iconKey: 'spotify',
    imageType: 'none',
    active: true,
    order: 3,
  },
  {
    id: '5',
    title: 'Escombro no Bandcamp',
    url: 'https://escombro-hc.bandcamp.com/',
    iconKey: 'bandcamp',
    imageType: 'none',
    active: true,
    order: 4,
  },
  {
    id: '6',
    title: 'YouTube',
    url: 'https://www.youtube.com/@EscombroHC',
    iconKey: 'youtube',
    imageType: 'none',
    active: true,
    order: 5,
  },
  {
    id: '7',
    title: 'Instagram',
    url: 'https://www.instagram.com/escombro.hc/',
    iconKey: 'instagram',
    imageType: 'none',
    active: true,
    order: 6,
  },
  {
    id: '8',
    title: 'Facebook',
    url: 'https://web.facebook.com/ESCOMBRO.HC/',
    iconKey: 'facebook',
    imageType: 'none',
    active: true,
    order: 7,
  },
];

const DEFAULT_SITE_CONFIG: SiteConfig = {
  backgroundType: 'url',
  backgroundValue: 'https://www.transparenttextures.com/patterns/rocky-wall.png',
  backgroundOverlay: 60,
};

// Profile is static — not stored in database
const DEFAULT_PROFILE: UserProfile = {
  name: 'Escombro',
  handle: '@escombro.hc',
  avatarUrl: './assets/logo_branco_2.png',
  subtitle: 'SÃO PAULO, BRASIL. HARDCORE POR UM MUNDO MAIS DIGNO',
};

// Firebase paths
const DB_PATHS = {
  LINKS: 'cms/links',
  SITE_CONFIG: 'cms/siteConfig',
} as const;

// --- Context ---
interface CMSContextType {
  links: LinkItem[];
  activeLinks: LinkItem[];
  siteConfig: SiteConfig;
  profile: UserProfile;
  loading: boolean;
  addLink: (link: Omit<LinkItem, 'id' | 'order'>) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (fromIndex: number, toIndex: number) => void;
  toggleLinkActive: (id: string) => void;
  updateSiteConfig: (updates: Partial<SiteConfig>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const CMSContext = createContext<CMSContextType | null>(null);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [profile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [linksInitialized, setLinksInitialized] = useState(false);
  const [configInitialized, setConfigInitialized] = useState(false);

  // Stream links from Firebase
  useEffect(() => {
    const linksRef = ref(db, DB_PATHS.LINKS);
    const unsub = onValue(linksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, LinkItem>;
        setLinks(Object.values(data));
      } else {
        // First time: seed defaults into Firebase
        const seed: Record<string, LinkItem> = {};
        DEFAULT_LINKS.forEach(l => { seed[l.id] = l; });
        set(ref(db, DB_PATHS.LINKS), seed);
      }
      setLinksInitialized(true);
    });
    return () => unsub();
  }, []);

  // Stream siteConfig from Firebase
  useEffect(() => {
    const configRef = ref(db, DB_PATHS.SITE_CONFIG);
    const unsub = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        setSiteConfig(snapshot.val() as SiteConfig);
      } else {
        set(ref(db, DB_PATHS.SITE_CONFIG), DEFAULT_SITE_CONFIG);
      }
      setConfigInitialized(true);
    });
    return () => unsub();
  }, []);

  // Loading is done when both streams have responded
  useEffect(() => {
    if (linksInitialized && configInitialized) setLoading(false);
  }, [linksInitialized, configInitialized]);

  // --- Link Actions (write to Firebase; stream updates local state) ---

  const addLink = useCallback((link: Omit<LinkItem, 'id' | 'order'>) => {
    setLinks(prev => {
      const newLink: LinkItem = {
        ...link,
        id: crypto.randomUUID(),
        order: prev.length,
      };
      set(ref(db, `${DB_PATHS.LINKS}/${newLink.id}`), newLink);
      return [...prev, newLink];
    });
  }, []);

  const updateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
    setLinks(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, ...updates } : l);
      const link = updated.find(l => l.id === id);
      if (link) update(ref(db, `${DB_PATHS.LINKS}/${id}`), updates);
      return updated;
    });
  }, []);

  const deleteLink = useCallback((id: string) => {
    remove(ref(db, `${DB_PATHS.LINKS}/${id}`));
    setLinks(prev => prev.filter(l => l.id !== id));
  }, []);

  const reorderLinks = useCallback((fromIndex: number, toIndex: number) => {
    setLinks(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);
      const reordered = sorted.map((l, i) => ({ ...l, order: i }));
      // Write all reordered links to Firebase
      const patch: Record<string, LinkItem> = {};
      reordered.forEach(l => { patch[l.id] = l; });
      set(ref(db, DB_PATHS.LINKS), patch);
      return reordered;
    });
  }, []);

  const toggleLinkActive = useCallback((id: string) => {
    setLinks(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, active: !l.active } : l);
      const link = updated.find(l => l.id === id);
      if (link) update(ref(db, `${DB_PATHS.LINKS}/${id}`), { active: link.active });
      return updated;
    });
  }, []);

  // --- Site Config Actions ---

  const updateSiteConfig = useCallback((updates: Partial<SiteConfig>) => {
    setSiteConfig(prev => {
      const next = { ...prev, ...updates };
      set(ref(db, DB_PATHS.SITE_CONFIG), next);
      return next;
    });
  }, []);

  // --- Profile (static, no DB) ---
  const updateProfile = useCallback((_updates: Partial<UserProfile>) => {
    // Profile is static in this project
  }, []);

  // --- Computed ---
  const activeLinks = links
    .filter(l => l.active)
    .sort((a, b) => a.order - b.order);

  const value: CMSContextType = {
    links, activeLinks, siteConfig, profile, loading,
    addLink, updateLink, deleteLink, reorderLinks, toggleLinkActive,
    updateSiteConfig, updateProfile,
  };

  return React.createElement(CMSContext.Provider, { value }, children);
};

export function useCMSStore() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMSStore must be used inside CMSProvider');
  return ctx;
}
