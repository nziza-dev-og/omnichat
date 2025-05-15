import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; 
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Bot } from "lucide-react";
import { cn } from '@/lib/utils';

const geistSans = Geist({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OmniAssist - Your AI Partner',
  description: 'AI Chatbot for coding, image generation, and multipurpose assistance, powered by Together AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased", 
          geistSans.variable, 
          geistMono.variable
        )}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b bg-card">
            <div className="container flex h-16 max-w-screen-xl items-center">
              <div className="mr-4 flex items-center">
                <Bot className="h-8 w-8 mr-3 text-primary" />
                <span className="font-bold text-xl tracking-tight text-foreground">OmniAssist</span>
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="py-4 md:px-8 border-t bg-card">
            <div className="container flex flex-col items-center justify-center gap-2 md:h-16 md:flex-row">
              <p className="text-balance text-center text-xs leading-loose text-muted-foreground md:text-left">
                Built by You. Powered by Together AI.
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
