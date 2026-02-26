// ============================================================
// MODEL LAYER — types.ts
// Single source of truth for all data shapes in the application.
// ============================================================

// --- Public Page Types ---

export type ImageType = 'banner' | 'avatar' | 'none';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  iconKey?: IconKey;       // Key referencing ICON_MAP
  imageType: ImageType;    // 'banner' = full-width image, 'avatar' = small left icon, 'none' = text only
  imageUrl?: string;       // URL or base64 for image
  highlight?: boolean;     // Inverted color treatment
  active: boolean;         // Hidden from public if false
  order: number;           // Display order
}

export interface UserProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  subtitle: string;
}

export interface SiteConfig {
  backgroundType: 'url' | 'upload' | 'none';
  backgroundValue: string; // URL string or base64 data URI
  backgroundOverlay: number; // 0–100 opacity of dark overlay
}

export interface AdConfig {
  id: string;
  content: string;
  ctaUrl: string;
  ctaText: string;
}

// --- CMS / Admin Types ---

export interface AdminCredentials {
  username: string;
  password: string;
}

// --- Icon Registry ---

export type IconKey =
  | 'ticket'
  | 'instagram'
  | 'spotify'
  | 'facebook'
  | 'youtube'
  | 'bandcamp'
  | 'cart'
  | 'link'
  | 'tiktok'
  | 'twitter'
  | 'whatsapp'
  | 'email';

// Legacy type alias for backwards compatibility
export type SocialLink = LinkItem;
