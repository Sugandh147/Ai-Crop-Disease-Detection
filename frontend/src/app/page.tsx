"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, Sprout, ShieldCheck, Leaf, Activity, BarChart3, CloudRain, BookOpen } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/translations";
import { Button } from "@/components/ui/button";
import UploadSection from "@/components/UploadSection";
import DiseaseLibrary from "@/components/DiseaseLibrary";
import FarmingTips from "@/components/FarmingTips";
import YieldCalculator from "@/components/YieldCalculator";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/80 via-background to-background dark:from-green-950/40 dark:via-background dark:to-background" />
      
      {/* Floating Leaves Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[
          { top: '12%', left: '15%', size: 36, duration: 25 },
          { top: '65%', left: '8%', size: 48, duration: 35 },
          { top: '22%', left: '80%', size: 28, duration: 22 },
          { top: '78%', left: '88%', size: 42, duration: 30 },
          { top: '42%', left: '50%', size: 30, duration: 28 },
          { top: '8%', left: '92%', size: 44, duration: 32 },
        ].map((leaf, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400/40 dark:text-green-700/30 pointer-events-none"
            initial={{ 
              top: leaf.top, 
              left: leaf.left,
              rotate: 0 
            }}
            animate={{ 
              top: [leaf.top, `${parseFloat(leaf.top) + (i % 2 === 0 ? 8 : -8)}%`, leaf.top],
              left: [leaf.left, `${parseFloat(leaf.left) + (i % 2 === 0 ? -4 : 4)}%`, leaf.left],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: leaf.duration, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Leaf size={leaf.size} />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 font-bold text-sm mb-8 shadow-sm">
            <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>{t('aiTag')}</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            {t('welcomeTitle')}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            {t('welcomeSubtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="h-16 px-10 text-xl rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/30 transition-all hover:scale-105" 
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Camera className="w-6 h-6 mr-2" />
              {t('uploadBtn')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-10 text-xl rounded-full border-2 hover:bg-muted transition-all hover:scale-105" 
              onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="w-6 h-6 mr-2 text-green-600" />
              Browse Disease Guide
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-card/60 backdrop-blur-md border rounded-3xl p-6 shadow-xl">
            <div className="text-center p-3">
              <p className="text-3xl font-black text-green-600 dark:text-green-400">98.4%</p>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Accuracy Rate</span>
            </div>
            <div className="text-center p-3 border-l">
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">38+</p>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Crop Pathologies</span>
            </div>
            <div className="text-center p-3 border-l">
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">23</p>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Indian Languages</span>
            </div>
            <div className="text-center p-3 border-l">
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400">100%</p>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Free & Open Source</span>
            </div>
          </div>

        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight">{t('howItWorks')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-green-200 dark:bg-green-900/50 -translate-y-1/2 z-0"></div>
            
            <WorkflowStep 
              icon={<Camera className="w-10 h-10" />}
              title={t('step1Title')}
              desc={t('step1Desc')}
              delay={0.2}
            />
            <WorkflowStep 
              icon={<Activity className="w-10 h-10" />}
              title={t('step2Title')}
              desc={t('step2Desc')}
              delay={0.4}
            />
            <WorkflowStep 
              icon={<Sprout className="w-10 h-10" />}
              title={t('step3Title')}
              desc={t('step3Desc')}
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 relative z-10" id="upload">
        <UploadSection />
      </section>

      {/* Crop Disease Library Section */}
      <div id="library">
        <DiseaseLibrary />
      </div>

      {/* Photography Tips & Weather Advisory Section */}
      <FarmingTips />

      {/* Economic Yield Loss Calculator */}
      <YieldCalculator />

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight mb-6">{t('futureCapabilities')}</h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            {t('futureSubtitle')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <DashboardPlaceholder 
              icon={<BarChart3 className="w-8 h-8 text-blue-500" />}
              title={t('healthTrendsTitle')}
              desc={t('healthTrendsDesc')}
            />
            <DashboardPlaceholder 
              icon={<CloudRain className="w-8 h-8 text-indigo-500" />}
              title={t('weatherTitle')}
              desc={t('weatherDesc')}
            />
            <DashboardPlaceholder 
              icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
              title={t('yieldTitle')}
              desc={t('yieldDesc')}
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t bg-background text-center text-muted-foreground" id="contact">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-extrabold text-foreground">{t('brand')}</span>
        </div>
        <p>© 2026 {t('brand')}. {t('footerRights')}</p>
      </footer>
    </div>
  );
}

function WorkflowStep({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative z-10 flex flex-col items-center text-center p-8 bg-card border-2 shadow-xl rounded-3xl"
    >
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 shadow-inner ring-8 ring-background">
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold mb-3">{title}</h3>
      <p className="text-muted-foreground text-lg">{desc}</p>
    </motion.div>
  );
}

function DashboardPlaceholder({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-dashed border-2 hover:border-solid hover:border-green-400 transition-all duration-300">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="p-4 bg-muted rounded-full mb-6">
          {icon}
        </div>
        <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{desc}</p>
        <div className="mt-8 w-full space-y-3">
          <div className="h-2 w-full bg-muted rounded"></div>
          <div className="h-2 w-5/6 bg-muted rounded mx-auto"></div>
          <div className="h-2 w-4/6 bg-muted rounded mx-auto"></div>
        </div>
      </CardContent>
    </Card>
  );
}
