import type { Metadata } from "next";
import localFont from "next/font/local";
import NavBar from "../components/nav-bar/NavBar";
import "./globals.css";
import { NextAuthProvider } from "./providers/nextauth-provider";

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
  title: "TravelIt",
  description: "Plan and collaborate on your next adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <NavBar />
          <div className="lg:ml-[10%] lg:mr-[10%]">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
