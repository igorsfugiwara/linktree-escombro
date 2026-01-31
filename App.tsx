import React from 'react';
import Header from './components/Header';
import Profile from './components/Profile';
import LinkItem from './components/LinkItem';
import AnchorAd from './components/AnchorAd';
import { USER_PROFILE, LINKS, FOOTER_AD } from './constants';

// MAIN CONTROLLER / VIEW ORCHESTRATOR
// - Imports static data (Model)
// - Composes UI components (View)
// - Sets up global layout structure

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-green selection:text-brand-black">
      
      {/* Header Controller Component */}
      <Header user={USER_PROFILE} />

      <main className="max-w-md mx-auto px-6 pt-24 pb-32">
        
        {/* Profile Section */}
        <Profile user={USER_PROFILE} />

        {/* Links List View */}
        <div className="flex flex-col w-full mt-6 space-y-2">
          {LINKS.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </div>

        {/* Footer info */}
        <footer className="mt-12 text-center text-neutral-600 text-xs">
          <p>© {new Date().getFullYear()} {USER_PROFILE.name}. Todos os direitos reservados.</p>
          <p className="mt-1">Desenvolvido com escombro hc </p>
        </footer>

      </main>

      {/* Monetization Controller Component */}
      <AnchorAd ad={FOOTER_AD} />
      
    </div>
  );
};

export default App;