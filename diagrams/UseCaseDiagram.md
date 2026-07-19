# Use Case Diagram

## Overview

The Use Case Diagram represents the interactions between different users (actors) and the DataPulse – AI-Driven Crime Analytics & Visualization Platform.

It identifies the major functionalities available to each type of user and provides a high-level understanding of the system's behavior.

---

# Purpose

The purpose of this diagram is to:

- Identify all system users.
- Define the responsibilities of each user.
- Describe the main functionalities provided by the system.
- Serve as the foundation for backend API design and frontend development.

---

# Actors

## 1. Police Officer

Responsibilities:

- Login
- View Dashboard
- Generate Reports
- Receive Alerts
- Logout

---

## 2. Crime Analyst

Responsibilities:

- Login
- Upload Crime Dataset
- View Dashboard
- Analyze Crime Trends
- Detect Crime Hotspots
- Perform District Analysis
- Perform Crime Category Analysis
- Generate Reports
- Logout

---

## 3. Investigator

Responsibilities:

- Login
- View Dashboard
- Track Repeat Offenders
- Analyze Criminal Relationships
- Generate Reports
- Logout

---

## 4. Administrator

Responsibilities:

- Login
- Manage Crime Records
- Manage Users
- Generate Reports
- Logout

---

# Major Use Cases

- User Authentication
- Crime Data Upload
- Crime Record Management
- Interactive Dashboard
- Crime Analytics
- Crime Hotspot Detection
- District Analysis
- Crime Category Analysis
- Repeat Offender Tracking
- Criminal Network Analysis
- Report Generation
- Alert Notification
- User Management

---

# Diagram

![Use Case Diagram](UseCaseDiagram.svg)

---

# Mermaid Source

```mermaid
(Paste your Mermaid code here)
```

---

# Notes

- All users must authenticate before accessing the system.
- Only administrators can manage users.
- Crime Analysts perform data analysis.
- Investigators focus on criminal relationship analysis.
- Police Officers mainly consume analytics and reports.

---

# Future Enhancements

Future versions may include:

- Voice-based interaction
- AI Chatbot
- Multi-language support
- Mobile application
- Facial Recognition Integration