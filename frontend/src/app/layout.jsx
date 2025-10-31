// File: app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ---------------------------------------------------------------------
// This file is a **Server Component** – it must NOT have "use client"
// ---------------------------------------------------------------------
export const metadata = {
  title: "Pure Gospel",
  description: "Sharing the Word of God with Clarity and Truth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}