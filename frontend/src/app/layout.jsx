// File: app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext"; // Imported, but was unused

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pure Gospel",
  description: "Sharing the Word of God with Clarity and Truth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* === FIX: WRAP CHILDREN WITH THEME PROVIDER === */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {/* ============================================== */}
      </body>
    </html>
  );
}