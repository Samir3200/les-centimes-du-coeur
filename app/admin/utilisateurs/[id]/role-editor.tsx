
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Save } from "lucide-react";

const availableRoles = [
  { value: "adherent", label: "Adhérent" },
  { value: "partenaire", label: "Partenaire" },
  { value: "donateur", label: "Donateur" },
  { value: "admin", label: "Administrateur" },
] as const;

type RoleEditorProps = {
  userId: string;
  initialRoles: string[];
  isOwnAccount: boolean;
};

export default function RoleEditor({
  userId,
  initialRoles,
  isOwnAccount,
}: RoleEditorProps) {
  const router = useRouter();

  const [savedRoles, setSavedRoles] =
    useState<string[]>(initialRoles);

  const [selectedRoles, setSelectedRoles] =
    useState<string[]>(initialRoles);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function toggleRole(role: string) {
    if (isSaving) return;

    if (role === "admin" && isOwnAccount) {
      return;
    }

    setSelectedRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );

    setMessage("");
    setError("");
  }

  const hasChanges =
    [...selectedRoles].sort().join(",") !==
    [...savedRoles].sort().join(",");

  const adminChanged =
    selectedRoles.includes("admin") !==
    savedRoles.includes("admin");

  async function saveRoles() {
    if (!hasChanges || isSaving) return;

    let confirmAdminChange = false;

    if (adminChanged) {
      const addingAdmin = selectedRoles.includes("admin");

      confirmAdminChange = window.confirm(
        addingAdmin
          ? "Attention : cet utilisateur pourra accéder à l'administration et gérer les comptes. Confirmez-vous sa promotion en administrateur ?"
          : "Attention : cet utilisateur perdra ses droits d'administration. Confirmez-vous ce retrait ?"
      );

      if (!confirmAdminChange) return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/utilisateurs/${userId}/roles`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roles: selectedRoles,
            confirmAdminChange,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Impossible de modifier les rôles."
        );
      }

      const updatedRoles: string[] = result.roles;

      setSavedRoles(updatedRoles);
      setSelectedRoles(updatedRoles);

      setMessage(
        "Les rôles ont été enregistrés avec succès."
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#092B20]">
          Modifier les rôles
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Sélectionnez les rôles à attribuer à cet utilisateur.
          Plusieurs rôles sont possibles.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {availableRoles.map((role) => {
          const checked = selectedRoles.includes(role.value);

          const disabled =
            isSaving ||
            (role.value === "admin" && isOwnAccount);

          return (
            <label
              key={role.value}
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                checked
                  ? "border-[#17643D] bg-[#EDF5EF]"
                  : "border-slate-200 bg-white"
              } ${
                disabled
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggleRole(role.value)}
                className="h-4 w-4 accent-[#17643D]"
              />

              <span className="text-sm font-medium text-[#092B20]">
                {role.label}
              </span>
            </label>
          );
        })}
      </div>

      {adminChanged && (
        <div className="flex items-start gap-3 rounded-xl bg-[#FFF8E7] p-4">
          <ShieldAlert
            size={20}
            className="shrink-0 text-[#9A741F]"
          />

          <p className="text-sm text-[#765B18]">
            Vous modifiez les droits administrateur.
            Une confirmation sera demandée avant
            l'enregistrement.
          </p>
        </div>
      )}

      {isOwnAccount && (
        <p className="text-sm text-slate-500">
          Pour votre sécurité, vous ne pouvez pas retirer
          vos propres droits administrateur.
        </p>
      )}

      {message && (
        <p
          role="status"
          className="rounded-xl bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={saveRoles}
          disabled={!hasChanges || isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#103C2A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#17643D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={17} />
          {isSaving
            ? "Enregistrement..."
            : "Enregistrer les modifications"}
        </button>

        {hasChanges && !isSaving && (
          <button
            type="button"
            onClick={() => {
              setSelectedRoles(savedRoles);
              setError("");
              setMessage("");
            }}
            className="rounded-xl px-4 py-3 text-sm font-medium text-[#17643D] hover:bg-[#EDF5EF]"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
