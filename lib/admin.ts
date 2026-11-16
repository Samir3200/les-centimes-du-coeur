
import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function getCurrentAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const administrators = await sql`
    SELECT u.id, u.first_name, u.last_name
    FROM public.users AS u
    INNER JOIN public.user_roles AS r
      ON r.user_id = u.id
    WHERE u.auth_user_id = ${session.user.id}
      AND u.profile_completed = TRUE
      AND u.status = 'active'
      AND r.role = 'admin'
    LIMIT 1
  `;

  if (administrators.length === 0) {
    return null;
  }

  return administrators[0];
}
