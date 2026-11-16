
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  UserRound,
  Handshake,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

type Role = "adherent" | "partenaire" | "donateur";

export default function InscriptionPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("adherent");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }

      router.push("/inscription/succes");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    {
      id: "adherent" as Role,
      label: "Adhérent",
      description: "Rejoindre l'association",
      icon: UserRound,
    },
    {
      id: "partenaire" as Role,
      label: "Partenaire",
      description: "Soutenir nos actions",
      icon: Handshake,
    },
    {
      id: "donateur" as Role,
      label: "Donateur",
      description: "Contribuer à nos projets",
      icon: HeartHandshake,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F8F5] px-4 py-14 text-[#092B20]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#103C2A] text-[#D9C58B]">
            <Heart size={27} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#17643D]">
            Les Centimes du Cœur
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Rejoignez notre communauté solidaire
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            Ensemble, donnons plus de force à la solidarité.
            Créez votre compte et participez à nos actions.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E6EAE3] bg-white p-6 shadow-sm md:p-10"
        >
          <h2 className="mb-2 text-lg font-semibold">
            Comment souhaitez-vous nous rejoindre ?
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            Sélectionnez votre profil.
          </p>

          <div className="mb-9 grid gap-3 md:grid-cols-3">
            {roles.map((item) => {
              const Icon = item.icon;
              const selected = role === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  aria-pressed={selected}
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-[#17643D] bg-[#F0F6F0] ring-1 ring-[#17643D]"
                      : "border-slate-200 hover:border-[#17643D]"
                  }`}
                >
                  <Icon
                    size={25}
                    className="mb-4 text-[#17643D]"
                  />
                  <span className="block font-semibold">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>

          <h2 className="mb-5 text-lg font-semibold">
            Vos informations personnelles
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
                Prénom
              </label>
              <input
                id="firstName"
                required
                maxLength={100}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17643D]"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
                Nom
              </label>
              <input
                id="lastName"
                required
                maxLength={100}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17643D]"
                placeholder="Votre nom"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17643D]"
                placeholder="exemple@email.com"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Numéro de téléphone (facultatif)
              </label>
              <input
                id="phone"
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17643D]"
                placeholder="Ex. : 06 12 34 56 78 ou +33 6 12 34 56 78"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17643D]"
                placeholder="8 caractères minimum"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17643D]"
                placeholder="Confirmez votre mot de passe"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#103C2A] px-6 py-4 font-semibold text-white transition hover:bg-[#17643D] disabled:opacity-60"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Déjà inscrit ?{" "}
            <Link
              href="/connexion"
              className="font-semibold text-[#17643D] hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </form>

        <p className="mt-7 text-center text-xs text-slate-500">
          La force de la solidarité accessible à tous.
        </p>
      </div>
    </main>
  );
}
