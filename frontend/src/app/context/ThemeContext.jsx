// File: app/context/ThemeContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
export const ThemeContext = createContext(null);

// 2. Create the Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Load theme from LocalStorage on mount
  useEffect(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark") document.documentElement.classList.add("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Fallback to system preference
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      
      // Save to localStorage
      localStorage.setItem("theme", newTheme);
      
      // Update HTML class for Tailwind dark mode support
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook for easy access
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};