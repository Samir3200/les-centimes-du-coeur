import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactForm from "@/app/contact/contact-form";

describe("aperçu du formulaire de contact", () => {
  const markup = renderToStaticMarkup(<ContactForm />);

  it("affiche les champs obligatoires et le téléphone facultatif", () => {
    for (const id of ["contact-first-name", "contact-last-name", "contact-email", "contact-subject", "contact-message"]) {
      expect(markup).toMatch(new RegExp(`<(?:input|select|textarea)\\b(?=[^>]*id="${id}")(?=[^>]*\\brequired="")[^>]*>`));
    }
    expect(markup).toMatch(/<input\b(?=[^>]*id="contact-phone")(?![^>]*\brequired=)[^>]*>/);
  });

  it("propose uniquement les cinq sujets prévus", () => {
    for (const subject of ["Question générale", "Devenir bénévole", "Proposer un partenariat", "Question concernant un don", "Autre demande"]) {
      expect(markup).toContain(subject);
    }
    expect(markup.match(/<option\b/g)).toHaveLength(6);
  });

  it("impose le consentement et limite la taille du message", () => {
    expect(markup).toMatch(/<input\b(?=[^>]*name="consent")(?=[^>]*required="")[^>]*>/);
    expect(markup).toMatch(/<textarea\b(?=[^>]*id="contact-message")(?=[^>]*maxLength="5000")[^>]*>/i);
  });

  it("indique l'absence de politique et désactive l'envoi", () => {
    expect(markup).toContain("politique de confidentialité est en cours");
    expect(markup).toMatch(/<button\b(?=[^>]*disabled="")[^>]*>/);
    expect(markup).toContain("Envoi momentanément indisponible");
  });
});
