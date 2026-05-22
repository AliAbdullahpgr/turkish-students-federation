import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { media, teamMembers } from "@/db/schema";

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
  return db
    .select(teamMemberSelection)
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoMediaId, media.id))
    .orderBy(asc(teamMembers.order))
    .all();
}

export async function getActiveTeamMembers() {
  return db
    .select(teamMemberSelection)
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoMediaId, media.id))
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.order))
    .all();
}

export async function getTeamMemberById(id: string) {
  return db
    .select(teamMemberSelection)
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoMediaId, media.id))
    .where(eq(teamMembers.id, id))
    .get();
}
