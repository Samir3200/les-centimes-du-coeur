"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Heart, Mail } from "lucide-react";
import { authClient } from "@/lib/auth_clients";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: requestError } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
      });

      if (requestError) {
        setError("Impossible d'envoyer le courriel pour le moment. Réessayez plus tard.");
        return;
      }

      setSent(true);
    } catch {
      setError("Impossible d'envoyer le courriel pour le moment. Réessayez plus tard.");
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
          <h1 className="text-3xl font-semibold">Mot de passe oublié</h1>
          <p className="mt-3 text-sm text-slate-600">
            Recevez un lien pour choisir un nouveau mot de passe.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E6EAE3] bg-white p-7 shadow-sm md:p-9"
        >
          {sent ? (
            <p role="status" className="rounded-xl bg-[#F0F6F0] p-4 text-sm leading-6 text-[#17643D]">
              Si cette adresse correspond à un compte, un lien de réinitialisation vient d&apos;être envoyé. Vérifiez aussi vos courriers indésirables.
            </p>
          ) : (
            <>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-medium">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-[#17643D]"
                />
              </div>

              {error && (
                <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#103C2A] px-6 py-4 font-semibold text-white transition hover:bg-[#17643D] disabled:opacity-60"
              >
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </>
          )}

          <Link href="/connexion" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#17643D] hover:underline">
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </form>
      </div>
    </main>
  );
}
