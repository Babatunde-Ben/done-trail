import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/app/components/ui/provider";
import { Toaster } from "@/app/components/ui/toaster";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DoneTrail",
  description: "Manage tasks from idea to done with an intuitive Kanban board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ minHeight: "100vh" }}
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <Provider>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
