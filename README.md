<div align="center">

# 📦 Real-Time Shipment Tracker

### A production-grade, fullstack shipment tracking platform built with **Spring Boot 4** and **Angular 21**
### featuring RESTful APIs and live status updates powered by **WebSockets**

<br/>

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://stomp.github.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

<br/>

> _Track every shipment. Every update. In real time._

</div>

---

## 📌 Overview

**Real-Time Shipment Tracker** is a full-stack logistics platform that enables businesses and end users to monitor the complete lifecycle of shipments — from creation to final delivery — without ever refreshing the page.

In today's e-commerce and supply chain landscape, **shipment visibility is not a nice-to-have — it's a competitive necessity**. Customers expect to know where their package is at all times. Operations teams need instant awareness of delays, in-transit events, and delivery confirmations. This platform solves exactly that.

### 🎯 The Problem It Solves

| Challenge | Solution |
|---|---|
| Stale shipment data requiring constant manual refresh | Live WebSocket push updates to every connected client |
| Fragmented backend APIs with no type safety | MapStruct-powered DTOs with strict contract enforcement |
| Brittle DB schemas with no migration history | Flyway-managed versioned migrations on PostgreSQL |
| Frontend state growing complex with multiple async updates | Angular Signals for fine-grained reactive state management |
| Local dev environment inconsistency | Docker Compose for fully reproducible multi-service setup |

### 💼 Real-World Use Cases

- **E-commerce platforms** — Track parcels from dispatch to doorstep with zero polling overhead
- **Logistics & courier companies** — Centralized dashboard for operations teams monitoring fleet-wide shipment status
- **B2B supply chains** — Manufacturers and distributors tracking inventory movements across warehouses
- **Internal fulfillment systems** — Integration-ready REST APIs that plug into existing ERP/WMS solutions

---

## 🚀 Features

### Core Capabilities

- **📡 Real-Time Status Updates** — WebSocket (STOMP over SockJS) broadcasts shipment state changes the instant they occur, reaching all connected clients simultaneously with sub-second latency
- **📋 Full Shipment Lifecycle Management** — Create, update, retrieve, and delete shipments with rich metadata (origin, destination, carrier, weight, status, timestamps)
- **🔍 Shipment Search & Filtering** — Query shipments by tracking number, status, carrier, or date range through clean REST endpoints
- **🗂️ Status History Tracking** — Every status transition is persisted, providing a full audit trail for each shipment
- **📊 Dashboard Overview** — Angular-powered dashboard displaying shipment counts, status breakdowns, and recent activity feeds
- **📝 Reactive Forms** — Angular Reactive Forms with full client-side validation for shipment creation and editing
- **🔄 Optimistic UI Updates** — Angular Signals enable fine-grained, efficient re-renders without full component refreshes
- **🗄️ Schema Versioned Database** — Flyway handles all DB migrations, ensuring reproducible schema evolution from day one
- **🐳 Dockerized Infrastructure** — Single `docker-compose up` spins up the entire stack: API, database, and frontend proxy

### Technical Highlights

- ⚡ **Event-driven push architecture** — no polling, no wasted network round-trips
- 🏗️ **Layered backend architecture** — Controller → Service → Repository, with strict DTO boundaries enforced by MapStruct
- 🧩 **Angular 21 standalone components** with AOT compilation for optimal bundle size
- 🔐 **Input validation** at both API and database layers
- 📦 **H2 in-memory DB** for local development, **PostgreSQL** for production

---

