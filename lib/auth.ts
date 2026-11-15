
import "server-only";

import { betterAuth } from "better-auth";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Resend } from "resend";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL est manquante");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY est manquante");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: {
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: true },
      }),
    }),
    type: "postgres",
    schemaName: "auth",
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    autoSignIn: false,
    async sendResetPassword({ user, url }) {
      const { error } = await resend.emails.send({
        from: "Les Centimes du Cœur <onboarding@resend.dev>",
        to: user.email,
        subject: "Réinitialisez votre mot de passe",
        html: `
          <div style="font-family: Arial, sans-serif; color: #092B20; line-height: 1.6;">
            <h2>Réinitialisation du mot de passe</h2>
            <p>Nous avons reçu une demande de réinitialisation pour votre compte.</p>
            <p>
              <a href="${url}" style="color: #17643D; font-weight: bold;">
                Choisir un nouveau mot de passe
              </a>
            </p>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Erreur d'envoi de l'email de réinitialisation :", error);
        throw new Error("Impossible d'envoyer l'email de réinitialisation.");
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,

    async sendVerificationEmail({ user, url }) {
      const { error } = await resend.emails.send({
        from: "Les Centimes du Cœur <onboarding@resend.dev>",
        to: user.email,
        subject: "Confirmez votre adresse email",
        html: `
          <div style="font-family: Arial, sans-serif; color: #092B20; line-height: 1.6;">
            <h2>Bienvenue aux Centimes du Cœur !</h2>
            <p>Merci de rejoindre notre association.</p>
            <p>Pour confirmer votre adresse email, cliquez sur le lien suivant :</p>
            <p>
              <a href="${url}" style="color: #17643D; font-weight: bold;">
                Confirmer mon adresse email
              </a>
            </p>
            <p>Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.</p>
            <p>La force de la solidarité accessible à tous.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Erreur d'envoi de l'email de vérification :", error);
        throw new Error("Impossible d'envoyer l'email de vérification.");
      }
    },
  },
});
