import Image from "next/image";

type ConfirmedDonation = {
  donorName: string;
  donorEmail?: string;
  amount: number;
  dateLabel: string;
  reference: string;
  paymentMethod?: string;
};

export default function DonationConfirmation({
  donation,
}: {
  donation: ConfirmedDonation;
}) {
  const amount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(donation.amount);

  return (
    <article className="donation-document" aria-labelledby="confirmation-title">
      <header className="donation-header">
        <Image
          src="/images/Logo Les Centimes du Cœur.png"
          alt="Les Centimes du Cœur — La force de la solidarité accessible à tous."
          width={2000}
          height={667}
          priority
          className="donation-logo"
        />
        <div className="donation-header-meta">
          <span>Un geste qui compte</span>
          <strong>Document de démonstration</strong>
        </div>
      </header>

      <div className="donation-content">
        <div className="donation-introduction">
          <p className="donation-eyebrow">Ensemble, faisons grandir la solidarité</p>
          <h1 id="confirmation-title">Confirmation <em>de don</em></h1>
          <p className="donation-subtitle">
            Un grand merci pour votre confiance et votre générosité.
          </p>
        </div>

        <section className="donation-amount-card" aria-label="Montant du don">
          <div>
            <p className="donation-amount-label">Votre contribution</p>
            <p className="donation-amount">{amount}</p>
          </div>
          <div className="donation-status">
            <span aria-hidden="true">✓</span> Paiement confirmé
          </div>
        </section>

        <div className="donation-details">
          <section aria-labelledby="donor-heading">
            <p className="donation-section-number">01 / VOTRE SOUTIEN</p>
            <h2 id="donor-heading">Donateur</h2>
            <dl className="donation-detail-list">
              <div>
                <dt>Nom et prénom</dt>
                <dd>{donation.donorName}</dd>
              </div>
              {donation.donorEmail && (
                <div>
                  <dt>Adresse email</dt>
                  <dd>{donation.donorEmail}</dd>
                </div>
              )}
            </dl>
          </section>

          <section aria-labelledby="donation-heading">
            <p className="donation-section-number">02 / VOTRE DON</p>
            <h2 id="donation-heading">Détails du don</h2>
            <dl className="donation-detail-list">
              <div>
                <dt>Date du don</dt>
                <dd>{donation.dateLabel}</dd>
              </div>
              <div>
                <dt>Référence</dt>
                <dd>{donation.reference}</dd>
              </div>
              {donation.paymentMethod && (
                <div>
                  <dt>Mode de paiement</dt>
                  <dd>{donation.paymentMethod}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        <section className="donation-thanks" aria-labelledby="thanks-heading">
          <p className="donation-eyebrow">Du fond du cœur</p>
          <h2 id="thanks-heading">Merci pour votre générosité.</h2>
          <p>
            Votre générosité contribue à faire vivre notre engagement en faveur
            de la solidarité et de l&apos;entraide. Toute l&apos;équipe des
            Centimes du Cœur vous remercie chaleureusement pour votre soutien.
          </p>
        </section>

        <aside className="donation-notice">
          <strong>Information importante · Sans valeur fiscale</strong>
          <p>
            Ce document confirme la réception d&apos;un don. Il ne constitue pas
            un reçu fiscal et n&apos;ouvre pas droit, à lui seul, à une réduction
            d&apos;impôt.
          </p>
        </aside>
      </div>

      <footer className="donation-footer">
        <div>
          <strong>Les Centimes du Cœur</strong>
          <p>La force de la solidarité accessible à tous.</p>
        </div>
        <div className="donation-contact">
          <span>Meaux, France</span>
          <span>lescentimesducoeur@gmail.com</span>
        </div>
      </footer>
    </article>
  );
}
