import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllTeamMembers() {
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.order))
    .all();
}

export async function getActiveTeamMembers() {
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.order))
    .all();
}

export async function getTeamMemberById(id: string) {
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .get();
}
