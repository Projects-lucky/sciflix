
'use client'

/**
 * Footer Component
 * 
 * Site-wide footer with navigation links, brand information, and metadata.
 * Includes links to main pages, account section, and tech stack info.
 * Responsive grid layout with dark mode support.
 */

import Link from 'next/link'

/**
 * Footer Component
 * 
 * @returns Rendered footer with navigation and brand information
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white dark:bg-gray-900 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-link transition-colors">
              <span className="hidden sm:inline font-logo text-4xl tracking-wider ">sci<span className='text-red-500'>f</span>lix</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Discover movies, TV shows, and celebrities. Your ultimate entertainment guide.
            </p>
          </div>

          {/* Explore Navigation */}
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/movies" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Movies</Link></li>
              <li><Link href="/tv" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">TV Shows</Link></li>
              <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Account Navigation */}
          <div className='ac-nav'>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/watchlist" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Watchlist</Link></li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div>
            <h3 className="font-semibold mb-3">Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500 dark:text-gray-400">Data from TMDB</li>
              <li className="text-gray-500 dark:text-gray-400">Next.js 16</li>
              <li className="text-gray-500 dark:text-gray-400">TypeScript</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t dark:border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {currentYear} MovieApp. All rights reserved.</p>
          <p>Built with using Next.js & TMDB</p>
        </div>
      </div>
    </footer>
  )
}