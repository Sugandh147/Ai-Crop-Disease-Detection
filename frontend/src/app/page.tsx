"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, Sprout, ShieldCheck, Zap, Leaf, Activity, BarChart3, CloudRain } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/translations";
import { Button } from "@/components/ui/button";
import UploadSection from "@/components/UploadSection";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-background to-background dark:from-green-900/30 dark:via-background dark:to-background" />
      
      {/* Floating Leaves Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[
          { top: '15%', left: '20%', size: 32, duration: 25 },
          { top: '65%', left: '10%', size: 45, duration: 35 },
          { top: '25%', left: '75%', size: 24, duration: 22 },
          { top: '80%', left: '85%', size: 38, duration: 30 },
          { top: '45%', left: '50%', size: 28, duration: 28 },
          { top: '10%', left: '90%', size: 40, duration: 32 },
        ].map((leaf, i) => (
          <motion.div
            key={i}
            className="absolute text-green-300 dark:text-green-800/30 opacity-50"
            initial={{ 
              top: leaf.top, 
              left: leaf.left,
              rotate: 0 
            }}
            animate={{ 
              top: [leaf.top, `${parseFloat(leaf.top) + (i % 2 === 0 ? 10 : -10)}%`, leaf.top],
              left: [leaf.left, `${parseFloat(leaf.left) + (i % 2 === 0 ? -5 : 5)}%`, leaf.left],
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
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-medium mb-8">
            <Sparkles className="h-5 w-5" />
            <span>AI Powered Agriculture</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6">
            {t('welcomeTitle')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            {t('welcomeSubtitle')}
          </p>
          
          <div className="flex justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20" onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('uploadBtn')}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">{t('howItWorks')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
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
      <section className="py-24 relative z-10">
        <UploadSection />
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Future Capabilities</h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            Our platform is continuously evolving. Soon, you will have access to powerful analytics to monitor your entire farm's health.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <DashboardPlaceholder 
              icon={<BarChart3 className="w-8 h-8 text-blue-500" />}
              title="Crop Health Trends"
              desc="Track the historical health of your crops over seasons."
            />
            <DashboardPlaceholder 
              icon={<CloudRain className="w-8 h-8 text-indigo-500" />}
              title="Weather Integration"
              desc="Correlate disease outbreaks with hyper-local weather data."
            />
            <DashboardPlaceholder 
              icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
              title="Yield Protection"
              desc="Estimated crop saved through early AI intervention."
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t bg-background text-center text-muted-foreground" id="contact">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-foreground">{t('brand')}</span>
        </div>
        <p>© 2026 Kisan AI. Empowering farmers with technology.</p>
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
      className="relative z-10 flex flex-col items-center text-center p-6 bg-card border shadow-xl rounded-3xl"
    >
      <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 shadow-inner ring-8 ring-background">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
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
