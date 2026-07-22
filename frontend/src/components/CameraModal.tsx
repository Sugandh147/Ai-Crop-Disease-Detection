"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedImage]);

  const startCamera = async () => {
    try {
      setError(null);
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check camera permissions or upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUrl);
    }
  };

  const confirmPhoto = () => {
    if (!capturedImage) return;
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `leaf_photo_${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        handleClose();
      });
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg">Take Leaf Photo</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-square sm:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-white space-y-4">
              <p className="text-red-400 font-medium">{error}</p>
              <Button variant="outline" className="text-white border-white/20" onClick={startCamera}>
                Try Again
              </Button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured preview" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
          )}

          {/* Guide Overlay Grid */}
          {!capturedImage && !error && (
            <div className="absolute inset-0 pointer-events-none border-2 border-green-500/40 rounded-2xl m-6 border-dashed flex items-center justify-center">
              <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                Center leaf inside frame
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-card border-t flex justify-around items-center gap-4">
          {capturedImage ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl flex-1 gap-2 border-2"
                onClick={() => setCapturedImage(null)}
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </Button>
              <Button
                size="lg"
                className="rounded-2xl flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
                onClick={confirmPhoto}
              >
                <Check className="w-5 h-5" />
                Use Photo
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setFacingMode(facingMode === "environment" ? "user" : "environment")}
                title="Flip Camera"
              >
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
              </Button>

              <button
                onClick={takePhoto}
                className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl shadow-green-600/40 ring-4 ring-green-200 dark:ring-green-900 active:scale-95 transition-all"
                aria-label="Shutter"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white" />
                </div>
              </button>

              <div className="w-12" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
