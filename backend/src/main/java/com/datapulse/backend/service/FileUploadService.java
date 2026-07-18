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

@Service
public class FileUploadService {

    @Autowired
    private CrimeIncidentRepository crimeIncidentRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public List<CrimeIncident> processFile(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            throw new IllegalArgumentException("File name is null");
        }

        List<CrimeIncident> crimes = new ArrayList<>();

        if (fileName.endsWith(".csv")) {
            crimes = processCSV(file);
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            crimes = processExcel(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload CSV or Excel file.");
        }

        return crimeIncidentRepository.saveAll(crimes);
    }

    private List<CrimeIncident> processCSV(MultipartFile file) throws Exception {
        List<CrimeIncident> crimes = new ArrayList<>();

        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(file.getInputStream()))
                .withSkipLines(1)
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

    private List<CrimeIncident> processExcel(MultipartFile file) throws Exception {
        List<CrimeIncident> crimes = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;

            for (Row row : sheet) {
                rowNumber++;
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
     * ✅ FIXED: Parse CSV with flexible columns (7 to 17 supported)
     */
    private CrimeIncident parseCrimeFromArray(String[] data) {
        if (data.length < 7) {
            throw new IllegalArgumentException("Insufficient columns. Expected at least 7 columns.");
        }

        // Safe getter - returns null if index out of bounds
        int idx = 0;
        String crimeNumber = safeGet(data, idx++);
        String title = safeGet(data, idx++);
        String description = safeGet(data, idx++);
        String category = safeGet(data, idx++);
        String severityStr = safeGet(data, idx++);
        String statusStr = safeGet(data, idx++);
        String incidentDateStr = safeGet(data, idx++);
        String incidentTimeStr = safeGet(data, idx++);
        String latitudeStr = safeGet(data, idx++);
        String longitudeStr = safeGet(data, idx++);
        String address = safeGet(data, idx++);
        String district = safeGet(data, idx++);
        String city = safeGet(data, idx++);
        String state = safeGet(data, idx++);
        String country = safeGet(data, idx++);
        String reportedBy = safeGet(data, idx++);
        String policeStation = safeGet(data, idx);

        return buildCrimeIncident(crimeNumber, title, description, category, severityStr,
                statusStr, incidentDateStr, incidentTimeStr, latitudeStr, longitudeStr,
                address, district, city, state, country, reportedBy, policeStation);
    }

    /**
     * ✅ FIXED: Parse Excel with flexible columns (7 to 17 supported)
     */
    private CrimeIncident parseCrimeFromRow(Row row) {
        int idx = 0;
        String crimeNumber = safeGetCell(row, idx++);
        String title = safeGetCell(row, idx++);
        String description = safeGetCell(row, idx++);
        String category = safeGetCell(row, idx++);
        String severityStr = safeGetCell(row, idx++);
        String statusStr = safeGetCell(row, idx++);
        String incidentDateStr = safeGetCell(row, idx++);
        String incidentTimeStr = safeGetCell(row, idx++);
        String latitudeStr = safeGetCell(row, idx++);
        String longitudeStr = safeGetCell(row, idx++);
        String address = safeGetCell(row, idx++);
        String district = safeGetCell(row, idx++);
        String city = safeGetCell(row, idx++);
        String state = safeGetCell(row, idx++);
        String country = safeGetCell(row, idx++);
        String reportedBy = safeGetCell(row, idx++);
        String policeStation = safeGetCell(row, idx);

        return buildCrimeIncident(crimeNumber, title, description, category, severityStr,
                statusStr, incidentDateStr, incidentTimeStr, latitudeStr, longitudeStr,
                address, district, city, state, country, reportedBy, policeStation);
    }

    /**
     * ✅ FIXED: Safe getter for String array
     */
    private String safeGet(String[] data, int index) {
        if (index < data.length) {
            String value = data[index];
            return (value != null && !value.trim().isEmpty()) ? value.trim() : null;
        }
        return null;
    }

    /**
     * ✅ FIXED: Safe getter for Excel cell
     */
    private String safeGetCell(Row row, int index) {
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

    /**
     * ✅ Build CrimeIncident with all fields (null safety)
     */
    private CrimeIncident buildCrimeIncident(String crimeNumber, String title, String description,
                                             String category, String severityStr, String statusStr, String incidentDateStr,
                                             String incidentTimeStr, String latitudeStr, String longitudeStr, String address,
                                             String district, String city, String state, String country, String reportedBy,
                                             String policeStation) {

        // Required fields validation
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

        // Parse enums
        Severity severity = Severity.valueOf(severityStr.toUpperCase());
        Status status = Status.valueOf(statusStr.toUpperCase());

        // Parse date
        LocalDate incidentDate = LocalDate.parse(incidentDateStr, DATE_FORMATTER);

        // Optional fields
        LocalTime incidentTime = null;
        if (incidentTimeStr != null && !incidentTimeStr.isEmpty()) {
            incidentTime = LocalTime.parse(incidentTimeStr, TIME_FORMATTER);
        }

        Double latitude = null;
        if (latitudeStr != null && !latitudeStr.isEmpty()) {
            latitude = Double.parseDouble(latitudeStr);
        }

        Double longitude = null;
        if (longitudeStr != null && !longitudeStr.isEmpty()) {
            longitude = Double.parseDouble(longitudeStr);
        }

        // Build CrimeIncident
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
}