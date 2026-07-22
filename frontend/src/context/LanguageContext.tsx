"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCode } from "@/translations";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("appLanguage") as LanguageCode;
      if (savedLang) return savedLang;
    }
    return "en";
  });

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("appLanguage", lang);
    }
  };


  // The initial state matches the server ("en").
  // After mount, useEffect will check localStorage and update state if needed,
  // triggering a safe re-render on the client.

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
