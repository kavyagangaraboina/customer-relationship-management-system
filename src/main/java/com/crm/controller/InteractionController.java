package com.crm.controller;

import com.crm.dto.InteractionDto;
import com.crm.service.InteractionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class InteractionController {

    private final InteractionService interactionService;

    @Autowired
    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    @GetMapping("/api/customers/{customerId}/interactions")
    public ResponseEntity<List<InteractionDto>> getInteractionsByCustomer(@PathVariable Long customerId) {
        List<InteractionDto> interactions = interactionService.getInteractionsByCustomerId(customerId);
        return ResponseEntity.ok(interactions);
    }

    @PostMapping("/api/customers/{customerId}/interactions")
    public ResponseEntity<InteractionDto> createInteraction(@PathVariable Long customerId, @Valid @RequestBody InteractionDto dto) {
        dto.setCustomerId(customerId);
        return interactionService.createInteraction(dto)
                .map(interaction -> ResponseEntity.status(HttpStatus.CREATED).body(interaction))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/api/interactions/{id}")
    public ResponseEntity<Void> deleteInteraction(@PathVariable Long id) {
        if (interactionService.deleteInteraction(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