## 🏗️ Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                           │
│                                                               │
│   ┌─────────────────────────────────────────────────────┐    │
│   │              Angular 21 SPA (shipment-ui)           │    │
│   │                                                     │    │
│   │  ┌──────────────┐   ┌──────────────┐   ┌────────┐  │    │
│   │  │  Components  │   │   Services   │   │Signals │  │    │
│   │  │  (Standalone │   │  (HTTP +     │   │(State) │  │    │
│   │  │   + AOT)     │   │  WebSocket)  │   │        │  │    │
│   │  └──────┬───────┘   └──────┬───────┘   └────────┘  │    │
│   │         │                  │                         │    │
│   │         └────────┬─────────┘                        │    │
│   └──────────────────┼──────────────────────────────────┘    │
│                      │ HTTP REST + WebSocket (STOMP/SockJS)   │
└──────────────────────┼────────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────────┐
│                     API GATEWAY / CORS                         │
└──────────────────────┬────────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────────┐
│                  BACKEND LAYER (Spring Boot 4)                  │
│                                                               │
│  ┌─────────────────┐   ┌────────────────────────────────┐    │
│  │  REST Controllers│   │  WebSocket Message Controllers │    │
│  │  (@RestController│   │  (@MessageMapping / @SendTo)   │    │
│  └────────┬────────┘   └───────────────┬────────────────┘    │
│           │                            │                       │
│  ┌────────▼────────────────────────────▼────────────────┐    │
│  │              Service Layer (Business Logic)           │    │
│  │         MapStruct DTO Mapping | Bean Validation       │    │
│  └────────────────────────┬──────────────────────────────┘    │
│                            │                                   │
│  ┌─────────────────────────▼────────────────────────────┐    │
│  │         Repository Layer (Spring Data JPA)            │    │
│  │                  + Flyway Migrations                  │    │
│  └─────────────────────────┬────────────────────────────┘    │
└──────────────────────────────┼────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│              DATABASE LAYER                                    │
│   ┌─────────────────────┐       ┌──────────────────────────┐  │
│   │  PostgreSQL (prod)  │  OR   │  H2 In-Memory (dev/test) │  │
│   └─────────────────────┘       └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 🔁 Real-Time Update Flow

```
Client Browser
     │
     │  1. Subscribe to /topic/shipments via STOMP
     │
     ▼
Spring WebSocket Broker (In-Memory)
     │
     │  2. REST call: PUT /api/shipments/{id}/status
     │
     ▼
ShipmentService.updateStatus()
     │
     │  3. Persist to DB, then:
     │     messagingTemplate.convertAndSend("/topic/shipments", updatedShipmentDTO)
     │
     ▼
All subscribed clients receive the update simultaneously ✅
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Core language |
| Spring Boot | 4.x | Application framework |
| Spring Web MVC | — | RESTful API layer |
| Spring WebSocket | — | Real-time STOMP messaging |
| Spring Data JPA | — | ORM & repository abstraction |
| MapStruct | Latest | Compile-time DTO ↔ Entity mapping |
| Lombok | Latest | Boilerplate reduction |
| Flyway | Latest | DB schema version management |
| Bean Validation | — | Request/entity constraint enforcement |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 21 | SPA framework |
| TypeScript | 5.x | Type-safe application code |
| Angular Signals | — | Fine-grained reactive state |
| Angular Reactive Forms | — | Form management & validation |
| STOMP.js / SockJS | — | WebSocket client abstraction |
| AOT Compilation | — | Optimized production builds |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| PostgreSQL 16 | Production-grade relational database |
| H2 (in-memory) | Lightweight dev/test database |
| Docker & Docker Compose | Containerized multi-service orchestration |

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- **Java 21+** — [Download](https://adoptium.net/)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 20+** & **npm** — [Download](https://nodejs.org/)
- **Angular CLI 17+** — `npm install -g @angular/cli`
- **Docker & Docker Compose** — [Download](https://docs.docker.com/get-docker/) _(optional, for full-stack Docker setup)_
- **PostgreSQL 16** — [Download](https://www.postgresql.org/download/) _(if running outside Docker)_

---

### 🐳 Option A: Run with Docker Compose (Recommended)

The fastest way to get the full stack running locally:

```bash
# 1. Clone the repository
git clone https://github.com/drissiOmar98/Real-Time-Shipment-Tracker.git
cd Real-Time-Shipment-Tracker

# 2. Start all services (backend, database, frontend)
docker-compose up --build
```

The application will be available at:
- **Frontend:** `http://localhost:4200`
- **Backend API:** `http://localhost:8080`
- **API Docs (if enabled):** `http://localhost:8080/swagger-ui.html`

---

### 🔧 Option B: Run Manually

#### 1. Clone the repository

```bash
git clone https://github.com/drissiOmar98/Real-Time-Shipment-Tracker.git
cd Real-Time-Shipment-Tracker
```

#### 2. Configure the Backend

Navigate to the backend module:

```bash
cd backend/shipment-tracker
```

Update `src/main/resources/application.properties` (or `application.yml`) with your database credentials:

```properties
# PostgreSQL configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/shipment_tracker_db
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

# JPA settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Flyway migrations (auto-applied on startup)
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# WebSocket
spring.websocket.allowed-origins=http://localhost:4200

# Server
server.port=8080
```

> 💡 **For local dev without PostgreSQL**, switch to the H2 profile:
> ```properties
> spring.datasource.url=jdbc:h2:mem:shipmentdb
> spring.datasource.driver-class-name=org.h2.Driver
> spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
> spring.h2.console.enabled=true
> ```

#### 3. Run the Backend

```bash
# From backend/shipment-tracker/
./mvnw spring-boot:run
```

The API server will start on `http://localhost:8080`.

#### 4. Install & Run the Frontend

```bash
# From project root
cd frontend/shipment-ui

# Install dependencies
npm install

# Start the Angular development server
ng serve
```

The frontend will be available at `http://localhost:4200`.

---

### 🌍 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_URL` | JDBC connection URL | `jdbc:h2:mem:shipmentdb` |
| `DB_USERNAME` | Database username | `sa` |
| `DB_PASSWORD` | Database password | _(empty)_ |
| `SERVER_PORT` | Backend server port | `8080` |
| `ALLOWED_ORIGINS` | CORS & WebSocket allowed origins | `http://localhost:4200` |

---

## ▶️ Usage

### Typical Workflow

#### 1. Create a New Shipment

Use the **"New Shipment"** form in the dashboard to register a shipment with:
- Tracking number, carrier name
- Origin & destination addresses
- Package weight and estimated delivery date
- Initial status (e.g., `PENDING`)

#### 2. Track a Shipment in Real Time

Open any shipment's detail view. The status panel is WebSocket-connected — any backend update reflects instantly on screen without any page reload.

#### 3. Update Shipment Status (Operator/Admin)

Authorized users can transition shipment status through the workflow:

```
PENDING → CONFIRMED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
                                                    ↘ FAILED / RETURNED
```

Each transition triggers a WebSocket broadcast to all watching clients.

#### 4. View Status History

Every shipment's timeline view shows the complete history of status changes, including timestamps and notes.

---

## 📡 API Documentation

> 📌 Base URL: `http://localhost:8080/api`

### Shipments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/shipments` | Retrieve all shipments (paginated) |
| `GET` | `/shipments/{id}` | Get a single shipment by ID |
| `GET` | `/shipments/track/{trackingNumber}` | Look up shipment by tracking number |
| `POST` | `/shipments` | Create a new shipment |
| `PUT` | `/shipments/{id}` | Update shipment details |
| `PATCH` | `/shipments/{id}/status` | Update shipment status only |
| `DELETE` | `/shipments/{id}` | Delete a shipment |

### Example: Create a Shipment

```http
POST /api/shipments
Content-Type: application/json

{
  "trackingNumber": "TRK-2024-00142",
  "carrier": "DHL",
  "origin": "Casablanca, MA",
  "destination": "Paris, FR",
  "weight": 2.5,
  "estimatedDelivery": "2024-12-20",
  "status": "PENDING"
}
```

**Response `201 Created`:**
```json
{
  "id": 42,
  "trackingNumber": "TRK-2024-00142",
  "carrier": "DHL",
  "origin": "Casablanca, MA",
  "destination": "Paris, FR",
  "weight": 2.5,
  "status": "PENDING",
  "estimatedDelivery": "2024-12-20",
  "createdAt": "2024-12-15T10:30:00Z",
  "updatedAt": "2024-12-15T10:30:00Z"
}
```

### Example: Update Status

```http
PATCH /api/shipments/42/status
Content-Type: application/json

{
  "status": "IN_TRANSIT",
  "note": "Departed Casablanca hub"
}
```

**Response `200 OK`** — also triggers a WebSocket broadcast to all subscribers on `/topic/shipments`.

### WebSocket Endpoint

| Type | Destination | Description |
|---|---|---|
| **Connect** | `ws://localhost:8080/ws` (SockJS fallback) | Establish WebSocket session |
| **Subscribe** | `/topic/shipments` | Receive all shipment updates |
| **Subscribe** | `/topic/shipments/{id}` | Receive updates for a specific shipment |

---

## 📊 Key Concepts

### Real-Time Communication with WebSockets

Traditional HTTP polling is wasteful — the client repeatedly asks "anything new?" whether or not there is. This application uses the **WebSocket protocol**, which establishes a **persistent, bi-directional TCP connection** between client and server.

The stack uses **STOMP** (Simple Text Oriented Messaging Protocol) on top of WebSocket, via **SockJS** as a fallback transport for environments that block WebSocket connections. This gives:

- A **publish/subscribe model** — clients subscribe to topics, the server broadcasts to them
- **Message broker routing** — Spring's in-memory broker routes messages from sender to all topic subscribers
- **Connection resilience** — SockJS auto-falls back to HTTP long-polling if WebSocket is unavailable

### Angular Signals for Reactive State

Rather than using traditional `BehaviorSubject` + `async` pipe patterns, this project adopts Angular's **Signals API** for state management. Signals provide:

- Fine-grained change detection — only the exact DOM node that depends on a changed signal re-renders
- Synchronous, readable state without verbose RxJS chains
- Better integration with Angular's new **zoneless** change detection model introduced in Angular 17+

### Flyway Database Migrations

All schema changes are versioned as SQL scripts under `src/main/resources/db/migration/`. Flyway applies them in order on startup, giving the project:

- A full history of every schema change
- Zero-downtime deployment compatibility
- Team-safe DB evolution — no manual `ALTER TABLE` statements in production

---

## 🧪 Testing

### Backend Tests

```bash
cd backend/shipment-tracker

# Run all unit and integration tests
./mvnw test

# Run with coverage report (generates in target/site/jacoco/)
./mvnw verify
```

Tests cover:
- **Service layer** — business logic unit tests with Mockito
- **Controller layer** — MockMvc slice tests for REST API contracts
- **Repository layer** — Spring Data JPA tests using H2 in-memory DB
- **WebSocket** — STOMP message broadcasting verification

### Frontend Tests

```bash
cd frontend/shipment-ui

# Run unit tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run end-to-end tests
ng e2e
```

---

## 📁 Project Structure

```
Real-Time-Shipment-Tracker/
│
├── backend/
│   └── shipment-tracker/
│       ├── src/main/java/com/shipment/
│       │   ├── config/
│       │   │   ├── WebSocketConfig.java       # STOMP endpoint & message broker config
│       │   │   └── CorsConfig.java            # Cross-origin request configuration
│       │   ├── controller/
│       │   │   ├── ShipmentController.java    # REST API endpoints
│       │   │   └── ShipmentWSController.java  # WebSocket message mappings
│       │   ├── service/
│       │   │   └── ShipmentService.java       # Business logic + WS broadcast trigger
│       │   ├── repository/
│       │   │   └── ShipmentRepository.java    # Spring Data JPA interface
│       │   ├── entity/
│       │   │   └── Shipment.java              # JPA entity with Lombok
│       │   ├── dto/
│       │   │   ├── ShipmentDTO.java           # API response contract
│       │   │   └── ShipmentCreateRequest.java # Request body model
│       │   ├── mapper/
│       │   │   └── ShipmentMapper.java        # MapStruct DTO ↔ Entity mapper
│       │   └── enums/
│       │       └── ShipmentStatus.java        # Status enum definition
│       ├── src/main/resources/
│       │   ├── db/migration/                  # Flyway SQL versioned scripts
│       │   └── application.properties         # Spring configuration
│       └── pom.xml
│
├── frontend/
│   └── shipment-ui/
│       ├── src/app/
│       │   ├── core/
│       │   │   ├── services/
│       │   │   │   ├── shipment.service.ts    # HTTP + WebSocket client service
│       │   │   │   └── websocket.service.ts   # STOMP/SockJS connection manager
│       │   │   └── models/
│       │   │       └── shipment.model.ts      # TypeScript shipment interfaces
│       │   ├── features/
│       │   │   ├── dashboard/                 # Overview + live feed component
│       │   │   ├── shipment-list/             # Paginated shipment table
│       │   │   ├── shipment-detail/           # Single shipment + status timeline
│       │   │   └── shipment-form/             # Create/edit reactive form
│       │   ├── shared/
│       │   │   ├── components/                # Reusable UI components
│       │   │   └── pipes/                     # Status formatting pipes
│       │   └── app.config.ts                  # Standalone app config (no NgModule)
│       ├── angular.json
│       └── package.json
│
├── docker-compose.yml                         # Full-stack container orchestration
└── README.md
```

---

## 🔐 Security Considerations

### Current Implementation

- **CORS configuration** — Strict origin allowlist on both REST API and WebSocket handshake endpoint
- **Input validation** — Bean Validation (`@NotNull`, `@Size`, `@Pattern`) on all incoming request DTOs; malformed requests return `400 Bad Request`
- **Error handling** — Global `@ControllerAdvice` ensures no stack traces or internal details leak in error responses
- **Parameterized queries** — Spring Data JPA uses prepared statements by default, protecting against SQL injection

### Production Recommendations

> The following security layers are recommended for production deployment:

- 🔐 **Authentication & Authorization** — Integrate Spring Security with JWT (stateless) or OAuth 2.0 / OIDC for user identity and role-based access control (`ADMIN`, `OPERATOR`, `VIEWER`)
- 🔒 **WebSocket Authentication** — Validate JWT tokens in the STOMP `CONNECT` frame via a custom `ChannelInterceptor` before establishing the session
- 🌐 **HTTPS / WSS** — Terminate TLS at the load balancer or reverse proxy (Nginx/Caddy); ensure WebSocket connections use `wss://`
- 🛡️ **Rate Limiting** — Apply API gateway-level rate limiting (e.g., via Spring Cloud Gateway or Nginx `limit_req`) to prevent abuse
- 📋 **Audit Logging** — Log all status change events with user identity, timestamp, and IP address for compliance and forensics
- 🔑 **Secret Management** — Store DB credentials and secrets in environment variables or a secrets manager (HashiCorp Vault, AWS Secrets Manager) — never in source code

---

## 🚀 Future Improvements

| Feature | Description |
|---|---|
| 🔔 **Push Notifications** | Integrate Web Push API or email/SMS alerts (via Twilio/SendGrid) for delivery milestones |
| 🗺️ **Live Map Tracking** | Embed Leaflet.js or Google Maps with real-time GPS coordinates for in-transit shipments |
| 🤖 **AI-Powered ETA Prediction** | ML model trained on historical shipment data to predict accurate delivery windows |
| 📈 **Analytics Dashboard** | KPIs: average delivery time, on-time rate, carrier performance, delay heatmaps |
| 🔐 **Full Auth System** | Spring Security + JWT with role-based access (`ADMIN`, `OPERATOR`, `CLIENT`) |
| 📱 **Mobile App** | React Native or Flutter client consuming the same REST + WebSocket API |
| 🔗 **Carrier API Integration** | Connect to DHL, FedEx, UPS APIs to ingest real carrier tracking events automatically |
| 🧵 **Message Queue** | Replace in-memory broker with Apache Kafka or RabbitMQ for high-throughput, durable event streaming |
| 🌐 **Internationalization (i18n)** | Multi-language support via Angular i18n for global logistics operators |
| 📦 **Batch Import** | CSV/Excel bulk shipment upload with async processing and status reporting |

---


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for full details.

---

## 👨‍💻 Author

<div align="center">

**Omar Drissi**

*Full-Stack Software Engineer | Java · Spring Boot · Angular · Cloud*

[![GitHub](https://img.shields.io/badge/GitHub-drissiOmar98-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/drissiOmar98)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Omar_Drissi-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/omar-drissi-4798171a4/)

</div>

---

<div align="center">

⭐ **If you found this project useful, please consider giving it a star!** ⭐

*Built with ❤️ using Spring Boot 4 & Angular 21*

</div>
