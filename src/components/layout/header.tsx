/**
 * Header Component
 * Sticky, translucent top navigation
 * Desktop: logo + nav links + theme toggle + user menu
 * Mobile:  logo + theme toggle + hamburger
 */

'use client';

import Link from 'next/link';
import { Film } from 'lucide-react';
import { NavLinks } from './nav-links';
import { MobileMenu } from './mobile-menu';
import { UserMenu } from './user-menu';
import { ThemeToggle } from './theme-toggle';
import { APP_META } from '@/lib/config/nav.config';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface HeaderProps {
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'border-b border-border',
        'bg-background/0 backdrop-blur-xs',
        'supports-backdrop-filter:bg-background/0',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ─────────────────────────────────── */}
          {/* Logo                                 */}
          {/* ─────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
            aria-label={`${APP_META.name} home`}
          >
            <span className="text-3xl font-logo font-bold tracking-wider text-amber-700 border border-orange-700 p-1 rounded-sm">
              {APP_META.name}
            </span>
          </Link>

          {/* ─────────────────────────────────── */}
          {/* Desktop Nav                          */}
          {/* ─────────────────────────────────── */}
          <NavLinks className="hidden md:flex flex-1 justify-center" />

          {/* ─────────────────────────────────── */}
          {/* Right side: Theme + User + Mobile    */}
          {/* ─────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <UserMenu className="hidden md:flex" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}