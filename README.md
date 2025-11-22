# 🚀 TubeMaster AI: Ultimate Video Strategy System

![System Online](https://img.shields.io/badge/System-Online-green?style=flat-square)
![AI Engine](https://img.shields.io/badge/AI-Gemini%202.5-blue?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-Vite%20React-indigo?style=flat-square)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square)

**TubeMaster AI** is the "World's Most Powerful" video analysis and editing command center. Designed by **MAHIR**, this system leverages the latest Google Gemini 2.5 models to analyze content, generate viral metadata for multiple platforms (YouTube, TikTok, Facebook), creates AI-generated 3D thumbnails, and provides professional in-browser video editing tools.

---

## 📸 System Interface & Visuals

The interface features a **True Black 3D Mesh** aesthetic, designed for high-focus professional workflows.

| **Command Center** | **AI Analysis Core** |
|:---:|:---:|
| ![Dashboard Interface](https://via.placeholder.com/800x450/020617/6366f1?text=Main+Dashboard+&+Upload+Center) | ![Analysis Results](https://via.placeholder.com/800x450/020617/ef4444?text=AI+Metadata+&+Virality+Score) |
| *Dark 3D Environment with Multi-Platform Selector* | *Deep Forensics, Copyright Risk, & SEO Data* |

| **Pro Video Editor** | **3D Thumbnail Gen** |
|:---:|:---:|
| ![Video Editor](https://via.placeholder.com/800x450/020617/10b981?text=Non-Linear+Editor+Suite) | ![Thumbnail Generator](https://via.placeholder.com/800x450/020617/f59e0b?text=AI+Generative+Thumbnail+Engine) |
| *Timeline, Audio Mixing, AI Upscaling & Filters* | *Style Control, Lighting & Prompt Engineering* |

---

## ✨ Key Features

### 🧠 High-Power AI Forensics
- **Multi-Platform Intelligence:** Automatically generates tailored titles, descriptions, and hashtags for **YouTube**, **TikTok**, and **Facebook**.
- **Deep Content Analysis:** Uses OCR and Audio Recognition to extract "Power Keywords" from the video to boost SEO.
- **Copyright Radar:** Scans for potential copyright risks (Audio/Visual) and provides a risk assessment (Low/Medium/High).
- **Virality Score:** Assigns a predicted 0-100 score based on current social trends.

### 🎨 AI Generative Thumbnails
- **Gemini 2.5 Image Engine:** Generates high-fidelity, 3D, and cinematic thumbnails based on the video's specific "Hero Object".
- **Psychological Hooks:** Automatically prompts for high-contrast, glowing elements, and specific lighting to maximize Click-Through Rate (CTR).
- **Style Control:** Granular control over Art Style (Cyberpunk, Realistic, 3D), Lighting, and Color Palette.
- **Stock Photo Fallback:** Integrated Pexels API for high-quality stock asset search.

### 🎬 Professional Video Studio
- **Smart Trimming:** Precision cut and trim tools.
- **AI Enhancements:** 
  - **4K Upscale:** Simulated HD upscaling filter.
  - **Voice Clarity:** EQ and compression chain to enhance spoken audio.
- **Audio Mixing:** Mix background music from a royalty-free library with auto-ducking and volume controls.
- **Visual Filters:** Real-time color grading (Sepia, Grayscale, High Contrast, Vintage).
- **Format Support:** Exports optimized `.webm` video ready for upload.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **AI Provider:** Google GenAI SDK (`gemini-2.5-flash`, `gemini-2.5-flash-image`)
- **Database:** Supabase (Cloud History)
- **Styling:** Tailwind CSS (Custom "True Black" 3D Aesthetic)
- **Icons:** Lucide React
- **Core APIs:** MediaRecorder, Web Audio API, HTML5 Canvas

---

## 🚀 Deployment Guide (Vercel)

This project is optimized for immediate deployment on Vercel.

### 1. Preparation
Ensure you have your API keys ready (though users can also input them via the UI Settings).

### 2. Deploy to Vercel
1.  Push this code to a **GitHub** repository.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3.  Select your `tubemaster-ai` repository.
4.  **Build Settings:** Vercel automatically detects Vite. No custom overrides needed.
5.  **(Optional) Environment Variables:**
    - `API_KEY`: Your Google Gemini API Key.
6.  Click **Deploy**.

### 3. Access
Once deployed, Vercel will provide a URL (e.g., `https://tubemaster-ai.vercel.app`).

---

## ⚙️ Configuration

The system includes a robust **Settings Manager**:

1.  Click the **Settings (Gear Icon)** in the top navigation.
2.  **Gemini API Key:** Required for video analysis and AI thumbnail generation.
3.  **Pexels API Key:** Optional. Used only if you switch the thumbnail generator to "Stock Photo" mode.
4.  **Supabase Config:** Optional. Connect your Supabase URL/Key to save analysis history to the cloud.

*The system persists these keys locally in the browser session for security.*

---

## 📄 License

**System Architect:** MAHIR  
Proprietary high-performance video strategy system.
