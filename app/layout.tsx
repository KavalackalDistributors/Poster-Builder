import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PosterAI - AI Poster Generator',
  description: 'Generate beautiful product posters with Google Gemini.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
