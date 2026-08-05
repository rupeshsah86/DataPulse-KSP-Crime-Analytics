package com.datapulse.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send a simple email alert
     */
    public void sendAlertEmail(String to, String subject, String body) {
        System.out.println("📧 Attempting to send email asynchronously to: " + to);
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("rupeshkumarsah.2024cse@sece.ac.in");

                mailSender.send(message);
                System.out.println("✅ Email sent successfully to: " + to);
            } catch (Exception e) {
                System.err.println("⚠️ Non-critical email send note: " + e.getMessage());
            }
        });
    }

    /**
     * Send a critical crime alert
     */
    public void sendCriticalCrimeAlert(String title, String category, String district, String status) {
        System.out.println("📧 sendCriticalCrimeAlert called!");
        String to = "rupeshkumarsah.2024cse@sece.ac.in";
        String subject = "🚨 CRITICAL ALERT: " + title;
        String body = """
                ╔══════════════════════════════════════════════════╗
                ║          🚨 CRITICAL CRIME ALERT 🚨             ║
                ╠══════════════════════════════════════════════════╣
                ║                                                 ║
                ║  Title:    %s
                ║  Category: %s
                ║  District: %s
                ║  Status:   %s
                ║                                                 ║
                ║  ⚠️  This crime requires immediate attention!   ║
                ║                                                 ║
                ║  DataPulse - AI-Driven Crime Analytics         ║
                ╚══════════════════════════════════════════════════╝
                """.formatted(title, category, district, status);

        sendAlertEmail(to, subject, body);
    }

    /**
     * Send a welcome email to new users
     */
    public void sendWelcomeEmail(String to, String fullName, String role) {
        System.out.println("📧 sendWelcomeEmail called for: " + to);
        String subject = "Welcome to DataPulse! 🚀";
        String body = """
                ╔══════════════════════════════════════════════════╗
                ║          Welcome to DataPulse! 🚀               ║
                ╠══════════════════════════════════════════════════╣
                ║                                                 ║
                ║  Hello %s,                                      ║
                ║                                                 ║
                ║  Welcome to DataPulse - AI-Driven Crime         ║
                ║  Analytics Platform!                            ║
                ║                                                 ║
                ║  Your Role: %s                                  ║
                ║                                                 ║
                ║  You can now:                                   ║
                ║  ✅ View crime analytics                        ║
                ║  ✅ Upload crime data                           ║
                ║  ✅ Generate reports                            ║
                ║  ✅ Track crime patterns                        ║
                ║                                                 ║
                ║  🔐 Login: http://localhost:3000/login         ║
                ║                                                 ║
                ║  DataPulse - Making Communities Safer          ║
                ╚══════════════════════════════════════════════════╝
                """.formatted(fullName, role);

        sendAlertEmail(to, subject, body);
    }
}