import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Les Centimes du Cœur",
  description: "La force de la solidarité accessible à tous.",
  icons: {
    icon: "https://res.cloudinary.com/dsybzvkmv/image/upload/f_png,q_auto,w_128/v1794770341/C%C5%93ur_vert_avec_main_protectrice_zgxltj.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
