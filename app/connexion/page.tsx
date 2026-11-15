
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth_clients";

export default function ConnexionPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } =
        await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });

      if (authError) {
        if (authError.code === "EMAIL_NOT_VERIFIED") {
          setError(
            "Votre adresse email n'est pas encore confirmée. Un nouveau lien vient de vous être envoyé. Vérifiez votre boîte de réception et vos courriers indésirables."
          );
          return;
        }

        setError("Adresse email ou mot de passe incorrect.");
        return;
      }

      router.push("/espace-personnel");
      router.refresh();
    } catch {
      setError("Impossible de se connecter pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4 py-12 text-[#092B20]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#103C2A] text-[#D9C58B]">
            <Heart size={27} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#17643D]">
            Les Centimes du Cœur
          </p>

          <h1 className="text-3xl font-semibold">
            Heureux de vous retrouver
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Connectez-vous à votre espace personnel.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E6EAE3] bg-white p-7 shadow-sm md:p-9"
        >
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Adresse email
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-[#17643D]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Mot de passe
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-[#17643D]"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#103C2A] px-6 py-4 font-semibold text-white transition hover:bg-[#17643D] disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="mt-5 text-center text-sm">
            <Link
              href="/mot-de-passe-oublie"
              className="font-medium text-[#17643D] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-slate-500">
            Vous n&apos;avez pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="font-semibold text-[#17643D] hover:underline"
            >
              S&apos;inscrire
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
