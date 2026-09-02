package com.crm.service;

import com.crm.dto.CustomerDto;
import com.crm.dto.DashboardStatsDto;
import com.crm.dto.InteractionDto;
import com.crm.entity.Customer;
import com.crm.entity.Interaction;
import com.crm.repository.CustomerRepository;
import com.crm.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final InteractionRepository interactionRepository;

    @Autowired
    public DashboardService(CustomerRepository customerRepository, InteractionRepository interactionRepository) {
        this.customerRepository = customerRepository;
        this.interactionRepository = interactionRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        long totalCustomers = customerRepository.count();
        long totalInteractions = interactionRepository.count();

        List<CustomerDto> recentCustomers = customerRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertCustomerToDto)
                .collect(Collectors.toList());

        List<InteractionDto> recentInteractions = interactionRepository.findTop5ByOrderByInteractionDateDesc()
                .stream()
                .map(this::convertInteractionToDto)
                .collect(Collectors.toList());

        return new DashboardStatsDto(totalCustomers, totalInteractions, recentCustomers, recentInteractions);
    }

    private CustomerDto convertCustomerToDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setCompany(customer.getCompany());
        dto.setAddress(customer.getAddress());
        dto.setRequirements(customer.getRequirements());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());
        return dto;
    }

    private InteractionDto convertInteractionToDto(Interaction interaction) {
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
