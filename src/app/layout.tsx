import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ombalakisul.com'),
  title: 'OMBALA KISUL — LDA | Saneamento Básico e Limpeza Urbana em Ondjiva, Cunene',
  description: 'Empresa especializada em saneamento básico, limpeza urbana, varredura, recolha e transporte de resíduos no casco urbano de Ondjiva, Cuanhama, Província do Cunene, Angola. NIF: 5000597244.',
  keywords: 'Ombala Kisul, Saneamento Angola, Limpeza Urbana Ondjiva, Gestão de Resíduos Cunene, Cuanhama, Edir Jorge Muluta Pacelli',
  authors: [{ name: 'OMBALA KISUL — LDA' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#A61413',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
