/**
 * useIsMobile Hook
 * 
 * React hook for detecting mobile screen sizes.
 * Uses matchMedia API with event listener for responsive breakpoint detection.
 * Returns boolean indicating if screen width is below 768px.
 */

"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Set initial state
    setIsMobile(mql.matches)

    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // Modern browser support
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}