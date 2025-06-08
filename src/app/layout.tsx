import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Banana+Grotesk:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
