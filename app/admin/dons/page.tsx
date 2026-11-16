
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, HandCoins } from "lucide-react";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export const instant = false;

export default async function AdminDonsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/connexion");
  }

  // Accès réservé aux administrateurs actifs.
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

  // Liste des dons avec les informations des donateurs.
  const donations = await sql`
    SELECT
      d.id,
      d.amount,
      d.currency,
      d.payment_status,
      d.donated_at,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email
    FROM public.donations AS d
    LEFT JOIN public.users AS u
      ON u.id = d.user_id
    ORDER BY d.donated_at DESC
    LIMIT 200
  `;

  // Total des dons confirmés, regroupés par devise.
  const totals = await sql`
    SELECT
      currency,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS donation_count
    FROM public.donations
    WHERE payment_status = 'completed'
    GROUP BY currency
    ORDER BY currency
  `;

  function formatAmount(amount: unknown, currency: unknown) {
    const value = Number(amount);
    const code = String(currency || "EUR");

    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: code,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${code}`;
    }
  }

  function formatDate(value: unknown) {
    if (!value) return "Date indisponible";

    const date = new Date(String(value));

    return Number.isNaN(date.getTime())
      ? "Date indisponible"
      : date.toLocaleDateString("fr-FR");
  }

  const statusLabels: Record<string, string> = {
    completed: "Confirmé",
    pending: "En attente",
    failed: "Échoué",
    refunded: "Remboursé",
    cancelled: "Annulé",
  };

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
            <HandCoins className="text-[#17643D]" size={26} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Dons collectés
            </h1>
            <p className="mt-1 text-slate-600">
              Consultez les dons enregistrés par l&apos;association.
            </p>
          </div>
        </div>

        {/* TOTAUX CONFIRMÉS */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Total des dons confirmés
          </h2>

          {totals.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-7 text-slate-500 shadow-sm">
              Aucun don confirmé pour le moment.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {totals.map((item) => (
                <div
                  key={String(item.currency)}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <p className="text-sm text-slate-500">
                    Total en {String(item.currency)}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#17643D]">
                    {formatAmount(item.total, item.currency)}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {String(item.donation_count)} don(s) confirmé(s)
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HISTORIQUE DES DONS */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Historique des dons
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Les 200 dons les plus récents.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EDF5EF]">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Donateur
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Montant
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
                {donations.map((donation) => {
                  const status = String(donation.payment_status);

                  const fullName = [
                    donation.first_name,
                    donation.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr
                      key={String(donation.id)}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(donation.donated_at)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium">
                          {fullName || "Donateur non renseigné"}
                        </p>

                        {donation.email && (
                          <p className="mt-1 text-xs text-slate-500">
                            {String(donation.email)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {formatAmount(
                          donation.amount,
                          donation.currency
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "completed"
                              ? "bg-green-100 text-green-800"
                              : status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {statusLabels[status] || status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {donation.user_id ? (
                          <Link
                            href={`/admin/utilisateurs/${donation.user_id}`}
                            className="font-semibold text-[#17643D] hover:underline"
                          >
                            Voir le profil
                          </Link>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {donations.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              Aucun don enregistré pour le moment.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
