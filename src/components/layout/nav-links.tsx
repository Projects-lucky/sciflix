/**
 * NavLinks Component
 * Desktop horizontal navigation
 * - Icon rotates 360° on hover
 * - Text label reveals on hover with smooth transition
 * - Active route is highlighted
 * - Auth-gated links wrapped in <Show>
 */

"use client";

import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, type NavLink } from "@/lib/config/nav.config";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface NavLinksProps {
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function NavLinks({ className }: NavLinksProps) {
  return (
    <nav className={cn("flex items-center gap-1 transition-all", className)}>
      {NAV_LINKS.map((link) => (
        <NavItem key={link.href} link={link} />
      ))}
    </nav>
  );
}

// ============================================
// NAV ITEM
// ============================================

interface NavItemProps {
  link: NavLink;
}

function NavItem({ link }: NavItemProps) {
  const pathname = usePathname();
  const Icon = link.icon;

  const isActive =
    link.href === "/"
      ? pathname === "/"
      : pathname === link.href || pathname.startsWith(`${link.href}/`);

  const content = (
    <Link
      href={link.href}
      className={cn(
        "inline-flex group items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
        "transition-colors duration-300",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-accent text-accent-foreground border border-orange-700"
          : "text-muted-foreground",
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-transform duration-500 ease-in-ou text-orange-700 dark:text-olive-100",
          "",
        )}
        aria-hidden="true"
      />

      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-poppins",
          "max-w-0 opacity-0",
          "group-hover:max-w-30 group-hover:opacity-100 group-hover:ml-1 group-hover:rotate-x-360",
          isActive && "max-w-30 opacity-100 ml-1",
        )}
      >
        {link.label}
      </span>
    </Link>
  );

  if (link.requiresAuth) {
    return <Show when="signed-in">{content}</Show>;
  }

  return content;
}
