import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import SideNav from "@/components/SideNav";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Buddy",
  description: "Explore places, book experiences, translate, get eSIMs, and plan trips",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full bg-stone-100 font-sans antialiased">
        <StoreProvider>
          {/* Desktop: sidebar + main content */}
          <div className="hidden md:flex h-full">
            <SideNav />
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
          {/* Mobile: full screen + bottom nav */}
          <div className="flex flex-col h-full md:hidden bg-white">
            <main className="flex-1 overflow-y-auto pb-20">{children}</main>
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
