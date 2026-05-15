import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

export const metadata: Metadata = {
  title: 'AsianGPT SaaS Foundation',
  description: 'Production-grade AI SaaS starter foundation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
