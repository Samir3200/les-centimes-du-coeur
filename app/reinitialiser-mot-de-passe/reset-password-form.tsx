"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Heart, LockKeyhole } from "lucide-react";
import { authClient } from "@/lib/auth_clients";

type ResetPasswordFormProps = {
  token: string;
  invalidToken: boolean;
};

export default function ResetPasswordForm({
  token,
  invalidToken,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError("Ce lien est invalide ou expiré. Demandez un nouveau lien de réinitialisation.");
        return;
      }

      setDone(true);
    } catch {
      setError("Impossible de réinitialiser le mot de passe. Demandez un nouveau lien.");
    } finally {
      setLoading(false);
    }
  }

  const hasInvalidToken = invalidToken || !token;

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
          <h1 className="text-3xl font-semibold">Nouveau mot de passe</h1>
        </div>

        <div className="rounded-3xl border border-[#E6EAE3] bg-white p-7 shadow-sm md:p-9">
          {done ? (
            <div className="text-center">
              <p role="status" className="text-sm leading-6 text-[#17643D]">
                Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.
              </p>
              <Link
                href="/connexion"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#103C2A] px-6 py-4 font-semibold text-white transition hover:bg-[#17643D]"
              >
                Aller à la connexion
              </Link>
            </div>
          ) : hasInvalidToken ? (
            <div className="text-center">
              <p role="alert" className="text-sm leading-6 text-red-700">
                Ce lien est invalide ou expiré. Demandez un nouveau lien de réinitialisation.
              </p>
              <Link
                href="/mot-de-passe-oublie"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#103C2A] px-6 py-4 font-semibold text-white transition hover:bg-[#17643D]"
              >
                Demander un nouveau lien
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
                Nouveau mot de passe
              </label>
              <div className="relative mb-5">
                <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-[#17643D]"
                />
              </div>

              <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
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
                {loading ? "Modification..." : "Modifier le mot de passe"}
              </button>
            </form>
          )}

          <Link href="/connexion" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#17643D] hover:underline">
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </div>
      </div>
    </main>
  );
}
