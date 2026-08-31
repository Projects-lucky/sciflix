/**
 * Header Component
 * 
 * Site-wide navigation header with logo, navigation links, and user controls.
 * Sticky positioning with backdrop blur effect on hover.
 * Responsive design with desktop navigation and mobile menu support.
 */

import Link from 'next/link'
import { HeaderClient } from './HeaderClient'
import { 
  Clapperboard, 
  Tv, 
  UserRound, 
  Search, 
  Birdhouse 
} from 'lucide-react'

// Navigation structure with icons
const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Birdhouse },
  { href: "/movies", label: "Movies", icon: Clapperboard },
  { href: "/tv", label: "TV Shows", icon: Tv },
  { href: "/person", label: "Person", icon: UserRound },
  { href: "/search", label: "Search", icon: Search },
]

/**
 * Header Component
 * 
 * @returns Rendered header with logo, navigation, and client-side controls
 */
export function Header() {
  return (
    <header className="border-none sticky top-2 z-50">
      <div className="container mx-auto px-4 bg-background/0 hover:backdrop-blur-md">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-link transition-colors">
            <span className="font-logo text-4xl tracking-wider ">sci<span className='text-red-500'>f</span>lix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {NAV_ITEMS.map((item) => (
              <NavLink 
                key={item.href} 
                href={item.href} 
                label={item.label} 
                icon={item.icon} 
              />
            ))}
          </nav>

          {/* Auth & Mobile Menu */}
          <HeaderClient />
        </div>
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * NavLink Component
 * 
 * Reusable navigation link with icon support.
 * 
 * @param href - Link destination
 * @param label - Link text
 * @param icon - Icon component
 */
function NavLink({ href, label, icon: Icon }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex flex-row whitespace-nowrap items-center gap-2 text-sm font-medium hover:bg-link-background/20 hover:text-link-foreground hover:border border-link-background transition-all rounded-2xl px-3 py-2"
    >
      <Icon className="h-4 w-4 opacity-80" />
      <span>{label}</span>
    </Link>
  )
}