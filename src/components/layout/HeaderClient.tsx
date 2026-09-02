/**
 * Header Client Component
 * 
 * Client-side header controls including authentication, dark mode toggle,
 * watchlist link, and mobile menu.
 * Uses Clerk for authentication with signed-in/signed-out states.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserButton,
  SignInButton,
  Show,
} from "@clerk/nextjs";
import { BookmarkPlus, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { DarkModeToggle } from "../ui";

/**
 * HeaderClient Component
 * 
 * @returns Rendered header controls with authentication and mobile menu
 */
export function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv", label: "TV Shows" },
    { href: "/search", label: "Search" },
  ];

  return (
    <div className="flex items-center gap-4">
      <DarkModeToggle />
      
      {/* Desktop Authentication Controls */}
      <div className="hidden md:flex items-center gap-4">
        <Show when="signed-in">
          <Link
            href="/watchlist"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 transition-colors p-1.5 rounded-md"
          >
             <BookmarkPlus className="stroke-red-primary stroke-2 size-4.5"/>
          </Link>
        </Show>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Sign In
            </Button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 border-b shadow-lg md:hidden">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-link-background/20 text-link-foreground"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 mt-2 space-y-2">
              <Show when="signed-in">
                <Link
                  href="/watchlist"
                  onClick={closeMenu}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Watchlist
                </Link>
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button className="w-full text-center px-1 py-2 rounded-lg bg-green-400 transition-colors">
                    Sign In
                  </Button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
                <div className="px-4 py-2 flex items-center gap-3">
                  <UserButton />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    My Account
                  </span>
                </div>
              </Show>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}