import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { resolveMediaUrls } from "./resolve-media";

export async function getAllTeamMembers() {
  const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.order)).all();
  return resolveMediaUrls(rows, "photoMediaId", "photo");
}

export async function getActiveTeamMembers() {
  const rows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.order))
    .all();
  return resolveMediaUrls(rows, "photoMediaId", "photo");
}

export async function getTeamMemberById(id: string) {
  const row = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .get();
  if (!row) return null;
  const [resolved] = await resolveMediaUrls([row], "photoMediaId", "photo");
  return resolved;
}
