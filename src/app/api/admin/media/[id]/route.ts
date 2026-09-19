import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activityPosts, blogPosts, courses, events, media, teamMembers } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse } from "@/lib/api-validation";

/**
 * Everything that can point at a media row, with the label the admin panel
 * uses for it. Kept next to the delete so adding a new image field to a table
 * shows up here rather than silently becoming a way to break a page.
 */
const references = [
  { label: "blog yazısı", table: blogPosts, column: blogPosts.thumbnailMediaId },
  { label: "faaliyet yazısı", table: activityPosts, column: activityPosts.thumbnailMediaId },
  { label: "etkinlik", table: events, column: events.posterMediaId },
  { label: "ekip üyesi", table: teamMembers, column: teamMembers.photoMediaId },
  { label: "kurs", table: courses, column: courses.thumbnailMediaId },
] as const;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const { id } = await params;
    const existing = await db.select({ id: media.id }).from(media).where(eq(media.id, id)).get();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    /*
      Deleting an image that something still uses used to be attempted blind.
      With foreign keys enforced that threw, and the handler had no catch, so
      the panel got an unhandled 500; without them it succeeded and left a
      dangling reference, which the public page renders as a missing picture.
      Neither told the editor what was wrong, so the usages are counted first
      and reported back by name.
    */
    const inUse: string[] = [];
    for (const reference of references) {
      const row = await db
        .select({ id: reference.column })
        .from(reference.table)
        .where(eq(reference.column, id))
        .get();
      if (row) inUse.push(reference.label);
    }

    if (inUse.length > 0) {
      return NextResponse.json(
        {
          error: `Bu görsel kullanımda: ${inUse.join(", ")}. Önce oradan kaldırın.`,
          inUse,
        },
        { status: 409 },
      );
    }

    await db.delete(media).where(eq(media.id, id)).run();

    // No public page can reference an unused image, so nothing needs rebuilding.
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
