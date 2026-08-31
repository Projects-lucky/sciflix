/**
 * Sign Up Page
 * 
 * Renders the Clerk authentication sign-up component.
 * Centered on the page with custom styling for consistent branding.
 */

import { SignUp } from '@clerk/nextjs'

/**
 * SignUpPage Component
 * 
 * @returns Rendered sign-up page with Clerk sign-up form
 */
export default function SignUpPage() {
  return (
    <section className="sign-up-page flex min-h-screen items-center justify-center">
      <SignUp 
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