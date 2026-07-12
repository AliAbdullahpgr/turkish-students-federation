import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { media, teamMembers } from "@/db/schema";
import { teamMembers as fallbackTeamMembers } from "@/data/team";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

const teamFallbacks = fallbackTeamMembers.map((member) => ({
  ...member,
  bio: member.bio || null,
  photo: member.photo || null,
  photoMediaId: null,
  isActive: true,
  createdAt: null,
}));

const teamMemberSelection = {
  id: teamMembers.id,
  name: teamMembers.name,
  role: teamMembers.role,
  bio: teamMembers.bio,
  photoMediaId: teamMembers.photoMediaId,
  photo: media.secureUrl,
  order: teamMembers.order,
  isActive: teamMembers.isActive,
  createdAt: teamMembers.createdAt,
};

export async function getAllTeamMembers() {
  try { return await db
    .select(teamMemberSelection)
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoMediaId, media.id))
    .orderBy(asc(teamMembers.order))
    .all(); } catch (error) { return staticFallbackOrThrow(error, teamFallbacks); }
}

export async function getActiveTeamMembers() {
  try { return await db
    .select(teamMemberSelection)
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoMediaId, media.id))
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.order))
    .all(); } catch (error) { return staticFallbackOrThrow(error, teamFallbacks); }
}

export async function getTeamMemberById(id: string) {
  return db
    .select(teamMemberSelection)
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoMediaId, media.id))
    .where(eq(teamMembers.id, id))
    .get();
}
