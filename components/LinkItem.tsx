// ============================================================
// VIEW LAYER — components/LinkItem.tsx
// Renders a single link with 3 image layout modes:
//   - 'banner': full-width image above/behind the text
//   - 'avatar': small image on the left of the text
//   - 'none': text + icon only
// ============================================================

import React from 'react';
import { LinkItem as LinkItemType } from '../types';
import IconRenderer from './IconRenderer';

interface LinkItemProps {
  link: LinkItemType;
}

const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
  const base = "group relative flex w-full mb-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-green border font-bold uppercase tracking-wider overflow-hidden";
  const standard = "bg-black/40 border-white text-white hover:bg-white hover:text-black";
  const highlight = "bg-white text-black border-white hover:bg-brand-green hover:border-brand-green";

  const colorClass = link.highlight ? highlight : standard;

  // ── BANNER MODE ──────────────────────────────────────────
  if (link.imageType === 'banner' && link.imageUrl) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${colorClass} flex-col p-0`}
        aria-label={`Visitar ${link.title}`}
      >
        {/* Banner image — 100% width */}
        <div className="w-full aspect-[3/1] overflow-hidden">
          <img
            src={link.imageUrl}
            alt={link.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {/* Text below banner */}
        <div className="flex items-center px-4 py-3 gap-3">
          {link.iconKey && <IconRenderer iconKey={link.iconKey} size={20} />}
          <span className="flex-1 text-left">{link.title}</span>
          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </a>
    );
  }

  // ── AVATAR MODE ──────────────────────────────────────────
  if (link.imageType === 'avatar' && link.imageUrl) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${colorClass} items-center p-3 gap-3`}
        aria-label={`Visitar ${link.title}`}
      >
        <img
          src={link.imageUrl}
          alt=""
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/20"
        />
        <span className="flex-1 text-left">{link.title}</span>
        {link.highlight && (
          <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </a>
    );
  }

  // ── DEFAULT MODE (icon + text) ───────────────────────────
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${colorClass} items-center p-4 gap-3`}
      aria-label={`Visitar ${link.title}`}
    >
      {link.iconKey && (
        <div className="flex-shrink-0">
          <IconRenderer iconKey={link.iconKey} size={22} />
        </div>
      )}
      <span className="flex-1 text-left relative z-10">{link.title}</span>
      {link.highlight && (
        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      )}
    </a>
  );
};

export default LinkItem;
