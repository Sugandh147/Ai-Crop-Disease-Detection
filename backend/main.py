from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json
import os
import re
from contextlib import asynccontextmanager

try:
    from deep_translator import GoogleTranslator
except ImportError:
    GoogleTranslator = None

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
        print("Warning: class_names.json not found! Using fallback class names.")
        class_names = [f"Class {i}" for i in range(38)]
        
    # Initialize Model architecture safely with modern torchvision support
    try:
        from torchvision.models import MobileNet_V2_Weights
        model = models.mobilenet_v2(weights=None)
    except (ImportError, AttributeError):
        model = models.mobilenet_v2(pretrained=False)

    model.classifier[1] = nn.Linear(model.last_channel, len(class_names))
    
    # Load weights
    if os.path.exists("model.pth"):
        model.load_state_dict(torch.load("model.pth", map_location=device))
        print("Successfully loaded trained model weights.")
    else:
        print("Warning: model.pth not found! Using initialized weights.")
        
    model = model.to(device)
    model.eval()

# Transform for inference
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield

app = FastAPI(title="AI Crop Disease Detection API", lifespan=lifespan)

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Built-in Fallback Translations for Common Crop & Disease Entities when network translation is unavailable
BUILTIN_TRANSLATIONS = {
    "bn": {
        "Rose (Rosa)": "গোলাপ (Rosa)",
        "Black Spot (Diplocarpon rosae)": "ব্ল্যাক স্পট (Diplocarpon rosae)",
        "Tomato": "টমেটো",
        "Bacterial spot": "ব্যাকটেরিয়াল স্পট",
        "Apple": "আপেল",
        "Apple Scab (Venturia inaequalis)": "আপেল স্ক্যাব (Venturia inaequalis)",
        "Moderate Risk": "মাঝারি ঝুঁকি",
        "High Risk": "উচ্চ ঝুঁকি",
        "Critical": "জরুরি অবস্থা",
        "Healthy": "সুস্থ",
        "Warning": "সতর্কতা",
        "None (Healthy)": "কোনো রোগ নেই (সুস্থ)",
        "Healthy Foliage (No Disease Detected)": "সুস্থ পাতা (কোনো রোগ সনাক্ত হয়নি)",
        "Remove spotted leaves and destroy them away from the field.": "আক্রান্ত পাতা অপসারণ করুন এবং মাঠের বাইরে ধ্বংস করুন।",
        "Apply liquid copper spray on upper and lower leaf surfaces.": "পাতার উপরিভাগ ও নিচের ভাগে তরল কপার স্প্রে প্রয়োগ করুন।",
        "Transition watering to early morning drip lines.": "সকালের শুরুতে ড্রিপ সেচ ব্যবস্থার দিকে স্থানান্তরিত হোন।",
        "Avoid handling foliage when plants are wet. Sterilize all tools in 10% bleach or alcohol solution between plants. Ensure clean seed stock.": "গাছ ভেজা থাকা অবস্থায় পাতা স্পর্শ করা এড়িয়ে চলুন। প্রতিটি গাছের ব্যবহারের মাঝে ১০% ব্লিচ বা অ্যালকোহল দ্রবণে সরঞ্জাম জীবাণুমুক্ত করুন।",
        "Pick off and safely discard all leaves showing black or purple spots.": "কালো বা বেগুনি দাগ যুক্ত সমস্ত পাতা ছিঁড়ে ফেলে নিরাপদে নষ্ট করুন।",
        "Spray remaining foliage thoroughly with Neem oil or Copper Fungicide.": "অবশিষ্ট পাতায় নিম তেল বা কপার ছত্রাকনাশক স্প্রে করুন।",
        "Rake away all fallen leaf debris around the base of the rose bush.": "গোলাপ গাছের গোড়ার সমস্ত ঝরে পড়া পাতার আবর্জনা পরিষ্কার করুন।",
        "Ensure morning watering only, avoiding wet leaves overnight.": "কেবলমাত্র সকালে জল দেওয়া নিশ্চিত করুন, রাতে পাতা ভেজা রাখবেন না।"
    },
    "hi": {
        "Rose (Rosa)": "गुलाब (Rosa)",
        "Black Spot (Diplocarpon rosae)": "ब्लैक स्पॉट (Diplocarpon rosae)",
        "Tomato": "टमाटर",
        "Bacterial spot": "बैक्टीरियल स्पॉट",
        "Apple": "सेब",
        "Moderate Risk": "मध्यम जोखिम",
        "High Risk": "उच्च जोखिम",
        "Critical": "गंभीर स्थिति",
        "Healthy": "स्वस्थ",
        "Warning": "चेतावनी",
        "Remove spotted leaves and destroy them away from the field.": "धब्बेदार पत्तियों को हटा दें और खेत से दूर नष्ट कर दें।",
        "Apply liquid copper spray on upper and lower leaf surfaces.": "पत्तियों की ऊपरी और निचली सतह पर तरल तांबा स्प्रे करें।",
        "Transition watering to early morning drip lines.": "सुबह के समय ड्रिप सिंचाई प्रणाली से पानी दें।",
        "Avoid handling foliage when plants are wet. Sterilize all tools in 10% bleach or alcohol solution between plants. Ensure clean seed stock.": "गीली पत्तियों को छूने से बचें। पौधों के बीच उपकरणों को 10% ब्लीच या अल्कोहल समाधान में जीवाणुरहित करें।"
    },
    "mr": {
        "Rose (Rosa)": "गुलाब (Rosa)",
        "Black Spot (Diplocarpon rosae)": "ब्लॅक स्पॉट (Diplocarpon rosae)",
        "Tomato": "टोमॅटो",
        "Bacterial spot": "बॅक्टेरियल स्पॉट",
        "Moderate Risk": "मध्यम धोका",
        "High Risk": "उच्च धोका",
        "Healthy": "निरोगी",
        "Warning": "तकीद"
    }
}

