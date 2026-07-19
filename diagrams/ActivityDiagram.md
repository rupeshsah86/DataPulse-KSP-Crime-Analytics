# Activity Diagram

## Overview

The Activity Diagram describes the workflow of the DataPulse platform from user authentication to crime analysis and report generation.

It illustrates how crime data moves through different modules of the system until meaningful insights are presented to the user.

---

## Purpose

The Activity Diagram helps developers understand:

- System workflow
- Decision points
- Processing sequence
- AI execution flow
- Report generation process

---

## Workflow

```mermaid
flowchart TD

    A([Start])

    B[Open DataPulse]

    C[Login]

    D{Credentials Valid?}

    E[Display Login Error]

    F[Load Dashboard]

    G{Select Module}

    H[Upload Crime Dataset]

    I[Validate Dataset]

    J{Dataset Valid?}

    K[Display Validation Errors]

    L[Store Data in PostgreSQL]

    M[Run Data Preprocessing]

    N[Run AI Analytics]

    O[Crime Pattern Detection]

    P[Crime Hotspot Detection]

    Q[Repeat Offender Analysis]

    R[Criminal Network Analysis]

    S[Generate Predictions]

    T[Generate Dashboard]

    U[Generate Reports]

    V[Download PDF/CSV]

    W[Logout]

    X([End])

    A --> B
    B --> C
    C --> D

    D -- No --> E
    E --> C

    D -- Yes --> F

    F --> G

    G --> H

    H --> I

    I --> J

    J -- No --> K
    K --> H

    J -- Yes --> L

    L --> M

    M --> N

    N --> O

    O --> P

    P --> Q

    Q --> R

    R --> S

    S --> T

    T --> U

    U --> V

    V --> W

    W --> X
```

---

# Explanation

## Login

The user authenticates using secure credentials.

---

## Dataset Upload

Crime records are uploaded in CSV or Excel format.

---

## Validation

The uploaded dataset is checked for:

- Missing values
- Duplicate records
- Invalid crime categories
- Invalid district names

---

## Data Storage

Validated data is stored inside PostgreSQL.

---

## AI Processing

The AI engine performs:

- Crime Trend Analysis
- Crime Pattern Detection
- Repeat Offender Identification
- Hotspot Detection
- Criminal Relationship Analysis
- Risk Prediction

---

## Dashboard

The processed insights are displayed through:

- KPI Cards
- Charts
- Maps
- Heatmaps
- Network Graphs

---

## Report Generation

Users can export:

- PDF Reports
- CSV Reports

---

## Logout

The session is terminated securely.

---

# Diagram

![Activity Diagram](ActivityDiagram.svg)

---

# Mermaid Source

(Paste the Mermaid code here.)

---

# Future Enhancements

Future workflow improvements may include:

- Live Crime Streaming
- AI Chatbot Interaction
- Voice Commands
- Automatic Alert Notifications
- Real-Time CCTV Analysis