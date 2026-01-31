// MODEL LAYER
// Defines the shape of data used throughout the application

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  iconPath?: string; // SVG path data
  highlight?: boolean; // If true, applies special styling
}

export interface UserProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  subtitle: string; // Changed from 'bio' to 'subtitle'
}

export interface AdConfig {
  id: string;
  content: string;
  ctaUrl: string;
  ctaText: string;
}