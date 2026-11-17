import type { Metadata } from "next";
import DonationConfirmation from "./donation-confirmation";
import "./donation-confirmation.css";

export const metadata: Metadata = {
  title: "Confirmation de don | Les Centimes du Cœur",
  robots: { index: false, follow: false },
};

const demonstration = {
  donorName: "Marie Dupont",
  donorEmail: "marie.dupont@example.com",
  amount: 25,
  dateLabel: "17 novembre 2026",
  reference: "DON-2026-001",
};

export default function DonationConfirmationPreviewPage() {
  return (
    <main className="donation-preview">
      <DonationConfirmation donation={demonstration} />
    </main>
  );
}
