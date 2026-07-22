"use client";

import React, { useState } from "react";
import { Calculator, TrendingDown, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";


interface CropYieldMeta {
  avgYieldPerAcreKg: number;
  avgPricePerKg: number;
  unmanagedLossPct: number;
  managedLossPct: number;
}

const cropRates: Record<string, CropYieldMeta> = {
  Potato: { avgYieldPerAcreKg: 10000, avgPricePerKg: 18, unmanagedLossPct: 65, managedLossPct: 10 },
  Tomato: { avgYieldPerAcreKg: 12000, avgPricePerKg: 25, unmanagedLossPct: 80, managedLossPct: 15 },
  Corn: { avgYieldPerAcreKg: 3500, avgPricePerKg: 22, unmanagedLossPct: 40, managedLossPct: 5 },
  Apple: { avgYieldPerAcreKg: 8000, avgPricePerKg: 70, unmanagedLossPct: 75, managedLossPct: 12 },
  Wheat: { avgYieldPerAcreKg: 2000, avgPricePerKg: 24, unmanagedLossPct: 35, managedLossPct: 8 },
};

export default function YieldCalculator() {
  const [crop, setCrop] = useState("Potato");
  const [acres, setAcres] = useState(2);
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High">("Medium");

  const meta = cropRates[crop] || cropRates["Potato"];
  const severityMultiplier = severity === "High" ? 1.2 : severity === "Medium" ? 1.0 : 0.7;

  const totalExpectedYieldKg = acres * meta.avgYieldPerAcreKg;
  const potentialLossKg = totalExpectedYieldKg * ((meta.unmanagedLossPct * severityMultiplier) / 100);
  const lossAmountRs = Math.round(potentialLossKg * meta.avgPricePerKg);

  const savedYieldKg = totalExpectedYieldKg * (((meta.unmanagedLossPct - meta.managedLossPct) * severityMultiplier) / 100);
  const savedAmountRs = Math.round(savedYieldKg * meta.avgPricePerKg);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="calculator">
      <div className="bg-card border-2 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Inputs & Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold text-sm">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Economic Impact Estimator
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Crop Yield & Revenue Protection Calculator
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Estimate potential financial loss from unmanaged plant diseases and calculate revenue protected by taking early organic action.
            </p>

            {/* Controls Form */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Select Crop Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {Object.keys(cropRates).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCrop(c)}
                      className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                        crop === c
                          ? "bg-green-600 text-white border-green-600 shadow-md"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-foreground">Farm Size (Acres)</label>
                  <span className="text-base font-extrabold text-green-600">{acres} Acres</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={acres}
                  onChange={(e) => setAcres(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Infection Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Low", "Medium", "High"] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                        severity === sev
                          ? sev === "High"
                            ? "bg-red-600 text-white border-red-600"
                            : sev === "Medium"
                            ? "bg-amber-600 text-white border-amber-600"
                            : "bg-green-600 text-white border-green-600"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {sev} Severity
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Results Card */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white rounded-3xl p-8 shadow-2xl space-y-6 border border-green-500/30">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-green-400">
                  {crop} ({acres} Acres) Diagnostics
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                  Real-time Estimate
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Risk Box */}
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-1">
                  <span className="text-xs text-red-300 font-semibold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Unmanaged Risk Loss
                  </span>
                  <p className="text-2xl font-black text-red-400">
                    ₹{lossAmountRs.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    ~{Math.round(potentialLossKg).toLocaleString()} kg crop yield loss
                  </span>
                </div>

                {/* Savings Box */}
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 space-y-1">
                  <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Protected Value
                  </span>
                  <p className="text-2xl font-black text-emerald-300">
                    ₹{savedAmountRs.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-emerald-200 font-medium">
                    ~{Math.round(savedYieldKg).toLocaleString()} kg saved with early action
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-400" /> Key Takeaway for Farmers
                </p>
                Taking action within 48 hours of detecting initial leaf spots reduces overall crop damage by up to <strong>85%</strong> and preserves harvest marketability.
              </div>

              <Button
                className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-slate-950 font-bold text-lg shadow-lg shadow-green-500/30 gap-2"
                onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
              >
                Scan Your Leaf Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
