# 🚑 RoadSoS AI: The Future of Rapid Emergency Response

[![Hackathon Project](https://img.shields.io/badge/Hackathon-Project-blueviolet?style=for-the-badge)](https://github.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**RoadSoS AI** is a high-stakes emergency response application designed to save lives during the "Golden Hour" of an accident. It combines a sophisticated AI Dispatcher with real-time location intelligence to bridge the gap between an incident and professional medical arrival.

---

## 🌟 Key Features

### 1. 🛡️ Critical SOS Broadcast
One-tap emergency broadcast that instantly shares your live coordinates and medical profile with the nearest trauma centers and emergency services.

### 2. 🤖 AI Voice Dispatcher
A voice-first LLM-powered assistant trained on medical protocols. It provides step-by-step first-aid guidance (e.g., CPR, wound pressure, spinal safety) during high-pressure situations.

### 3. 🗺️ Live Trauma Tracker (Overpass API)
Real-time integration with OpenStreetMap's Overpass API to locate the nearest verified hospitals, ambulances, and police stations. Includes smart fallbacks to ensure service even in low-connectivity areas.

### 4. 👤 Universal Medical ID
Store your blood group, medical conditions, and emergency contacts. This profile is shared with responders during an SOS event to ensure you get the right care instantly.

### 5. 🌗 Premium Modern UI
A professional, "Modern & Reassuring" aesthetic built with accessibility in mind.
- **Dark Mode Support:** Full night-vision optimized theme for low-light emergencies.
- **Apple Health Inspired:** Clean, high-contrast layouts with smooth Framer Motion animations.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS, Framer Motion, Lucide Icons, Leaflet Maps.
- **Backend:** FastAPI (Python), SQLAlchemy, SQLite, Pydantic.
- **Intelligence:** LangChain, Overpass API (OpenStreetMap), FAISS (Vector DB).
- **Auth:** Simulated Phone-based OTP Authentication (Hackathon Demo optimized).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
- Open `http://localhost:5173`
- Login with any phone number.
- Use OTP: `123456`
- **Go to Settings** to set up your Medical Profile.
- **Go to Emergency** to see real nearby hospitals on the map!

---

## 🏗️ Project Architecture

```text
roadsos-cloud-fallback/
├── backend/                # FastAPI Server
│   ├── db/                 # SQLAlchemy Models & SQLite
│   ├── routers/            # Auth, SOS, Profile, AI Routers
│   └── main.py             # Entry Point
├── frontend/               # React Application
│   ├── src/
│   │   ├── context/        # Auth & Theme State
│   │   ├── components/     # SOSButton, BottomNav, etc.
│   │   └── pages/          # Home, Emergency, Chat, Settings
└── README.md
```

---

## 🎯 Hackathon Impact
RoadSoS AI addresses the critical problem of **information asymmetry** and **panic** during roadside emergencies. By providing an immediate AI companion and a direct link to hospitals, we reduce response times and empower bystanders to provide life-saving assistance.

*Built with ❤️ for the Hackathon Community.*
