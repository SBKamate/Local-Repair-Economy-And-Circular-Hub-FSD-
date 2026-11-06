# FixNear – Local Repair Economy and Circular Hub 🛠️♻️

> **A full-stack MERN platform connecting residents who have damaged household products with certified nearby repair specialists to foster a local circular economy, save consumer costs, and reduce landfill waste.**

---

## 1. Project Introduction & Overview

Modern consumption patterns frequently lead to premature disposal of household items—such as split wooden furniture, faulty kitchen appliances, broken mobile screens, or leaking plumbing fixtures—even when simple part replacement or joint restoration could extend their lifespans for years. 

**FixNear** is a web-based circular economy ecosystem that bridges the gap between customers facing household product damages and nearby independent repair technicians. By streamlining photo uploads, category classification, neighborhood matching, and quote management, FixNear makes repair easier, cheaper, and faster than buying new replacements.

---

## 2. Problem Statement & Objectives

### The Problem:
* **Severe Landfill & E-Waste Burden:** Millions of tons of repairable household electronics, metals, and treated woods are discarded into municipal landfills each year.
* **Economic Inefficiency:** Consumers spend disproportionately high sums replacing entire appliances when a minor component (such as a capacitor, thermal fuse, or dowel joint) is the only damaged element.
* **Hyperlocal Artisans Disconnect:** Skilled neighborhood carpenters, electricians, and technicians lack a modern digital platform to receive customer requests with clear damage descriptions and photos.

### Project Objectives:
1. **Promote the Circular Economy:** Encourage reuse, refurbishment, and waste reduction over disposal.
2. **Seamless Problem Intake:** Allow customers to drag-and-drop damaged product photos, choose categories, describe issues, and set convenient repair times.
3. **Neighborhood Matching Engine:** Match repair requests to local technicians by category expertise and neighborhood location.
4. **Transparent Communication & Tracking:** Provide clear status indicators (*Pending*, *Accepted*, *In Progress*, *Completed*), estimated price quotes, and review metrics.
5. **Future-Ready AI Architecture:** Incorporate modular hooks for automated computer vision damage assessment and circular feasibility scoring.

---

## 3. Technology Stack

### Frontend:
* **React 18** with **Vite** (Fast modern SPA architecture)
* **Tailwind CSS** (Custom startup theme with Deep Navy `#153B50` and Teal Green `#16A085`)
* **React Router v6** (Declarative routing & role-based route guards)
* **Lucide React** (Consistent modern iconography)
* **Axios** (HTTP client with JWT auto-injection interceptor)

### Backend:
* **Node.js** & **Express.js** (REST API architecture)
* **JWT (JSON Web Tokens)** (Stateless role-based authentication)
* **bcryptjs** (Salted password hashing)
* **Multer** (Multipart file upload handling with MIME & file size validation)
* **Morgan & CORS** (Structured request logging and cross-origin configuration)

### Storage & Database:
* **MongoDB (Atlas / Local)** with **Mongoose ODM** (Schema validation, indexes, and relations)
* **Cloudinary CDN** (Cloud media storage for product photos with automatic local disk `/uploads` static URL fallback)
* **Zero-Crash Development Fallback:** Automatic in-memory mock store if MongoDB connection is offline.

---

## 4. Project Folder Structure

