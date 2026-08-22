// ============================================================
// MODEL LAYER — constants.ts
// Static configuration that doesn't need CMS management.
// Links and profile are now managed by useCMSStore (localStorage).
// ============================================================

import { AdConfig, LinkItem } from './types';

// Footer ad config — static, managed here
export const FOOTER_AD: AdConfig = {
  id: 'ad-001',
  content: 'Confira a nova coleção de merchandising oficial.',
  ctaText: 'Ver Loja',
  ctaUrl: 'https://heartmerch.com.br/collections/escombro/',
};

// ============================================================
// Shows passados
// Link de show é reconhecido pelo prefixo de data no título
// ("20/06 - AMERICANA ..."). Depois que a data passa, o link vai
// para o fim da lista e aparece riscado, em vez de continuar no topo.
// ============================================================

const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/** Lê o prefixo dd/mm (ou dd/mm/aaaa) do título. Retorna null se não houver. */
export const parseShowDate = (title: string): Date | null => {
  const match = title.trim().match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  if (day < 1 || day > 31 || month < 0 || month > 11) return null;

  if (match[3]) {
    const year = parseInt(match[3], 10);
    return new Date(year < 100 ? 2000 + year : year, month, day);
  }

  // Sem ano no título: assume o ano corrente. Se isso jogar a data para mais
  // de seis meses atrás, é show do ano seguinte anunciado na virada — então
  // conta como o próximo ano, para não nascer marcado como passado.
  const today = startOfToday();
  const event = new Date(today.getFullYear(), month, day);
  const SIX_MONTHS_MS = 182 * 24 * 60 * 60 * 1000;
  if (today.getTime() - event.getTime() > SIX_MONTHS_MS) {
    event.setFullYear(event.getFullYear() + 1);
  }
  return event;
};

export const isPastShowLink = (link: LinkItem): boolean => {
  const date = parseShowDate(link.title);
  return date !== null && date < startOfToday();
};
