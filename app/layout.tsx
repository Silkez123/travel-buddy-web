import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Buddy",
  description: "Your travel companion for creating postcards and organizing trips",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full bg-stone-50 font-sans antialiased">
        <StoreProvider>
          <div className="flex flex-col h-full max-w-md mx-auto bg-white shadow-xl relative">
            <main className="flex-1 overflow-y-auto pb-20">{children}</main>
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
