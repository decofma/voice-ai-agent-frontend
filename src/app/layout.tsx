// frontend/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'AI Voice Agent Admin Panel',
  description: 'Administrative dashboard for configuring and testing AI voice agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}