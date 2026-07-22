"use client";

import React, { useState } from "react";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Leaf, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";



export interface DiseaseItem {
  id: string;
  name: string;
  crop: string;
  severity: "High" | "Medium" | "Low" | "Healthy";
  symptomSummary: string;
  organicRemedy: string;
  iconBg: string;
}

const diseaseData: DiseaseItem[] = [
  {
    id: "potato-late-blight",
    name: "Potato Late Blight (Phytophthora infestans)",
    crop: "Potato",
    severity: "High",
    symptomSummary: "Dark water-soaked lesions on leaves with white fungal growth on underside.",
    organicRemedy: "Apply Copper Fungicide spray, ensure wide row spacing, remove infected foliage.",
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: "potato-early-blight",
    name: "Potato Early Blight (Alternaria solani)",
    crop: "Potato",
    severity: "Medium",
    symptomSummary: "Concentric target-like brown spots on older leaves, yellow halo rings.",
    organicRemedy: "Neem oil emulsion, mulching soil to prevent water splash, crop rotation.",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "tomato-yellow-leaf-curl",
    name: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    crop: "Tomato",
    severity: "High",
    symptomSummary: "Upward leaf curling, yellowing leaf margins, stunted plant growth.",
    organicRemedy: "Use silver reflective mulch, insecticidal soap spray for whiteflies, barrier netting.",
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: "tomato-bacterial-spot",
    name: "Tomato Bacterial Spot (Xanthomonas)",
    crop: "Tomato",
    severity: "Medium",
    symptomSummary: "Small dark water-soaked spots with yellow border on leaves and green fruit.",
    organicRemedy: "Copper soap spray, drip irrigation instead of overhead spray, pathogen-free seed.",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "corn-common-rust",
    name: "Corn Common Rust (Puccinia sorghi)",
    crop: "Corn",
    severity: "Medium",
    symptomSummary: "Powdery cinnamon-brown pustules on both leaf surfaces.",
    organicRemedy: "Plant resistant hybrids, apply sulfur dust early season, ensure adequate air flow.",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "apple-scab",
    name: "Apple Scab (Venturia inaequalis)",
    crop: "Apple",
    severity: "High",
    symptomSummary: "Olive-green velvety spots turning dark brown scab lesions on leaves and fruit.",
    organicRemedy: "Rake and destroy fallen autumn leaves, liquid copper spray before bloom.",
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: "grape-black-rot",
    name: "Grape Black Rot (Guignardia bidwellii)",
    crop: "Grape",
    severity: "High",
    symptomSummary: "Reddish-brown leaf spots with black fruiting specks; shriveled mummy berries.",
    organicRemedy: "Prune canopy for sunlight penetration, remove mummified berries, copper spray.",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "healthy-crop",
    name: "Healthy Foliage (No Disease Detected)",
    crop: "General",
    severity: "Healthy",
    symptomSummary: "Vibrant green leaves, uniform texture, no spots, lesions, or wilting.",
    organicRemedy: "Maintain balanced organic composting, regular moisture monitoring, crop rotation.",
    iconBg: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
];

export default function DiseaseLibrary() {
  const [search, setSearch] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<DiseaseItem | null>(null);

  const crops: string[] = ["All", "Potato", "Tomato", "Corn", "Apple", "Grape"];

  const filteredData = diseaseData.filter((item) => {
    const matchesCrop =
      selectedCrop === "All" || item.crop.toLowerCase() === selectedCrop.toLowerCase();
    const query = search.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      item.name.toLowerCase().includes(query) ||
      item.crop.toLowerCase().includes(query) ||
      item.symptomSummary.toLowerCase().includes(query);
    return matchesCrop && matchesSearch;
  });

  const getSeverityBadge = (sev: DiseaseItem["severity"]) => {
    if (sev === "Healthy") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border border-green-300 dark:border-green-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
        </span>
      );
    }
    if (sev === "High") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 border border-red-300 dark:border-red-700 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> High Risk
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
        <AlertTriangle className="w-3.5 h-3.5" /> Moderate Risk
      </span>
    );
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="library">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-semibold text-sm mb-4">
          <Leaf className="w-4 h-4 text-green-600" />
          Agricultural Knowledge Hub
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Crop Disease Library &amp; Field Guide
        </h2>
        <p className="text-muted-foreground text-lg sm:text-xl">
          Browse verified plant pathologies, key visual markers, and recommended organic remedies.
        </p>
      </div>

      {/* Controls: Search Bar & Crop Filter Pills */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search disease name, crop, or symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card border-2 shadow-sm text-base focus:border-green-500 focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>


        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {crops.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCrop === c
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105"
                  : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <Card
            key={item.id}
            className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-400/60 rounded-3xl overflow-hidden cursor-pointer bg-card/80 backdrop-blur-md"
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${item.iconBg}`}>
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="text-xs uppercase font-bold text-green-700 dark:text-green-400 tracking-wider">
                    {item.crop}
                  </span>
                </div>
                {getSeverityBadge(item.severity)}
              </div>

              <div>
                <h3 className="font-extrabold text-xl leading-snug group-hover:text-green-600 transition-colors">
                  {item.name}
                </h3>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="line-clamp-2">
                  <strong className="text-foreground font-semibold">Symptoms: </strong>
                  {item.symptomSummary}
                </p>
              </div>

              <div className="pt-4 border-t flex justify-between items-center text-sm font-semibold text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                <span>View Full Treatment</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-card border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-bold text-green-600 dark:text-green-400 tracking-wider">
                  {selectedItem.crop} Pathological Brief
                </span>
                <h3 className="text-2xl font-extrabold text-foreground mt-1">{selectedItem.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Key Visual Symptoms
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedItem.symptomSummary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                <h4 className="font-bold text-green-800 dark:text-green-300 mb-1 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" /> Recommended Organic Remedy
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedItem.organicRemedy}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-6"
                onClick={() => setSelectedItem(null)}
              >
                Close Guide
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
