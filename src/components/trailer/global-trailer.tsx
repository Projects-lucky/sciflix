/**
 * GlobalTrailer
 * Single instance of the trailer modal, controlled by VideoContext.
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTrailerModal } from '@/lib/video/context';

export function GlobalTrailer() {
  const { open, videoKey, title, close } = useTrailerModal();

  if (!videoKey) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent
        className={[
          //  Fluid width — from mobile to ultrawide
          'w-[95vw] max-w-[95vw]',
          'sm:w-[90vw] sm:max-w-[90vw]',
          'md:w-[85vw] md:max-w-300',
          'lg:w-[80vw] lg:max-w-350',
          'xl:w-[75vw] xl:max-w-[1600px]',
          // Fluid height — video dictates size, no forced limits
          'h-auto',
          // Layout
          'p-0 gap-0',
          'bg-black border-border',
          'overflow-hidden',
          // Close button (kept as-is)
          '[&>button]:text-white [&>button]:hover:bg-white/10 [&>button]:z-50',
        ].join(' ')}
      >
        <DialogHeader className="px-4 py-3 border-b border-white/10 shrink-0">
          <DialogTitle className="text-white text-base md:text-lg truncate">
            {title || 'Trailer'}
          </DialogTitle>
        </DialogHeader>

        {/*  Video container: aspect-video keeps 16:9 at any width */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={title || 'Trailer'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}