import React from 'react';
import { SocialLink } from '../types';

// VIEW LAYER
// Reusable component for a single link

interface LinkItemProps {
  link: SocialLink;
}

const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
  // Styles adapted to match the "Escombro" original vibe:
  // - Uppercase font
  // - Icons on the left
  // - Transparent/Black background to show texture
  // - White text
  
  const baseStyles = "group relative flex items-center w-full p-4 mb-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-green border font-bold uppercase tracking-wider";
  
  // Highlight: White bg, Black text (Inverted)
  // Standard: Transparent/Black bg, White text, White border
  const standardStyles = "bg-black/40 border-white text-white hover:bg-white hover:text-black hover:border-white";
  const highlightStyles = "bg-white text-black border-white hover:bg-brand-green hover:border-brand-green hover:text-black";

  return (
    <a 
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${link.highlight ? highlightStyles : standardStyles}`}
      aria-label={`Visitar ${link.title}`}
    >
      {/* Icon Section */}
      {link.iconPath && (
        <div className="mr-4 flex-shrink-0">
           <svg 
             viewBox="0 0 24 24" 
             width="24" 
             height="24" 
             stroke="currentColor" 
             strokeWidth="2" 
             fill="none" 
             strokeLinecap="round" 
             strokeLinejoin="round"
             className="transition-colors duration-300"
            >
              <path d={link.iconPath} />
            </svg>
        </div>
      )}

      {/* Text Section */}
      <span className="flex-1 text-left relative z-10">
        {link.title}
      </span>
      
      {/* Optional Highlight Indicator (if needed, but style usually sufficient) */}
      {link.highlight && (
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </span>
      )}
    </a>
  );
};

export default LinkItem;