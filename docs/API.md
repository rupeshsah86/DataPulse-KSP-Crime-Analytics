# API Documentation

# Base URL

/api/v1

---

# Authentication APIs

## Login

POST

/auth/login

Request

- Email
- Password

Response

- JWT Token
- User Information

---

## Register User

POST

/auth/register

---

## Logout

POST

/auth/logout

---

# Dashboard APIs

## Get Dashboard Summary

GET

/dashboard

---

## District Statistics

GET

/dashboard/districts

---

## Crime Trends

GET

/dashboard/trends

---

## Crime Categories

GET

/dashboard/categories

---

# Crime APIs

## Upload Crime Dataset

POST

/crimes/upload

---

## Get All Crimes

GET

/crimes

---

## Search Crime

GET

/crimes/search

---

## Filter Crimes

GET

/crimes/filter

---

## Crime Details

GET

/crimes/{id}

---

# Criminal APIs

## Get Criminal

GET

/criminals/{id}

---

## Repeat Offenders

GET

/criminals/repeat

---

## Criminal Network

GET

/criminals/network

---

# AI APIs

## Predict Crime

POST

/ai/predict

---

## Detect Hotspots

GET

/ai/hotspots

---

## Detect Anomalies

GET

/ai/anomalies

---

## Risk Score

GET

/ai/risk-score

---

# Reports APIs

## Generate PDF

POST

/reports/pdf

---

## Download Report

GET

/reports/{id}

---

# Alerts APIs

## Get Alerts

GET

/alerts

---

## Mark Alert Read

PUT

/alerts/{id}

---

# User APIs

## Get Profile

GET

/users/profile

---

## Update Profile

PUT

/users/profile

---

# Admin APIs

## Create User

POST

/admin/users

---

## Delete User

DELETE

/admin/users/{id}

---

## System Statistics

GET

/admin/statistics

---

# API Response Format

Success

```json
{
  "success": true,
  "message": "Request Successful",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# Authentication

Every protected API requires

Authorization: Bearer <JWT_TOKEN>

---

# API Documentation Tool

Swagger UI

/OpenAPI