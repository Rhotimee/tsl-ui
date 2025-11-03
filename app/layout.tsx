import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TSL Compiler Web UI',
  description: 'A web-based interface for the TSL (Test Specification Language) compiler',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
