import requests
import io
from PIL import Image

def test_predict(filename, color, description):
    img = Image.new("RGB", (224, 224), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    
    res = requests.post(
        "http://localhost:8000/predict",
        files={"file": (filename, buf, "image/jpeg")},
        data={"lang": "en"}
    )
    if res.status_code == 200:
        data = res.json()
        print(f"[{description}] -> File: {filename}")
        print(f"   Crop: {data['crop']}")
        print(f"   Disease: {data['disease']}")
        print(f"   Confidence: {round(data['confidence'] * 100, 1)}%")
        print(f"   Status: {data['advice'].get('status')}")
        print("-" * 50)
    else:
        print(f"Error testing {filename}: {res.status_code}")

if __name__ == "__main__":
    print("Testing Kisan AI Backend Multi-Class Prediction Endpoint...\n")
    test_predict("apple_leaf.jpg", (35, 175, 45), "Green Apple Leaf")
    test_predict("tomato_early_blight.jpg", (45, 30, 25), "Spotted Tomato Leaf (Blight)")
    test_predict("tomato_yellow_curl.jpg", (220, 210, 40), "Yellowed Mosaic Virus Leaf")
    test_predict("corn_rust.jpg", (180, 90, 30), "Rust Spotted Corn Leaf")
    test_predict("rose_bush.jpg", (90, 90, 90), "Rose Leaf")
