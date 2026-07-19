# Deployment Diagram

## Overview

The Deployment Diagram illustrates the physical deployment architecture of the DataPulse platform.

It shows how different software components are deployed across various nodes and how they communicate during runtime.

The architecture follows a modular cloud-based deployment model suitable for scalable AI-powered crime analytics.

---

# Purpose

The Deployment Diagram helps developers:

- Understand deployment architecture.
- Visualize communication between services.
- Plan server infrastructure.
- Prepare cloud deployment.
- Improve scalability.

---

# Deployment Architecture

```mermaid
flowchart TB

User["👮 Police Officer<br/>Crime Analyst<br/>Administrator"]

Browser["Web Browser"]

Frontend["Next.js Frontend"]

Backend["Spring Boot REST API"]

Database["PostgreSQL Database"]

AI["Python AI Engine"]

Report["PDF Report Generator"]

Storage["Dataset Storage (CSV / Excel)"]

User --> Browser

Browser --> Frontend

Frontend --> Backend

Backend --> Database

Backend --> AI

Backend --> Report

Backend --> Storage

AI --> Database

Report --> Database
```

---

# Deployment Nodes

## Client Node

Runs:

- Web Browser
- Responsive UI

---

## Frontend Server

Technology:

- Next.js

Responsibilities:

- User Interface
- Dashboard
- Charts
- Maps
- Authentication Pages

---

## Backend Server

Technology:

- Spring Boot

Responsibilities:

- REST APIs
- Business Logic
- Security
- Authentication
- Validation

---

## AI Server

Technology:

- Python

Libraries:

- Pandas
- Scikit-learn
- NetworkX
- GeoPandas

Responsibilities:

- Crime Prediction
- Hotspot Detection
- Criminal Network Analysis
- Risk Scoring
- Anomaly Detection

---

## Database Server

Technology:

- PostgreSQL

Stores:

- Users
- Crime Records
- Criminals
- Reports
- Alerts
- Predictions

---

## File Storage

Stores:

- Uploaded CSV files
- Generated Reports
- PDF Exports

---

# Diagram

![Deployment Diagram](DeploymentDiagram.svg)

---

# Mermaid Source

(Paste Mermaid code here.)

---

# Future Deployment

Future versions may deploy using:

- Docker
- Kubernetes
- Nginx
- Redis
- Kafka
- AWS
- Azure
- Zoho Catalyst