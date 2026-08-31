/**
 * Sonner Listener Provider
 * 
 * Client-side provider that subscribes to toast events from the ToastEventManager.
 * Automatically handles promise-based toasts and standard toast types.
 * Wraps application to enable programmatic toast notifications.
 */

"use client"

import { useEffect } from "react";
import { toast } from "sonner";
import { toastEvents } from "@/lib/toast-events";

interface SonnerListenerProviderProps {
  children: React.ReactNode
}

/**
 * SonnerListenerProvider Component
 * 
 * @param children - Child components that will have access to toast events
 * @returns Wrapped children with toast event listener
 */
export function SonnerListenerProvider({ children }: SonnerListenerProviderProps) {
  useEffect(() => {
    // Subscribe to toast events
    const unsubscribe = toastEvents.subscribe((payload) => {
      
      // Handle promise-based toasts
      if (payload.type === "promise" && payload.promise && payload.promiseMessages) {
        toast.promise(payload.promise, {
          loading: payload.promiseMessages.loading,
          success: payload.promiseMessages.success,
          error: payload.promiseMessages.error,
        });
        return;
      }

      // Handle standard toast types
      const options = {
        description: payload.description,
        action: payload.action ? {
          label: payload.action.label,
          onClick: payload.action.onClick,
        } : undefined
      };

      switch (payload.type) {
        case "success":
          toast.success(payload.message, options);
          break;
        case "error":
          toast.error(payload.message, options);
          break;
        case "warning":
          toast.warning(payload.message, options);
          break;
        case "info":
          toast.info(payload.message, options);
          break;
        default:
          toast(payload.message, options);
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}