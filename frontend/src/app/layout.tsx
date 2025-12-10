import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ToastProvider } from "@/components/ui/Toast";
import { OnboardingModal } from "@/components/ui/OnboardingModal";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Fi-Khidmatik | Services à domicile au Maroc",
  description: "Trouvez des artisans qualifiés près de chez vous au Maroc - Plomberie, Électricité, Menuiserie, Peinture et plus. Réservez en ligne facilement.",
  keywords: ["artisan", "services", "domicile", "Maroc", "plombier", "électricien", "menuisier", "réservation"],
  authors: [{ name: "Fi-Khidmatik" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fi-Khidmatik",
  },
  formatDetection: {
    telephone: false,
  },
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
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
        <ServiceWorkerRegistration />
        <ToastProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main className="pt-16 min-h-screen">
                {children}
              </main>
              <OnboardingModal />
            </AuthProvider>
          </LanguageProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
