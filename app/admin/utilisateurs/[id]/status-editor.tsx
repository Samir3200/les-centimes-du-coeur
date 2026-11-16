
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StatusEditorProps = {
  userId: string;
  initialStatus: string;
  isOwnAccount: boolean;
};

export default function StatusEditor({
  userId,
  initialStatus,
  isOwnAccount,
}: StatusEditorProps) {
  const router = useRouter();

  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const isActive = status === "active";

  async function changeStatus() {
    if (saving || isOwnAccount) return;

    const nextStatus = isActive ? "inactive" : "active";

    const confirmed = window.confirm(
      isActive
        ? "Voulez-vous désactiver ce compte utilisateur ? Son accès sera suspendu."
        : "Voulez-vous réactiver ce compte utilisateur ?"
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        `/api/admin/utilisateurs/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Impossible de modifier le statut."
        );
      }

      setStatus(result.status);
      setMessage(
        result.status === "active"
          ? "Le compte a été réactivé avec succès."
          : "Le compte a été désactivé avec succès."
      );

      router.refresh();
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 border-t border-slate-200 pt-7">
      <h3 className="text-lg font-semibold text-[#092B20]">
        Activation du compte
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        Statut actuel :{" "}
        <span className="font-semibold">
          {isActive ? "Actif" : "Inactif"}
        </span>
      </p>

      <p className="mt-2 text-sm text-slate-500">
        La désactivation suspend l'accès au compte sans
        supprimer les informations de l'utilisateur.
      </p>

      <button
        type="button"
        onClick={changeStatus}
        disabled={saving || isOwnAccount}
        className={`mt-5 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive
            ? "bg-red-50 text-red-700 hover:bg-red-100"
            : "bg-[#17643D] text-white hover:bg-[#103C2A]"
        }`}
      >
        {saving
          ? "Enregistrement..."
          : isActive
            ? "Désactiver le compte"
            : "Réactiver le compte"}
      </button>

      {isOwnAccount && (
        <p className="mt-3 text-sm text-amber-700">
          Vous ne pouvez pas désactiver votre propre compte
          administrateur.
        </p>
      )}

      {message && (
        <p
          role="status"
          className={`mt-4 text-sm font-medium ${
            error ? "text-red-700" : "text-[#17643D]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