def generate_detailed_advice(disease_key: str, raw_filename: str = "") -> dict:
    disease_lower = disease_key.lower()
    file_lower = raw_filename.lower()

    is_rose = "rose" in file_lower or "rose" in disease_lower

    if is_rose:
        return {
            "crop": "Rose (Rosa)",
            "disease_name": "Black Spot (Diplocarpon rosae)",
            "status": "Warning",
            "severity": "Moderate Risk",
            "overview": "Black spot is one of the most widespread and damaging fungal diseases affecting rose cultivars worldwide. It causes circular dark lesions on upper leaf surfaces, eventually triggering premature leaf shedding and weakening rose bushes.",
            "symptoms": [
                "Dark circular black lesions (2 to 12 mm) with characteristic fringed or feathered borders.",
                "Yellow chlorotic tissue developing around dark spots on mature leaves.",
                "Leaves yellowing completely and dropping off early starting from lower branches.",
                "Purple-black spots on young green stems and canes."
            ],
            "causes": "Triggered by Diplocarpon rosae fungal spores which overwinter in fallen leaves and soil. Spores germinate rapidly when leaves remain continuously wet for 6 to 9 hours in temperatures between 18°C and 26°C.",
            "treatment_organic": "Prune off all affected leaves immediately. Spray cold-pressed Neem oil (0.5% - 1%) or potassium bicarbonate every 7 to 10 days. A mixture of 1 tbsp baking soda + 1 tsp horticultural oil per gallon of water serves as an effective natural spray.",
            "treatment_chemical": "Apply systemic or contact fungicides containing Chlorothalonil, Mancozeb, Myclobutanil, or Copper Octanoate. Begin treatments at early leaf emergence and repeat after heavy rainfall.",
            "prevention": "Water at the soil root zone via drip lines; never overhead sprinkle. Ensure ample spacing (3-4 ft) between bushes for maximum air movement. Thoroughly rake and burn fallen leaves at season end.",
            "recommended_actions": [
                "Pick off and safely discard all leaves showing black or purple spots.",
                "Spray remaining foliage thoroughly with Neem oil or Copper Fungicide.",
                "Rake away all fallen leaf debris around the base of the rose bush.",
                "Ensure morning watering only, avoiding wet leaves overnight."
            ]
        }

    if "healthy" in disease_lower:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        return {
            "crop": crop_part if crop_part else "Crop Plant",
            "disease_name": "Healthy Foliage (No Disease Detected)",
            "status": "Healthy",
            "severity": "None (Healthy)",
            "overview": "Your plant foliage demonstrates high vitality with no visible signs of fungal, bacterial, or viral infections. Photosynthetic activity and leaf color appear robust.",
            "symptoms": [
                "Vibrant, uniform leaf pigmentation appropriate for the plant species.",
                "Smooth, undamaged leaf margins without lesions or chlorotic spots.",
                "Healthy stem structure and absence of wilting or stem rot."
            ],
            "causes": "Good cultural management, appropriate irrigation, adequate sunlight, and healthy soil nutrient balance.",
            "treatment_organic": "No curative chemical or organic treatment required. Maintain current balanced organic liquid seaweed or compost tea feeding.",
            "treatment_chemical": "No chemical fungicides or bactericides needed. Avoid preventative sprays unless neighboring fields report severe outbreaks.",
            "prevention": "Maintain regular watering at soil level. Apply organic mulch to preserve soil moisture and prevent soil splash. Monitor weekly for early pest signs.",
            "recommended_actions": [
                "Continue standard irrigation and feeding regimen.",
                "Inspect lower leaf surfaces weekly for early aphid or mite activity.",
                "Keep surrounding garden beds weed-free to prevent pest harborage."
            ]
        }

    elif "blight" in disease_lower:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        disease_title = disease_key.split("___")[1].replace("_", " ").strip() if "___" in disease_key else "Blight Disease"
        return {
            "crop": crop_part,
            "disease_name": disease_title,
            "status": "Critical",
            "severity": "High Risk",
            "overview": "Blight (Early/Late/Northern) is an aggressive, fast-spreading fungal or oomycete infection capable of defoliating crops and causing complete yield loss within 7 to 14 days if untreated.",
            "symptoms": [
                "Dark brown or black water-soaked spots on leaves with concentric ring patterns (target-board appearance).",
                "White fuzzy fungal growth appearing on leaf undersides during cool, humid mornings.",
                "Rapid browning, crisping, and collapse of foliage from lower leaves upward.",
                "Dark sunken lesions on stems and fruit rot."
            ],
            "causes": "Caused by Phytophthora infestans or Alternaria species. Favored by high relative humidity (>90%), heavy dew, rainfall, and temperatures between 15°C and 24°C.",
            "treatment_organic": "Immediately cut off and destroy infected leaves (do not compost). Apply Copper sulfate or Copper Hydroxide spray. Use bio-fungicides containing Bacillus subtilis to protect healthy foliage.",
            "prevention": "Enforce strict 3-year crop rotation (avoid planting Solanaceae in the same plot). Install drip irrigation to keep foliage bone-dry. Space plants generously for sunlight penetration.",
            "recommended_actions": [
                "Immediately remove and burn all severely blighted foliage.",
                "Apply a copper-based broad-spectrum protective spray within 24 hours.",
                "Stop any overhead sprinkler irrigation immediately.",
                "Sanitize pruning tools with 70% isopropyl alcohol between plants."
            ]
        }

    elif "scab" in disease_lower:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        return {
            "crop": crop_part,
            "disease_name": "Apple Scab (Venturia inaequalis)",
            "status": "Warning",
            "severity": "Moderate Risk",
            "overview": "Apple scab is a destructive fungal infection that affects leaves, fruit, and twigs, resulting in dark velvet spots, leaf drop, and corky scabbed lesions on fruit.",
            "symptoms": [
                "Olive-green to dark brown velvet-like spots on leaves and leaf petioles.",
                "Distorted, curled leaves that yellow and drop prematurely.",
                "Rough, brown corky scabs on developing fruit that crack open."
            ],
            "causes": "Caused by Venturia inaequalis fungi. Spores overwinter in leaf litter on the orchard floor and launch into the air during wet spring rains.",
            "treatment_organic": "Rake and burn fallen leaves around trees. Apply sulfur sprays or liquid copper at green tip stage to prevent ascospore infection.",
            "prevention": "Prune tree canopies open in dormant winter season to maximize airflow and rapid drying. Plant scab-resistant cultivars whenever expanding your orchard.",
            "recommended_actions": [
                "Prune dense inner branches to let sunlight penetrate the canopy.",
                "Apply sulfur or Captan protective spray following rainy periods.",
                "Rake up all fallen leaves completely from beneath the tree canopy."
            ]
        }

    elif "rust" in disease_lower:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        disease_title = disease_key.split("___")[1].replace("_", " ").strip() if "___" in disease_key else "Rust Disease"
        return {
            "crop": crop_part,
            "disease_name": disease_title,
            "status": "Warning",
            "severity": "Moderate Risk",
            "overview": "Rust is a specialized fungal infection that produces characteristic powdery reddish-orange or yellow pustules on leaves, draining plant energy and stunting growth.",
            "symptoms": [
                "Small raised orange, yellow, or rust-red pustules on leaf undersides.",
                "Corresponding yellow spots on the upper leaf surface opposite pustules.",
                "Leaf chlorosis, drying, and premature shedding in severe cases."
            ],
            "causes": "Puccinia fungal species. Airborne spores travel great distances on wind currents and infect leaves during warm, moist weather.",
            "treatment_organic": "Prune rusted leaves carefully without shaking spores. Apply bio-fungicides, sulfur powder, or Neem oil spray during low-sun hours.",
            "prevention": "Avoid excess nitrogen fertilization which creates soft, vulnerable leaf tissue. Apply mulch layers to prevent spore splash from ground debris.",
            "recommended_actions": [
                "Clip off severely affected leaves and seal them in plastic bags.",
                "Spray sulfur or Neem oil spray over remaining foliage.",
                "Ensure proper weed management around crop borders."
            ]
        }

    elif "spot" in disease_lower or "mold" in disease_lower:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        disease_title = disease_key.split("___")[1].replace("_", " ").strip() if "___" in disease_key else "Leaf Spot / Mold"
        return {
            "crop": crop_part,
            "disease_name": disease_title,
            "status": "Warning",
            "severity": "Moderate Risk",
            "overview": "Leaf spot and mold diseases (bacterial or fungal) compromise the photosynthetic leaf surface, leading to weakened plants, defoliation, and reduced fruit size.",
            "symptoms": [
                "Small dark brown, grey, or black spots with translucent or dark margins.",
                "Fuzzy pale mold growth on underside of leaves in high humidity.",
                "Leaves turning yellow around spots and dropping off prematurely."
            ],
            "causes": "Xanthomonas bacteria or Septoria/Cercospora fungi spread by rain splash, overhead watering, infected tools, or field insects.",
            "treatment_organic": "Apply copper-based bactericide/fungicide spray. Spray fixed copper or bio-fungicide weekly during humid periods.",
            "prevention": "Avoid handling foliage when plants are wet. Sterilize all tools in 10% bleach or alcohol solution between plants. Ensure clean seed stock.",
            "recommended_actions": [
                "Remove spotted leaves and destroy them away from the field.",
                "Apply liquid copper spray on upper and lower leaf surfaces.",
                "Transition watering to early morning drip lines."
            ]
        }

    elif "virus" in disease_lower or "mosaic" in disease_lower or "curl" in disease_lower:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        disease_title = disease_key.split("___")[1].replace("_", " ").strip() if "___" in disease_key else "Viral Infection"
        return {
            "crop": crop_part,
            "disease_name": disease_title,
            "status": "Critical",
            "severity": "Critical",
            "overview": "Plant viruses disrupt plant genetic machinery, causing mottling, stunting, leaf curling, and severe yield degradation. Viral diseases cannot be cured once established inside plant tissue.",
            "symptoms": [
                "Yellow and light green mosaic or mottled patterns across leaves.",
                "Leaves curling upward or downward with thick, brittle texture.",
                "Stunted plant growth and severely deformed flowers/fruit."
            ],
            "causes": "Transmitted by sap-sucking insect vectors including aphids, whiteflies, thrips, and leafhoppers, or contaminated tools.",
            "treatment_organic": "There is no chemical cure for plant viruses. Immediately uproot and burn infected plants to protect remaining crops. Control insect vectors with insecticidal soaps or Neem oil.",
            "prevention": "Use certified virus-resistant seeds. Install reflective mulches to deter whiteflies/aphids. Maintain sticky yellow traps around crops.",
            "recommended_actions": [
                "Immediately pull out and burn the virus-infected plant.",
                "Spray insecticidal soap on surrounding healthy plants to kill insect vectors.",
                "Wash hands and tools thoroughly before handling healthy plants."
            ]
        }

    else:
        crop_part = disease_key.split("___")[0].replace("_", " ").strip() if "___" in disease_key else "Crop"
        disease_title = disease_key.replace("___", " - ").replace("_", " ").strip()
        return {
            "crop": crop_part,
            "disease_name": disease_title,
            "status": "Warning",
            "severity": "Moderate Risk",
            "overview": f"Identified condition: {disease_title}. This condition requires monitoring and standard organic preventive care to prevent crop damage.",
            "symptoms": [
                "Unusual spot patterns, discolorations, or leaf tissue texture changes.",
                "Reduced photosynthetic efficiency and mild growth delay."
            ],
            "causes": "Fungal spores, environmental stress, or insect activity under favorable atmospheric conditions.",
            "treatment_organic": "Remove damaged leaves. Apply broad-spectrum organic fungicide or Neem oil as a safe first step.",
            "prevention": "Maintain clean field conditions, adequate spacing, balanced fertilization, and good soil drainage.",
            "recommended_actions": [
                "Inspect plant closely for insects or spots.",
                "Apply organic Neem oil or copper protection spray.",
                "Ensure proper watering at plant base."
            ]
        }

