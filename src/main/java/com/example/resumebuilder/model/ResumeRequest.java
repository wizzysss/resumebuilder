package com.example.resumebuilder.model;

import lombok.Data;
import java.util.List;

@Data
public class ResumeRequest {
    private String fullName;
    private String email;
    private String phone;
    private String summary;
    private List<Experience> experience;
    private List<Education> education;

    @Data
    public static class Experience {
        private String company;
        private String position;
        private String duration;
        private String description;
    }

    @Data
    public static class Education {
        private String school;
        private String degree;
        private String year;
    }
}