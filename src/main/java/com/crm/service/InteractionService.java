package com.crm.service;

import com.crm.dto.InteractionDto;
import com.crm.entity.Customer;
import com.crm.entity.Interaction;
import com.crm.repository.CustomerRepository;
import com.crm.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public InteractionService(InteractionRepository interactionRepository, CustomerRepository customerRepository) {
        this.interactionRepository = interactionRepository;
        this.customerRepository = customerRepository;
    }

    public List<InteractionDto> getInteractionsByCustomerId(Long customerId) {
        return interactionRepository.findByCustomerIdOrderByInteractionDateDesc(customerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<InteractionDto> createInteraction(InteractionDto dto) {
        Optional<Customer> customerOpt = customerRepository.findById(dto.getCustomerId());
        if (customerOpt.isEmpty()) {
            return Optional.empty();
        }

        Customer customer = customerOpt.get();
        LocalDateTime interactionDate = dto.getInteractionDate() != null ? dto.getInteractionDate() : LocalDateTime.now();

        Interaction interaction = new Interaction(
                customer,
                dto.getType().toUpperCase(),
                interactionDate,
                dto.getNotes()
        );

        Interaction saved = interactionRepository.save(interaction);
        return Optional.of(convertToDto(saved));
    }

    public boolean deleteInteraction(Long id) {
        if (interactionRepository.existsById(id)) {
            interactionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private InteractionDto convertToDto(Interaction interaction) {
        InteractionDto dto = new InteractionDto();
        dto.setId(interaction.getId());
        dto.setCustomerId(interaction.getCustomer().getId());
        dto.setCustomerName(interaction.getCustomer().getName());
        dto.setType(interaction.getType());
        dto.setInteractionDate(interaction.getInteractionDate());
        dto.setNotes(interaction.getNotes());
        dto.setCreatedAt(interaction.getCreatedAt());
        return dto;
    }
}
