/**
 * Sign In Page
 * 
 * Renders the Clerk authentication sign-in component.
 * Centered on the page with custom styling for consistent branding.
 */

import { SignIn } from '@clerk/nextjs'

/**
 * SignInPage Component
 * 
 * @returns Rendered sign-in page with Clerk sign-in form
 */
export default function SignInPage() {
  return (
    <section className="sign-in-page flex min-h-screen items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          }
        }}
      />
    </section>
  )
}