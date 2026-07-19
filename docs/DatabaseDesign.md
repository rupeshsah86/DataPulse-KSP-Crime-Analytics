# Database Design

# Database

PostgreSQL

---

# Database Overview

The application stores crime-related information, users, predictions, reports, and alerts inside PostgreSQL.

The database is normalized to reduce redundancy and improve performance.

---

# Main Tables

## Users

Purpose

Stores all users.

Columns

- id
- full_name
- email
- password
- role
- created_at

---

## Districts

Purpose

Stores district information.

Columns

- id
- district_name
- state

---

## CrimeCategories

Columns

- id
- category_name

Examples

- Theft
- Murder
- Robbery
- Cyber Crime

---

## CrimeIncidents

Columns

- id
- title
- description
- district_id
- category_id
- latitude
- longitude
- date
- status

---

## Criminals

Columns

- id
- name
- gender
- age
- district_id
- risk_score

---

## RepeatOffenders

Columns

- id
- criminal_id
- crime_count

---

## NetworkConnections

Columns

- id
- criminal1
- criminal2
- relation_type

---

## Alerts

Columns

- id
- title
- severity
- created_at

---

## Predictions

Columns

- id
- district
- predicted_crime
- confidence
- prediction_date

---

## Reports

Columns

- id
- generated_by
- report_type
- created_at

---

# Relationships

District

↓

CrimeIncidents

CrimeCategory

↓

CrimeIncidents

CrimeIncidents

↓

Criminal

Criminal

↓

RepeatOffender

Criminal

↓

NetworkConnections

User

↓

Reports

---

# Future Tables

- CCTV
- FIR
- Vehicles
- Weapons
- Police Stations

---

# Indexing

Indexes

- Crime Date
- District
- Crime Category
- Criminal Name

---

# Advantages

- Fast Searching
- Easy Expansion
- Supports AI Models
- Clean Normalized Structure