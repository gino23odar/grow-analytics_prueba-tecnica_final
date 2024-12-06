import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/components/AuthProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prueba tecnica Grow Analytics",
  description: "Desarrollador: Gino Odar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head />
      <body
        className={`bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

