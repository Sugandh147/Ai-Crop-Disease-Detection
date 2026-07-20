"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X, Languages, Sprout } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { languageNames, getTranslation, LanguageCode } from "@/translations";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600 dark:text-green-500" />
            <Link href="/" className="text-2xl font-bold tracking-tight text-green-700 dark:text-green-400">
              {t('brand')}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-lg font-medium hover:text-green-600 transition-colors">
              {t('home')}
            </Link>
            <Link href="#upload" className="text-lg font-medium hover:text-green-600 transition-colors">
              {t('upload')}
            </Link>
            <Link href="#about" className="text-lg font-medium hover:text-green-600 transition-colors">
              {t('about')}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-lg h-10 px-4"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                aria-haspopup="true"
                aria-expanded={isLangMenuOpen}
              >
                <Languages className="h-5 w-5" />
                <span>{languageNames[language].split(' ')[0]}</span>
              </Button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 max-h-96 overflow-y-auto rounded-md shadow-lg bg-card border z-50">
                  <div className="py-1">
                    {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-3 text-base hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400 ${language === code ? 'font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}`}
                      >
                        {languageNames[code]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10"
              aria-label="Toggle theme"
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-12 w-12"
            >
              <Sun className="h-7 w-7 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-7 w-7 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-12 w-12"
            >
              {isMobileMenuOpen ? <X className="h-8 w-8 text-foreground" /> : <Menu className="h-8 w-8 text-foreground" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 shadow-lg space-y-4">
          <Link 
            href="/" 
            className="block px-3 py-4 rounded-md text-xl font-medium hover:bg-green-50 dark:hover:bg-green-900/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('home')}
          </Link>
          <Link 
            href="#upload" 
            className="block px-3 py-4 rounded-md text-xl font-medium hover:bg-green-50 dark:hover:bg-green-900/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('upload')}
          </Link>
          <Link 
            href="#about" 
            className="block px-3 py-4 rounded-md text-xl font-medium hover:bg-green-50 dark:hover:bg-green-900/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('about')}
          </Link>

          <div className="pt-4 border-t">
            <p className="px-3 pb-2 text-lg font-semibold text-muted-foreground">{t('selectLanguage')}</p>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
              {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base ${language === code ? 'bg-green-100 dark:bg-green-900/40 font-bold text-green-800 dark:text-green-300' : 'hover:bg-muted'}`}
                >
                  {languageNames[code]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
