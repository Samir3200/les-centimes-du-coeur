
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, Handshake } from "lucide-react";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export const instant = false;

export default async function AdminPartenairesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/connexion");
  }

  // Vérification des droits administrateur.
  const admins = await sql`
    SELECT u.id
    FROM public.users AS u
    INNER JOIN public.user_roles AS r
      ON r.user_id = u.id
    WHERE u.auth_user_id = ${session.user.id}
      AND u.status = 'active'
      AND u.profile_completed = TRUE
      AND r.role = 'admin'
    LIMIT 1
  `;

  if (admins.length === 0) {
    redirect("/espace-personnel");
  }

  // Récupération des partenaires dans Neon.
  const partenaires = await sql`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.status,
      u.created_at
    FROM public.users AS u
    INNER JOIN public.user_roles AS r
      ON r.user_id = u.id
    WHERE r.role = 'partenaire'
    ORDER BY u.created_at DESC
  `;

  return (
    <main className="min-h-screen bg-[#F7F8F5] px-4 py-10 text-[#092B20]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#17643D] hover:underline"
        >
          <ArrowLeft size={17} />
          Retour au dashboard
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-[#EDF5EF] p-3">
            <Handshake className="text-[#17643D]" size={26} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Partenaires de l'association
            </h1>
            <p className="mt-1 text-slate-600">
              {partenaires.length} partenaire
              {partenaires.length > 1 ? "s" : ""} enregistré
              {partenaires.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EDF5EF] text-[#092B20]">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Nom et prénom
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Inscription
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Statut
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {partenaires.map((partenaire) => (
                  <tr
                    key={String(partenaire.id)}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {String(partenaire.first_name)}{" "}
                      {String(partenaire.last_name)}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {String(partenaire.email)}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(
                        String(partenaire.created_at)
                      ).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          partenaire.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {partenaire.status === "active"
                          ? "Actif"
                          : "Inactif"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/utilisateurs/${partenaire.id}`}
                        className="font-semibold text-[#17643D] hover:underline"
                      >
                        Voir le profil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {partenaires.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              Aucun partenaire enregistré pour le moment.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
