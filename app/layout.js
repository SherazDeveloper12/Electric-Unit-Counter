import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { ThemeScript } from "@/components/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Bijli — Meter Tracker",
  description: "Track your electricity meter readings and bills, effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>
          <Navbar />
          <div className="pt-24">{children}</div>
        </Providers>
      </body>
    </html>
  );
}