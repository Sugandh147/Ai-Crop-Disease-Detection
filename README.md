# 🌾 Kisan AI – AI Crop Disease Detection & Agricultural Advisory System

Welcome to **Kisan AI**! A full-stack artificial intelligence application designed to empower farmers by providing instant crop disease diagnosis from leaf photos, interactive field tools, and synthesizing actionable 8-part agricultural advisory reports in 23 Indian languages.

---

## 🌍 Key Features & Capabilities

Crop diseases account for up to 40% of global harvest yield losses. Many existing digital farming tools are complicated or only available in English. **Kisan AI** bridges this gap:

1. **Intuitive Scan Zone & Live Camera Capture:** Drag-and-drop file uploader with in-browser webcam photography modal (`CameraModal.tsx`) and futuristic scanning laser animations.
2. **1-Click Live Demo Sample Leaves:** Instant demo samples (Potato Late Blight, Tomato Leaf Curl, Corn Rust, Healthy Leaf) for instant testing without uploading files.
3. **23-Language Support & Text-To-Speech (Audio Reader):** Instant translation across 23 Indian languages with one-click voice playback for rural farmers.
4. **Interactive Crop Disease Library (`DiseaseLibrary.tsx`):** Filterable, searchable field catalog of crop pathologies with symptoms and organic remedies.
5. **Economic Yield & Loss Calculator (`YieldCalculator.tsx`):** Interactive estimator calculating potential crop loss and protected revenue based on farm acreage and infection severity.
6. **Print & Copy Diagnostic Reports:** One-click PDF print view and copyable formatted diagnostic summaries.
7. **8-Part Actionable Diagnostic Reports:** Synthesizes disease overview, key visual symptoms, primary causes, organic treatment, chemical remedies, long-term prevention, and a step-by-step action plan.

---

## 🏗️ System Architecture & Stack

```
[ 📱 User / Farmer ]
        │ (1. Uploads photo or captures via CameraModal)
        ▼
[ 🎨 Next.js 16 / React 19 Frontend ] ── (2. HTTP POST /predict) ──► [ ⚙️ FastAPI Python Backend ]
                                                                             │
                                                           (3. Preprocesses & passes tensor)
                                                                             ▼
                                                                  [ 🧠 PyTorch MobileNetV2 Model ]
                                                                             │
                                                           (4. Predicts class & confidence)
                                                                             ▼
[ 📊 Interactive Diagnostic Card & Voice Reader ] ◄── (5. 8-Part Advice) ◄── [ 🌐 Translation & Advice Engine ]
```

* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, shadcn/ui, Lucide Icons, Plus Jakarta Sans.
* **Backend API:** FastAPI (Python 3.10+), Uvicorn ASGI server running on port 8000.
* **Deep Learning Engine:** PyTorch & torchvision utilizing MobileNetV2 (Transfer Learning trained on 54,303 images across 38 classes).
* **Model Footprint:** ~14.2 MB (`model.pth`) with high inference speed (< 45ms).

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

