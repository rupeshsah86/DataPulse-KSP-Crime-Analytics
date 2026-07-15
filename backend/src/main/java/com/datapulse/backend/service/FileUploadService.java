package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import com.datapulse.backend.repository.CrimeIncidentRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * File Upload Service
 *
 * Handles CSV and Excel file uploads for bulk crime data import.
 *
 * Supported Formats:
 * - CSV (Comma Separated Values)
 * - Excel (.xlsx)
 *
 * CSV/Excel Column Mapping (in order):
 * Column 1: crimeNumber (String) - Optional, auto-generated if empty
 * Column 2: title (String) - Required
 * Column 3: description (String) - Optional
 * Column 4: category (String) - Required (e.g., THEFT, MURDER, ROBBERY)
 * Column 5: severity (String) - Required (LOW, MEDIUM, HIGH, CRITICAL)
 * Column 6: status (String) - Required (OPEN, INVESTIGATING, CLOSED, COLD_CASE)
 * Column 7: incidentDate (String) - Required (yyyy-MM-dd)
 * Column 8: incidentTime (String) - Optional (HH:mm:ss)
 * Column 9: latitude (Double) - Optional
 * Column 10: longitude (Double) - Optional
 * Column 11: address (String) - Optional
 * Column 12: district (String) - Required
 * Column 13: city (String) - Optional
 * Column 14: state (String) - Optional
 * Column 15: country (String) - Optional
 * Column 16: reportedBy (String) - Optional
 * Column 17: policeStation (String) - Optional
 */
@Service
public class FileUploadService {

    @Autowired
    private CrimeIncidentRepository crimeIncidentRepository;

    @Autowired
    private CrimeIncidentService crimeIncidentService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * Process uploaded file (CSV or Excel)
     *
     * @param file Uploaded file
     * @return List of saved CrimeIncident objects
     * @throws Exception if file processing fails
     */
    public List<CrimeIncident> processFile(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException("File name is null");
        }

        List<CrimeIncident> crimes = new ArrayList<>();

        // Check file type and process accordingly
        if (fileName.endsWith(".csv")) {
            crimes = processCSV(file);
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            crimes = processExcel(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload CSV or Excel file.");
        }

        // Save all crimes to database
        return crimeIncidentRepository.saveAll(crimes);
    }

