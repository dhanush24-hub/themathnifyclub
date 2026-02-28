import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'THE MATHnify CLUB | NREC CDC — Analytical Excellence',
  description:
    'Official student club under Career Development Center of Narsimha Reddy Engineering College. Fostering analytical excellence and structured aptitude mastery.',
  openGraph: {
    title: 'THE MATHnify CLUB | NREC CDC',
    description: 'Analytical excellence and structured aptitude mastery at NREC.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
