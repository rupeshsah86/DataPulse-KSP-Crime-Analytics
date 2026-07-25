# DataPulse - AI-Driven Crime Analytics Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.10-black?style=flat&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.16-brightgreen?style=flat&logo=springboot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Python-3.12-blue?style=flat&logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/PostgreSQL-17-orange?style=flat&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Deployed-Catalyst-success?style=flat&logo=zoho" alt="Catalyst"/>
</div>

## 📌 Overview

**DataPulse** is an AI-powered crime analytics platform designed for law enforcement agencies. It transforms raw crime data into actionable intelligence through interactive dashboards, geospatial visualization, predictive analytics, and criminal network analysis.

Built for the **Karnataka State Police Hackathon 2026**, DataPulse helps police departments make data-driven decisions, detect crime patterns, and proactively allocate resources.

### 🎯 Problem Statement

Law enforcement agencies face challenges with:
- Fragmented crime data across multiple systems
- Manual analysis and reporting
- Limited predictive capabilities
- Difficulty identifying crime hotspots
- No automated criminal relationship analysis

### 💡 Solution

DataPulse centralizes crime data and provides:
- **Real-time analytics** with interactive dashboards
- **AI-powered crime prediction** and hotspot detection
- **Geospatial mapping** with crime location visualization
- **Criminal network analysis** with relationship graphs
- **Repeat offender tracking** with risk scoring
- **Bulk data upload** with CSV/Excel support
- **PDF report generation** and data export

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://frontend-deploy-wfmnamam.onslate.in](https://frontend-deploy-wfmnamam.onslate.in) |
| **Backend API** | [https://datapulse-backend-50044313424.development.catalystappsail.in](https://datapulse-backend-50044313424.development.catalystappsail.in) |

**Demo Credentials:**
- Email: `admin@datapulse.com`
- Password: `admin123`

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.10 | React framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Recharts | 3.9.2 | Charts & analytics |
| Leaflet | 1.9.4 | Interactive maps |
| vis-network | 10.1.0 | Network graphs |
| Zustand | 5.0.14 | State management |
| Axios | 1.18.1 | API calls |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.5.16 | REST API framework |
| Java | 21 | Programming language |
| PostgreSQL | 17 | Database |
| JWT | 0.12.6 | Authentication |
| Hibernate | 6.6.53 | ORM |
| Maven | 3.9+ | Build tool |

### AI Service
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.12 | Programming language |
| FastAPI | 0.115.6 | API framework |
| Groq | 0.1.0 | LLM for RAG |
| HuggingFace | - | Embeddings |
| ChromaDB | 0.5.3 | Vector database |
| Scikit-learn | 1.6.1 | Machine learning |

### Deployment
| Platform | Service |
|----------|---------|
| Zoho Catalyst | Slate (Frontend) |
| Zoho Catalyst | AppSail (Backend & AI) |

## ✨ Key Features

### 🔐 Authentication
- Secure JWT-based authentication
- Role-based access control (ADMIN, OFFICER, ANALYST, INVESTIGATOR)
- User registration and profile management

### 📊 Dashboard
- Real-time KPI cards (Total Crimes, Active Cases, Resolution Rate)
- Crime trend charts
- Alerts panel for critical crimes
- Officer performance tracking

### 🗺️ Geospatial Mapping
- Interactive crime location map
- Crime heatmaps
- District-wise crime visualization
- Clickable markers with crime details

### 🤖 AI-Powered Insights
- Crime risk prediction
- Hotspot detection
- Crime pattern analysis
- RAG chatbot for natural language queries
- Trend analysis (peak times, categories)

### 🔗 Criminal Network Analysis
- Interactive network graph
- Relationship visualization
- Node details and connections
- Risk level indicators

### 🔄 Repeat Offender Tracking
- Identify criminals with 2+ offenses
- Risk scoring (LOW, MEDIUM, HIGH, CRITICAL)
- Offense history tracking
- Crime pattern detection

### 📈 Analytics & Reports
- Category distribution charts
- District-wise crime analysis
- Status and severity breakdown
- CSV/Excel export
- PDF report generation

### 📤 Data Management
- Bulk upload (CSV, Excel)
- Data validation
- Search and filter
- CRUD operations

## 📁 Project Structure

```
DataPulse-KSP-Crime-Analytics/
├── frontend/                  # Next.js frontend application
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API service layer
│   ├── store/                 # Zustand state management
│   ├── utils/                 # Utility functions
│   └── public/                # Static assets
│
├── backend/                   # Spring Boot backend
│   ├── src/main/java/
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # JPA repositories
│   │   ├── entity/            # JPA entities
│   │   ├── config/            # Configuration
│   │   └── security/          # JWT security
│   └── src/main/resources/    # Application config
│
├── ai/                        # Python AI service
│   ├── models/                # ML models
│   ├── services/              # AI services
│   └── app.py                 # FastAPI application
│
├── database/                  # Database scripts
├── docs/                      # Documentation
├── diagrams/                  # UML diagrams
└── presentation/              # Presentation materials
```

## 🚀 Local Development Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22+ |
| Java | 21+ |
| Python | 3.12+ |
| PostgreSQL | 17+ |
| Maven | 3.9+ |
| npm | 10+ |

### Step 1: Clone the Repository

```bash
git clone https://github.com/rupeshsah86/DataPulse-KSP-Crime-Analytics.git
cd DataPulse-KSP-Crime-Analytics
```

### Step 2: Setup Database

```bash
brew services start postgresql@17
psql -U postgres -c "CREATE DATABASE datapulse_db;"
```

### Step 3: Setup Backend

```bash
cd backend
# Update application.yml with your database credentials
mvn clean install
mvn spring-boot:run
```

### Step 4: Setup AI Service

```bash
cd ai
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cat > .env <<EOF
GROQ_API_KEY=your-groq-api-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=datapulse_db
DB_USER=your-username
DB_PASSWORD=your-password
EOF

python app.py
```

### Step 5: Setup Frontend

```bash
cd frontend
npm install

cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=http://localhost:8082
NEXT_PUBLIC_AI_URL=http://localhost:8000
EOF

npm run dev
```

### Step 6: Access Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8082 |
| AI Service | http://localhost:8000 |
| Swagger UI | http://localhost:8082/swagger-ui/index.html |

## 🔧 Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8082
NEXT_PUBLIC_AI_URL=http://localhost:8000
NEXT_PUBLIC_DEBUG=true
```

### Backend (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/datapulse_db
    username: your-username
    password: your-password
server:
  port: 8082
```

### AI Service (`.env`)

```env
GROQ_API_KEY=your-groq-api-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=datapulse_db
DB_USER=your-username
DB_PASSWORD=your-password
```

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login and get JWT |

### Crimes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/crimes | Get all crimes |
| POST | /api/v1/crimes | Create crime |
| GET | /api/v1/crimes/{id} | Get crime by ID |
| PUT | /api/v1/crimes/{id} | Update crime |
| DELETE | /api/v1/crimes/{id} | Delete crime |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/predict | Predict crime risk |
| GET | /api/ai/hotspots | Get crime hotspots |
| GET | /api/ai/patterns | Get crime patterns |
| POST | /api/ai/chat | RAG chatbot query |

## 🌐 Deployment on Zoho Catalyst

### Deploy Frontend
```bash
cd frontend
zip -r ../frontend-source.zip . -x "node_modules/*" -x ".next/*"
# Upload to Catalyst Slate → Deploy By Direct Upload
# Framework: Next.js, Node Runtime: Node 22
```

### Deploy Backend
```bash
cd backend
mvn clean package -DskipTests
catalyst deploy
```

### Deploy AI Service
```bash
cd ai
zip -r ../ai-deploy.zip . -x "venv/*" -x "__pycache__/*"
# Upload to Catalyst AppSail
# Runtime: Python 3.12, Command: uvicorn app:app --host 0.0.0.0 --port 8000
```

## 👥 Contributors

| Name | Role | GitHub | LinkedIn |
|------|------|--------|----------|
| Rupesh Kumar Sah | Lead Developer | [rupeshsah86](https://github.com/rupeshsah86) | [Rupesh Kumar Sah](https://www.linkedin.com/in/rupesh-shah-a480b8324/) |
| Ravi Kushwaha | Frontend Developer | - | - |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Karnataka State Police Hackathon
- Zoho Catalyst for cloud deployment
- Groq for AI inference

## 📧 Contact

- Email: rupeshkumarsah.2024cse@sece.ac.in
- GitHub: [rupeshsah86](https://github.com/rupeshsah86)
- LinkedIn: [Rupesh Kumar Sah](https://www.linkedin.com/in/rupesh-shah-a480b8324/)

<div align="center">Made with ❤️ for the Karnataka State Police Hackathon 2026</div>
