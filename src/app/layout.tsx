import './globals.css';

export const metadata = {
  title: 'FundRaiser',
  description: 'Crowdfunding platform for education',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}