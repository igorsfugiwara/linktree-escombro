// ============================================================
// MODEL LAYER — constants.ts
// Static configuration that doesn't need CMS management.
// Links and profile are now managed by useCMSStore (localStorage).
// ============================================================

import { AdConfig } from './types';

// Footer ad config — static, managed here
export const FOOTER_AD: AdConfig = {
  id: 'ad-001',
  content: 'Confira a nova coleção de merchandising oficial.',
  ctaText: 'Ver Loja',
  ctaUrl: 'https://heartmerch.com.br/collections/escombro/',
};
