
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Heart,
  Wallet,
  UserCog,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export const instant = false;

const menuItems = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Adhérents",
    href: "/admin/adherents",
    icon: Users,
    active: false,
  },
  {
    label: "Partenaires",
    href: "/admin/partenaires",
    icon: Handshake,
    active: false,
  },
  {
    label: "Donateurs",
    href: "/admin/donateurs",
    icon: Heart,
    active: false,
  },
  {
    label: "Dons collectés",
    href: "/admin/dons",
    icon: Wallet,
    active: false,
  },
  {
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: UserCog,
    active: false,
  },
];

export default async function AdminPage() {
  // Vérification de la session Better Auth.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/connexion");
  }

  // Vérification du rôle administrateur dans Neon.
  const administrators = await sql`
    SELECT u.id, u.first_name
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <ShieldCheck
            size={48}
            className="mx-auto mb-5 text-[#17643D]"
          />

          <h1 className="text-2xl font-semibold text-[#092B20]">
            Accès réservé
          </h1>

          <p className="mt-4 text-slate-600">
            Cette page est réservée aux administrateurs
            des Centimes du Cœur.
          </p>

          <Link
            href="/espace-personnel"
            className="mt-7 inline-block rounded-xl bg-[#103C2A] px-6 py-3 font-medium text-white hover:bg-[#17643D]"
          >
            Retour à mon espace
          </Link>
        </div>
      </main>
    );
  }

  const admin = administrators[0];

  // Statistiques réelles provenant de Neon.
  const [stats] = await sql`
    SELECT
      (
        SELECT COUNT(DISTINCT user_id)
        FROM public.user_roles
        WHERE role = 'adherent'
      ) AS adherents,

      (
        SELECT COUNT(DISTINCT user_id)
        FROM public.user_roles
        WHERE role = 'partenaire'
      ) AS partenaires,

      (
        SELECT COUNT(DISTINCT user_id)
        FROM public.user_roles
        WHERE role = 'donateur'
      ) AS donateurs,

      (
        SELECT COALESCE(SUM(amount), 0)
        FROM public.donations
        WHERE payment_status = 'completed'
          AND currency = 'EUR'
      ) AS total_dons
  `;

  const cards = [
    {
      label: "Adhérents",
      value: String(stats.adherents),
      icon: Users,
      description: "Membres de l'association",
    },
    {
      label: "Partenaires",
      value: String(stats.partenaires),
      icon: Handshake,
      description: "Partenaires enregistrés",
    },
    {
      label: "Donateurs",
      value: String(stats.donateurs),
      icon: Heart,
      description: "Comptes donateurs",
    },
    {
      label: "Dons collectés",
      value: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(Number(stats.total_dons)),
      icon: Wallet,
      description: "Dons confirmés en euros",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#092B20] lg:flex">
      {/* MENU LATÉRAL */}
      <aside className="bg-[#103C2A] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col">
        <div className="border-b border-white/10 px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9C58B]">
              <Heart
                size={24}
                className="text-[#103C2A]"
              />
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide">
                Les Centimes du Cœur
              </p>

              <p className="mt-1 text-xs text-white/60">
                Espace administration
              </p>
            </div>
          </div>
        </div>

        <nav
          aria-label="Navigation administrateur"
          className="flex-1 space-y-1 px-4 py-6"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  item.active ? "page" : undefined
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-[#17643D] text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />

                <span className="flex-1">
                  {item.label}
                </span>

                {item.active && (
                  <ChevronRight size={16} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          {/* EN-TÊTE */}
          <header className="mb-9 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#17643D]">
                Vue d&apos;ensemble
              </p>

              <h1 className="text-3xl font-semibold md:text-4xl">
                Tableau de bord
              </h1>

              <p className="mt-3 text-slate-600">
                Bienvenue, {admin.first_name}.
                Voici les informations de votre association.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#E5EFE8] px-4 py-2 text-sm font-semibold text-[#17643D]">
              <ShieldCheck size={18} />
              Administrateur
            </div>
          </header>

          {/* STATISTIQUES */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <section
                  key={card.label}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.label}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF]">
                      <Icon
                        size={22}
                        className="text-[#17643D]"
                      />
                    </div>
                  </div>

                  <p className="text-3xl font-semibold text-[#092B20]">
                    {card.value}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    {card.description}
                  </p>
                </section>
              );
            })}
          </div>

          {/* GESTION */}
          <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Gestion de l&apos;association
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Accédez aux différentes rubriques
                de votre espace administrateur.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {menuItems
                .filter((item) => !item.active)
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-[#17643D] hover:bg-[#F7FAF7]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF5EF]">
                        <Icon
                          size={23}
                          className="text-[#17643D]"
                        />
                      </div>

                      <span className="flex-1 font-medium">
                        {item.label}
                      </span>

                      <ChevronRight
                        size={19}
                        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#17643D]"
                      />
                    </Link>
                  );
                })}
            </div>
          </section>

          <p className="mt-7 text-center text-xs text-slate-400">
            Les Centimes du Cœur — Administration
          </p>
        </div>
      </main>
    </div>
  );
}