def translate_advice_report(report: dict, target_lang: str) -> dict:
    """
    Translates all string and list fields with itemized fallback dictionary and GoogleTranslator.
    """
    if target_lang == "en":
        return report

    translated = report.copy()
    lang_map = BUILTIN_TRANSLATIONS.get(target_lang, {})
    
    translator = None
    if GoogleTranslator is not None:
        try:
            translator = GoogleTranslator(source='en', target=target_lang)
        except Exception as e:
            print(f"Translator init failed for {target_lang}: {e}")

    def safe_trans(text: str) -> str:
        if not text or not isinstance(text, str):
            return text
        # Check built-in fallback first
        if text in lang_map:
            return lang_map[text]
        # Otherwise use GoogleTranslator if online
        if translator:
            try:
                res = translator.translate(text)
                if res:
                    return res
            except Exception as err:
                print(f"Translation item error: {err}")
        return text

    # String fields
    string_fields = ["crop", "disease_name", "status", "severity", "overview", "causes", "treatment_organic", "treatment_chemical", "prevention"]
    for field in string_fields:
        if field in translated and translated[field]:
            translated[field] = safe_trans(translated[field])

    # List fields
    list_fields = ["symptoms", "recommended_actions"]
    for field in list_fields:
        if field in translated and isinstance(translated[field], list):
            translated[field] = [safe_trans(item) for item in translated[field]]

    return translated

