"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth_clients";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const { error: signOutError } = await authClient.signOut();

      if (signOutError) {
        setError("La déconnexion a échoué. Réessayez.");
        return;
      }

      router.push("/");
    } catch {
      setError("La déconnexion a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#17643D]/20 px-4 py-3 text-sm font-semibold text-[#17643D] transition hover:bg-[#EDF5EF] disabled:opacity-60"
      >
        <LogOut size={17} />
        {loading ? "Déconnexion..." : "Se déconnecter"}
      </button>
      {error && (
        <p role="alert" className="text-right text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
