"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Image as ImageIcon, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/translations";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const UploadSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState<{disease: string, confidence: number, advice: any} | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

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
    
    // Simulate fast upload progress for UI
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

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setPrediction(data);
      setProgress(100);
      setUploadState('done');
    } catch (error) {
      console.error(error);
      // Fallback if backend is not running yet
      setPrediction({
        disease: "Backend Unavailable",
        confidence: 0,
        advice: {
          status: "Error",
          treatment: "Please make sure the Python backend is running on port 8000.",
          prevention: ""
        }
      });
      setProgress(100);
      setUploadState('done');
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setUploadState('idle');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6" id="upload">
      <Card className="border-0 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden rounded-[2rem]">
        <CardContent className="p-8 sm:p-12">
          
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
                  className={`w-full relative rounded-3xl border-4 border-dashed transition-all duration-300 ease-in-out p-12 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]
                    ${dragActive ? "border-green-500 bg-green-50/50 dark:bg-green-900/20" : "border-muted-foreground/20 hover:border-green-400 hover:bg-muted/50"}`}
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
                  
                  <div className="bg-green-100 dark:bg-green-900/40 p-6 rounded-full mb-6">
                    <Upload className="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{t('dragDropText')}</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    Support for high-quality JPG, PNG, and HEIC images.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button size="lg" className="h-16 px-8 text-xl rounded-2xl bg-green-600 hover:bg-green-700 text-white gap-3 shadow-xl">
                      <ImageIcon className="w-6 h-6" />
                      {t('uploadBtn')}
                    </Button>
                    <Button size="lg" variant="outline" className="h-16 px-8 text-xl rounded-2xl gap-3 border-2 hover:bg-muted">
                      <Camera className="w-6 h-6" />
                      Take Photo
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
                className="flex flex-col items-center justify-center w-full min-h-[300px]"
              >
                <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl mb-8">
                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                    {uploadState === 'uploading' ? (
                      <>
                        <Upload className="w-12 h-12 mb-4 animate-bounce" />
                        <span className="text-xl font-medium">Uploading... {progress}%</span>
                        <Progress value={progress} className="w-48 h-3 mt-4" />
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-12 h-12 mb-4 animate-spin text-green-400" />
                        <span className="text-xl font-medium">{t('analyzingMsg')}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {uploadState === 'done' && preview && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-8 w-full"
              >
                <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden shadow-xl aspect-square border-4 border-white dark:border-slate-800">
                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 rounded-full shadow-lg"
                    onClick={reset}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-semibold mb-6 w-fit">
                    <CheckCircle2 className="w-5 h-5" />
                    Image Processed Successfully
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">AI Analysis Status</h3>
                  
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border">
                    {prediction?.disease === "Backend Unavailable" ? (
                      <>
                        <h4 className="text-xl font-bold text-red-500 mb-2">Backend Connection Failed</h4>
                        <p className="text-lg text-muted-foreground">{prediction.advice.treatment}</p>
                      </>
                    ) : (
                      <>
                        <div className="mb-4 pb-4 border-b">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Detected Disease</p>
                          <h4 className="text-2xl font-bold text-foreground">{prediction?.disease}</h4>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                            Confidence: {((prediction?.confidence || 0) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Action Plan</p>
                          <p className="text-base text-foreground mb-3">
                            <strong className="text-red-500 dark:text-red-400">Treatment:</strong> {prediction?.advice?.treatment}
                          </p>
                          <p className="text-base text-foreground">
                            <strong className="text-blue-500 dark:text-blue-400">Prevention:</strong> {prediction?.advice?.prevention}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Button size="lg" className="mt-8 h-14 rounded-xl" variant="outline" onClick={reset}>
                    Upload Another Image
                  </Button>
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
