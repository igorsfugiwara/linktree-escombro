// MODEL LAYER
// Static data simulating a database or API response

import { UserProfile, SocialLink, AdConfig } from './types';

export const USER_PROFILE: UserProfile = {
  name: "Escombro",
  handle: "@escombro.hc",
  avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZPnzfu9HsmNrha3qu9ATysdpHZubhmWzddg&s", // Placeholder
  subtitle: "HARDCORE. SÃO PAULO, BRASIL. CONSTRUINDO SOBRE AS RUÍNAS."
};

// SVG Paths for icons
// Note: These must be STROKE-friendly paths (lines, not filled shapes) to work with LinkItem.tsx
const ICONS = {
  cart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  spotify: "M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z M8 11.5c2.5-1.2 5.5-1.2 8 0 M8.5 14c2-1 5-1 7 0 M9.5 16.5c1.5-.5 3.5-.5 5 0",
  youtube: "M21.582,5.193c-0.25-0.945-0.995-1.69-1.94-1.94C17.93,2.793,12,2.793,12,2.793s-5.93,0-7.642,0.46 c-0.945,0.25-1.69,0.995-1.94,1.94C2,6.905,2,10.5,2,10.5s0,3.595,0.418,5.307c0.25,0.945,0.995,1.69,1.94,1.94 C6.07,18.207,12,18.207,12,18.207s5.93,0,7.642-0.46c0.945-0.25,1.69-0.995,1.94-1.94C22,14.095,22,10.5,22,10.5 S22,6.905,21.582,5.193z M9.75,13.668V7.332L15.25,10.5L9.75,13.668z",
  instagram: "M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2L14 8 20 8"
};

export const LINKS: SocialLink[] = [
  {
    id: '1',
    title: 'LOJA HEART MERCH',
    url: 'https://heartmerch.com.br/collections/escombro/',
    highlight: true,
    iconPath: ICONS.cart
  },
  {
    id: '2',
    title: 'Escombro no Spotify',
    url: 'https://open.spotify.com/artist/11PXwcpndk1zz25pgz8uDY',
    iconPath: ICONS.spotify
  },
  {
    id: '3',
    title: 'YouTube',
    url: 'https://www.youtube.com/@EscombroHC',
    iconPath: ICONS.youtube
  },
  {
    id: '4',
    title: 'Instagram',
    url: 'https://www.instagram.com/escombro.hc/',
    iconPath: ICONS.instagram
  },
  {
    id: '5',
    title: 'Facebook',
    url: 'https://web.facebook.com/ESCOMBRO.HC/',
    iconPath: ICONS.facebook
  },
  {
    id: '6',
    title: 'Eletronic Press Kit 2023',
    url: 'https://escombro-epk23.netlify.app/',
    iconPath: ICONS.file
  }
];

export const FOOTER_AD: AdConfig = {
  id: 'ad-001',
  content: 'Confira a nova coleção de merchandising oficial.',
  ctaText: 'Ver Loja',
  ctaUrl: 'https://heartmerch.com.br/collections/escombro/'
};