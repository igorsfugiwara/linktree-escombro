import React, { useState } from 'react';
import { useScrollDirection, ScrollDirection } from '../hooks/useScrollDirection';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const scrollDirection = useScrollDirection();
  const [showToast, setShowToast] = useState(false);
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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div style={{ maxWidth: '448px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', color: '#fff' }}>
            {user.handle}
          </span>
          <button
            onClick={handleShare}
            aria-label="Compartilhar perfil"
            style={{ padding: '8px', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </header>

      <div style={{
        position: 'fixed', top: '80px', left: '50%', transform: `translateX(-50%) translateY(${showToast ? '0' : '-16px'})`,
        zIndex: 50, backgroundColor: '#22c55e', color: '#000', padding: '8px 24px', borderRadius: '9999px',
        fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase',
        opacity: showToast ? 1 : 0, transition: 'all 0.3s ease', pointerEvents: 'none',
      }}>
        Link copiado!
      </div>
    </>
  );
};

export default Header;
