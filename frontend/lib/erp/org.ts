import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { orgsApi, authApi } from "@/lib/api/client";
import type { Organization, TeamMember, TeamRole } from "./types";

export const ACTIVE_ORG_COOKIE = "bp_active_org";

const ROLE_RANK: Record<TeamRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

export function roleAtLeast(role: string | null | undefined, min: TeamRole) {
  if (!role || !(role in ROLE_RANK)) return false;
  return ROLE_RANK[role as TeamRole] >= ROLE_RANK[min];
}

export interface OrgContext {
  org: Organization;
  member: TeamMember;
}

/** All active organizations the signed-in user belongs to. */
export async function getMemberships(): Promise<OrgContext[]> {
  try {
    const orgs = await orgsApi.list();
    if (!orgs || orgs.length === 0) return [];

    const user = await authApi.getMe().catch(() => null);

    const list: OrgContext[] = [];
    for (const org of orgs) {
      const ownerId = String(org.owner_id || (org as unknown as { owner: string }).owner || "");
      const isOwner = Boolean(user && ownerId && String(user.id) === ownerId);
      const role: TeamRole = isOwner ? "owner" : "admin";
      const member: TeamMember = {
        id: `mem-${org.id}`,
        organization_id: org.id,
        user_id: user?.id ?? null,
        email: user?.email ?? "",
        name: user?.name ?? "",
        role,
        department: "",
        status: "active",
        invited_at: null,
        joined_at: null,
        created_at: org.created_at,
      };
      list.push({ org, member });
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * The organization the user is currently working in.
 * Persisted via cookie; falls back to the first membership.
 */
export async function getActiveOrg(): Promise<OrgContext | null> {
  const memberships = await getMemberships();
  if (memberships.length === 0) return null;

  const cookieStore = await cookies();
  const wanted = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
  return (
    memberships.find((m) => m.org.id === wanted) ?? memberships[0]
  );
}

/** For pages — guarantees an org context or redirects. */
export async function requireOrg(): Promise<OrgContext> {
  const ctx = await getActiveOrg();
  if (!ctx) redirect("/dashboard");
  return ctx;
}

/** For mutations — enforces a minimum role at the application layer. */
export async function requireRole(min: TeamRole): Promise<OrgContext> {
  const ctx = await getActiveOrg();
  if (!ctx) throw new Error("You don't belong to any organization.");
  if (!roleAtLeast(ctx.member.role, min))
    throw new Error(
      `This action requires the ${min} role or higher in ${ctx.org.name}.`,
    );
  return ctx;
}

/** Claim pending invites matching this user's email. */
export async function claimPendingInvites(
  email: string,
  userId: string,
): Promise<number> {
  try {
    const res = await authApi.claimPendingInvites();
    return res.claimed;
  } catch {
    return 0;
  }
}
