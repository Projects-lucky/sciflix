/**
 * Footer Component
 * Simple responsive footer:
 * - Logo + tagline
 * - Grouped link sections (from FOOTER_SECTIONS)
 * - Copyright bar
 */

import Link from "next/link";
import { APP_META, FOOTER_SECTIONS } from "@/lib/config/nav.config";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface FooterProps {
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border",
        "bg-background/60 backdrop-blur-sm",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Top: Brand + Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              aria-label={`${APP_META.name} home`}
            >
              <span className="text-3xl font-logo font-bold tracking-wider text-amber-700 border  border-orange-700 p-1 rounded-sm">
                {APP_META.name}
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-sm">
              {APP_META.description}
            </p>

            <p className="text-xs text-muted-foreground/70 italic">
              {APP_META.tagline}
            </p>
          </div>

          {/* Link Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-md font-semibold font-poppins tracking-wider text-amber-700">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-poppins"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {APP_META.year} {APP_META.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
