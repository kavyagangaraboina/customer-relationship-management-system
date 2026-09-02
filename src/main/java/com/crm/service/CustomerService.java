package com.crm.service;

import com.crm.dto.CustomerDto;
import com.crm.entity.Customer;
import com.crm.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerDto> getAllCustomers(String query) {
        List<Customer> customers;
        if (query != null && !query.trim().isEmpty()) {
            customers = customerRepository.searchCustomers(query.trim());
        } else {
            customers = customerRepository.findAll();
        }
        return customers.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public Optional<CustomerDto> getCustomerById(Long id) {
        return customerRepository.findById(id).map(this::convertToDto);
    }

    public CustomerDto createCustomer(CustomerDto dto) {
        Customer customer = convertToEntity(dto);
        Customer saved = customerRepository.save(customer);
        return convertToDto(saved);
    }

    public Optional<CustomerDto> updateCustomer(Long id, CustomerDto dto) {
        return customerRepository.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setEmail(dto.getEmail());
            existing.setPhone(dto.getPhone());
            existing.setCompany(dto.getCompany());
            existing.setAddress(dto.getAddress());
            existing.setRequirements(dto.getRequirements());
            Customer updated = customerRepository.save(existing);
            return convertToDto(updated);
        });
    }

    public boolean deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private CustomerDto convertToDto(Customer customer) {
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
        dto.setInteractionCount(customer.getInteractions() != null ? customer.getInteractions().size() : 0);
        return dto;
    }

    private Customer convertToEntity(CustomerDto dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setCompany(dto.getCompany());
        customer.setAddress(dto.getAddress());
        customer.setRequirements(dto.getRequirements());
        return customer;
    }
}
