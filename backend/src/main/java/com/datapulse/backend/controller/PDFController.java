package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import com.datapulse.backend.service.CrimeIncidentService;
import com.datapulse.backend.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class PDFController {

    @Autowired
    private PDFService pdfService;

    @Autowired
    private CrimeIncidentService crimeService;

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generatePDF() throws Exception {
        List<CrimeIncident> crimes = crimeService.findAllCrimes();
        byte[] pdfBytes = pdfService.generateCrimeReport(crimes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "crime_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/pdf/{id}")
    public ResponseEntity<byte[]> generateSinglePDF(@PathVariable Long id) throws Exception {
        CrimeIncident crime = crimeService.findCrimeById(id)
                .orElseThrow(() -> new RuntimeException("Crime not found with id: " + id));

        byte[] pdfBytes = pdfService.generateSingleCrimeReport(crime);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "crime_report_" + crime.getCrimeNumber() + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/pdf/district/{district}")
    public ResponseEntity<byte[]> generateDistrictPDF(@PathVariable String district) throws Exception {
        List<CrimeIncident> crimes = crimeService.findCrimesByDistrict(district);
        byte[] pdfBytes = pdfService.generateCrimeReport(crimes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "crime_report_" + district + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/pdf/status/{status}")
    public ResponseEntity<byte[]> generateStatusPDF(@PathVariable String status) throws Exception {
        List<CrimeIncident> crimes = crimeService.findCrimesByStatus(Status.valueOf(status));
        byte[] pdfBytes = pdfService.generateCrimeReport(crimes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "crime_report_" + status + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}