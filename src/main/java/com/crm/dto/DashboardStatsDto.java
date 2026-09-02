package com.crm.dto;

import java.util.List;

public class DashboardStatsDto {
    private long totalCustomers;
    private long totalInteractions;
    private List<CustomerDto> recentCustomers;
    private List<InteractionDto> recentInteractions;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalCustomers, long totalInteractions, List<CustomerDto> recentCustomers, List<InteractionDto> recentInteractions) {
        this.totalCustomers = totalCustomers;
        this.totalInteractions = totalInteractions;
        this.recentCustomers = recentCustomers;
        this.recentInteractions = recentInteractions;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalInteractions() {
        return totalInteractions;
    }

    public void setTotalInteractions(long totalInteractions) {
        this.totalInteractions = totalInteractions;
    }

    public List<CustomerDto> getRecentCustomers() {
        return recentCustomers;
    }

    public void setRecentCustomers(List<CustomerDto> recentCustomers) {
        this.recentCustomers = recentCustomers;
    }

    public List<InteractionDto> getRecentInteractions() {
        return recentInteractions;
    }

    public void setRecentInteractions(List<InteractionDto> recentInteractions) {
        this.recentInteractions = recentInteractions;
    }
}
