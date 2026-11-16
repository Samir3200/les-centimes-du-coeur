

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    Users,
    ShieldCheck,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export const instant = false;

const roleLabels: Record<string, string> = {
    adherent: "Adhérent",
    partenaire: "Partenaire",
    donateur: "Donateur",
    admin: "Administrateur",
};

const allowedFilters = [
    "tous",
    "adherent",
    "partenaire",
    "donateur",
    "admin",
];

type PageProps = {
    searchParams: Promise<{
        role?: string;
        q?: string;
    }>;
};

export default async function AdminUtilisateursPage({
    searchParams,
}: PageProps) {
    // Vérification de la session.
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/connexion");
    }

    // Vérification du rôle administrateur.
    const administrators = await sql`
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

    if (administrators.length === 0) {
        redirect("/espace-personnel");
    }

    // Lecture des filtres.
    const params = await searchParams;

    const requestedRole = params.role ?? "tous";

    const selectedRole = allowedFilters.includes(requestedRole)
        ? requestedRole
        : "tous";

    const search = (params.q ?? "").trim().slice(0, 100);

    // Récupération des utilisateurs et de leurs rôles.
    // Les paramètres sont transmis de manière sécurisée à Neon.
    const users = await sql`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.status,
      u.created_at,
      COALESCE(
        ARRAY_AGG(DISTINCT r.role)
          FILTER (WHERE r.role IS NOT NULL),
        ARRAY[]::text[]
      ) AS roles
    FROM public.users AS u
    LEFT JOIN public.user_roles AS r
      ON r.user_id = u.id
    WHERE
      (
        ${selectedRole} = 'tous'
        OR EXISTS (
          SELECT 1
          FROM public.user_roles AS rf
          WHERE rf.user_id = u.id
            AND rf.role = ${selectedRole}
        )
      )
      AND (
        ${search} = ''
        OR u.first_name ILIKE ${"%" + search + "%"}
        OR u.last_name ILIKE ${"%" + search + "%"}
        OR u.email ILIKE ${"%" + search + "%"}
      )
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT 100
  `;

    const filters = [
        { label: "Tous", value: "tous" },
        { label: "Adhérents", value: "adherent" },
        { label: "Partenaires", value: "partenaire" },
        { label: "Donateurs", value: "donateur" },
        { label: "Administrateurs", value: "admin" },
    ];

    function filterUrl(role: string) {
        const query = new URLSearchParams();

        if (role !== "tous") {
            query.set("role", role);
        }

        if (search) {
            query.set("q", search);
        }

        const qs = query.toString();

        return `/admin/utilisateurs${qs ? `?${qs}` : ""}`;
    }

    return (
        <main className="min-h-screen bg-[#F7F8F5] px-4 py-10 text-[#092B20] sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#17643D] hover:underline"
                    >
                        <ArrowLeft size={18} />
                        Retour au tableau de bord
                    </Link>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#17643D]">
                                Administration
                            </p>

                            <h1 className="text-3xl font-semibold">
                                Gestion des utilisateurs
                            </h1>

                            <p className="mt-3 text-slate-600">
                                Consultez les comptes et leurs rôles.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-[#E5EFE8] px-4 py-2 text-sm font-medium text-[#17643D]">
                            <ShieldCheck size={18} />
                            Accès administrateur
                        </div>
                    </div>
                </div>

                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3">
                        <Users className="text-[#17643D]" />

                        <h2 className="text-xl font-semibold">
                            Liste des utilisateurs
                        </h2>

                        <span className="rounded-full bg-[#EDF5EF] px-3 py-1 text-xs font-semibold text-[#17643D]">
                            {users.length} affiché(s)
                        </span>
                    </div>

                    {/* RECHERCHE */}
                    <form
                        action="/admin/utilisateurs"
                        method="GET"
                        className="mb-6 flex flex-wrap gap-3"
                    >
                        {selectedRole !== "tous" && (
                            <input
                                type="hidden"
                                name="role"
                                value={selectedRole}
                            />
                        )}

                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="search"
                                name="q"
                                defaultValue={search}
                                placeholder="Rechercher par nom ou email..."
                                maxLength={100}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-[#17643D]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-[#103C2A] px-6 py-3 text-sm font-medium text-white hover:bg-[#17643D]"
                        >
                            Rechercher
                        </button>
                    </form>

                    {/* FILTRES */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {filters.map((filter) => {
                            const active = selectedRole === filter.value;

                            return (
                                <Link
                                    key={filter.value}
                                    href={filterUrl(filter.value)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
                                            ? "bg-[#103C2A] text-white"
                                            : "bg-[#F1F5F1] text-[#17643D] hover:bg-[#E5EFE8]"
                                        }`}
                                >
                                    {filter.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* TABLEAU */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-4 py-4 font-medium">
                                        Utilisateur
                                    </th>

                                    <th className="px-4 py-4 font-medium">
                                        Email
                                    </th>

                                    <th className="px-4 py-4 font-medium">
                                        Rôles
                                    </th>

                                    <th className="px-4 py-4 font-medium">
                                        Statut
                                    </th>

                                    <th className="px-4 py-4 font-medium">
                                        Inscription
                                    </th>
                                    <th className="px-4 py-4 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-[#F7FAF7]"
                                    >
                                        <td className="px-4 py-5 font-medium">
                                            {user.first_name} {user.last_name}
                                        </td>

                                        <td className="px-4 py-5 text-slate-600">
                                            {user.email}
                                        </td>

                                        <td className="px-4 py-5">
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.map((role: string) => (
                                                    <span
                                                        key={role}
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${role === "admin"
                                                                ? "bg-[#F5EBD0] text-[#765B18]"
                                                                : "bg-[#EDF5EF] text-[#17643D]"
                                                            }`}
                                                    >
                                                        {roleLabels[role] ?? role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="px-4 py-5">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${user.status === "active"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {user.status === "active"
                                                    ? "Actif"
                                                    : "Inactif"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-5 text-slate-500">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("fr-FR")}
                                        </td>
                                        <td className="px-4 py-5 text-right">
                                            <Link
                                                href={`/admin/utilisateurs/${user.id}`}
                                                className="inline-flex items-center rounded-xl bg-[#EDF5EF] px-4 py-2 text-sm font-medium text-[#17643D] transition hover:bg-[#DDECE0]"
                                            >
                                                Gérer
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="py-12 text-center text-slate-500">
                                Aucun utilisateur trouvé pour ces critères.
                            </div>
                        )}
                    </div>

                    <p className="mt-5 text-xs text-slate-400">
                        Affichage limité aux 100 premiers résultats.
                        La pagination sera ajoutée si nécessaire.
                    </p>
                </section>
            </div>
        </main>
    );
}
