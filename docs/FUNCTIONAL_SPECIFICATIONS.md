# 5. Functional & Non-Functional Specifications 📋

## 5.1 Functional Requirements (FR)

| Req ID | Requirement Title | Description & Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- |
| **FR-1** | **Problem Intake & Image Upload** | Allow users to drag-and-drop damaged product images, validate MIME types (JPEG, PNG, WEBP), select a category (Furniture, Electronics, Home Appliances, Plumbing, Electrical, Other), enter descriptions, and choose preferred date/time. | **Verified** |
| **FR-2** | **Category & Location Matching** | Filter technicians in real time based on matching trade categories, neighborhood keyword matching, and real-time availability status (*Available*, *Busy*). | **Verified** |
| **FR-3** | **Customer Lifecycle Dashboard** | Display metric totals (Total, Pending, Accepted, Completed), list active requests with thumbnails, provide cancel actions, and track confirmed bookings. | **Verified** |
| **FR-4** | **Technician Hub & Status Engine** | Allow repairers to view incoming neighborhood repair requests, zoom in on damage photos, issue estimated labor quotes, and advance statuses (*Accepted* -> *In Progress* -> *Completed*). | **Verified** |
| **FR-5** | **JWT Authentication & RBAC** | Support distinct customer and technician registration with salted bcrypt password hashing, 30-day signed JWT tokens, and role-based route guards. | **Verified** |
| **FR-6** | **Modular AI Diagnostics** | Provide a plug-and-play endpoint at `POST /api/ai/analyze-image` calculating circular feasibility scores and estimated carbon savings (~14.5 kg CO2 avoided). | **Verified** |

---

## 5.2 Non-Functional Requirements (NFR)

| Req ID | Requirement Title | Metric & Verification |
| :--- | :--- | :--- |
| **NFR-1** | **Startup UI/UX Quality** | Consistent brand palette (Deep Navy `#153B50`, Teal `#16A085`, Light Grey `#F5F7FA`), Inter font typography, rounded cards (`rounded-2xl`, `rounded-3xl`), soft shadows, and smooth hover micro-transitions. |
| **NFR-2** | **Responsive Design** | Fluid layouts optimized across mobile phones (`< 640px`), tablets (`768px`), and widescreen desktop viewports (`1024px+`) with collapsible mobile navigation drawer. |
| **NFR-3** | **Fault Tolerance & Zero-Crash Fallback** | Automatic fallback to preloaded in-memory repository if local MongoDB is offline or inaccessible, ensuring 100% demo continuity during presentations. |
| **NFR-4** | **Performance & Fast Compilation** | Frontend builds with Vite in under 3.0 seconds (1,670 modules transformed). Backend response time under 60ms. |
| **NFR-5** | **Security & Integrity** | Passwords never stored in plain text. JWT bearer tokens sanitized against invalid string values. MongoDB driver v6 duplicate key codes handled safely. |

---

## 5.3 REST API Endpoints Specification

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer or technician |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `POST` | `/api/requests` | Public / Private | Submit new repair report with multipart photo |
| `GET` | `/api/requests` | Public | Query all requests with category/location filters |
| `GET` | `/api/requests/my` | Private | Retrieve current user's submitted or assigned requests |
| `GET` | `/api/requests/:id` | Public | Retrieve single request details |
| `PUT` | `/api/requests/:id/status` | Private | Update lifecycle status (*accepted*, *in_progress*, etc.) |
| `DELETE` | `/api/requests/:id` | Private | Cancel/delete pending request |
| `GET` | `/api/repairers` | Public | Browse repairers with category & location filters |
| `GET` | `/api/repairers/:id` | Public | View technician profile & ratings |
| `PUT` | `/api/repairers/profile` | Private (Pro) | Update trade skills, rates, or availability |
| `POST` | `/api/bookings` | Private | Confirm appointment booking with technician |
| `GET` | `/api/bookings/my` | Private | Retrieve user's confirmed bookings |
| `POST` | `/api/ai/analyze-image` | Public | Modular circular feasibility & CO2 diagnosis |
| `GET` | `/api/health` | Public | Live server health & storage provider telemetry |
