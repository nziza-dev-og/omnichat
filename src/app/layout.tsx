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
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn(
          "h-full bg-background font-sans antialiased flex flex-col", 
          geistSans.variable, 
          geistMono.variable
        )}>
        <div className="flex flex-col flex-1 min-h-0"> {/* Changed to flex-1 and min-h-0 */}
          <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
            <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6"> {/* Wider container */}
              <div className="mr-4 flex items-center">
                <Bot className="h-8 w-8 mr-3 text-primary" />
                <span className="font-bold text-xl tracking-tight text-foreground">OmniAssist</span>
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col overflow-hidden"> {/* Added overflow-hidden */}
            {children}
          </main>
          {/* Footer can be simplified or removed if not matching the new design */}
          <footer className="py-3 md:px-6 border-t bg-card/80 text-xs text-center text-muted-foreground">
            Built by You. Powered by Together AI.
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
