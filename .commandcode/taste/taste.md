# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Architecture
- Use Turso (SQLite) for database, Clerk for authentication, and Cloudinary for image storage. Confidence: 0.70
- Restrict Clerk sign-up to admin-only; public user registration should be disabled. Confidence: 0.75

# Clerk
- Use currentUser() (not sessionClaims) to check publicMetadata for admin authorization, since Clerk session JWTs don't include custom metadata by default. Confidence: 0.70
- Use NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL env var for post-sign-in redirect instead of ClerkProvider props in @clerk/nextjs v7. Confidence: 0.70

