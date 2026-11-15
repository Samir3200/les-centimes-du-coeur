
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  UserRound,
  Handshake,
  Gift,
  CalendarDays,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import LogoutButton from "./logout-button";

export const instant = false;

const roleLabels: Record<string, string> = {
  adherent: "Adhérent",
  partenaire: "Partenaire",
  donateur: "Donateur",
  admin: "Administrateur",
};

export default async function EspacePersonnelPage() {
  // Vérification de la session côté serveur.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/connexion");
  }

  // On recherche le profil uniquement à partir de
  // l'identifiant authentifié, jamais depuis l'URL.
  const profiles = await sql`
    SELECT id, first_name, last_name, email, created_at
    FROM public.users
    WHERE auth_user_id = ${session.user.id}
      AND profile_completed = TRUE
    LIMIT 1
  `;

  if (profiles.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <Heart
            size={40}
            className="mx-auto mb-5 text-[#17643D]"
          />

          <h1 className="text-2xl font-semibold text-[#092B20]">
            Profil en attente
          </h1>

          <p className="mt-4 text-slate-600">
            Votre compte existe, mais votre profil n&apos;est pas
            encore finalisé. Veuillez contacter l&apos;association.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4">
            <LogoutButton />
            <Link
              href="/"
              className="font-medium text-[#17643D] hover:underline"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const profile = profiles[0];

  const roles = await sql`
    SELECT role
    FROM public.user_roles
    WHERE user_id = ${profile.id}
    ORDER BY created_at ASC
  `;

  const donations = await sql`
    SELECT id, amount, currency, donated_at
    FROM public.donations
    WHERE user_id = ${profile.id}
      AND payment_status = 'completed'
    ORDER BY donated_at DESC
    LIMIT 20
  `;

  const fullName =
    `${profile.first_name} ${profile.last_name}`.trim();

  return (
    <main className="min-h-screen bg-[#F7F8F5] px-4 py-12 text-[#092B20]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#17643D]">
              Les Centimes du Cœur
            </p>

            <h1 className="text-3xl font-semibold md:text-4xl">
              Bonjour, {profile.first_name} !
            </h1>

            <p className="mt-3 text-slate-600">
              Bienvenue dans votre espace personnel.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="text-[#17643D]" />
              <h2 className="text-xl font-semibold">
                Mes informations
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500">Nom complet</p>
                <p className="mt-1 font-medium">{fullName}</p>
              </div>

              <div>
                <p className="text-slate-500">Adresse email</p>
                <p className="mt-1 font-medium">{profile.email}</p>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays size={17} />
                <span>
                  Inscrit depuis le{" "}
                  {new Date(profile.created_at).toLocaleDateString(
                    "fr-FR"
                  )}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Handshake className="text-[#17643D]" />
              <h2 className="text-xl font-semibold">
                Mon engagement
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {roles.map((item) => (
                <span
                  key={item.role}
                  className="rounded-full bg-[#EDF5EF] px-4 py-2 text-sm font-medium text-[#17643D]"
                >
                  {roleLabels[item.role] ?? item.role}
                </span>
              ))}
            </div>

            {roles.length === 0 && (
              <p className="text-sm text-slate-500">
                Aucun rôle attribué pour le moment.
              </p>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Gift className="text-[#17643D]" />
            <h2 className="text-xl font-semibold">
              Historique de mes dons
            </h2>
          </div>

          {donations.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucun don confirmé n&apos;est encore associé à votre compte.
            </p>
          ) : (
            <div className="space-y-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F8F5] p-4"
                >
                  <span className="text-sm text-slate-600">
                    {donation.donated_at
                      ? new Date(
                          donation.donated_at
                        ).toLocaleDateString("fr-FR")
                      : "Date indisponible"}
                  </span>

                  <span className="font-semibold text-[#17643D]">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: donation.currency,
                    }).format(Number(donation.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-medium text-[#17643D] hover:underline"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
