import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fi-Khidmatik | Services à domicile au Maroc",
  description: "Trouvez des artisans qualifiés près de chez vous au Maroc - Plomberie, Électricité, Menuiserie, Peinture et plus. Réservez en ligne facilement.",
  keywords: ["artisan", "services", "domicile", "Maroc", "plombier", "électricien", "menuisier", "réservation"],
  authors: [{ name: "Fi-Khidmatik" }],
  openGraph: {
    title: "Fi-Khidmatik | Services à domicile au Maroc",
    description: "Trouvez des artisans qualifiés près de chez vous - Plomberie, Électricité, Menuiserie et plus",
    url: "https://frontend-seven-gamma-60.vercel.app",
    siteName: "Fi-Khidmatik",
    locale: "fr_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fi-Khidmatik | Services à domicile",
    description: "Trouvez des artisans qualifiés près de chez vous au Maroc",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
