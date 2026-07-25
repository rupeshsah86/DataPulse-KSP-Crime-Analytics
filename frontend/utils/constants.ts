// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

// App Configuration
export const APP_NAME = "DataPulse";
export const APP_DESCRIPTION = "AI-Driven Crime Analytics Platform";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// Date Format
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

// Status Options
export const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "CLOSED", label: "Closed" },
  { value: "COLD_CASE", label: "Cold Case" },
] as const;

// Severity Options
export const SEVERITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
] as const;

// Crime Categories
export const CRIME_CATEGORIES = [
  "THEFT",
  "ROBBERY",
  "MURDER",
  "ASSAULT",
  "BURGLARY",
  "CYBER_CRIME",
  "FRAUD",
  "DRUG_OFFENSE",
  "RAPE",
  "KIDNAPPING",
  "VEHICLE_THEFT",
  "EXTORTION",
  "DOMESTIC_VIOLENCE",
  "HATE_CRIME",
  "TERRORISM",
];
