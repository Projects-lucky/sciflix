/**
 * Navigation Configuration
 * Single source of truth for all nav links
 */

import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Film,
  Tv,
  Users,
  Search,
  Bookmark,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresAuth: boolean;
  hideOnMobile?: boolean;
}

// ============================================
// NAV LINKS
// ============================================

export const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    requiresAuth: false,
  },
  {
    href: '/movie',
    label: 'Movies',
    icon: Film,
    requiresAuth: false,
  },
  {
    href: '/tv',
    label: 'TV Shows',
    icon: Tv,
    requiresAuth: false,
  },
  {
    href: '/person',
    label: 'People',
    icon: Users,
    requiresAuth: false,
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
    requiresAuth: false,
  },
  {
    href: '/watchlist',
    label: 'Watchlist',
    icon: Bookmark,
    requiresAuth: true,
  },
];

// ============================================
// FOOTER LINKS
// ============================================

export interface FooterSection {
  title: string;
  links: Array<{ href: string; label: string }>;
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Browse',
    links: [
      { href: '/movie', label: 'Movies' },
      { href: '/tv', label: 'TV Shows' },
      { href: '/person', label: 'People' },
      { href: '/search', label: 'Search' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/watchlist', label: 'Watchlist' },
      { href: '/sign-in', label: 'Sign In' },
      { href: '/sign-up', label: 'Sign Up' },
    ],
  },
];

// ============================================
// APP META
// ============================================

export const APP_META = {
  name: 'sciflix',
  tagline: 'Discover. Track. Watch.',
  description:
    'Discover trending movies and TV shows, build your personal watchlist, and never miss a must-watch.',
  year: new Date().getFullYear(),
} as const;