'use client'

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components"

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center w-full min-h-screen p-4 text-center text-white bg-linear-to-tr from-red-950 via-zinc-950 to-neutral-900 font-sans selection:bg-red-500/30">
        <main className="relative flex flex-col items-center max-w-md gap-6 p-8 overflow-hidden border border-red-500/10 backdrop-blur-xl bg-zinc-900/40 rounded-2xl shadow-2xl shadow-red-950/20">
          
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/15 rounded-full blur-[60px] pointer-events-none" />

          {/* Animated Error Icon */}
          <div className="flex items-center justify-center w-16 h-16 border rounded-full border-red-500/20 bg-red-500/10 text-red-400 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>

          {/* Typography */}
          <header className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-linear-to-b from-white to-zinc-400">
              Critical Error Occurred
            </h1>
            <p className="text-sm text-zinc-400 max-w-[320px] balance">
              {error.message || "Something went wrong! A fatal application error disrupted the current session."}
            </p>
          </header>

          {/* Error Digest/Code (Optimized for Debugging) */}
          {error.digest && (
            <code className="px-3 py-1.5 text-[11px] font-mono tracking-wider border rounded-md uppercase text-zinc-500 border-zinc-800 bg-zinc-950/60 selection:bg-zinc-800">
              ID: {error.digest}
            </code>
          )}

          {/* Action Trigger */}
          <Button 
            onClick={() => unstable_retry()}
            className="group inline-flex items-center gap-2 px-6 py-2.5 font-medium transition-all duration-200 cursor-pointer bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-500/30"
          >
            <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
            Try again
          </Button>
          
        </main>
      </body>
    </html>
  )
}