```
FixNear/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection & fallback handler
│   │   ├── cloudinary.js      # Cloudinary CDN credentials configuration
│   │   └── seedDB.js          # Auto-seeder for demo accounts & sample repairers
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and getMe
│   │   ├── requestController.js  # Create, list, filter, update, delete requests
│   │   ├── repairerController.js # Repairer directory and profile updates
│   │   ├── bookingController.js  # Service booking lifecycle
│   │   ├── reviewController.js   # Customer ratings and technician reviews
│   │   └── aiController.js       # Modular circular diagnosis & CV hook
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   ├── uploadMiddleware.js   # Multer image upload & file validation
│   │   └── errorHandler.js       # Central error handler
│   ├── models/
│   │   ├── User.js               # Customer & Repairer credentials
│   │   ├── Repairer.js           # Skills, location, rating, availability
│   │   ├── ServiceRequest.js     # Damage report, photo, status, category
│   │   ├── Booking.js            # Customer-technician confirmed bookings
│   │   └── Review.js             # Ratings (1-5) and feedback
│   ├── routes/                   # Express route definitions
│   ├── services/
│   │   ├── storageService.js     # Dual Cloudinary & local storage engine
│   │   └── mockDatabase.js       # Development in-memory fallback dataset
│   ├── uploads/                  # Local media directory for damage photos
│   ├── server.js                 # Express server entry point
│   ├── test_api.js               # Automated 7-phase API integration test
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/                   # Favicon and static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with role badge & demo pills
│   │   │   ├── Footer.jsx        # Circular economy mission & quick links
│   │   │   ├── ServiceCard.jsx   # Interactive category cards
│   │   │   ├── RepairerCard.jsx  # Technician card with ratings & booking
│   │   │   ├── StatusBadge.jsx   # Status indicators (Pending, Accepted, etc.)
│   │   │   ├── BookingModal.jsx  # Booking confirmation popup
│   │   │   ├── Notification.jsx  # Floating toast notification
│   │   │   └── ProtectedRoute.jsx# Role-aware route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & instant demo switchers
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero, categories, how it works, circular impact
│   │   │   ├── ReportProblemPage.jsx # Image upload, problem intake form
│   │   │   ├── FindRepairersPage.jsx # Directory with category & area filters
│   │   │   ├── CustomerDashboard.jsx # Request lifecycle, bookings, metrics
│   │   │   ├── RepairerDashboard.jsx # Incoming requests, accept/quotes, availability
│   │   │   ├── RequestDetailPage.jsx # Full problem view, AI insights, status timeline
│   │   │   ├── DocumentationPage.jsx # College review hub: Arch, Use Case, DFD, ERD
│   │   │   ├── LoginPage.jsx         # Sign in with instant demo fill
│   │   │   └── RegisterPage.jsx      # Role selection (Customer vs Repairer)
│   │   ├── services/
│   │   │   └── api.js                # Axios instance & unified API services
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx        # Responsive shell layout
│   │   ├── App.jsx                   # Route configuration
│   │   ├── index.css                 # Tailwind directives
│   │   └── main.jsx                  # React DOM entry
│   ├── index.html
│   ├── vite.config.js                # Vite dev server with proxy on port 5001
│   ├── tailwind.config.js            # Brand color palette configuration
│   └── package.json
│
├── COLLEGE_REVIEW_DOCS.md            # Detailed college viva documentation
└── README.md
```

---

## 5. Installation & Setup Instructions

### Prerequisites:
* **Node.js** v18+ (tested on Node v24)
* **npm** v9+
* Optional: Local MongoDB or MongoDB Atlas account. (FixNear automatically falls back to an in-memory store if MongoDB is offline, guaranteeing 100% demo stability).

---

### Step 1: Clone or Navigate to the Project

```bash
cd "c:\Users\Shrishail\Downloads\local repair"
```

---

### Step 2: Configure Environment Variables

The backend includes a pre-configured `.env` file. You can adjust it or copy from `.env.example`:

**File:** `backend/.env`
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb://127.0.0.1:27017/fixnear

# JWT Secret Key
JWT_SECRET=fixnear_super_secure_jwt_secret_key_2026_dev

# Cloudinary Credentials (Optional - if blank, local file upload storage is automatically used)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **Note on Cloudinary:** If left blank, FixNear automatically stores damage photos in `backend/uploads/` and serves them via static Express routes (`http://localhost:5001/uploads/...`). This means image upload works out of the box without any external setup!

---

### Step 3: Run the Backend Server

Open a terminal in the project directory:

```bash
cd backend
npm install
npm start
```

* Backend server will start on: **`http://localhost:5001`**
* Test healthcheck anytime at: **`http://localhost:5001/api/health`**
* Run the automated backend test suite:
  ```bash
  npm test
  ```

---

### Step 4: Run the React Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

* Frontend application will start on: **`http://localhost:5173`**
* Open **`http://localhost:5173`** in your browser.

---

## 6. Pre-Seeded Demo Accounts for College Review

