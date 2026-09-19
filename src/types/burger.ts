export type Role = 'superadmin' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
  invitedBy?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  badge?: 'Nouveau' | 'Populaire' | 'Best-seller' | 'Spécial Chef' | 'Promo' | string;
  available: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  tagline: string;
  heroImage: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  badgeText: string;
}

export interface RestaurantInfo {
  name: string;
  brandTagline: string;
  logoUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  openingHours: {
    days: string;
    hours: string;
  }[];
  aboutText: string;
  aboutImage: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  keywords: string;
}

export interface SiteData {
  hero: HeroSettings;
  info: RestaurantInfo;
  seo: SEOSettings;
  categories: Category[];
  products: MenuItem[];
  gallery: GalleryItem[];
}
