"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  Leaf, 
  FlaskConical, 
  Activity, 
  ListChecks, 
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/translations";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface AdviceReport {
  crop?: string;
  disease_name?: string;
  status?: string;
  severity?: string;
  overview?: string;
  symptoms?: string[];
  causes?: string;
  treatment_organic?: string;
  treatment_chemical?: string;
  prevention?: string;
  recommended_actions?: string[];
  treatment?: string;
  prevention_simple?: string;
}

interface PredictionResult {
  disease: string;
  crop?: string;
  confidence: number;
  advice: AdviceReport;
}

const UploadSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'symptoms' | 'treatment' | 'prevention'>('overview');
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to translate text using dictionary key lookup or returning original if missing
  const tr = (str?: string) => {
    if (!str) return "";
    const translated = t(str);
    return translated !== str ? translated : str;
  };

  // Re-fetch translation when language changes while viewing a prediction result
  useEffect(() => {
    if (uploadState === 'done' && file) {
      reTranslatePrediction(file, language);
    }
  }, [language]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      simulateUpload(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const simulateUpload = async (uploadFile: File) => {
    setUploadState('uploading');
    setProgress(0);
    setActiveTab('overview');
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setUploadState('analyzing');
          return 90;
        }
        return prev + 15;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("lang", language);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data: PredictionResult = await response.json();
      setPrediction(data);
      setProgress(100);
      setUploadState('done');
    } catch (error) {
      console.error(error);
      setPrediction({
        disease: t('backendErrorTitle'),
        crop: "System",
        confidence: 0,
        advice: {
          status: "Error",
          severity: "High",
          overview: t('backendErrorDesc'),
          treatment_organic: t('backendErrorDesc'),
          prevention: t('backendErrorDesc')
        }
      });
      setProgress(100);
      setUploadState('done');
    } finally {
      clearInterval(interval);
    }
  };

  const reTranslatePrediction = async (currentFile: File, targetLang: string) => {
    try {
      const formData = new FormData();
      formData.append("file", currentFile);
      formData.append("lang", targetLang);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: PredictionResult = await response.json();
        setPrediction(data);
      }
    } catch (error) {
      console.error("Re-translation failed:", error);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setUploadState('idle');
    setProgress(0);
    setPrediction(null);
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    const displayStatus = tr(status);
    if (s.includes("healthy")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border border-green-300 dark:border-green-700">
          <CheckCircle2 className="w-4 h-4" />
          {displayStatus}
        </span>
      );
    } else if (s.includes("critical") || s.includes("high")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 border border-red-300 dark:border-red-700">
          <ShieldAlert className="w-4 h-4" />
          {displayStatus}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
          <AlertTriangle className="w-4 h-4" />
          {displayStatus || tr("Warning")}
        </span>
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6" id="upload">
      <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden rounded-[2.5rem] border-2 border-green-100 dark:border-green-900/30">
        <CardContent className="p-6 sm:p-10">
          
          <AnimatePresence mode="wait">
            {uploadState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center"
              >
                <div 
                  className={`w-full relative rounded-3xl border-4 border-dashed transition-all duration-300 ease-in-out p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer min-h-[320px]
                    ${dragActive ? "border-green-500 bg-green-50/60 dark:bg-green-900/30 scale-[0.99]" : "border-muted-foreground/25 hover:border-green-500 hover:bg-muted/40"}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={onButtonClick}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                    aria-label="Upload crop image"
                  />
                  
                  <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-full mb-6 text-green-600 dark:text-green-400 shadow-inner ring-8 ring-green-50 dark:ring-green-950/40">
                    <Upload className="w-14 h-14" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 text-foreground">{t('dragDropText')}</h3>
                  <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
                    {t('uploadSupport')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-green-600 hover:bg-green-700 text-white gap-3 shadow-lg shadow-green-600/25 transition-all hover:scale-105">
                      <ImageIcon className="w-5 h-5" />
                      {t('uploadBtn')}
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl gap-3 border-2 hover:bg-muted transition-all hover:scale-105">
                      <Camera className="w-5 h-5" />
                      {t('takePhoto')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {(uploadState === 'uploading' || uploadState === 'analyzing') && preview && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center w-full min-h-[350px]"
              >
                <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl mb-8 ring-4 ring-green-500/30">
                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-md p-4">
                    {uploadState === 'uploading' ? (
                      <>
                        <Upload className="w-12 h-12 mb-4 animate-bounce text-green-400" />
                        <span className="text-xl font-bold">{t('uploadingMsg')} {progress}%</span>
                        <Progress value={progress} className="w-48 h-3 mt-4 bg-white/20" />
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-12 h-12 mb-4 animate-spin text-green-400" />
                        <span className="text-xl font-bold text-center">{t('analyzingMsg')}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {uploadState === 'done' && preview && prediction && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-8 w-full"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-sm font-semibold mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      {t('uploadSuccessMsg')}
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{t('analysisTitle')}</h2>
                  </div>
                  <Button size="lg" variant="outline" className="rounded-xl gap-2 hover:bg-muted" onClick={reset}>
                    <X className="w-4 h-4" />
                    {t('uploadAnother')}
                  </Button>
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left Column: Image & Quick Stats */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square border-4 border-white dark:border-slate-800 group">
                      <img src={preview} alt="Analyzed Crop" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-xs uppercase font-semibold text-green-300 tracking-wider">{t('cropType')}</span>
                        <h4 className="text-xl font-bold">{tr(prediction.crop || prediction.advice?.crop || "Plant Foliage")}</h4>
                      </div>
                    </div>

                    {/* Diagnostic Quick Summary Card */}
                    <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b">
                        <span className="text-sm text-muted-foreground font-medium">{t('confidence')}</span>
                        <span className="text-base font-bold text-green-600 dark:text-green-400">
                          {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b">
                        <span className="text-sm text-muted-foreground font-medium">{t('severity')}</span>
                        {getStatusBadge(prediction.advice?.severity || prediction.advice?.status)}
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">{t('detectedDisease')}</span>
                        <h3 className="text-lg font-bold text-foreground leading-snug">{tr(prediction.disease)}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Tabbed Intelligence */}
                  <div className="lg:col-span-8 flex flex-col">
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-muted/60 dark:bg-slate-800/60 rounded-2xl mb-6">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'overview' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <FileText className="w-4 h-4 text-green-600" />
                        {t('overviewTab')}
                      </button>

                      <button
                        onClick={() => setActiveTab('symptoms')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'symptoms' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Activity className="w-4 h-4 text-amber-500" />
                        {t('symptomsTab')}
                      </button>

                      <button
                        onClick={() => setActiveTab('treatment')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'treatment' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <FlaskConical className="w-4 h-4 text-blue-500" />
                        {t('treatmentTab')}
                      </button>

                      <button
                        onClick={() => setActiveTab('prevention')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'prevention' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        {t('preventionTab')}
                      </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm flex-1">
                      {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
                              <Sparkles className="w-5 h-5 text-green-600" />
                              {tr(prediction.disease)}
                            </h3>
                            <p className="text-muted-foreground text-base leading-relaxed">
                              {tr(prediction.advice?.overview || prediction.advice?.treatment)}
                            </p>
                          </div>

                          {prediction.advice?.crop && (
                            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                              <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider block mb-1">{t('cropType')}</span>
                              <p className="text-base font-semibold text-foreground">{tr(prediction.advice.crop)}</p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'symptoms' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                          <div>
                            <h4 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                              <Activity className="w-5 h-5 text-amber-500" />
                              {t('symptomsTitle')}
                            </h4>
                            {prediction.advice?.symptoms && prediction.advice.symptoms.length > 0 ? (
                              <ul className="space-y-3">
                                {prediction.advice.symptoms.map((symptom, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-base text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                    <span>{tr(symptom)}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground text-base">{tr(prediction.advice?.overview)}</p>
                            )}
                          </div>

                          {prediction.advice?.causes && (
                            <div className="pt-4 border-t">
                              <h4 className="text-lg font-bold mb-2 text-foreground">{t('causes')}</h4>
                              <p className="text-muted-foreground text-base leading-relaxed">{tr(prediction.advice.causes)}</p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'treatment' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                          <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40">
                            <h4 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300 flex items-center gap-2">
                              <Leaf className="w-5 h-5 text-green-600" />
                              {t('organicTreatment')}
                            </h4>
                            <p className="text-muted-foreground text-base leading-relaxed">
                              {tr(prediction.advice?.treatment_organic || prediction.advice?.treatment)}
                            </p>
                          </div>

                          {prediction.advice?.treatment_chemical && (
                            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                              <h4 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-blue-600" />
                                {t('chemicalTreatment')}
                              </h4>
                              <p className="text-muted-foreground text-base leading-relaxed">
                                {tr(prediction.advice.treatment_chemical)}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'prevention' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                          {prediction.advice?.recommended_actions && prediction.advice.recommended_actions.length > 0 && (
                            <div>
                              <h4 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-emerald-600" />
                                {t('actionPlan')}
                              </h4>
                              <div className="grid sm:grid-cols-2 gap-3">
                                {prediction.advice.recommended_actions.map((action, idx) => (
                                  <div key={idx} className="p-4 rounded-xl bg-muted/60 border flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <p className="text-sm font-medium text-foreground">{tr(action)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-4 border-t">
                            <h4 className="text-lg font-bold mb-2 text-foreground flex items-center gap-2">
                              <ShieldCheck className="w-5 h-5 text-green-600" />
                              {t('preventionTitle')}
                            </h4>
                            <p className="text-muted-foreground text-base leading-relaxed">
                              {tr(prediction.advice?.prevention || prediction.advice?.prevention_simple)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
