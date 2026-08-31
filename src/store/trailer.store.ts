/**
 * Trailer Store
 * 
 * Zustand store for managing trailer modal state.
 * Provides actions to open and close the trailer with video key and title.
 */

import { create } from 'zustand'

interface TrailerState {
  isOpen: boolean
  videoKey: string | null
  title: string
  openTrailer: (videoKey: string, title: string) => void
  closeTrailer: () => void
}

export const useTrailerStore = create<TrailerState>((set) => ({
  isOpen: false,
  videoKey: null,
  title: '',
  openTrailer: (videoKey, title) => set({ isOpen: true, videoKey, title }),
  closeTrailer: () => set({ isOpen: false, videoKey: null, title: '' }),
}))