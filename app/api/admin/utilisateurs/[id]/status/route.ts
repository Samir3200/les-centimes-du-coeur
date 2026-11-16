
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

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

    // Vérifier les droits administrateur.
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

    const { id } = await params;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "Identifiant utilisateur invalide." },
        { status: 400 },
      );
    }

    // Empêcher la désactivation de son propre compte.
    if (String(admins[0].id) === id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas modifier le statut de votre propre compte administrateur." },
        { status: 403 },
      );
    }

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
      !("status" in body) ||
      (body.status !== "active" && body.status !== "inactive")
    ) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 },
      );
    }

    const newStatus = body.status;

    // Vérifier que le compte existe.
    const users = await sql`
      SELECT id, status
      FROM public.users
      WHERE id = ${id}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    // Modifier uniquement le statut du compte.
    const updated = await sql`
  UPDATE public.users
  SET status = ${newStatus},
      updated_at = NOW()
  WHERE id = ${id}
    AND id <> ${admins[0].id}
  RETURNING status, auth_user_id
`;

if (updated.length > 0 && newStatus === "inactive") {
  await sql`
    DELETE FROM auth.session
    WHERE "userId" = ${updated[0].auth_user_id}
  `;
}

    return NextResponse.json({
      success: true,
      status: updated[0].status,
    });
  } catch (error) {
    console.error("Erreur modification du statut :", error);

    return NextResponse.json(
      { error: "Impossible de modifier le statut du compte." },
      { status: 500 },
    );
  }
}
