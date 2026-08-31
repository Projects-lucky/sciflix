/**
 * Toast Events Utility
 * 
 * Provides centralized toast notification management using Sonner.
 * Includes event manager for custom toast subscriptions and a trackRequest
 * utility for wrapping async operations with loading/success/error states.
 */

import { AppError } from "@/errors/AppError";
import { toast } from "sonner";

export type SonnerEventPayload = {
  type: "success" | "error" | "info" | "warning" | "promise";
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  promise?: Promise<any>;
  promiseMessages?: {
    loading: string;
    success: string;
    error: string;
  };
};

type EventCallback = (payload: SonnerEventPayload) => void;

/**
 * Toast Event Manager
 * 
 * Manages toast event subscriptions and emissions.
 * Allows components to listen for toast events programmatically.
 */
class ToastEventManager {
  private listeners: Set<EventCallback> = new Set();

  /**
   * Subscribes a callback to toast events
   * 
   * @param callback - Function to call when toast is emitted
   * @returns Unsubscribe function
   */
  subscribe(callback: EventCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Emits a toast event to all subscribers
   * 
   * @param payload - Toast event data
   */
  emit(payload: SonnerEventPayload) {
    this.listeners.forEach((callback) => callback(payload));
  }
}

/**
 * Tracks an async request with toast notifications
 * 
 * @param requestPromise - The async operation to track
 * @param loadingMessage - Message shown while loading
 * @returns The original promise result
 */
export const trackRequest = <T>(
  requestPromise: Promise<T>,
  loadingMessage = "Connecting to services..."
): Promise<T> => {
  toast.promise(requestPromise, {
    loading: loadingMessage,
    success: () => "Data synchronized successfully.",
    error: (err) => {
      return err instanceof AppError 
        ? `Request Failed: ${err.message}` 
        : "Network communication collapsed.";
    }
  });

  return requestPromise;
};

export const toastEvents = new ToastEventManager();