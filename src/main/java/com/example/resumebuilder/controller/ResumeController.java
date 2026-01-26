package com.example.resumebuilder.controller;

import com.example.resumebuilder.model.ResumeRequest;
import com.example.resumebuilder.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/generate")
@CrossOrigin(origins = "*") // Allow requests from any frontend
public class ResumeController {

    private final PdfService pdfService;

    public ResumeController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping
    public ResponseEntity<byte[]> generateResume(@RequestBody ResumeRequest request) {
        // Generate the PDF bytes
        byte[] pdfBytes = pdfService.generateResumePdf(request);

        // Return as a downloadable file
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}