import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import: Geist is default, Geist_Mono is specific
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Bot } from "lucide-react";
import { cn } from '@/lib/utils';

const geistSans = Geist({ // Corrected variable name to match usage
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OmniAssist - Your AI Coding Partner',
  description: 'AI Chatbot for coding and multipurpose assistance, powered by DeepInfra and OpenAI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased", // Using Tailwind's font-sans
          geistSans.variable, 
          geistMono.variable
        )}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-xl items-center">
              <div className="mr-4 flex items-center">
                <Bot className="h-8 w-8 mr-3 text-primary" />
                <span className="font-bold text-xl tracking-tight">OmniAssist</span>
              </div>
              {/* Future: Theme toggle or navigation links */}
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
              <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by Your Name/Company. Powered by AI.
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
