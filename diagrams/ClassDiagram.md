# Class Diagram

## Overview

The Class Diagram represents the object-oriented structure of the DataPulse platform.

It defines the major classes, their attributes, methods, and relationships. These classes will later be implemented as Java entity classes in the Spring Boot backend.

---

# Purpose

The Class Diagram helps developers:

- Understand the software structure
- Define object relationships
- Design Java entity classes
- Plan backend implementation
- Maintain modular architecture

---

# Mermaid Diagram

```mermaid
classDiagram

class User{
+Long userId
+String fullName
+String email
+String password
+String role
+login()
+logout()
+changePassword()
}

class UploadedDataset{
+Long datasetId
+String fileName
+String fileType
+Date uploadedAt
+upload()
+validate()
}

class CrimeIncident{
+Long incidentId
+String crimeType
+Date incidentDate
+String status
+save()
+update()
+delete()
}

class Criminal{
+Long criminalId
+String name
+Integer age
+String gender
+Double riskScore
+calculateRisk()
}

class Victim{
+Long victimId
+String name
+Integer age
+String gender
}

class District{
+Long districtId
+String districtName
}

class CrimeCategory{
+Long categoryId
+String categoryName
}

class CrimeLocation{
+Long locationId
+String address
+Double latitude
+Double longitude
}

class Prediction{
+Long predictionId
+String prediction
+Double confidence
+generatePrediction()
}

class Alert{
+Long alertId
+String alertType
+String severity
+sendAlert()
}

class Report{
+Long reportId
+String reportName
+Date generatedAt
+generatePDF()
+exportCSV()
}

class CriminalNetwork{
+Long networkId
+String relationType
+buildGraph()
}

class AuditLog{
+Long logId
+String activity
+Date timestamp
+saveLog()
}

User "1" --> "*" UploadedDataset

UploadedDataset "1" --> "*" CrimeIncident

CrimeIncident "*" --> "1" District

CrimeIncident "*" --> "1" CrimeCategory

CrimeIncident "*" --> "1" CrimeLocation

CrimeIncident "*" --> "1" Criminal

CrimeIncident "*" --> "1" Victim

CrimeIncident "1" --> "*" Prediction

CrimeIncident "1" --> "*" Alert

CrimeIncident "1" --> "*" Report

Criminal "1" --> "*" CriminalNetwork

User "1" --> "*" AuditLog
```

---

# Class Responsibilities

## User

Responsible for authentication and authorization.

---

## UploadedDataset

Handles CSV and Excel uploads.

---

## CrimeIncident

Stores all crime records.

---

## Criminal

Stores criminal information and risk score.

---

## Victim

Stores victim information.

---

## District

Stores district details.

---

## CrimeCategory

Stores crime category information.

---

## CrimeLocation

Stores geospatial coordinates.

---

## Prediction

Stores AI-generated predictions.

---

## Alert

Stores system-generated alerts.

---

## Report

Handles report generation.

---

## CriminalNetwork

Stores criminal relationship information.

---

## AuditLog

Stores system activity logs.

---

# Diagram

![Class Diagram](ClassDiagram.svg)

---

# Mermaid Source

(Paste Mermaid code here.)

---

# Future Enhancements

Future classes may include:

- PoliceStation
- FIR
- Evidence
- Vehicle
- CCTVRecord
- AIChat
- Notification
- CaseManagement