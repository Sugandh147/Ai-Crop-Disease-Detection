# 🌾 AI Crop Disease Detection Platform

Welcome to the **AI Crop Disease Detection** project! 

This project was built with a single goal in mind: **To help farmers identify plant diseases instantly just by taking a picture on their phone.**

## 🌍 Why We Built This

Farming is hard, and crop diseases can wipe out an entire season of hard work in just a few days. While there are many high-tech agricultural tools available today, most of them are built for people who are tech-savvy or speak fluent English. 

We wanted to build something for **everyone**—especially rural farmers who might be using a smartphone for the very first time. 

That is why this platform is built differently:
1. **Extremely Simple:** There are no confusing dashboards or complicated settings. You open the website, tap a massive button to take a photo of a sick leaf, and the AI does the rest.
2. **Speaks Your Language:** It supports **22 Indian Languages**. With a single tap, the entire website instantly translates into Hindi, Bengali, Tamil, Telugu, Marathi, and many more, making it accessible to millions.
3. **Actionable Advice:** It doesn’t just tell you the disease name. It gives you clear, easy-to-understand steps on how to treat the disease and prevent it from spreading.

---

## 🤖 How the Magic Works

Even though it looks simple on the outside, there is powerful artificial intelligence running in the background.

Imagine the AI as a doctor for plants. Instead of going to medical school, our AI looked at **tens of thousands of pictures** of both healthy and sick leaves. By studying these images, it learned how to instantly spot the tiny differences between a healthy plant and one suffering from 38 different types of diseases.

When you upload a photo:
1. The picture is securely sent to our "AI Brain" (the server).
2. The AI looks closely at the spots, colors, and shapes on the leaf.
3. Within seconds, it figures out exactly what is wrong and sends the answer back to your phone along with a treatment plan.

---

## 💻 For the Tech-Curious (Under the Hood)

If you are a developer looking at this code, here is a quick summary of what powers this platform:

*   **The Frontend (The Website):** Built using **Next.js** and **React**. It uses modern design principles (glassmorphism, smooth animations) and a highly optimized custom translation engine so the website never feels slow, even on older mobile phones.
*   **The Backend (The Engine):** Powered by **Python** and **FastAPI**, making it lightning-fast. 
*   **The AI Model:** We use a custom-trained **MobileNetV2** model using **PyTorch**. We specifically chose MobileNet because it is incredibly lightweight and fast, meaning it doesn't require an expensive supercomputer to run.

### How to run this locally:
1. **Start the Backend Engine:**
   Navigate into the `backend` folder and run `python main.py`. (This will start the AI on `http://localhost:8000`).
2. **Start the Website:**
   Navigate into the `frontend` folder and run `npm run dev`. (This will open the website on `http://localhost:3000`).

---
*Built to empower the next billion users in agriculture.* 🌱
