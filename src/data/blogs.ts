import { BlogPost } from "@/types";

/**
 * Intentionally empty.
 *
 * This file used to carry six invented articles ("Öğrenciler Üzerindeki Artan
 * Fiyat Yükü" and friends) illustrated with picsum.photos stock images. They
 * were demo content from the original clone, they were seeded into the real
 * database, and they read on the live site as things the association had
 * actually published. Real posts are written in the admin panel.
 *
 * The array stays so the outage fallback in `static-fallback.ts` still has a
 * shape to return: an empty blog list is correct when the database is
 * unreachable, placeholder articles are not.
 */
export const blogPosts: BlogPost[] = [];
