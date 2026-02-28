import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import PublicLayout from '@/components/PublicLayout';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'THE MATHnify CLUB | NRCM CDC — Analytical Excellence',
  description:
    'Official student club under Career Development Center of Narsimha Reddy Engineering College. Fostering analytical excellence and structured aptitude mastery.',
  openGraph: {
    title: 'THE MATHnify CLUB | NRCM CDC',
    description: 'Analytical excellence and structured aptitude mastery at NRCM.',
  },
  metadataBase: new URL('https://mathnify-club.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
