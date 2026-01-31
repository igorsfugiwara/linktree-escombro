import React, { useState } from 'react';
import { useScrollDirection, ScrollDirection } from '../hooks/useScrollDirection';
import { UserProfile } from '../types';

// VIEW LAYER
// Renders the top navigation bar with dynamic visibility based on scroll

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const scrollDirection = useScrollDirection();
  const [showToast, setShowToast] = useState(false);
  
  // Logic to determine if header should be hidden
  // Hide only when scrolling down. Show when at top or scrolling up.
  const isHidden = scrollDirection === ScrollDirection.DOWN;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-40 
          bg-brand-black/90 backdrop-blur-md border-b border-white/10
          transition-transform duration-300 ease-in-out
          ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        `}
        aria-hidden={isHidden}
      >
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight text-white">
            {user.handle}
          </span>
          <button 
            onClick={handleShare}
            aria-label="Compartilhar perfil"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-brand-green"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      <div 
        className={`
          fixed top-20 left-1/2 transform -translate-x-1/2 z-50
          bg-brand-green text-brand-black px-6 py-2 rounded-full shadow-xl
          font-bold text-sm tracking-wide uppercase
          transition-all duration-300 ease-in-out
          ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        Link copiado!
      </div>
    </>
  );
};

export default Header;