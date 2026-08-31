/**
 * Person Detail Component
 * 
 * Displays detailed information about a person including biography, metadata,
 * and filmography. Features a compact, knowledge-panel style layout with
 * enhanced visual hierarchy and interactive elements.
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Star, ChevronLeft, Film, Tv, Award, Users, Briefcase, ExternalLink, ChevronDown, Sparkle } from 'lucide-react'
import type { PersonDetails, FilmographyItem } from '@/types'
import { TMDB_CONFIG } from "@/constants/api"

interface PersonDetailProps {
  person: PersonDetails
  filmography?: FilmographyItem[]
}

const formatDate = (dateString: string) => 
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

/**
 * PersonDetail Component
 * 
 * @param person - Person details data
 * @param filmography - Array of filmography items
 * @returns Rendered person detail page
 */
export function PersonDetail({ person, filmography }: PersonDetailProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const [bioHeight, setBioHeight] = useState<'auto' | number>('auto')
  const bioRef = useRef<HTMLParagraphElement>(null)
  const [showReadMore, setShowReadMore] = useState(false)

  // Build profile image URL
  const imageBase = TMDB_CONFIG.IMAGE_BASE_URL.endsWith('/') 
    ? TMDB_CONFIG.IMAGE_BASE_URL 
    : `${TMDB_CONFIG.IMAGE_BASE_URL}/`
  
  const profilePath = person.profile || person.profile_path
  const profileSize = TMDB_CONFIG.IMAGE_SIZES?.profile?.large || 'h632'
  const profileUrl = profilePath ? `${imageBase}${profileSize}${profilePath}` : '/placeholder-profile.jpg'

  // Check if biography needs truncation
  useEffect(() => {
    if (bioRef.current) {
      const lineHeight = parseInt(getComputedStyle(bioRef.current).lineHeight) || 24
      const maxHeight = lineHeight * 5 // 5 lines
      if (bioRef.current.scrollHeight > maxHeight) {
        setShowReadMore(true)
      }
    }
  }, [person.biography])

  // Build metadata items with enhanced formatting
  const metadataItems = [
    person.birthday && { 
      icon: Calendar, 
      label: 'Born', 
      value: formatDate(person.birthday),
      subValue: person.birthday ? new Date().getFullYear() - new Date(person.birthday).getFullYear() + ' years ago' : null
    },
    person.place_of_birth && { 
      icon: MapPin, 
      label: 'Origin', 
      value: person.place_of_birth,
      subValue: null
    },
    person.deathday && { 
      icon: Calendar, 
      label: 'Died', 
      value: formatDate(person.deathday), 
      subValue: person.deathday ? new Date(person.deathday).getFullYear() - new Date(person.birthday || person.deathday).getFullYear() + ' years old' : null,
      className: 'text-rose-400' 
    },
    { 
      icon: Star, 
      label: 'Popularity', 
      value: person.popularity.toFixed(1), 
      subValue: 'out of 100',
      className: 'text-amber-400 font-bold' 
    }
  ].filter(Boolean) as { icon: any, label: string, value: string, subValue: string | null, className?: string }[]

  // Known for department icon mapping
  const getDepartmentIcon = () => {
    const dept = person.known_for_department?.toLowerCase() || ''
    if (dept.includes('acting')) return <Users className="w-4 h-4" />
    if (dept.includes('directing')) return <Briefcase className="w-4 h-4" />
    if (dept.includes('writing')) return <Award className="w-4 h-4" />
    return <Sparkle className="w-4 h-4" />
  }

  // Get gradient based on department
  const getDepartmentGradient = () => {
    const dept = person.known_for_department?.toLowerCase() || ''
    if (dept.includes('acting')) return 'from-blue-500/10 to-purple-500/10'
    if (dept.includes('directing')) return 'from-emerald-500/10 to-teal-500/10'
    if (dept.includes('writing')) return 'from-amber-500/10 to-orange-500/10'
    return 'from-primary/10 to-secondary/10'
  }

  // Calculate age
  const getAge = () => {
    if (!person.birthday) return null
    const birth = new Date(person.birthday)
    const age = new Date().getFullYear() - birth.getFullYear()
    return age
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background via-background/95 to-background/90">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col gap-6">
        
        {/* Enhanced Back Button */}
        <Link
          href="/person"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300 bg-background/50 hover:bg-background px-4 py-2 rounded-full w-fit group shadow-sm hover:shadow-md border border-border/50"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
          Back to Person
        </Link>

        {/* Enhanced Knowledge Panel */}
        <div className="relative w-full bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/30 overflow-hidden transition-all duration-300 hover:shadow-primary/5">
          
          {/* Gradient Background Accent */}
          <div className={`absolute inset-0 bg-linear-to-br ${getDepartmentGradient()} pointer-events-none`} />
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative flex flex-col md:flex-row gap-8 p-6 sm:p-8 lg:p-10">
            
            {/* Profile Image with Enhanced Frame */}
            <div className="shrink-0 w-full md:w-56 lg:w-64 xl:w-72">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-border/30 group">
                <Image
                  src={profileUrl}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 288px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Glassmorphism Overlay at Bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Department Badge - Enhanced */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full w-fit border border-white/20 shadow-lg">
                    {getDepartmentIcon()}
                    {person.known_for_department || "Talent"}
                  </span>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
              </div>
            </div>

            {/* Content Column - Enhanced */}
            <div className="flex-1 min-w-0 space-y-5">
              
              {/* Name & Quick Stats */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05] bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {person.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground">
                      ID #{person.id.toString().slice(-4)}
                    </p>
                    {getAge() && (
                      <>
                        <span className="w-px h-3 bg-border" />
                        <p className="text-xs font-medium text-muted-foreground">
                          {getAge()} years old
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* External Link Hint */}
                <button className="p-2 rounded-full hover:bg-muted/50 transition-colors duration-200 text-muted-foreground hover:text-foreground">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Enhanced Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {metadataItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group relative flex flex-col gap-0.5 bg-muted/30 hover:bg-muted/50 rounded-xl px-3.5 py-3 border border-border/30 hover:border-primary/20 transition-all duration-300 cursor-default"
                  >
                    <span className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground uppercase flex items-center gap-1.5">
                      <item.icon className="w-3 h-3 group-hover:text-primary transition-colors" />
                      {item.label}
                    </span>
                    <span className={`text-sm font-medium leading-tight ${item.className || ''}`}>
                      {item.value}
                    </span>
                    {item.subValue && (
                      <span className="text-[10px] text-muted-foreground/60 font-light">
                        {item.subValue}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Biography Section */}
              {person.biography && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Biography</span>
                    <div className="h-px flex-1 bg-linear-to-r from-border/50 to-transparent" />
                  </div>
                  
                  <div className="relative">
                    <p 
                      ref={bioRef}
                      className={`text-sm leading-relaxed font-light text-muted-foreground transition-all duration-500 ${
                        !isBioExpanded && showReadMore ? 'line-clamp-5' : ''
                      }`}
                      style={{
                        maxHeight: isBioExpanded ? 'none' : undefined
                      }}
                    >
                      {person.biography}
                    </p>
                    
                    {showReadMore && (
                      <button
                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                      >
                        {isBioExpanded ? 'Show less' : 'Read more'}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isBioExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filmography Section - UNTOUCHED */}
        {filmography && filmography.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-semibold font-poppins tracking-wider mb-6 flex items-center">
              Known For
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-col-4 lg:grid-cols-5 gap-4">
              {filmography.slice(0, 30).map((item) => {
                const posterSize = TMDB_CONFIG.IMAGE_SIZES?.poster?.medium || 'w342'
                const itemPosterUrl = item.poster ? `${imageBase}${posterSize}${item.poster}` : null
                const isMovie = item.mediaType === 'movie'
  
                return (
                  <Link
                    key={`${item.id}-${item.mediaType}`}
                    href={isMovie ? `/movies/${item.id}` : `/tv/${item.id}`}
                    className="group block relative"
                  >
                    <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 group-hover:shadow-lg group-hover:ring-blue-500/30">
                      {itemPosterUrl ? (
                        <Image
                          src={itemPosterUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                          {isMovie ? <Film className="w-8 h-8 mb-2 opacity-50" /> : <Tv className="w-8 h-8 mb-2 opacity-50" />}
                          <span className="text-[10px] uppercase tracking-wider">No Image</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay & Text */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                            {isMovie ? 'Movie' : 'TV'}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white truncate drop-shadow-md">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-300 truncate">
                          {item.year} • {item.character || item.job || 'Unknown Role'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}