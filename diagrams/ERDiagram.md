# Entity Relationship (ER) Diagram

## Overview

The ER Diagram represents the database structure of the DataPulse platform. It defines all entities, their attributes, and the relationships between them.

This database is designed to support crime analytics, AI prediction, hotspot detection, report generation, and criminal network analysis.

---

## Purpose

The ER Diagram helps developers:

- Design the PostgreSQL database
- Define entity relationships
- Avoid data redundancy
- Build backend JPA entities
- Create REST APIs

---

## ER Diagram

```mermaid
erDiagram

USER {
    int user_id PK
    string full_name
    string email
    string password
    string role
    datetime created_at
}

UPLOADED_DATASET {
    int dataset_id PK
    string file_name
    string file_type
    datetime uploaded_at
}

DISTRICT {
    int district_id PK
    string district_name
}

CRIME_CATEGORY {
    int category_id PK
    string category_name
}

CRIME_LOCATION {
    int location_id PK
    string latitude
    string longitude
    string address
}

CRIMINAL {
    int criminal_id PK
    string criminal_name
    int age
    string gender
}

VICTIM {
    int victim_id PK
    string victim_name
    int age
    string gender
}

CRIME_INCIDENT {
    int incident_id PK
    string crime_type
    date incident_date
    string status
}

REPEAT_OFFENDER {
    int offender_id PK
    int crime_count
    string risk_level
}

CRIMINAL_NETWORK {
    int network_id PK
    string relation_type
}

PREDICTION {
    int prediction_id PK
    string prediction
    float confidence_score
}

ALERT {
    int alert_id PK
    string alert_type
    string severity
}

REPORT {
    int report_id PK
    string report_name
    datetime generated_at
}

AUDIT_LOG {
    int log_id PK
    string activity
    datetime timestamp
}

USER ||--o{ UPLOADED_DATASET : uploads

UPLOADED_DATASET ||--o{ CRIME_INCIDENT : contains

DISTRICT ||--o{ CRIME_INCIDENT : has

CRIME_CATEGORY ||--o{ CRIME_INCIDENT : classifies

CRIME_LOCATION ||--o{ CRIME_INCIDENT : occurred_at

CRIMINAL ||--o{ CRIME_INCIDENT : involved_in

VICTIM ||--o{ CRIME_INCIDENT : affected_in

CRIMINAL ||--|| REPEAT_OFFENDER : becomes

CRIMINAL ||--o{ CRIMINAL_NETWORK : connected_to

CRIME_INCIDENT ||--o{ PREDICTION : generates

CRIME_INCIDENT ||--o{ ALERT : triggers

CRIME_INCIDENT ||--o{ REPORT : included_in

USER ||--o{ AUDIT_LOG : performs
```

---

# Relationship Summary

| Parent | Child | Relationship |
|----------|--------|--------------|
| User | UploadedDataset | One-to-Many |
| UploadedDataset | CrimeIncident | One-to-Many |
| District | CrimeIncident | One-to-Many |
| CrimeCategory | CrimeIncident | One-to-Many |
| CrimeLocation | CrimeIncident | One-to-Many |
| Criminal | CrimeIncident | One-to-Many |
| Victim | CrimeIncident | One-to-Many |
| Criminal | RepeatOffender | One-to-One |
| Criminal | CriminalNetwork | One-to-Many |
| CrimeIncident | Prediction | One-to-Many |
| CrimeIncident | Alert | One-to-Many |
| CrimeIncident | Report | One-to-Many |
| User | AuditLog | One-to-Many |

---

# Diagram

![ER Diagram](ERDiagram.svg)

---

# Mermaid Source

(Paste the Mermaid code here.)

---

# Future Improvements

Future versions may include:

- Police Station entity
- Evidence Management
- CCTV Records
- Vehicle Tracking
- FIR Management
- Case Management
- Court Proceedings
- AI Chat History