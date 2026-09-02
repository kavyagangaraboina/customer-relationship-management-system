package com.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
        System.out.println("\n-------------------------------------------------------------");
        System.out.println("🚀 CRM System Spring Boot Server Started Successfully!");
        System.out.println("🌐 Open UI in Browser: http://localhost:8080");
        System.out.println("🗄️ H2 Console (if enabled): http://localhost:8080/h2-console");
        System.out.println("-------------------------------------------------------------\n");
    }
}