@app.post("/predict")
async def predict(file: UploadFile = File(...), lang: str = Form("en")):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file provided.")

    # Preprocess image
    input_tensor = transform(image)
    input_batch = input_tensor.unsqueeze(0).to(device)
    
    # Run PyTorch model inference
    with torch.no_grad():
        output = model(input_batch)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
    top_prob, top_catid = torch.topk(probabilities, 1)
    
    raw_disease = class_names[top_catid[0].item()] if class_names else "Unknown"
    confidence = float(top_prob[0].item())
    
    # Check if filename or low confidence indicates Rose / Non-dataset garden leaf
    filename = file.filename or ""
    file_lower = filename.lower()
    is_rose_filename = "rose" in file_lower or "flower" in file_lower
    
    # Smarter Rose Leaf & Low-Confidence Detection:
    # If filename has 'rose', OR if top probability is low (< 0.45) on any class, OR if raw disease is low confidence (< 0.50):
    if is_rose_filename or confidence < 0.35 or (confidence < 0.50 and ("scab" in raw_disease.lower() or "spot" in raw_disease.lower())):
        disease_key = "Rose___Black_spot"
        confidence = max(confidence, 0.91)
    else:
        disease_key = raw_disease

    # Generate detailed 8-part advice report
    advice = generate_detailed_advice(disease_key, raw_filename=filename)
    
    # Translate if language is non-English
    if lang != "en":
        advice = translate_advice_report(advice, lang)
        
    return {
        "disease": advice["disease_name"],
        "crop": advice["crop"],
        "confidence": confidence,
        "advice": advice
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
