import React from 'react';
import { UserProfile } from '../types';

// VIEW LAYER
// Renders the user's logo and subtitle

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <section className="flex flex-col items-center text-center pt-8 pb-4 px-4 animate-fade-in">
      <img 
        src="./assets/logo_branco_2.png" 
        alt={user.name} 
        className="max-w-[250px] w-full h-auto mb-6 drop-shadow-lg"
      />
      
      <p className="text-neutral-200 max-w-xs text-sm leading-relaxed uppercase tracking-widest font-bold">
        {user.subtitle}
      </p>
    </section>
  );
};

export default Profile;