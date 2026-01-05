import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./Providers";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300","400","500","700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["300","400","500","700"],
  display: "swap",
});

const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
  weight: ["400","700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkLune - Task Management for Teams",
  description: "A modern, multi-tenant B2B SaaS task management platform built with React and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoMono.variable} ${libreCaslonText.variable}  font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
