# ⚡ Full-Stack Customer Relationship Management (CRM) System

A beginner-friendly, production-ready **Customer Relationship Management (CRM) System** built with **Java Spring Boot**, **Spring Data JPA**, **MySQL / H2 Database**, and a **Modern Glassmorphic HTML5/CSS3/JavaScript Web Interface**.

---

## 🌟 Key Features

1. **User Authentication**: Secure registration and login using BCrypt password hashing.
2. **Customer Management (CRUD)**:
   - Add new customers with Name, Email, Phone, Company, Address, and Requirements.
   - View detailed customer profiles & requirements.
   - Edit existing customer details.
   - Delete customer records safely.
3. **Customer Interaction Tracker**:
   - Log customer communications: **Calls**, **Emails**, **Meetings**, and **Notes**.
   - Track dates and conversation notes.
4. **Live Search**: Real-time search across Customer Name, Email, and Phone Number.
5. **Interactive Dashboard**:
   - Total Customers count widget.
   - Total Interactions logged counter.
   - Recent Customers table preview.
   - Live Activity Timeline feed.
6. **Dual Database Configuration**:
   - Runs out-of-the-box with embedded **H2 Database** (no setup needed).
   - Pre-configured for **MySQL Database** with 1-step property toggle.

---

## 📂 Complete Project Folder Structure

```
crm-system/
├── pom.xml                                  # Maven project configuration & dependencies
├── schema.sql                               # MySQL database table creation script
├── README.md                                # Beginner step-by-step setup guide
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── crm/
        │           ├── CrmApplication.java  # Spring Boot main entry point
        │           ├── config/
        │           │   └── SecurityConfig.java  # Password encoder & API security rules
        │           ├── controller/
        │           │   ├── AuthController.java        # Login & Register endpoints
        │           │   ├── CustomerController.java    # Customer CRUD endpoints
        │           │   ├── DashboardController.java   # Aggregated analytics endpoint
        │           │   └── InteractionController.java # Communication history endpoints
        │           ├── dto/
        │           │   ├── AuthRequest.java
        │           │   ├── AuthResponse.java
        │           │   ├── CustomerDto.java
        │           │   ├── DashboardStatsDto.java
        │           │   ├── InteractionDto.java
        │           │   └── RegisterRequest.java
        │           ├── entity/
        │           │   ├── Customer.java    # Customer JPA entity mapping
        │           │   ├── Interaction.java # Interaction JPA entity mapping
        │           │   └── User.java        # System Admin/User JPA entity mapping
        │           ├── repository/
        │           │   ├── CustomerRepository.java
        │           │   ├── InteractionRepository.java
        │           │   └── UserRepository.java
        │           └── service/
        │               ├── AuthService.java
        │               ├── CustomerService.java
        │               ├── DashboardService.java
        │               └── InteractionService.java
        └── resources/
            ├── application.properties       # Database & server configuration
            ├── schema.sql                   # Hibernate/Spring schema reference
            ├── data.sql                     # Initial demo seed data
            └── static/                      # Web UI Frontend Assets
                ├── css/
                │   └── styles.css           # Glassmorphism dark mode styles
                ├── js/
                │   ├── app.js               # Dashboard & Customer CRUD SPA logic
                │   └── auth.js              # Login/Register UI logic
                └── index.html               # Single Page Application UI layout
```

---

## 🛠️ Prerequisites

Before running the project, make sure you have installed:
- **Java Development Kit (JDK 17 or higher)**
- **Maven** (built into IntelliJ IDEA and VS Code Java extension pack)
- *(Optional)* **MySQL Server & MySQL Workbench** (if you want to use MySQL instead of embedded H2)

---

## 🗄️ Database Setup Instructions

### Option 1: Quick Run (Default H2 Database - No Setup Required!)
The application is pre-configured with **H2 In-Memory Database**. 
Simply run the Spring Boot app, and sample data will be loaded automatically!

### Option 2: Connect to MySQL Database
1. Open **MySQL Workbench** or MySQL command line and run:
   ```sql
   CREATE DATABASE crm_db;
   ```
2. Open `src/main/resources/application.properties`.
3. Comment out the H2 settings and uncomment the MySQL section:
   ```properties
   # MYSQL CONFIGURATION
   spring.datasource.url=jdbc:mysql://localhost:3306/crm_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=YOUR_MYSQL_USERNAME (e.g. root)
   spring.datasource.password=YOUR_MYSQL_PASSWORD (e.g. root)
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```

---

## 🚀 How to Run in IntelliJ IDEA

1. **Open Project**:
   - Open IntelliJ IDEA.
   - Click **File -> Open** and select the `crm-system` folder (`C:\Users\srini\.gemini\antigravity\scratch\crm-system`).
2. **Import Maven Dependencies**:
   - IntelliJ will automatically detect `pom.xml`. Click **Load Maven Changes** or open the Maven tool window on the right side and click the **Sync** icon.
3. **Run Application**:
   - Navigate to `src/main/java/com/crm/CrmApplication.java`.
   - Right-click `CrmApplication.java` and click **Run 'CrmApplication'** (or press `Shift + F10`).
4. **Access Application**:
   - Open your browser and go to `http://localhost:8080`.

---

## 🚀 How to Run in VS Code

1. **Open Project**:
   - Launch VS Code.
   - Install **Extension Pack for Java** by Microsoft and **Spring Boot Extension Pack**.
   - Click **File -> Open Folder** and select `crm-system`.
2. **Run Application**:
   - Open `src/main/java/com/crm/CrmApplication.java`.
   - Click **Run** above the `main` method (or press `F5`).
3. **Access Application**:
   - Open your browser and go to `http://localhost:8080`.

---

## 📡 API Endpoints Reference

### 🔐 Authentication API
| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `{ "username": "admin", "email": "admin@crm.com", "password": "password123", "fullName": "Admin User" }` | Register user |
| `POST` | `/api/auth/login` | `{ "username": "admin", "password": "password123" }` | Log in user |

### 👥 Customer API
| Method | Endpoint | Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/customers` | `?query=Sarah` *(optional)* | Get all customers or search |
| `GET` | `/api/customers/{id}` | None | Get customer details by ID |
| `POST` | `/api/customers` | `{ "name": "Sarah", "email": "sarah@acme.com", "phone": "+1 555-234-5678", "company": "Acme", "address": "742 Evergreen", "requirements": "Enterprise CRM integration" }` | Create new customer |
| `PUT` | `/api/customers/{id}` | Updated customer fields JSON | Update customer info |
| `DELETE` | `/api/customers/{id}` | None | Delete customer record |

### 📞 Interaction Tracker API
| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/customers/{id}/interactions` | None | Get interaction logs for customer |
| `POST` | `/api/customers/{id}/interactions` | `{ "type": "CALL", "notes": "Discussed annual discount" }` | Log call, email, or meeting |
| `DELETE` | `/api/interactions/{id}` | None | Delete interaction log |

### 📊 Dashboard API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Get total customers, total interactions, recent customers & activities |

---

## 💡 Default Admin Credentials for Demo

- **Username**: `admin`
- **Password**: `admin123`
