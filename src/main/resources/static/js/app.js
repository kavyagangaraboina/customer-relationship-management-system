// Main Application Logic for CRM Dashboard & Customer Management

let currentView = 'dashboard'; // 'dashboard' or 'customers'
let activeCustomerId = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initSearch();
});

// Navigation Switcher
function initNavigation() {
    const navDashboard = document.getElementById('navDashboard');
    const navCustomers = document.getElementById('navCustomers');
    const viewDashboard = document.getElementById('viewDashboard');
    const viewCustomers = document.getElementById('viewCustomers');

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navDashboard, navCustomers);
        viewDashboard.classList.remove('hidden');
        viewCustomers.classList.add('hidden');
        currentView = 'dashboard';
        loadDashboardData();
    });

    navCustomers.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navCustomers, navDashboard);
        viewDashboard.classList.add('hidden');
        viewCustomers.classList.remove('hidden');
        currentView = 'customers';
        loadCustomersData();
    });

    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
}

function setActiveNav(active, inactive) {
    active.classList.add('active');
    inactive.classList.remove('active');
}

// -----------------------------------------------------------------
// 1. DASHBOARD METRICS & RECENT ACTIVITIES
// -----------------------------------------------------------------
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) return;

        const data = await response.json();

        // Update Stat Cards
        document.getElementById('statTotalCustomers').textContent = data.totalCustomers;
        document.getElementById('statTotalInteractions').textContent = data.totalInteractions;

        // Render Recent Customers Table
        const recentCustBody = document.getElementById('recentCustomersTable');
        recentCustBody.innerHTML = '';

        if (!data.recentCustomers || data.recentCustomers.length === 0) {
            recentCustBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No customers added yet.</td></tr>`;
        } else {
            data.recentCustomers.forEach(cust => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(cust.name)}</strong></td>
                    <td>${escapeHtml(cust.email)}</td>
                    <td>${escapeHtml(cust.company || 'N/A')}</td>
                    <td><button class="btn-sm view" onclick="openCustomerProfile(${cust.id})">View</button></td>
                `;
                recentCustBody.appendChild(tr);
            });
        }

        // Render Recent Activity Feed
        const timelineFeed = document.getElementById('recentActivityFeed');
        timelineFeed.innerHTML = '';

        if (!data.recentInteractions || data.recentInteractions.length === 0) {
            timelineFeed.innerHTML = `<div style="text-align:center; color: var(--text-muted);">No recent activity logged.</div>`;
        } else {
            data.recentInteractions.forEach(item => {
                const dateStr = formatDate(item.interactionDate);
                const badgeClass = item.type.toLowerCase();
                
                const div = document.createElement('div');
                div.className = 'timeline-item';
                div.innerHTML = `
                    <div class="timeline-date">${dateStr}</div>
                    <div class="timeline-title">
                        <span class="badge ${badgeClass}">${item.type}</span> 
                        <strong>${escapeHtml(item.customerName)}</strong>
                    </div>
                    <div class="timeline-notes">${escapeHtml(item.notes)}</div>
                `;
                timelineFeed.appendChild(div);
            });
        }
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
    }
}
window.loadDashboardData = loadDashboardData;

// -----------------------------------------------------------------
// 2. CUSTOMERS DATA & LIVE SEARCH
// -----------------------------------------------------------------
async function loadCustomersData(searchQuery = '') {
    try {
        let url = '/api/customers';
        if (searchQuery) {
            url += `?query=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        if (!response.ok) return;

        const customers = await response.json();
        renderCustomersTable(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
    }
}

function renderCustomersTable(customers) {
    const tbody = document.getElementById('allCustomersTable');
    tbody.innerHTML = '';

    if (!customers || customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 32px;">No matching customers found.</td></tr>`;
        return;
    }

    customers.forEach(cust => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div><strong>${escapeHtml(cust.name)}</strong></div>
                <div style="font-size:12px; color: var(--text-muted);">${escapeHtml(cust.company || 'Individual')}</div>
            </td>
            <td>${escapeHtml(cust.email)}</td>
            <td>${escapeHtml(cust.phone || 'N/A')}</td>
            <td><span class="badge call">${cust.interactionCount || 0} Logs</span></td>
            <td>${formatDate(cust.createdAt)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-sm view" onclick="openCustomerProfile(${cust.id})">Profile</button>
                    <button class="btn-sm edit" onclick="openEditCustomerModal(${cust.id})">Edit</button>
                    <button class="btn-sm delete" onclick="confirmDeleteCustomer(${cust.id}, '${escapeJs(cust.name)}')">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function initSearch() {
    const searchInput = document.getElementById('customerSearchInput');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadCustomersData(e.target.value);
        }, 300);
    });
}

