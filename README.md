# 🌾 Kisan AI – AI Crop Disease Detection & Agricultural Advisory System

Welcome to **Kisan AI**! I built this full-stack artificial intelligence application to help farmers identify crop diseases instantly by uploading leaf photos from their phones and receiving actionable treatment plans in their native language.

---

## 🌍 Motivation & Goal

Crop diseases cause severe harvest yield losses every year. While high-tech agricultural tools exist, many are designed for English-speaking, tech-savvy users. 

I engineered this project specifically for **accessibility, speed, and localization**:
1. **Extremely Simple UI:** Zero complex menus. Farmers simply drag-and-drop or snap a leaf photo for instant diagnosis.
2. **23-Language System:** Supports 23 Indian languages (Hindi, Bengali, Marathi, Telugu, Tamil, Punjabi, Gujarati, etc.) with dynamic re-translation.
3. **8-Part Actionable Diagnostic Reports:** Returns detailed visual symptoms, organic remedies, chemical treatments, and step-by-step action plans.

---

## 🏗️ Architecture & Technology Stack

```
[ 🎨 Next.js 15 / React 19 Frontend ] ── (HTTP POST /predict) ──► [ ⚙️ FastAPI Python Backend ]
                                                                             │
                                                                             ▼
[ 📱 Interactive 4-Tab Diagnostic Card ] ◄── (23-Lang Payload) ◄── [ 🧠 PyTorch MobileNetV2 AI ]
```

* **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, shadcn/ui.
* **Backend API:** FastAPI (Python 3.10+), Uvicorn ASGI Server running on port 8000.
* **Deep Learning Engine:** PyTorch & torchvision using MobileNetV2 (Transfer Learning on 54,303 images across 38 categories).
* **Model Footprint:** ~14.2 MB (`model.pth`) with < 45ms inference time per image.

---

## 🚀 How to Run Locally

### 1. Start the FastAPI Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```
*(Runs on `http://localhost:8000`)*

### 2. Start the Next.js Frontend
```powershell
cd frontend
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

*Architected & Developed by Sugandh to empower accessible agriculture.* 🌱
