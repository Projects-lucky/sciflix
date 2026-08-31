/**
 * Theme Provider
 * 
 * Wraps the application with Next Themes provider for dark/light mode support.
 * Accepts all NextThemesProvider props for flexible configuration.
 */

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.ComponentProps<typeof NextThemesProvider> {}

/**
 * ThemeProvider Component
 * 
 * @param children - Child components that will have access to theme context
 * @param props - Additional NextThemesProvider props (attribute, defaultTheme, etc.)
 * @returns Theme provider with Next Themes
 */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}