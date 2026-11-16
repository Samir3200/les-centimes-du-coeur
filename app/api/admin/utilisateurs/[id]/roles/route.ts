import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

const allowedRoles = ["adherent", "partenaire", "donateur", "admin"] as const;

type Role = (typeof allowedRoles)[number];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // Vérifier l'origine de la requête.
    const origin = request.headers.get("origin");

    if (!origin || origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { error: "Origine non autorisée." },
        { status: 403 },
      );
    }

    // Vérifier la session Better Auth.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    // Vérifier les droits administrateur dans Neon.
    const admins = await sql`
      SELECT u.id
      FROM public.users AS u
      INNER JOIN public.user_roles AS r
        ON r.user_id = u.id
      WHERE u.auth_user_id = ${session.user.id}
        AND u.profile_completed = TRUE
        AND u.status = 'active'
        AND r.role = 'admin'
      LIMIT 1
    `;

    if (admins.length === 0) {
      return NextResponse.json(
        { error: "Accès réservé aux administrateurs." },
        { status: 403 },
      );
    }

    // Vérifier l'identifiant de l'utilisateur.
    const { id } = await params;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "Identifiant utilisateur invalide." },
        { status: 400 },
      );
    }

    // Vérifier les données reçues.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Données JSON invalides." },
        { status: 400 },
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      !("roles" in body) ||
      !Array.isArray(body.roles)
    ) {
      return NextResponse.json(
        { error: "Liste des rôles invalide." },
        { status: 400 },
      );
    }

    const requestedRoles: unknown[] = body.roles;

    if (
      requestedRoles.some(
        (role) =>
          typeof role !== "string" || !allowedRoles.includes(role as Role),
      ) ||
      new Set(requestedRoles).size !== requestedRoles.length
    ) {
      return NextResponse.json(
        { error: "Un ou plusieurs rôles sont invalides." },
        { status: 400 },
      );
    }

    const newRoles = requestedRoles as Role[];

    // Vérifier les rôles actuels du compte ciblé.
    const existingRoles = await sql`
      SELECT role
      FROM public.user_roles
      WHERE user_id = ${id}
    `;

    const isOwnAccount = admins[0].id === id;

    const wasAdmin = existingRoles.some((item) => item.role === "admin");

    const willBeAdmin = newRoles.includes("admin");

    // Empêcher le retrait de ses propres droits.
    if (isOwnAccount && wasAdmin && !willBeAdmin) {
      return NextResponse.json(
        {
          error:
            "Vous ne pouvez pas retirer vos propres droits administrateur.",
        },
        { status: 403 },
      );
    }

    // Confirmer les changements de droits admin.
    if (wasAdmin !== willBeAdmin) {
      if (!("confirmAdminChange" in body) || body.confirmAdminChange !== true) {
        return NextResponse.json(
          {
            error:
              "Une confirmation est nécessaire pour modifier les droits administrateur.",
          },
          { status: 400 },
        );
      }
    }

    // La fonction PostgreSQL réalise la modification
    // atomique et protège le dernier administrateur.
    const [result] = await sql`
      SELECT public.update_user_roles(
      ${admins[0].id}::uuid,
        ${id}::uuid,
        ${newRoles}::text[]
      ) AS roles
    `;

    return NextResponse.json({
      success: true,
      roles: result.roles,
    });
  } catch (error) {
    console.error("Erreur modification des rôles :", error);

    return NextResponse.json(
      { error: "Impossible de modifier les rôles." },
      { status: 500 },
    );
  }
}
