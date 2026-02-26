import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '32px', paddingBottom: '16px' }}>
      <img
        src="/assets/logo_branco_2.png"
        alt={user.name}
        style={{ maxWidth: '250px', width: '100%', height: 'auto', marginBottom: '24px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
      />
      <p style={{ color: '#e5e5e5', maxWidth: '280px', fontSize: '13px', lineHeight: '1.6', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
        {user.subtitle}
      </p>
    </section>
  );
};

export default Profile;
