"use client";

import React from "react";
import { CheckCircle2, XCircle, CloudRain, Thermometer, ShieldAlert, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


export default function FarmingTips() {
  return (
    <section className="py-20 bg-muted/40 backdrop-blur-md border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-semibold text-sm mb-4">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Field Photography & Advisory
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            How to Capture High-Accuracy Leaf Scans
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow these field guidelines to ensure the neural network achieves maximum diagnostic accuracy.
          </p>
        </div>

        {/* Grid: Photography Do's & Don'ts */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* DO's */}
          <Card className="border-2 border-green-500/30 bg-green-50/40 dark:bg-green-950/20 rounded-3xl overflow-hidden shadow-lg">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-green-500 text-white font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-green-900 dark:text-green-300">Recommended (Do)</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">Optimal photo conditions for AI accuracy</p>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <p className="text-base text-foreground font-medium">
                    <strong>Focus on a single leaf:</strong> Fill 70% of the frame with the infected leaf area.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <p className="text-base text-foreground font-medium">
                    <strong>Natural Daylight:</strong> Shoot under indirect sunlight or bright natural day light.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <p className="text-base text-foreground font-medium">
                    <strong>Show lesion details:</strong> Ensure spots, blights, or discolorations are sharply focused.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* DONT's */}
          <Card className="border-2 border-red-500/30 bg-red-50/40 dark:bg-red-950/20 rounded-3xl overflow-hidden shadow-lg">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-500 text-white font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-red-900 dark:text-red-300">Avoid (Don&apos;t)</h3>

                  <p className="text-sm text-red-700 dark:text-red-400">Common causes of false diagnostics</p>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  <p className="text-base text-foreground font-medium">
                    <strong>Blurry or shaky motion:</strong> Avoid taking photos while moving or in heavy wind.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  <p className="text-base text-foreground font-medium">
                    <strong>Distant whole-field shots:</strong> Photos taken from far away lose microscopic spot textures.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  <p className="text-base text-foreground font-medium">
                    <strong>Extreme glare / Dark shadows:</strong> Flash light reflections can obstruct natural colors.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Live Weather & Fungal Risk Advisory Bar */}
        <div className="bg-card border-2 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <CloudRain className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Regional Advisory
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50">
                  High Humidity Warning
                </span>
              </div>
              <h4 className="text-2xl font-bold text-foreground">Fungal Spore Weather Index</h4>
              <p className="text-muted-foreground text-sm">
                Current moisture levels favor Phytophthora (Late Blight) spore germination. Preventive spray recommended.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full lg:w-auto justify-around lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-semibold">Temperature</span>
              <p className="text-xl font-extrabold text-foreground flex items-center justify-center gap-1">
                <Thermometer className="w-4 h-4 text-red-500" /> 26°C
              </p>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-semibold">Humidity</span>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">84%</p>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-semibold">Disease Risk</span>
              <p className="text-xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Moderate
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
