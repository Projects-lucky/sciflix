/**
 * MobileMenu Component
 * Hamburger button (md:hidden) that opens a shadcn Sheet drawer
 * Contains the same nav links as desktop, stacked vertically
 * Includes UserMenu at the bottom
 */

"use client";

import { Show } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_META, NAV_LINKS, type NavLink } from "@/lib/config/nav.config";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

// ============================================
// TYPES
// ============================================

export interface MobileMenuProps {
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function MobileMenu({ className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 sm:w-96 p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-left">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-lg font-bold"
            >
              {APP_META.name}
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <MobileNavItem
              key={link.href}
              link={link}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>

        <Separator />

        {/* Auth Controls */}
        <div className="p-4">
          <UserMenu className="w-full flex-col items-stretch gap-2" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// MOBILE NAV ITEM
// ============================================

interface MobileNavItemProps {
  link: NavLink;
  onNavigate: () => void;
}

function MobileNavItem({ link, onNavigate }: MobileNavItemProps) {
  const pathname = usePathname();
  const Icon = link.icon;

  const isActive =
    link.href === "/"
      ? pathname === "/"
      : pathname === link.href || pathname.startsWith(`${link.href}/`);

  const content = (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span>{link.label}</span>
    </Link>
  );

  if (link.requiresAuth) {
    return <Show when="signed-in">{content}</Show>;
  }

  return content;
}
