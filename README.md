# DataPulse - AI-Driven Crime Analytics & Spatial Intelligence Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.10-black?style=flat&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.16-brightgreen?style=flat&logo=springboot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Python-3.12-blue?style=flat&logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/Groq%20LLM-Llama--3.3--70b-purple?style=flat&logo=groq" alt="Groq"/>
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?style=flat&logo=three.js" alt="Three.js"/>
  <img src="https://img.shields.io/badge/React%20Native-Expo-blue?style=flat&logo=expo" alt="React Native"/>
  <img src="https://img.shields.io/badge/PostgreSQL-17-orange?style=flat&logo=postgresql" alt="PostgreSQL"/>
</div>

---

## 📌 Overview

**DataPulse** is a next-generation AI-driven crime analytics and predictive spatial intelligence platform built for law enforcement agencies. It unifies raw incident feeds, FIR document scans, and multi-state crime registries into real-time operational intelligence.

Built for the **Karnataka State Police Hackathon 2026**, DataPulse empowers officers with **Groq LLM RAG case briefings**, **NetworkX predictive patrol routing**, **Three.js WebGL 3D spatial height maps**, **OCR FIR document extraction**, **Web Speech voice commands**, and a **React Native field mobile app**.

---

## 🛠️ Technology Stack

### Frontend & Web Visuals
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.10 | React App Router framework |
| TypeScript | 5.x | Type safety & strict compilation |
| Tailwind CSS | 4.x | Styling & responsive layouts |
| Three.js | Latest | 3D WebGL spatial height elevation rendering |
| Recharts | 3.9.2 | Dual-axis charts & analytics |
| Leaflet | 1.9.4 | 2D Spatial maps & hotspot GIS |
| Vis Network | 10.1.0 | Criminal network relationship force graphs |
| Zustand | 5.0.14 | Client state management |
| Web Speech API | Native | Voice recognition & Text-to-Speech audio |

### Backend Service (Port 8083)
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.5.16 | Core enterprise REST API framework |
| Java | 21/24 | Programming runtime |
| PostgreSQL | 17 | Relational crime database |
| Spring Security | 6.x | JWT authentication & role-based authorization |
| Hibernate | 6.6.53 | JPA ORM persistence layer |
| Maven | 3.9+ | Dependency management |

### AI Engine (Port 8000)
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.12 | AI engine runtime |
| FastAPI | 0.115.6 | Async REST API framework |
| Groq LLM | Llama-3.3-70b | High-speed LLM reasoning & RAG synthesis |
| NetworkX | Latest | Spatial graph algorithms & Dijkstra shortest paths |
| PyPDF & Tesseract | Latest | FIR document OCR text extraction |
| Scikit-learn | 1.6.1 | Machine learning clustering & risk scoring |

### Mobile Application
| Technology | Framework | Purpose |
|------------|-----------|---------|
| React Native | Expo | Cross-platform officer field mobile app |
| AsyncStorage | Offline Cache | Offline crime feed caching |
| Location Telemetry | Expo Location | Real-time officer GPS tracking |

---

## ✨ Key Features & AI Engines

### 🤖 1. AI Investigation Assistant (Groq LLM RAG)
* **Auto-Summarize Cases**: Generates structured executive briefs from raw police incident logs.
* **Tactical Lead Generation**: Recommends immediate field investigation steps.
* **Precedent Analysis**: Matches current modus operandi against historical crime registries.

### 🧭 2. Predictive Patrol Routes (NetworkX Optimization)
* **Spatial Graph Routing**: Computes optimal risk-weighted patrol paths connecting high-density crime hotspots.
* **Dijkstra Dispatching**: Minimizes officer response times with turn-by-turn dispatch itineraries.

### 🌐 3. Multi-State Crime Analytics
* **Cross-Jurisdictional Intelligence**: Aggregates crime statistics across Karnataka, Maharashtra, Tamil Nadu, Telangana, Kerala, and Delhi.
* **Comparative Benchmarking**: Multi-state crime distribution bar charts and national threat level metrics.

### 🧊 4. 3D Crime Spatial Heatmaps (Three.js WebGL)
* **3D Height Elevation Towers**: Visualizes crime volume in WebGL 3D space with elevation bars corresponding to incident severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
* **Interactive Raycasting**: Click or hover 3D crime towers to inspect sector risk telemetry.

