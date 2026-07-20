# 🌾 Kisan AI – AI Crop Disease Detection & Agricultural Advisory System

Welcome to **Kisan AI**! A full-stack artificial intelligence application designed to empower farmers by providing instant crop disease diagnosis from leaf photos and synthesizing actionable, 8-part agricultural advisory reports in 23 Indian languages.

---

## 🌍 Key Features & Motivation

Crop diseases account for up to 40% of global harvest yield losses. Many existing digital farming tools are complicated or only available in English. **Kisan AI** bridges this gap:

1. **Intuitive Drag-and-Drop / Camera Upload:** Zero learning curve UI designed for high usability on smartphones and low-bandwidth networks.
2. **23-Language Support:** Instant translation across 23 Indian languages (Hindi, Bengali, Marathi, Telugu, Tamil, Punjabi, Gujarati, Kannada, Malayalam, etc.).
3. **8-Part Actionable Diagnostic Reports:** Synthesizes disease overview, key visual symptoms, primary causes, organic treatment, chemical remedies, long-term prevention, and a 4-step action plan.
4. **Lightweight & High Speed:** MobileNetV2 architecture (~14.2 MB model footprint) delivering accurate inference (< 45ms per image).

---

## 🏗️ System Architecture & Stack

```
[ 📱 User / Farmer ]
        │ (1. Uploads leaf photo on Next.js frontend)
        ▼
[ 🎨 Next.js 16 / React 19 Frontend ] ── (2. HTTP POST /predict) ──► [ ⚙️ FastAPI Python Backend ]
                                                                             │
                                                           (3. Preprocesses & passes tensor)
                                                                             ▼
                                                                  [ 🧠 PyTorch MobileNetV2 Model ]
                                                                             │
                                                           (4. Predicts class & confidence)
                                                                             ▼
[ 📱 4-Tab Diagnostic Card ] ◄── (5. 8-Part 23-Lang Advice) ◄── [ 🌐 Translation & Advice Engine ]
```

* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, shadcn/ui.
* **Backend API:** FastAPI (Python 3.10+), Uvicorn ASGI server running on port 8000.
* **Deep Learning Engine:** PyTorch & torchvision utilizing MobileNetV2 (Transfer Learning trained on 54,303 images across 38 classes).
* **Model Footprint:** ~14.2 MB (`model.pth`) with high inference speed.

---

## 🚀 How to Run Locally

### 1. Start the FastAPI Backend Server
```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*(Backend API runs at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`)*

### 2. Start the Next.js Frontend App
```powershell
cd frontend
npm run dev
```
*(Frontend runs at `http://localhost:3000`)*

---

## 🧪 Testing predictions & APIs

To run prediction tests directly on the backend model engine:
```powershell
cd backend
.\venv\Scripts\python.exe test_predictions.py
```

---

*Architected & Developed by Sugandh to empower accessible agriculture.* 🌱
