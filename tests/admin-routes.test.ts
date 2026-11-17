import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  sql: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: mocks.getSession } } }));
vi.mock("@/lib/db", () => ({ sql: mocks.sql }));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));

import { PATCH as updateRoles } from "@/app/api/admin/utilisateurs/[id]/roles/route";
import { PATCH as updateStatus } from "@/app/api/admin/utilisateurs/[id]/status/route";

const adminId = "11111111-1111-4111-8111-111111111111";
const targetId = "22222222-2222-4222-8222-222222222222";
const context = (id = targetId) => ({ params: Promise.resolve({ id }) });

function request(path: string, body: unknown, origin = "http://localhost:3000") {
  return new NextRequest(`http://localhost:3000${path}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify(body),
  });
}

const roleRequest = (body: unknown, origin?: string) =>
  request("/api/admin/utilisateurs/test/roles", body, origin);
const statusRequest = (body: unknown, origin?: string) =>
  request("/api/admin/utilisateurs/test/status", body, origin);

beforeEach(() => {
  mocks.getSession.mockReset();
  mocks.sql.mockReset();
  mocks.getSession.mockResolvedValue({ user: { id: "auth-admin" } });
  mocks.sql.mockResolvedValueOnce([{ id: adminId }]);
});

describe("permissions des routes administrateur", () => {
  it.each([
    ["rôles", updateRoles, roleRequest],
    ["statut", updateStatus, statusRequest],
  ])("refuse une origine externe pour les %s", async (_label, handler, makeRequest) => {
    const response = await handler(makeRequest({}, "https://example.com"), context());
    expect(response.status).toBe(403);
    expect(mocks.getSession).not.toHaveBeenCalled();
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it.each([
    ["rôles", updateRoles, roleRequest],
    ["statut", updateStatus, statusRequest],
  ])("refuse une session absente pour les %s", async (_label, handler, makeRequest) => {
    mocks.getSession.mockResolvedValueOnce(null);
    const response = await handler(makeRequest({}), context());
    expect(response.status).toBe(401);
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it.each([
    ["rôles", updateRoles, roleRequest],
    ["statut", updateStatus, statusRequest],
  ])("refuse un utilisateur non administrateur pour les %s", async (_label, handler, makeRequest) => {
    mocks.sql.mockReset().mockResolvedValueOnce([]);
    const response = await handler(makeRequest({ roles: ["admin"], status: "active" }), context());
    expect(response.status).toBe(403);
    expect(mocks.sql).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["rôles", updateRoles, roleRequest],
    ["statut", updateStatus, statusRequest],
  ])("refuse un UUID invalide pour les %s", async (_label, handler, makeRequest) => {
    const response = await handler(makeRequest({}), context("invalid"));
    expect(response.status).toBe(400);
    expect(mocks.sql).toHaveBeenCalledTimes(1);
  });
});

describe("modification des rôles", () => {
  it.each([
    ["rôle inconnu", { roles: ["superadmin"] }],
    ["rôle dupliqué", { roles: ["adherent", "adherent"] }],
    ["rôle non textuel", { roles: [1] }],
    ["liste absente", {}],
  ])("refuse un %s", async (_label, body) => {
    const response = await updateRoles(roleRequest(body), context());
    expect(response.status).toBe(400);
    expect(mocks.sql).toHaveBeenCalledTimes(1);
  });

  it("interdit à un administrateur de retirer son propre rôle admin", async () => {
    mocks.sql.mockResolvedValueOnce([{ role: "admin" }]);
    const response = await updateRoles(roleRequest({ roles: ["adherent"], confirmAdminChange: true }), context(adminId));
    expect(response.status).toBe(403);
    expect(mocks.sql).toHaveBeenCalledTimes(2);
  });

  it("exige une confirmation pour accorder le rôle admin", async () => {
    mocks.sql.mockResolvedValueOnce([{ role: "adherent" }]);
    const response = await updateRoles(roleRequest({ roles: ["adherent", "admin"] }), context());
    expect(response.status).toBe(400);
    expect(mocks.sql).toHaveBeenCalledTimes(2);
  });

  it("transmet les rôles confirmés à la fonction SQL simulée", async () => {
    mocks.sql.mockResolvedValueOnce([{ role: "adherent" }]);
    mocks.sql.mockResolvedValueOnce([{ roles: ["adherent", "admin"] }]);
    const response = await updateRoles(roleRequest({ roles: ["adherent", "admin"], confirmAdminChange: true }), context());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, roles: ["adherent", "admin"] });
    expect(mocks.sql).toHaveBeenCalledTimes(3);
    expect(mocks.sql.mock.calls[2].slice(1)).toEqual([adminId, targetId, ["adherent", "admin"]]);
  });
});

describe("modification du statut", () => {
  it("interdit la modification du propre statut de l'administrateur", async () => {
    const response = await updateStatus(statusRequest({ status: "inactive" }), context(adminId));
    expect(response.status).toBe(403);
    expect(mocks.sql).toHaveBeenCalledTimes(1);
  });

  it("refuse un statut inconnu", async () => {
    const response = await updateStatus(statusRequest({ status: "pending" }), context());
    expect(response.status).toBe(400);
    expect(mocks.sql).toHaveBeenCalledTimes(1);
  });

  it("signale un utilisateur inexistant", async () => {
    mocks.sql.mockResolvedValueOnce([]);
    const response = await updateStatus(statusRequest({ status: "inactive" }), context());
    expect(response.status).toBe(404);
    expect(mocks.sql).toHaveBeenCalledTimes(2);
  });

  it("demande la suppression des sessions après désactivation", async () => {
    mocks.sql.mockResolvedValueOnce([{ id: targetId, status: "active" }]);
    mocks.sql.mockResolvedValueOnce([{ status: "inactive", auth_user_id: "auth-target" }]);
    mocks.sql.mockResolvedValueOnce([]);
    const response = await updateStatus(statusRequest({ status: "inactive" }), context());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, status: "inactive" });
    expect(mocks.sql).toHaveBeenCalledTimes(4);
    expect(mocks.sql.mock.calls[3][0].join("")).toContain("DELETE FROM auth.session");
    expect(mocks.sql.mock.calls[3][1]).toBe("auth-target");
  });

  it("ne supprime pas les sessions lors d'une réactivation", async () => {
    mocks.sql.mockResolvedValueOnce([{ id: targetId, status: "inactive" }]);
    mocks.sql.mockResolvedValueOnce([{ status: "active", auth_user_id: "auth-target" }]);
    const response = await updateStatus(statusRequest({ status: "active" }), context());
    expect(response.status).toBe(200);
    expect(mocks.sql).toHaveBeenCalledTimes(3);
  });
});