// -----------------------------------------------------------------
// 3. CUSTOMER MODAL & CRUD ACTIONS
// -----------------------------------------------------------------
function initModals() {
    // Open Add Customer Modal
    document.getElementById('btnAddCustomer').addEventListener('click', () => {
        document.getElementById('customerFormTitle').textContent = 'Add New Customer';
        document.getElementById('customerForm').reset();
        document.getElementById('customerId').value = '';
        openModal('customerModal');
    });

    // Save Customer Form Submission
    document.getElementById('customerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('customerId').value;
        const customerData = {
            name: document.getElementById('custName').value.trim(),
            email: document.getElementById('custEmail').value.trim(),
            phone: document.getElementById('custPhone').value.trim(),
            company: document.getElementById('custCompany').value.trim(),
            address: document.getElementById('custAddress').value.trim(),
            requirements: document.getElementById('custRequirements').value.trim()
        };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/customers/${id}` : '/api/customers';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });

            if (response.ok) {
                showToast(id ? 'Customer updated successfully!' : 'New customer added successfully!', 'success');
                closeModal('customerModal');
                if (currentView === 'customers') loadCustomersData();
                else loadDashboardData();
            } else {
                showToast('Failed to save customer record.', 'danger');
            }
        } catch (err) {
            console.error(err);
            showToast('Server error while saving customer.', 'danger');
        }
    });

    // Save Interaction Form Submission
    document.getElementById('interactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!activeCustomerId) return;

        const interactionData = {
            customerId: activeCustomerId,
            type: document.getElementById('intType').value,
            notes: document.getElementById('intNotes').value.trim()
        };

        try {
            const response = await fetch(`/api/customers/${activeCustomerId}/interactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(interactionData)
            });

            if (response.ok) {
                showToast('Interaction logged successfully!', 'success');
                document.getElementById('interactionForm').reset();
                loadCustomerProfileData(activeCustomerId);
            } else {
                showToast('Failed to record interaction.', 'danger');
            }
        } catch (err) {
            console.error(err);
            showToast('Server error while saving interaction.', 'danger');
        }
    });
}

async function openEditCustomerModal(id) {
    try {
        const response = await fetch(`/api/customers/${id}`);
        if (!response.ok) return;

        const cust = await response.json();
        document.getElementById('customerFormTitle').textContent = 'Edit Customer Profile';
        document.getElementById('customerId').value = cust.id;
        document.getElementById('custName').value = cust.name || '';
        document.getElementById('custEmail').value = cust.email || '';
        document.getElementById('custPhone').value = cust.phone || '';
        document.getElementById('custCompany').value = cust.company || '';
        document.getElementById('custAddress').value = cust.address || '';
        document.getElementById('custRequirements').value = cust.requirements || '';

        openModal('customerModal');
    } catch (err) {
        console.error(err);
        showToast('Error loading customer details', 'danger');
    }
}

async function confirmDeleteCustomer(id, name) {
    if (confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
        try {
            const response = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showToast('Customer record deleted.', 'success');
                if (currentView === 'customers') loadCustomersData();
                else loadDashboardData();
            } else {
                showToast('Failed to delete customer.', 'danger');
            }
        } catch (err) {
            console.error(err);
            showToast('Server error during deletion.', 'danger');
        }
    }
}

// -----------------------------------------------------------------
// 4. CUSTOMER PROFILE & INTERACTION TIMELINE MODAL
// -----------------------------------------------------------------
async function openCustomerProfile(id) {
    activeCustomerId = id;
    await loadCustomerProfileData(id);
    openModal('profileModal');
}

async function loadCustomerProfileData(id) {
    try {
        const custResp = await fetch(`/api/customers/${id}`);
        if (!custResp.ok) return;
        const cust = await custResp.json();

        // Populate Profile UI
        document.getElementById('profileName').textContent = cust.name;
        document.getElementById('profileEmail').textContent = cust.email;
        document.getElementById('profilePhone').textContent = cust.phone || 'Not specified';
        document.getElementById('profileCompany').textContent = cust.company || 'Not specified';
        document.getElementById('profileAddress').textContent = cust.address || 'No address logged';
        document.getElementById('profileRequirements').textContent = cust.requirements || 'No custom requirements logged.';

        // Load Customer Interactions
        const intResp = await fetch(`/api/customers/${id}/interactions`);
        const interactions = intResp.ok ? await intResp.json() : [];

        const timeline = document.getElementById('profileInteractionTimeline');
        timeline.innerHTML = '';

        if (interactions.length === 0) {
            timeline.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No interaction history logged yet. Use the form above to add a call, email, or meeting log!</div>`;
        } else {
            interactions.forEach(item => {
                const badgeClass = item.type.toLowerCase();
                const div = document.createElement('div');
                div.className = 'timeline-item';
                div.innerHTML = `
                    <div class="timeline-date">${formatDate(item.interactionDate)}</div>
                    <div class="timeline-title">
                        <span class="badge ${badgeClass}">${item.type}</span>
                    </div>
                    <div class="timeline-notes">${escapeHtml(item.notes)}</div>
                `;
                timeline.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
        showToast('Failed to load profile details', 'danger');
    }
}

// -----------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

function escapeJs(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'");
}
