
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";


type PublicRole = "adherent" | "partenaire" | "donateur";

const allowedRoles: PublicRole[] = [
  "adherent",
  "partenaire",
  "donateur",
];

function isEmailConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505" &&
    "constraint" in error &&
    error.constraint === "users_email_key"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = String(body.role ?? "");

    if (
      !firstName ||
      !lastName ||
      firstName.length > 100 ||
      lastName.length > 100 ||
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 8 ||
      password.length > 128 ||
      !allowedRoles.includes(role as PublicRole)
    ) {
      return NextResponse.json(
        { error: "Veuillez vérifier les informations saisies." },
        { status: 400 }
      );
    }

    const existingProfile = await sql`
      SELECT 1
      FROM public.users
      WHERE lower(email) = ${email}
      LIMIT 1
    `;

    if (existingProfile.length > 0) {
      return NextResponse.json(
        {
          error:
            "Un profil est déjà associé à cette adresse. Connectez-vous ou contactez-nous pour obtenir de l'aide.",
        },
        { status: 409 }
      );
    }

    // Créer un compte Better Auth.
    // Un email de vérification sera envoyé automatiquement.
    let authUserId: string;

    try {
      const signup = await auth.api.signUpEmail({
        body: {
          name: `${firstName} ${lastName}`,
          email,
          password,
        },
      });

      if (!signup?.user?.id) {
        throw new Error("Compte non créé");
      }

      authUserId = signup.user.id;
    } catch (error) {
      console.error("Erreur Better Auth :", error);

      return NextResponse.json(
        {
          error:
            "Impossible de créer ce compte. Si cette adresse est déjà utilisée, connectez-vous.",
        },
        { status: 400 }
      );
    }

    // Enregistrer le profil et son rôle dans Neon.
    await sql.transaction([
      sql`
        INSERT INTO public.users (
          auth_user_id,
          first_name,
          last_name,
          email,
          profile_completed
        )
        VALUES (
          ${authUserId},
          ${firstName},
          ${lastName},
          ${email},
          FALSE
        )
      `,
      sql`
        INSERT INTO public.user_roles (user_id, role)
        SELECT id, ${role}
        FROM public.users
        WHERE auth_user_id = ${authUserId}
        ON CONFLICT (user_id, role) DO NOTHING
      `,
      sql`
        UPDATE public.users
        SET profile_completed = TRUE,
            updated_at = NOW()
        WHERE auth_user_id = ${authUserId}
          AND EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = public.users.id
              AND role = ${role}
          )
      `,
    ]);

    return NextResponse.json(
      {
        success: true,
        message:
          "Votre compte a été créé. Vérifiez votre boîte email pour confirmer votre adresse avant de vous connecter.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (isEmailConflict(error)) {
      return NextResponse.json(
        {
          error:
            "Un profil est déjà associé à cette adresse. Connectez-vous ou contactez-nous pour obtenir de l'aide.",
        },
        { status: 409 }
      );
    }

    console.error("Erreur d'inscription :", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue. Veuillez réessayer ultérieurement.",
      },
      { status: 500 }
    );
  }
}
