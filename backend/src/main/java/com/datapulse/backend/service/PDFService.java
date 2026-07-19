package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * PDF Service
 *
 * Handles PDF report generation for crime data.
 *
 * Features:
 * - Generate crime reports in PDF format
 * - Professional formatting with headers and footers
 * - Includes all crime details in a table
 * - Date and time stamp
 *
 * Professional Note: PDF reports are essential for
 * police documentation and court submissions.
 */
@Service
public class PDFService {

    // Colors
    private static final Color HEADER_COLOR = new DeviceRgb(26, 82, 118);  // Primary Blue
    private static final Color TABLE_HEADER_COLOR = new DeviceRgb(41, 128, 185);  // Light Blue
    private static final Color TABLE_ALTERNATE_COLOR = new DeviceRgb(240, 245, 250);  // Light Gray

    /**
     * Generate a PDF report for a list of crimes
     *
     * @param crimes List of crime incidents
     * @return byte array of PDF content
     */
    public byte[] generateCrimeReport(List<CrimeIncident> crimes) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // ============================================
        // HEADER
        // ============================================
        // Title
        Paragraph title = new Paragraph("DataPulse - Crime Report")
                .setFontSize(18)
                .setBold()
                .setFontColor(HEADER_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);

        // Subtitle
        Paragraph subtitle = new Paragraph("AI-Driven Crime Analytics Platform")
                .setFontSize(10)
                .setFontColor(HEADER_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(subtitle);

        // Spacer
        document.add(new Paragraph(" "));

        // Date and time
        String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss"));
        Paragraph dateParagraph = new Paragraph("Generated on: " + dateTime)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT);
        document.add(dateParagraph);

        // Spacer
        document.add(new Paragraph(" "));

        // ============================================
        // SUMMARY STATISTICS
        // ============================================
        Paragraph summaryTitle = new Paragraph("Summary Statistics")
                .setFontSize(14)
                .setBold()
                .setFontColor(HEADER_COLOR);
        document.add(summaryTitle);

        long total = crimes.size();
        long critical = crimes.stream().filter(c -> c.getSeverity().name().equals("CRITICAL")).count();
        long high = crimes.stream().filter(c -> c.getSeverity().name().equals("HIGH")).count();
        long open = crimes.stream().filter(c -> c.getStatus().name().equals("OPEN")).count();
        long closed = crimes.stream().filter(c -> c.getStatus().name().equals("CLOSED")).count();

        String summary = "Total Crimes: " + total +
                " | Critical: " + critical +
                " | High: " + high +
                " | Open: " + open +
                " | Closed: " + closed;

        document.add(new Paragraph(summary).setFontSize(10));

        // Spacer
        document.add(new Paragraph(" "));

        // ============================================
        // TABLE
        // ============================================
        // Create table with 6 columns
        Table table = new Table(UnitValue.createPercentArray(new float[]{5, 20, 15, 15, 10, 10}))
                .setWidth(UnitValue.createPercentValue(100));

        // Table header
        String[] headers = {"ID", "Title", "Category", "District", "Status", "Severity"};
        for (String header : headers) {
            Cell cell = new Cell()
                    .add(new Paragraph(header).setBold().setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE))
                    .setBackgroundColor(TABLE_HEADER_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(5);
            table.addCell(cell);
        }

        // Table rows
        int rowNum = 0;
        for (CrimeIncident crime : crimes) {
            rowNum++;
            // Alternate row colors
            Color rowColor = (rowNum % 2 == 0) ? TABLE_ALTERNATE_COLOR : com.itextpdf.kernel.colors.ColorConstants.WHITE;

            table.addCell(createCell(String.valueOf(crime.getId()), rowColor));
            table.addCell(createCell(crime.getTitle(), rowColor));
            table.addCell(createCell(crime.getCategory(), rowColor));
            table.addCell(createCell(crime.getDistrict(), rowColor));
            table.addCell(createCell(crime.getStatus().name(), rowColor));
            table.addCell(createCell(crime.getSeverity().name(), rowColor));
        }

        document.add(table);

        // ============================================
        // FOOTER
        // ============================================
        document.add(new Paragraph(" "));
        Paragraph footer = new Paragraph("This is a system-generated report from DataPulse.")
                .setFontSize(8)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(footer);

        document.close();
        return baos.toByteArray();
    }

    /**
     * Create a table cell with text and background color
     */
    private Cell createCell(String text, Color backgroundColor) {
        return new Cell()
                .add(new Paragraph(text != null ? text : "N/A"))
                .setBackgroundColor(backgroundColor)
                .setPadding(5)
                .setTextAlignment(TextAlignment.LEFT);
    }

    /**
     * Generate PDF for a single crime
     */
    public byte[] generateSingleCrimeReport(CrimeIncident crime) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title
        Paragraph title = new Paragraph("DataPulse - Crime Report")
                .setFontSize(18)
                .setBold()
                .setFontColor(HEADER_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);

        document.add(new Paragraph(" "));

        // Crime details
        document.add(new Paragraph("Crime Details").setFontSize(14).setBold());
        document.add(new Paragraph("ID: " + crime.getId()));
        document.add(new Paragraph("Crime Number: " + crime.getCrimeNumber()));
        document.add(new Paragraph("Title: " + crime.getTitle()));
        document.add(new Paragraph("Description: " + (crime.getDescription() != null ? crime.getDescription() : "N/A")));
        document.add(new Paragraph("Category: " + crime.getCategory()));
        document.add(new Paragraph("District: " + crime.getDistrict()));
        document.add(new Paragraph("City: " + (crime.getCity() != null ? crime.getCity() : "N/A")));
        document.add(new Paragraph("State: " + (crime.getState() != null ? crime.getState() : "N/A")));
        document.add(new Paragraph("Status: " + crime.getStatus().name()));
        document.add(new Paragraph("Severity: " + crime.getSeverity().name()));
        document.add(new Paragraph("Incident Date: " + crime.getIncidentDate()));
        document.add(new Paragraph("Reported By: " + (crime.getReportedBy() != null ? crime.getReportedBy() : "N/A")));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss")))
                .setFontSize(8)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.GRAY));

        document.close();
        return baos.toByteArray();
    }
}