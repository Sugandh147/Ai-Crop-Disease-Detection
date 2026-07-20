"use client";

import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/translations";
import { motion, AnimatePresence } from "framer-motion";

const FloatingHelp = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-card text-card-foreground p-6 rounded-2xl shadow-xl max-w-[300px] border-2 border-green-200 dark:border-green-900"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl text-green-700 dark:text-green-400">
                {t('helpFloating')}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 text-base">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full mt-1">
                  <span className="font-bold text-green-700 dark:text-green-400">1</span>
                </div>
                <p>{t('step1Desc')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full mt-1">
                  <span className="font-bold text-green-700 dark:text-green-400">2</span>
                </div>
                <p>{t('step2Desc')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="h-16 w-16 rounded-full shadow-2xl bg-green-600 hover:bg-green-700 text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Help"
      >
        {isOpen ? <X className="h-8 w-8" /> : <HelpCircle className="h-8 w-8" />}
      </Button>
    </div>
  );
};

export default FloatingHelp;
