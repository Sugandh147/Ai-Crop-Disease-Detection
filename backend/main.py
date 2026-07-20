from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json
import os

app = FastAPI(title="AI Crop Disease Detection API")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
class_names = []

def load_model():
    global model, class_names
    
    # Load class names
    if os.path.exists("class_names.json"):
        with open("class_names.json", "r") as f:
            class_names = json.load(f)
    else:
        print("Warning: class_names.json not found! Cannot map output to labels.")
        class_names = [f"Class {i}" for i in range(38)] # Fallback
        
    # Initialize Model architecture
    model = models.mobilenet_v2(pretrained=False)
    model.classifier[1] = nn.Linear(model.last_channel, len(class_names))
    
    # Load weights
    if os.path.exists("model.pth"):
        model.load_state_dict(torch.load("model.pth", map_location=device))
        print("Successfully loaded trained model.")
    else:
        print("Warning: model.pth not found! Using random weights for now.")
        
    model = model.to(device)
    model.eval()

# Transform for inference
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.on_event("startup")
async def startup_event():
    load_model()

def generate_advice(disease_name):
    """
    In the future, this can be hooked up to Gemini API.
    For now, returns a simple heuristic dictionary for common diseases.
    """
    disease_name = disease_name.lower()
    if "healthy" in disease_name:
        return {
            "status": "Healthy",
            "treatment": "No action needed.",
            "prevention": "Continue regular watering and fertilization schedule."
        }
    elif "blight" in disease_name:
        return {
            "status": "Critical",
            "treatment": "Remove and destroy affected leaves immediately. Apply a copper-based fungicide.",
            "prevention": "Ensure good air circulation, avoid overhead watering, and practice crop rotation."
        }
    elif "rust" in disease_name:
        return {
            "status": "Warning",
            "treatment": "Remove severely infected parts. Apply appropriate fungicide like Neem oil or sulfur-based sprays.",
            "prevention": "Water at the base of the plant to keep leaves dry. Space plants properly."
        }
    elif "spot" in disease_name or "mold" in disease_name:
        return {
            "status": "Warning",
            "treatment": "Apply fungicide. Prune affected areas to prevent spread.",
            "prevention": "Avoid wetting foliage and water early in the day so plants dry quickly."
        }
    elif "virus" in disease_name or "mosaic" in disease_name or "curl" in disease_name:
        return {
            "status": "Critical",
            "treatment": "Viruses cannot be cured. Remove and destroy the entire infected plant immediately to save others.",
            "prevention": "Control insect vectors (like aphids/whiteflies) and disinfect tools regularly."
        }
    else:
        return {
            "status": "Unknown",
            "treatment": "Consult a local agricultural extension or use a broad-spectrum fungicide/pesticide depending on symptoms.",
            "prevention": "Maintain overall plant hygiene."
        }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read the image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Preprocess
    input_tensor = transform(image)
    input_batch = input_tensor.unsqueeze(0).to(device)
    
    # Inference
    with torch.no_grad():
        output = model(input_batch)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
    # Get top prediction
    top_prob, top_catid = torch.topk(probabilities, 1)
    
    disease = class_names[top_catid[0].item()]
    confidence = top_prob[0].item()
    
    # Format string (e.g. "Tomato___Early_blight" -> "Tomato - Early blight")
    formatted_disease = disease.replace("___", " - ").replace("_", " ")
    
    # Get advice
    advice = generate_advice(disease)
    
    return {
        "disease": formatted_disease,
        "confidence": confidence,
        "advice": advice
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
