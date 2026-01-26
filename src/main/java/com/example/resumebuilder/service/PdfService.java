package com.example.resumebuilder.service;

import com.example.resumebuilder.model.ResumeRequest;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateResumePdf(ResumeRequest resumeData) {
        try {
            // 1. Create a Thymeleaf Context and add data
            Context context = new Context();
            context.setVariable("resume", resumeData);

            // 2. Generate HTML string from the template ("resume_template.html")
            String htmlContent = templateEngine.process("resume_template", context);

            // 3. Convert HTML to PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}