    /**
     * Process CSV file
     */
    private List<CrimeIncident> processCSV(MultipartFile file) throws Exception {
        List<CrimeIncident> crimes = new ArrayList<>();

        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(file.getInputStream()))
                .withSkipLines(1) // Skip header row
                .build()) {

            String[] line;
            int rowNumber = 1;

            while ((line = reader.readNext()) != null) {
                rowNumber++;
                try {
                    CrimeIncident crime = parseCrimeFromArray(line);
                    crimes.add(crime);
                } catch (Exception e) {
                    throw new Exception("Error at row " + rowNumber + ": " + e.getMessage());
                }
            }
        }

        return crimes;
    }

    /**
     * Process Excel file (.xlsx)
     */
    private List<CrimeIncident> processExcel(MultipartFile file) throws Exception {
        List<CrimeIncident> crimes = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;

            for (Row row : sheet) {
                rowNumber++;
                // Skip header row
                if (rowNumber == 1) continue;

                try {
                    CrimeIncident crime = parseCrimeFromRow(row);
                    crimes.add(crime);
                } catch (Exception e) {
                    throw new Exception("Error at row " + rowNumber + ": " + e.getMessage());
                }
            }
        }

        return crimes;
    }

    /**
     * Parse crime from CSV row (String array)
     */
    private CrimeIncident parseCrimeFromArray(String[] data) {
        if (data.length < 7) {
            throw new IllegalArgumentException("Insufficient columns. Expected at least 7 columns.");
        }

        // Index mapping for CSV columns
        int idx = 0;
        String crimeNumber = getValue(data, idx++);
        String title = getValue(data, idx++);
        String description = getValue(data, idx++);
        String category = getValue(data, idx++);
        String severityStr = getValue(data, idx++);
        String statusStr = getValue(data, idx++);
        String incidentDateStr = getValue(data, idx++);
        String incidentTimeStr = getValue(data, idx++);
        String latitudeStr = getValue(data, idx++);
        String longitudeStr = getValue(data, idx++);
        String address = getValue(data, idx++);
        String district = getValue(data, idx++);
        String city = getValue(data, idx++);
        String state = getValue(data, idx++);
        String country = getValue(data, idx++);
        String reportedBy = getValue(data, idx++);
        String policeStation = getValue(data, idx);

        return buildCrimeIncident(crimeNumber, title, description, category, severityStr,
                statusStr, incidentDateStr, incidentTimeStr, latitudeStr, longitudeStr,
                address, district, city, state, country, reportedBy, policeStation);
    }

    /**
     * Parse crime from Excel row
     */
    private CrimeIncident parseCrimeFromRow(Row row) {
        int idx = 0;
        String crimeNumber = getCellValue(row, idx++);
        String title = getCellValue(row, idx++);
        String description = getCellValue(row, idx++);
        String category = getCellValue(row, idx++);
        String severityStr = getCellValue(row, idx++);
        String statusStr = getCellValue(row, idx++);
        String incidentDateStr = getCellValue(row, idx++);
        String incidentTimeStr = getCellValue(row, idx++);
        String latitudeStr = getCellValue(row, idx++);
        String longitudeStr = getCellValue(row, idx++);
        String address = getCellValue(row, idx++);
        String district = getCellValue(row, idx++);
        String city = getCellValue(row, idx++);
        String state = getCellValue(row, idx++);
        String country = getCellValue(row, idx++);
        String reportedBy = getCellValue(row, idx++);
        String policeStation = getCellValue(row, idx);

        return buildCrimeIncident(crimeNumber, title, description, category, severityStr,
                statusStr, incidentDateStr, incidentTimeStr, latitudeStr, longitudeStr,
                address, district, city, state, country, reportedBy, policeStation);
    }

    /**
     * Build CrimeIncident from parsed data
     */
    private CrimeIncident buildCrimeIncident(String crimeNumber, String title, String description,
                                             String category, String severityStr, String statusStr, String incidentDateStr,
                                             String incidentTimeStr, String latitudeStr, String longitudeStr, String address,
                                             String district, String city, String state, String country, String reportedBy,
                                             String policeStation) {

        // Validate required fields
        if (title == null || title.isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (category == null || category.isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (severityStr == null || severityStr.isEmpty()) {
            throw new IllegalArgumentException("Severity is required");
        }
        if (statusStr == null || statusStr.isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        if (incidentDateStr == null || incidentDateStr.isEmpty()) {
            throw new IllegalArgumentException("Incident date is required");
        }
        if (district == null || district.isEmpty()) {
            throw new IllegalArgumentException("District is required");
        }

        // Parse severity and status
        Severity severity = Severity.valueOf(severityStr.toUpperCase());
        Status status = Status.valueOf(statusStr.toUpperCase());

        // Parse date
        LocalDate incidentDate = LocalDate.parse(incidentDateStr, DATE_FORMATTER);

        // Parse time (optional)
        LocalTime incidentTime = null;
        if (incidentTimeStr != null && !incidentTimeStr.isEmpty()) {
            incidentTime = LocalTime.parse(incidentTimeStr, TIME_FORMATTER);
        }

        // Parse latitude and longitude (optional)
        Double latitude = null;
        if (latitudeStr != null && !latitudeStr.isEmpty()) {
            latitude = Double.parseDouble(latitudeStr);
        }

        Double longitude = null;
        if (longitudeStr != null && !longitudeStr.isEmpty()) {
            longitude = Double.parseDouble(longitudeStr);
        }

        // Build CrimeIncident object
        return CrimeIncident.builder()
                .crimeNumber(crimeNumber != null && !crimeNumber.isEmpty() ? crimeNumber : null)
                .title(title)
                .description(description)
                .category(category)
                .severity(severity)
                .status(status)
                .incidentDate(incidentDate)
                .incidentTime(incidentTime)
                .latitude(latitude)
                .longitude(longitude)
                .address(address)
                .district(district)
                .city(city)
                .state(state)
                .country(country)
                .reportedBy(reportedBy)
                .policeStation(policeStation)
                .build();
    }

    /**
     * Get value from String array with null check
     */
    private String getValue(String[] data, int index) {
        if (index < data.length) {
            String value = data[index];
            return (value != null && !value.trim().isEmpty()) ? value.trim() : null;
        }
        return null;
    }

    /**
     * Get cell value from Excel row
     */
    private String getCellValue(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) {
            return null;
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }
}