FixNear includes pre-seeded demo accounts with one-click switcher buttons on the navigation bar and login page:

| Role | Email | Password | Pre-configured Profile |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@fixnear.com` | `password123` | Rohan Sharma (Koramangala, Bengaluru) with active repair requests |
| **Repairer** | `repairer@fixnear.com` | `password123` | Suresh Kumar (Apex Electronics, 7 yrs exp, 4.9 Rating) |

---

## 7. Working Features (Implemented)

1. **Professional Landing Page:**
   * Hero section with headline: *"Broken Something? We'll Help Fix It."*
   * Interactive service category cards across Furniture, Electronics, Home Appliances, Plumbing, Electrical, and Other.
   * Step-by-step workflow: *"How FixNear Works"*.
   * Circular economy impact section: *"Why Repair Instead of Replace?"* (cost savings, carbon reduction, artisan empowerment).
   * Live telemetry stats strip.

2. **Core Problem Reporting Workflow:**
   * Drag-and-drop damage photo upload with instant image preview, replace, and remove capabilities.
   * Category dropdown, problem description textarea, neighborhood location input with quick autofill, and preferred date/time slot picker.
   * Form validation ensuring complete data intake.
   * Cloudinary upload with local disk fallback.

3. **Find Local Repairers Directory:**
   * Filter cards by service category (All, Furniture, Electronics, Plumbing, etc.).
   * Search by neighborhood name or technician keyword.
   * Filter by real-time availability status (*Available*, *Busy*).
   * Transparent notice banner distinguishing live database technicians from demo records.
   * Interactive *Book Repair* modal for confirmed scheduling.

4. **Customer Hub (Dashboard):**
   * Real-time metrics: Total Requests, Pending Review, Accepted / In Progress, and Completed & Saved.
   * Tabbed filtering by status.
   * Product thumbnails, problem descriptions, location, target dates, and color-coded status badges.
   * Cancel / delete request functionality.
   * Confirmed bookings overview.

5. **Repairer Hub (Technician Dashboard):**
   * Technician profile card with trade skills, experience, ratings, and availability toggle.
   * Incoming service requests matching neighborhood and category.
   * Damage image inspection with full-size viewer.
   * Direct actions: Accept Job (with custom labor quote), Start Repair (*In Progress*), Mark Restored (*Completed*), or Decline.

6. **Authentication & Security:**
   * Role-based registration (Customer vs Technician with trade skills & operating area).
   * JWT authentication with bcryptjs password hashing.
   * Password visibility toggle.
   * Protected routes guarding dashboards based on user role.

7. **Interactive College Review Documentation Page (`/college-docs`):**
   * Tab 1: 3-Tier System Architecture Diagram & Layer Breakdown.
   * Tab 2: Use Case Diagram & Actor Matrix (Customer vs Repairer).
   * Tab 3: Data Flow Diagram (DFD Level 0 Context & DFD Level 1).
   * Tab 4: Entity Relationship Diagram (ERD Schema for User, Repairer, ServiceRequest, Booking, Review).
   * Tab 5: Functional & Non-Functional Specifications compliance matrix.
   * Tab 6: Live System Diagnostic Telemetry (live pinging `/api/health`).

8. **Modular AI Image Classification Pipeline:**
   * Clean endpoint architecture at `POST /api/ai/analyze-image`.
   * Heuristic circular feasibility scoring (88/100) and carbon savings calculations (~14.5 kg CO2 avoided).
   * Ready for plug-and-play Google Gemini Vision API / Cloud Vision integration.

---

## 8. Planned Future Enhancements

* **Real-time Multimodal Gemini Vision API Integration:** Direct integration of Gemini 2.5 Flash for automatic damage type detection and spare parts recommendation from photo uploads.
* **In-app Chat & Live Geolocation:** Socket.io real-time chat between resident and repairer, with Leaflet/OpenStreetMap distance radius calculation.
* **Payment Escrow Gateway:** Razorpay / Stripe integration for escrow payments released only upon customer confirmation of restoration.

---

## 9. License & Credits

Developed for the College Mini-Project Review: **FixNear – Local Repair Economy and Circular Hub**.  
Built with the MERN Stack (React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, Cloudinary).
