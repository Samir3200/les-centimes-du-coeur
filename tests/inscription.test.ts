import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const transaction = vi.fn();
  const sql = Object.assign(vi.fn(), { transaction });
  return { sql, transaction, signUpEmail: vi.fn() };
});

vi.mock("@/lib/auth", () => ({ auth: { api: { signUpEmail: mocks.signUpEmail } } }));
vi.mock("@/lib/db", () => ({ sql: mocks.sql }));

import { POST } from "@/app/api/inscription/route";

const validRegistration = {
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie@example.com",
  password: "motdepasse123",
  role: "adherent",
};

function request(body: unknown) {
  return new Request("http://localhost:3000/api/inscription", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.sql.mockReset();
  mocks.transaction.mockReset();
  mocks.signUpEmail.mockReset();
  mocks.sql.mockResolvedValue([]);
  mocks.transaction.mockResolvedValue([]);
  mocks.signUpEmail.mockResolvedValue({ user: { id: "fake-auth-user" } });
});

describe("validation des inscriptions", () => {
  it.each([
    ["administrateur", { role: "admin" }],
    ["rôle inconnu", { role: "superadmin" }],
    ["prénom vide", { firstName: " " }],
    ["nom trop long", { lastName: "a".repeat(101) }],
    ["email invalide", { email: "invalid" }],
    ["mot de passe trop court", { password: "1234567" }],
    ["mot de passe trop long", { password: "a".repeat(129) }],
    ["téléphone invalide", { phone: "123" }],
    ["téléphone non textuel", { phone: 123456789 }],
  ])("refuse : %s", async (_label, change) => {
    const response = await POST(request({ ...validRegistration, ...change }));
    expect(response.status).toBe(400);
    expect(mocks.sql).not.toHaveBeenCalled();
    expect(mocks.signUpEmail).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("refuse un email déjà associé à un profil", async () => {
    mocks.sql.mockResolvedValueOnce([{ exists: 1 }]);
    const response = await POST(request(validRegistration));
    expect(response.status).toBe(409);
    expect(mocks.signUpEmail).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it.each(["adherent", "partenaire", "donateur"])(
    "accepte le rôle public %s sans téléphone",
    async (role) => {
      const response = await POST(request({ ...validRegistration, role }));
      expect(response.status).toBe(201);
      expect(mocks.signUpEmail).toHaveBeenCalledOnce();
      expect(mocks.transaction).toHaveBeenCalledOnce();
      expect(mocks.sql.mock.calls[1].slice(1)).toEqual([
        "fake-auth-user", "Marie", "Dupont", "marie@example.com", null,
      ]);
      expect(mocks.sql.mock.calls[2].slice(1)).toEqual([role, "fake-auth-user"]);
    },
  );

  it("normalise l'email et enregistre le téléphone fourni", async () => {
    const response = await POST(request({
      ...validRegistration,
      email: " MARIE@EXAMPLE.COM ",
      phone: " +33 6 12 34 56 78 ",
    }));
    expect(response.status).toBe(201);
    expect(mocks.signUpEmail).toHaveBeenCalledWith({
      body: { name: "Marie Dupont", email: "marie@example.com", password: "motdepasse123" },
    });
    expect(mocks.sql.mock.calls[1].slice(1)).toEqual([
      "fake-auth-user", "Marie", "Dupont", "marie@example.com", "+33 6 12 34 56 78",
    ]);
  });
});
