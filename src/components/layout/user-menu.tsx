/**
 * UserMenu Component
 * Renders Clerk auth controls:
 * - Signed out: Sign In + Sign Up buttons
 * - Signed in:  <UserButton /> avatar dropdown
 *
 * Uses <Show> (server-rendered) — no client-side auth flicker.
 */

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface UserMenuProps {
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function UserMenu({ className }: UserMenuProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* ───────────────────────────────────── */}
      {/* Signed OUT — Sign In + Sign Up        */}
      {/* ───────────────────────────────────── */}
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium font-poppins"
          >
            Sign In
          </Button>
        </SignInButton>
      </Show>

      {/* ───────────────────────────────────── */}
      {/* Signed IN — User Avatar Dropdown      */}
      {/* ───────────────────────────────────── */}
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "w-9 h-9 ring-2 ring-border hover:ring-primary transition-all",
              userButtonPopoverCard: "shadow-xl",
            },
          }}
        />
      </Show>
    </div>
  );
}
