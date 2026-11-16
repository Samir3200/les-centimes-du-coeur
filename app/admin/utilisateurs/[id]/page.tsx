
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    UserRound,
    Mail,
    CalendarDays,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import RoleEditor from "./role-editor";
import StatusEditor from "./status-editor";

export const instant = false;

const roleLabels: Record<string, string> = {
    adherent: "Adhérent",
    partenaire: "Partenaire",
    donateur: "Donateur",
    admin: "Administrateur",
};

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AdminUtilisateurDetailPage({
    params,
}: PageProps) {
    // Vérification de la session.
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/connexion");
    }

    // Vérification des droits administrateur.
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

    const { id } = await params;

    // Vérification du format UUID avant d'interroger Neon.
    const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
        notFound();
    }

    // Récupération du profil demandé.
    const profiles = await sql`
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      address,
      postal_code,
      city,
      country,
      status,
      created_at,
      profile_completed
    FROM public.users
    WHERE id = ${id}
    LIMIT 1
  `;

    if (profiles.length === 0) {
        notFound();
    }

    const user = profiles[0];

    const roles = await sql`
    SELECT role
    FROM public.user_roles
    WHERE user_id = ${id}
    ORDER BY created_at ASC
  `;

    const isOwnAccount =
        administrators[0].id === user.id;

    const fullName =
        `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    return (
        <main className="min-h-screen bg-[#F7F8F5] px-4 py-10 text-[#092B20] sm:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/admin/utilisateurs"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#17643D] hover:underline"
                >
                    <ArrowLeft size={18} />
                    Retour aux utilisateurs
                </Link>

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#17643D]">
                            Administration / Utilisateurs
                        </p>

                        <h1 className="text-3xl font-semibold">
                            Fiche utilisateur
                        </h1>

                        <p className="mt-3 text-slate-600">
                            Consultez les informations et les droits
                            de ce compte.
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-[#E5EFE8] px-4 py-2 text-sm font-medium text-[#17643D]">
                        <ShieldCheck size={18} />
                        Accès administrateur
                    </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* INFORMATIONS PERSONNELLES */}
                    <section className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <UserRound className="text-[#17643D]" />
                            <h2 className="text-xl font-semibold">
                                Informations personnelles
                            </h2>
                        </div>

                        <div className="space-y-5 text-sm">
                            <div>
                                <p className="text-slate-500">
                                    Nom complet
                                </p>
                                <p className="mt-1 font-semibold">
                                    {fullName || "Non renseigné"}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">
                                    Adresse email
                                </p>
                                <p className="mt-1 flex items-center gap-2">
                                    <Mail
                                        size={16}
                                        className="text-[#17643D]"
                                    />
                                    {user.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">
                                    Téléphone
                                </p>
                                <p className="mt-1 font-medium">
                                    {user.phone || "Non renseigné"}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">
                                    Adresse
                                </p>
                                <p className="mt-1 font-medium">
                                    {[
                                        user.address,
                                        user.postal_code,
                                        user.city,
                                        user.country,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "Non renseignée"}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">
                                    Date d'inscription
                                </p>
                                <p className="mt-1 flex items-center gap-2">
                                    <CalendarDays
                                        size={16}
                                        className="text-[#17643D]"
                                    />
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString("fr-FR")}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* RÔLES ET STATUT */}
                    <section className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-[#17643D]" />
                            <h2 className="text-xl font-semibold">
                                Rôles et statut
                            </h2>
                        </div>

                        <div className="mb-7">
                            <p className="mb-3 text-sm text-slate-500">
                                Rôles attribués
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {roles.map((item) => (
                                    <span
                                        key={item.role}
                                        className={`rounded-full px-4 py-2 text-sm font-medium ${item.role === "admin"
                                            ? "bg-[#F5EBD0] text-[#765B18]"
                                            : "bg-[#EDF5EF] text-[#17643D]"
                                            }`}
                                    >
                                        {roleLabels[item.role] ?? item.role}
                                    </span>
                                ))}

                                {roles.length === 0 && (
                                    <p className="text-sm text-slate-500">
                                        Aucun rôle attribué.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-7">
                            <p className="mb-3 text-sm text-slate-500">
                                Statut du compte
                            </p>

                            <span
                                className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${user.status === "active"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                {user.status === "active"
                                    ? "Actif"
                                    : "Inactif"}
                            </span>
                        </div>

                        <div>
                            <p className="mb-3 text-sm text-slate-500">
                                Profil
                            </p>

                            <span className="text-sm font-medium">
                                {user.profile_completed
                                    ? "Profil finalisé"
                                    : "Profil incomplet"}
                            </span>
                        </div>

                        {isOwnAccount && (
                            <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#FFF8E7] p-4">
                                <ShieldAlert
                                    size={20}
                                    className="shrink-0 text-[#9A741F]"
                                />

                                <p className="text-sm text-[#765B18]">
                                    Il s'agit de votre propre compte
                                    administrateur. Certaines actions
                                    sensibles seront protégées.
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* ACTIONS À VENIR */}
                <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                    <h2 className="mb-6 text-xl font-semibold">
                        Gestion du compte
                    </h2>

                    <RoleEditor
                        userId={String(user.id)}
                        initialRoles={roles.map((item) => String(item.role))}
                        isOwnAccount={isOwnAccount}
                    />
                    <StatusEditor
                        userId={String(user.id)}
                        initialStatus={String(user.status)}
                        isOwnAccount={isOwnAccount}
                    />
                </section>
            </div>
        </main>
    );
}
