import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

const bananaGrotesk = localFont({
  src: [
    {
      path: "../font/banana-grotesk-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/banana-grotesk-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-banana-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RafflesForGood - Transparent Fundraising Raffles",
  description:
    "Create transparent, fair raffles for fundraising. Help pets get medical treatment, support families in need, or raise money for any cause.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bananaGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
