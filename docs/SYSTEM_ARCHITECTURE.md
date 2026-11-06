# 1. System Architecture Document 🏗️

## 1.1 Architectural Overview

FixNear adopts a decoupled **3-Tier Client-Server Architecture** designed for high modularity, horizontal scalability, and clear separation of concerns:

1. **Presentation Layer (Client Tier):** Built with React 18 and Vite as a reactive Single Page Application (SPA), styled with Tailwind CSS, utilizing React Router v6 for client-side routing, and Axios for async API communication.
2. **Application / Business Logic Layer (Server Tier):** Built with Node.js and Express.js providing a stateless REST API, JWT-based role authentication, Multer-driven multipart media ingestion, and modular AI diagnostic evaluation hooks.
3. **Data & Storage Layer (Persistence Tier):** Powered by MongoDB Atlas (or Local MongoDB) utilizing Mongoose ODM schemas, and Cloudinary CDN for cloud-hosted product images with local disk fallback.

---

## 1.2 System Architecture Diagram

```
+=============================================================================+
|                      TIER 1: PRESENTATION LAYER (CLIENT)                    |
|                                                                             |
|   +-------------------+  +--------------------+  +----------------------+   |
|   |  Customer Views   |  |  Technician Views  |  |  Marketplace Catalog |   |
|   | - Problem Report  |  | - Incoming Stream  |  | - Fixer Directory    |   |
|   | - My Repairs Hub  |  | - Status Manager   |  | - Category Filter    |   |
|   +-------------------+  +--------------------+  +----------------------+   |
|                                                                             |
|   Technologies: React 18, Vite, Tailwind CSS, React Router v6, Axios       |
+=============================================================================+
                                      ▲
                                      │ HTTPS / REST (JSON & Multipart)
                                      │ Authorization: Bearer <JWT>
                                      ▼
+=============================================================================+
|                      TIER 2: APPLICATION LAYER (SERVER)                     |
|                                                                             |
|   +---------------------------------------------------------------------+   |
|   |  Express.js REST API Gateway (Port 5001)                            |   |
|   |  ├── CORS & Morgan Logging Middleware                               |   |
|   |  ├── JWT Authentication & Role Authorization Middleware             |   |
|   |  └── Multer File Upload Engine (MIME type & size validation)        |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
|   +------------------+ +------------------+ +---------------------------+   |
|   | Auth Controller  | | Request Service  | | Repairer Service Engine   |   |
|   | - Register/Login | | - CRUD Lifecycle | | - Neighborhood Matcher    |   |
|   | - bcrypt Hash    | | - Status Machine | | - Availability Filter     |   |
|   +------------------+ +------------------+ +---------------------------+   |
|   +------------------+ +------------------+ +---------------------------+   |
|   | Booking Service  | | Review Engine    | | Modular AI Diagnostics    |   |
|   | - Quotes/Pricing | | - Ratings/Stats  | | - Feasibility / CO2 Saver |   |
|   +------------------+ +------------------+ +---------------------------+   |
+=============================================================================+
                                      ▲
                                      │ Mongoose ODM / Cloudinary SDK
                                      ▼
+=============================================================================+
|                      TIER 3: DATA & STORAGE LAYER                           |
|                                                                             |
|   +-------------------------------------+ +-----------------------------+   |
|   |  MongoDB Database Engine            | |  Image Media Storage Engine |   |
|   |  - users collection                 | |  - Cloudinary Global CDN    |   |
|   |  - repairers collection             | |  - Static Local /uploads    |   |
|   |  - servicerequests collection       | |    (Zero-dependency mode)   |   |
|   |  - bookings collection              | +-----------------------------+   |
|   |  - reviews collection               |                                   |
|   +-------------------------------------+                                   |
+=============================================================================+
```

---

## 1.3 Layered Responsibility Matrix

| Layer | Component | Core Responsibilities |
| :--- | :--- | :--- |
| **Presentation** | `ReportProblemPage.jsx` | Drag-and-drop file upload, client-side format & size checks, problem metadata input, responsive layout. |
| **Presentation** | `FindRepairersPage.jsx` | Dynamic category pills, neighborhood keyword search, availability toggling, booking modal launcher. |
| **Presentation** | `CustomerDashboard.jsx` | Metrics computation, status lifecycle tracking, request cancellation, confirmed bookings overview. |
| **Presentation** | `RepairerDashboard.jsx` | Incoming requests stream, damage photo zoom inspection, quote entry, status state advancement. |
| **Application** | `authMiddleware.js` | Bearer token extraction, sanitization, JWT signature validation, role checking. |
| **Application** | `uploadMiddleware.js` | Multipart payload parsing, JPEG/PNG/WEBP validation, 10MB memory safety guard. |
| **Application** | `storageService.js` | Cloudinary remote upload with automatic Express static disk directory fallback. |
| **Application** | `aiController.js` | Modular computer vision hook endpoint for circular feasibility scoring and CO2 savings estimation. |
| **Persistence** | `User.js` / `Repairer.js` | Mongoose schemas with password pre-save hash hooks, category enums, and relational ObjectIds. |
| **Persistence** | `ServiceRequest.js` | Problem schema tracking customer ID, category, location, photo URL, and repair status. |
