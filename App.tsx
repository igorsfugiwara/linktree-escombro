// ============================================================
// CONTROLLER LAYER — App.tsx
// Main orchestrator. Sets up routing and injects CMS data
// into the View components.
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Profile from './components/Profile';
import LinkItem from './components/LinkItem';
import AnchorAd from './components/AnchorAd';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/admin/AdminPanel';
import { useCMSStore, CMSProvider } from './store/useCMSStore';
import { FOOTER_AD } from './constants';
import { AuthProvider } from './hooks/useAuth';

// ── Public Page ──────────────────────────────────────────────
const PublicPage: React.FC = () => {
  const { activeLinks, siteConfig, profile, loading } = useCMSStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Build background style from CMS config
  const bgStyle: React.CSSProperties = {};
  if (siteConfig.backgroundType !== 'none' && siteConfig.backgroundValue) {
    bgStyle.backgroundImage = `url(${siteConfig.backgroundValue})`;
    if (siteConfig.backgroundType === 'upload') {
      bgStyle.backgroundSize = 'cover';
      bgStyle.backgroundPosition = 'center';
    } else {
      bgStyle.backgroundRepeat = 'repeat';
    }
  }

  return (
    <div
      className="min-h-screen text-brand-white selection:bg-brand-green selection:text-brand-black relative"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Background layer */}
      {siteConfig.backgroundType !== 'none' && siteConfig.backgroundValue && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={bgStyle}
        />
      )}

      {/* Dark overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-black"
        style={{ opacity: siteConfig.backgroundOverlay / 100 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header user={profile} />

        <main className="max-w-md mx-auto px-6 pt-24 pb-32">
          <Profile user={profile} />

          <div className="flex flex-col w-full mt-6 space-y-2">
            {activeLinks.map(link => (
              <LinkItem key={link.id} link={link} />
            ))}
          </div>

          <footer className="mt-12 text-center text-neutral-600 text-xs">
            <p>© {new Date().getFullYear()} {profile.name}. Todos os direitos reservados.</p>
          </footer>
        </main>

        <AnchorAd ad={FOOTER_AD} />
      </div>
    </div>
  );
};

// ── Root App with Router ─────────────────────────────────────
const App: React.FC = () => {
  return (
    <CMSProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </CMSProvider>
  );
};

export default App;
