// File: app/context/ThemeContext.jsx
"use client";

import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};