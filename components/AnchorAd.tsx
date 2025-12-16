import React, { useState } from 'react';
import { AdConfig } from '../types';

// VIEW LAYER & CONTROLLER LOGIC (Local State)
// Renders the sticky ad and manages its visibility state

interface AnchorAdProps {
  ad: AdConfig;
}

const AnchorAd: React.FC<AnchorAdProps> = ({ ad }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-md mx-auto relative bg-neutral-800/95 backdrop-blur-sm border-t-2 border-brand-green rounded-t-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-2 bg-brand-black text-white border border-neutral-700 rounded-full p-1 hover:bg-red-500 hover:border-red-500 transition-colors"
          aria-label="Fechar anúncio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Ad Content */}
        <div className="text-sm font-medium text-white flex-1 text-center sm:text-left">
          {ad.content}
        </div>

        {/* CTA Button */}
        <a 
          href={ad.ctaUrl}
          className="whitespace-nowrap bg-brand-green text-brand-black text-xs font-bold py-2 px-4 rounded-full hover:bg-white transition-colors"
        >
          {ad.ctaText}
        </a>
      </div>
    </div>
  );
};

export default AnchorAd;