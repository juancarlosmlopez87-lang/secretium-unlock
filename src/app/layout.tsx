import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SECRETIUM UNLOCK | Franquicia de Desbloqueo Digital #1 en Espana",
  description: "Desbloquea moviles, WiFi, ordenadores, camaras, wallets y mas. Servicio profesional y legal con autorizacion. Franquicia disponible desde 4.999EUR.",
  keywords: "desbloqueo movil, recuperar contrasena wifi, desbloquear ordenador, abrir camara seguridad, recuperar wallet bitcoin, franquicia tecnologia, desbloqueo profesional",
  openGraph: {
    title: "SECRETIUM UNLOCK - Franquicia de Desbloqueo Digital",
    description: "La franquicia de desbloqueo #1 en Espana. Desbloquea cualquier dispositivo de forma legal.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
