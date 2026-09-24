/**
 * ThemeToggle Component
 * Dropdown menu to switch between Light / Dark / System themes
 * Uses next-themes for persistence and system detection
 *
 * - Hidden during SSR hydration to prevent icon flicker
 * - Active theme highlighted with a check mark
 */

'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface ThemeToggleProps {
  className?: string;
}

interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ============================================
// CONSTANTS
// ============================================

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

// ============================================
// COMPONENT
// ============================================

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch: only render theme-dependent UI after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which icon to show on the trigger
  const currentIcon = !mounted
    ? Sun
    : resolvedTheme === 'dark'
      ? Moon
      : Sun;

  const Icon = currentIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-9 w-9', className)}
          aria-label="Toggle theme"
        >
          {/*
            Show a neutral placeholder during SSR to prevent
            icon flicker between server and client
          */}
          {mounted ? (
            <Icon className="h-5 w-5" />
          ) : (
            <span className="h-5 w-5" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {THEME_OPTIONS.map((option) => {
          const OptionIcon = option.icon;
          const isActive = theme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <OptionIcon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}