### 📄 5. OCR FIR Document Scanner (PyPDF & Tesseract)
* **Automated Data Ingestion**: Extracts text from scanned paper FIR PDFs and image uploads.
* **Structured Parsing**: Uses Groq LLM to auto-fill official crime registry forms with zero manual typing.

### 🎙️ 6. Voice Search & AI Voice Assistant (Web Speech API)
* **Voice Search Bar**: Speak crime queries directly into the search bar (`"Search armed robbery in Indiranagar"`).
* **Voice Navigation & TTS**: Hands-free spoken route navigation (`"Go to Patrol Routes"`, `"Open 3D Map"`) with spoken audio responses.

### 📱 7. DataPulse Mobile Field App (React Native Expo)
* **Field Officer Companion**: Offline crime caching, GPS location tracking, and mobile camera evidence capture.

---

## 📁 Project Structure

```
DataPulse-KSP-Crime-Analytics/
├── frontend/                  # Next.js 16 Web Application
│   ├── app/                   # App Router pages (/map, /map/3d, /patrol, /ai, /upload/document)
│   ├── components/            # React UI components (3D map, Patrol, Network, Voice)
│   ├── hooks/                 # Custom hooks (useAI, use3DMap, useVoiceCommands, useCrimeStream)
│   ├── services/              # API service layer (Spring Boot & FastAPI integration)
│   ├── store/                 # Zustand state management
│   └── utils/                 # Spatial data processors & speech recognition helpers
│
├── backend/                   # Spring Boot 3.5 REST Backend (Port 8083)
│   ├── src/main/java/
│   │   ├── controller/        # REST controllers (Auth, Crimes, Patrol, Document, Analytics)
│   │   ├── service/           # Business logic & non-blocking email alerts
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── entity/            # JPA entities (CrimeIncident, User, Criminal)
│   │   ├── config/            # SecurityConfig role permission matrix
│   │   └── security/          # JWT authentication filter
│   └── src/main/resources/    # application.yml configuration
│
├── ai/                        # Python FastAPI AI Service (Port 8000)
│   ├── api/                   # FastAPI routers (investigation, patrol, ocr, voice)
│   ├── algorithms/            # NetworkX route optimizer
│   ├── models/                # ML predictor & investigation prompts
│   ├── services/              # Document processor & Groq LLM service
│   └── app.py                 # Main FastAPI application entrypoint
│
└── mobile/                    # React Native Expo Mobile App
    ├── app/screens/           # Login, Dashboard, Crimes, Map screens
    ├── app/components/        # Crime cards & evidence camera
    └── store/                 # Offline AsyncStorage state
```

---

## 🚀 Quick Execution Guide

Run the 3 core platform services in separate terminal windows:

### 1. Spring Boot Backend (Port 8083)
```bash
cd backend
mvn spring-boot:run
```

### 2. Python FastAPI AI Engine (Port 8000)
```bash
cd ai
source venv/bin/activate
uvicorn app:app --reload --port 8000
```

### 3. Next.js Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

---

## 📊 Core API Endpoints

### Authentication & Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register officer badge & account |
| POST | `/api/v1/auth/login` | Public | Authenticate officer & receive JWT |

### AI & Predictive Intelligence
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/investigation/analyze` | Officer | Groq LLM case briefing & lead generation |
| POST | `/api/patrol/routes` | Officer | NetworkX spatial graph route optimization |
| POST | `/api/ocr/extract` | Officer | OCR text extraction & FIR form auto-fill |
| POST | `/api/voice/intent` | Officer | Voice transcript intent parsing & TTS audio |

### Analytics & Multi-State
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/analytics/multi-state` | Officer | Cross-state crime benchmarking statistics |
| GET | `/api/v1/criminals/network` | Officer | Vis Network relationship graph nodes |

---

## 👥 Contributors

| Name | Role | GitHub | LinkedIn |
|------|------|--------|----------|
| **Rupesh Kumar Sah** | Lead Developer | [@rupeshsah86](https://github.com/rupeshsah86) | [Rupesh Kumar Sah](https://www.linkedin.com/in/rupesh-shah-a480b8324/) |
| **Ravi Kushwaha** | Frontend Developer | | |

---

<div align="center">Made with ❤️ for the <b>Karnataka State Police Hackathon 2026</b></div>
