import React, { useState } from 'react';
import { AdConfig } from '../types';

interface AnchorAdProps {
  ad: AdConfig;
}

const AnchorAd: React.FC<AnchorAdProps> = ({ ad }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  return (
    <div className="animate-slide-up" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '16px' }}>
      <div style={{
        maxWidth: '448px', margin: '0 auto', position: 'relative',
        backgroundColor: 'rgba(23,23,23,0.95)', backdropFilter: 'blur(8px)',
        borderTop: '2px solid #22c55e', borderRadius: '12px 12px 0 0',
        padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
      }}>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute', top: '-12px', right: '-8px',
            backgroundColor: '#000', border: '1px solid #333', borderRadius: '50%',
            padding: '4px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center',
          }}
          aria-label="Fechar anúncio"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', flex: 1 }}>{ad.content}</div>
        <a
          href={ad.ctaUrl}
          style={{
            whiteSpace: 'nowrap', backgroundColor: '#22c55e', color: '#000',
            fontSize: '12px', fontWeight: 700, padding: '8px 16px', borderRadius: '9999px',
            textDecoration: 'none', transition: 'background-color 0.2s',
          }}
        >
          {ad.ctaText}
        </a>
      </div>
    </div>
  );
};

export default AnchorAd;
