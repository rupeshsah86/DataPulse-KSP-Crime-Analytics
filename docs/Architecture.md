# System Architecture

# Project Name

**DataPulse – AI-Driven Crime Analytics & Visualization Platform**

---

# Architecture Overview

DataPulse follows a layered architecture that separates presentation, business logic, artificial intelligence, and data storage. This architecture ensures scalability, maintainability, security, and easy integration of AI services.

The application consists of five major layers:

1. Presentation Layer
2. Backend Layer
3. AI & Analytics Layer
4. Database Layer
5. Deployment Layer

---

# High-Level Architecture

```
+------------------------------------------------------+
|                 Police Officer / Analyst             |
+--------------------------+---------------------------+
                           |
                           v
+------------------------------------------------------+
|      Next.js + React Frontend (Dashboard UI)         |
+--------------------------+---------------------------+
                           |
                      REST API (HTTPS)
                           |
                           v
+------------------------------------------------------+
|           Spring Boot Backend (Java)                 |
|------------------------------------------------------|
| Authentication                                       |
| Dashboard APIs                                       |
| Crime APIs                                           |
| Report APIs                                          |
| AI Integration                                       |
+--------------------------+---------------------------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
+-----------------------+     +--------------------------+
| PostgreSQL Database   |     | Python AI Engine         |
|                       |     |--------------------------|
| Crime Records         |     | Pattern Detection        |
| Users                 |     | Crime Prediction         |
| Alerts                |     | Hotspot Detection        |
| Districts             |     | Network Analysis         |
| Reports               |     | Risk Scoring             |
+-----------------------+     +--------------------------+
             |
             v
+------------------------------------------------------+
|             Zoho Catalyst Cloud Deployment           |
+------------------------------------------------------+
```

---

# Components

## Frontend

Responsibilities

- User Login
- Dashboard
- Crime Visualization
- Charts
- Heatmaps
- Reports
- Search
- Filters

Technology

- Next.js
- React
- Tailwind CSS
- Leaflet
- Apache ECharts

---

## Backend

Responsibilities

- Authentication
- API Management
- Business Logic
- Validation
- File Upload
- Report Generation
- AI Communication

Technology

- Spring Boot
- Spring Security
- JWT
- Hibernate

---

## AI Layer

Responsibilities

- Crime Trend Prediction
- Crime Hotspot Detection
- Repeat Offender Detection
- Criminal Network Analysis
- Risk Score Calculation
- Anomaly Detection

Technology

- Python
- Scikit-learn
- Pandas
- NumPy
- NetworkX

---

## Database Layer

Responsibilities

- Store Crime Records
- Store User Information
- Store Reports
- Store Alerts
- Store Prediction Results

Technology

- PostgreSQL

---

# Data Flow

1. Police officer logs in.
2. Frontend sends login request.
3. Backend authenticates user.
4. Backend fetches required data.
5. AI Engine analyzes crime data.
6. Backend receives AI results.
7. Dashboard displays visualizations.
8. Officer interacts with dashboard.

---

# Security

- JWT Authentication
- Role-Based Access Control
- Password Encryption (BCrypt)
- HTTPS Communication
- API Validation
- Audit Logging

---

# Deployment

Development

MacBook → GitHub → Local PostgreSQL

Production

GitHub → Zoho Catalyst → PostgreSQL → AI Service

---

# Advantages

- Modular Design
- Scalable Architecture
- Easy Maintenance
- AI Ready
- Secure
- Cloud Deployable