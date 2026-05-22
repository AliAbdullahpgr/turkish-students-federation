# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Architecture
- Use Turso (SQLite) for database, Clerk for authentication, and Cloudinary for image storage. Confidence: 0.70
- Restrict Clerk sign-up to admin-only; public user registration should be disabled. Confidence: 0.75

# Clerk
- Use currentUser() (not sessionClaims) to check publicMetadata for admin authorization, since Clerk session JWTs don't include custom metadata by default. Confidence: 0.70
- Use NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL env var for post-sign-in redirect instead of ClerkProvider props in @clerk/nextjs v7. Confidence: 0.70

# Markdown
- Avoid `marked` and `dangerouslySetInnerHTML` for markdown preview rendering; use `react-markdown` with `remark-gfm` instead. Confidence: 0.70

# Engineering
- Prefer maintained, package-backed solutions over custom-built editors; do not rebuild editor behavior from scratch. Confidence: 0.70

# Layout
- For admin shells, use `h-screen flex overflow-hidden` on the outer wrapper, `h-full shrink-0 overflow-y-auto` on the sidebar, and `h-full flex-1 min-w-0 overflow-y-auto` on the main content area to achieve independent scroll panels. Avoid random fixed heights like `h-[900px]`. Confidence: 0.75
- For admin form pages (create/edit), use `max-w-4xl` on the form element with a 2-column grid layout (`grid-cols-1 sm:grid-cols-2 gap-4`). Confidence: 0.70

# Workflow
- Do not run `next build` after every small change (e.g., CSS tweaks, minor component edits); only run builds when explicitly requested or for significant changes. Confidence: 0.82
