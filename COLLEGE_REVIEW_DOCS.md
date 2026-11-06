# FixNear – College Mini-Project Technical Report & Viva Documentation 🎓

This document contains the academic documentation required for project reviews, project guide approvals, and viva voce defense.

---

## 1. System Architecture

FixNear follows a decoupled **3-Tier Client-Server Architecture**:

```
+-------------------------------------------------------------------------+
|                        TIER 1: PRESENTATION LAYER                       |
|   React.js 18 (Vite SPA) | Tailwind CSS UI | React Router v6 | Axios    |
+-------------------------------------------------------------------------+
                                    ▲
                                    │ HTTP / REST (JSON & Multipart)
                                    ▼
+-------------------------------------------------------------------------+
|                        TIER 2: APPLICATION LAYER                        |
|   Node.js & Express.js REST API                                         |
|   ├── Auth Middleware (JWT & bcryptjs)                                  |
|   ├── Multer File Engine (Damage Photo Uploads)                         |
|   ├── Business Logic Controllers (Requests, Repairers, Bookings)        |
|   └── Modular AI Diagnostic Engine (Circular Feasibility Pipeline)      |
+-------------------------------------------------------------------------+
                                    ▲
                                    │ Mongoose ODM / Cloudinary SDK
                                    ▼
+-------------------------------------------------------------------------+
|                        TIER 3: DATA & STORAGE LAYER                     |
|   MongoDB Atlas (Document DB) | Cloudinary CDN (or Local Disk /uploads) |
|   Collections: Users | Repairers | ServiceRequests | Bookings | Reviews |
+-------------------------------------------------------------------------+
```

---

## 2. Use Case Diagram (Actor Matrix)

```
                    ┌────────────────────────────┐
                    │      FixNear System        │
                    │                            │
   ( Customer )────►│ UC-1: Register & Log In    │◄────( Repairer )
        │           │                            │         │
        ├──────────►│ UC-2: Upload Damaged Photo │         │
        │           │                            │         │
        ├──────────►│ UC-3: Submit Repair Report │         │
        │           │                            │         │
        ├──────────►│ UC-4: Search & Filter Fixer│         │
        │           │                            │         │
        ├──────────►│ UC-5: Track Repair Status  │         │
        │           │                            │         │
        │           │ UC-6: View Incoming Jobs   │◄────────┤
        │           │                            │         │
        │           │ UC-7: Accept / Issue Quote │◄────────┤
        │           │                            │         │
        └──────────►│ UC-8: Book Technician      │◄────────┘
                    │                            │
                    │ UC-9: AI Damage Diagnosis  │ (System Internal)
                    └────────────────────────────┘
```

---

## 3. Data Flow Diagram (DFD)

### Level 0 Context Diagram:
```
  [ Customer ] ──── (Photo, Category, Description, Location) ────► [ 0.0 FixNear ]
                                                                       │
  [ Repairer ] ◄─── (Incoming Neighborhood Repair Requests) ───────────┤
  [ Repairer ] ──── (Estimated Labor Quote & Acceptance) ──────────────►│
                                                                       │
  [ Customer ] ◄─── (Status Timeline & Technician Details) ────────────┘
```

### Level 1 Data Flow Diagram:
```
[ Customer ]
     │
     ▼ (Multipart Form-Data)
[ 1.0 Input Validation & File Handling (Multer) ]
     │
     ├── (Store Image File) ──► [ Cloudinary / Local Disk ]
     ▼ (Valid Request Data)
[ 2.0 Request Controller ]
     │
     ├── (Write Record) ──► [ D1: ServiceRequests Collection (MongoDB) ]
     ▼ (Trigger Match)
[ 3.0 Matching & Notification Engine ]
     │
     ├── (Filter by Category & Area) ◄── [ D2: Repairers Collection ]
     ▼
[ Repairer Dashboard Stream ]
     │
     ▼ (Accept & Provide Quote)
[ 4.0 Status State Machine ]
     │
     └── (Update Status: pending -> accepted) ──► [ D1: ServiceRequests ]
     │
     ▼ (Booking Confirmation)
[ Customer Dashboard ]
```

---

## 4. Entity Relationship Diagram (ERD)

```
+------------------+         1 : 1         +----------------------+
|       USER       |-----------------------|       REPAIRER       |
+------------------+                       +----------------------+
| _id (PK)         |                       | _id (PK)             |
| name             |                       | userId (FK -> User)  |
| email (Unique)   |                       | serviceCategories [] |
| password (Hash)  |                       | location             |
| phone            |                       | experience           |
| role (Enum)      |                       | availability (Enum)  |
| createdAt        |                       | rating & reviews     |
+------------------+                       | estimatedCharges     |
         │ 1                               +----------------------+
         │
         │ 1 : N
         ▼
+-------------------------+
|     SERVICE_REQUEST     |
+-------------------------+
| _id (PK)                |
| customerId (FK -> User) |
| imageUrl                |
| category (Enum)         |
| description             |
| location                |
| preferredDate & Time    |
| status (Enum)           |
| assignedRepairerId (FK) |
| estimatedCost           |
| aiDiagnosis (Object)    |
| createdAt               |
+-------------------------+
         │ 1
         │
         │ 1 : 1
         ▼
+------------------------------------+
|              BOOKING               |
+------------------------------------+
| _id (PK)                           |
| customerId (FK -> User)            |
| repairerId (FK -> User)            |
| serviceRequestId (FK -> Request)   |
| agreedPrice (Number)               |
| scheduledDate                      |
| status (Enum)                      |
| notes                              |
| createdAt                          |
+------------------------------------+
```

---

## 5. Typical Viva Questions & Answers

**Q1: Why did you choose the MERN stack for this project?**  
*Answer:* The MERN stack (MongoDB, Express, React, Node.js) allows unified JavaScript execution from frontend to backend. React 18 with Vite provides a fast Single Page Application (SPA) user experience with reactive state updates. Node and Express handle high-concurrency non-blocking I/O for file uploads and REST APIs. MongoDB's flexible JSON-like document model naturally aligns with nested repair problem metadata and AI diagnostic structures.

**Q2: How does FixNear support the Circular Economy?**  
*Answer:* A circular economy seeks to eliminate waste and extend the lifespan of products through repair, refurbishment, and reuse. FixNear prevents repairable household goods from reaching landfills, reduces consumer expenses by up to 70% compared to purchasing new items, and lowers the carbon footprint (saving an estimated ~14.5 kg CO2 per repaired appliance).

**Q3: How is image upload implemented?**  
*Answer:* Image upload uses Multer on the backend with strict MIME-type validation (JPEG, PNG, WEBP, GIF) and a 10MB limit. The storage service supports a hybrid architecture: if Cloudinary credentials are provided, images are stored on Cloudinary's global CDN; otherwise, images are saved into the local `uploads/` directory and served statically.

**Q4: How does the development fallback work if MongoDB is offline?**  
*Answer:* `config/db.js` attempts connection to `MONGODB_URI` with a fast-fail timeout. If MongoDB is unavailable, the application gracefully switches to an in-memory mock repository (`services/mockDatabase.js`), logging a clear warning while enabling complete end-to-end testing of problem reporting, dashboards, and auth without application crashes. When MongoDB is available, it automatically connects and seeds the initial demo data.

**Q5: How is AI integrated into FixNear?**  
*Answer:* FixNear includes a modular AI endpoint (`/api/ai/analyze-image`) designed for plug-and-play multimodal vision models (such as Google Gemini 2.5 Flash Vision API). In the current version, users select categories manually while the modular pipeline performs heuristic circular feasibility and CO2 savings assessments.
