package com.datapulse.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {

    @Autowired
    private RestTemplate restTemplate;

    private final String AI_OCR_URL = "http://localhost:8000/api/ocr/extract";

    @PostMapping("/extract")
    public ResponseEntity<Map<String, Object>> extractDocumentData(@RequestParam("file") MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(AI_OCR_URL, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("data", response.getBody());
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Document OCR proxy error: " + e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("success", false);
        fallback.put("message", "Document OCR extraction service unavailable");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallback);
    }
}
