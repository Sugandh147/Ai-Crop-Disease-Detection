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
  ShieldCheck,
  Volume2,
  VolumeX,
  Printer,
  Copy,
  Check,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/translations";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import CameraModal from "./CameraModal";

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

// Interactive sample leaf options for instant 1-click testing
const sampleLeaves = [
  {
    name: "Potato Late Blight",
    crop: "Potato",
    color: "from-amber-700 to-green-800",
    diseaseName: "Potato___Late_blight",
    svgBg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%232e5d32"/><path d="M200,40 Q320,120 280,320 Q200,380 120,320 Q80,120 200,40 Z" fill="%2343a047"/><circle cx="180" cy="160" r="35" fill="%233e2723" opacity="0.8"/><circle cx="230" cy="240" r="28" fill="%233e2723" opacity="0.85"/><circle cx="180" cy="160" r="38" stroke="%23f57f17" stroke-width="4" fill="none"/></svg>`,
  },
  {
    name: "Tomato Leaf Curl",
    crop: "Tomato",
    color: "from-yellow-600 to-green-700",
    diseaseName: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    svgBg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231b5e20"/><path d="M200,50 C300,100 350,250 250,340 C150,340 50,250 200,50 Z" fill="%2366bb6a"/><path d="M150,120 Q220,150 170,220 Q250,260 200,320" stroke="%23fbc02d" stroke-width="12" fill="none"/><circle cx="220" cy="180" r="20" fill="%23fbc02d" opacity="0.7"/></svg>`,
  },
  {
    name: "Corn Rust",
    crop: "Corn",
    color: "from-orange-600 to-green-700",
    diseaseName: "Corn_(maize)___Common_rust_",
    svgBg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%2333691e"/><path d="M160,30 Q240,180 220,370 Q140,300 160,30 Z" fill="%237cb342"/><ellipse cx="190" cy="120" rx="8" ry="25" fill="%23d84315"/><ellipse cx="180" cy="200" rx="10" ry="30" fill="%23d84315"/><ellipse cx="200" cy="280" rx="7" ry="20" fill="%23d84315"/></svg>`,
  },
  {
    name: "Healthy Leaf",
    crop: "Apple",
    color: "from-emerald-600 to-green-500",
    diseaseName: "Apple___healthy",
    svgBg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%230f5132"/><path d="M200,40 C320,100 320,300 200,360 C80,300 80,100 200,40 Z" fill="%232e7d32"/><path d="M200,40 L200,360" stroke="%2381c784" stroke-width="6"/><path d="M200,120 L270,90 M200,180 L130,150 M200,240 L280,210 M200,300 L140,270" stroke="%2381c784" stroke-width="4"/></svg>`,
  },
];

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
  
  // New features state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const tr = (str?: string) => {
    if (!str) return "";
    const translated = t(str);
    return translated !== str ? translated : str;
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

  useEffect(() => {
    if (uploadState === 'done' && file) {
      reTranslatePrediction(file, language);
    }
  }, [language, file, uploadState]);


  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  // Convert Sample Leaf Data URL to File and analyze
  const loadSampleLeaf = (sample: typeof sampleLeaves[0]) => {
    fetch(sample.svgBg)
      .then((res) => res.blob())
      .then((blob) => {
        const sampleFile = new File([blob], `${sample.diseaseName}.png`, { type: "image/png" });
        processFile(sampleFile);
      });
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


  const reset = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setFile(null);
    setPreview(null);
    setUploadState('idle');
    setProgress(0);
    setPrediction(null);
  };

  // Text-To-Speech Audio Reader
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (prediction) {
      const textToRead = `
        Diagnosis result: ${tr(prediction.disease)}.
        Crop type: ${tr(prediction.crop || prediction.advice?.crop || "Plant")}.
        Confidence score: ${(prediction.confidence * 100).toFixed(1)} percent.
        Overview: ${tr(prediction.advice?.overview)}.
        Organic treatment: ${tr(prediction.advice?.treatment_organic || prediction.advice?.treatment)}.
        Prevention advice: ${tr(prediction.advice?.prevention || prediction.advice?.prevention_simple)}.
      `;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy diagnostic summary to clipboard
  const copySummary = () => {
    if (!prediction) return;
    const text = `🌾 Kisan AI Diagnostic Report
Disease: ${tr(prediction.disease)}
Crop: ${tr(prediction.crop || "Plant")}
Confidence: ${(prediction.confidence * 100).toFixed(1)}%
Severity: ${prediction.advice?.severity || "Standard"}
Overview: ${tr(prediction.advice?.overview)}
Organic Remedy: ${tr(prediction.advice?.treatment_organic || prediction.advice?.treatment)}
Prevention: ${tr(prediction.advice?.prevention)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print diagnostic card
  const handlePrint = () => {
    window.print();
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
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(cameraFile) => processFile(cameraFile)}
      />

      <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem] border-2 border-green-100 dark:border-green-900/30">
        <CardContent className="p-6 sm:p-10">
          
          <AnimatePresence mode="wait">
            {uploadState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center space-y-8"
              >
                {/* Main Dropzone */}
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
                    <Upload className="w-14 h-14 animate-pulse" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 text-foreground">{t('dragDropText')}</h3>
                  <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
                    {t('uploadSupport')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      size="lg" 
                      className="h-14 px-8 text-lg rounded-2xl bg-green-600 hover:bg-green-700 text-white gap-3 shadow-lg shadow-green-600/25 transition-all hover:scale-105"
                      onClick={onButtonClick}
                    >
                      <ImageIcon className="w-5 h-5" />
                      {t('uploadBtn')}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-14 px-8 text-lg rounded-2xl gap-3 border-2 hover:bg-muted transition-all hover:scale-105"
                      onClick={() => setIsCameraOpen(true)}
                    >
                      <Camera className="w-5 h-5" />
                      {t('takePhoto')}
                    </Button>
                  </div>
                </div>

                {/* Quick Sample Leaf Selector */}
                <div className="w-full pt-4 border-t border-dashed">
                  <div className="flex items-center gap-2 mb-4 justify-center">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Don&apos;t have a leaf handy? Try a live demo sample:
                    </span>

                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sampleLeaves.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadSampleLeaf(sample)}
                        className="group p-3 rounded-2xl border bg-card/60 hover:bg-green-50 dark:hover:bg-green-950/40 hover:border-green-400 transition-all text-left flex items-center gap-3 shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-muted border">
                          <img src={sample.svgBg} alt={sample.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-green-700 dark:group-hover:text-green-400">
                            {sample.name}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-semibold">{sample.crop} Sample</span>
                        </div>
                      </button>
                    ))}
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
                {/* Image Container with Scanning Laser */}
                <div className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-2xl mb-8 ring-4 ring-green-500/40">
                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />
                  
                  {/* Laser Scan Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_#4ade80] animate-scan z-20" />
                  
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-xs p-4 z-10">
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
                        <span className="text-xs text-green-300 mt-2 font-medium">Running MobileNet CNN Classifier...</span>
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

                  {/* Actions Bar: Audio Speech, Copy, Print & Reset */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`rounded-xl gap-2 ${isSpeaking ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300' : ''}`}
                      onClick={toggleSpeech}
                      title="Read diagnosis aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600 animate-pulse" /> : <Volume2 className="w-4 h-4 text-green-600" />}
                      <span>{isSpeaking ? "Stop Voice" : "Listen Advice"}</span>
                    </Button>

                    <Button size="sm" variant="outline" className="rounded-xl gap-2" onClick={copySummary} title="Copy Report">
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>

                    <Button size="sm" variant="outline" className="rounded-xl gap-2" onClick={handlePrint} title="Print PDF">
                      <Printer className="w-4 h-4 text-blue-600" />
                      <span>Print Report</span>
                    </Button>

                    <Button size="sm" variant="outline" className="rounded-xl gap-2 hover:bg-muted" onClick={reset}>
                      <X className="w-4 h-4" />
                      {t('uploadAnother')}
                    </Button>
                  </div>
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

