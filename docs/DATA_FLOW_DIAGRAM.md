# 3. Data Flow Diagram (DFD) 🔄

## 3.1 DFD Level 0: Context Diagram

The Level 0 context diagram demonstrates the boundary of the FixNear platform and its primary data flows with external entities:

```
                  +----------------------------------------------+
                  |                                              |
                  |  1. Problem Details & Damage Photo           |
                  |  2. Customer Contact & Location              |
                  |  3. Booking Confirmation                     |
                  v                                              |
          [ Customer Entity ]                          [ FixNear Platform ]
                  ▲                                              |
                  |  4. Matched Local Repairers                  |
                  |  5. Real-Time Repair Status Updates          |
                  +----------------------------------------------+
                                                                 ▲
                                                                 |
                  +----------------------------------------------+
                  |                                              |
                  |  6. Registered Skills, Rates & Availability  |
                  |  7. Job Acceptance & Labor Quotes            |
                  |  8. Repair Status Updates                    |
                  v                                              |
         [ Technician Entity ]                         [ FixNear Platform ]
                  ▲                                              |
                  |  9. Incoming Neighborhood Repair Requests    |
                  | 10. Damage Photos & Customer Contacts        |
                  +----------------------------------------------+
```

---

## 3.2 DFD Level 1: Detailed Process Data Flow

The Level 1 diagram breaks the FixNear platform into its core sub-processes, data stores, and input/output flows:

```
[ Customer ]
     │
     │ (Damage Photo Buffer + Problem Metadata)
     ▼
[ Process 1.0: Problem Intake & Validation ] ──── (Invalid Input) ──► [ Error Alert ]
     │
     │ (Binary Image Stream)
     ├───► [ Process 1.1: Media Storage Engine ] ────► [ Cloudinary CDN / Disk ]
     │                                                         │
     │                                                         │ (Permanent Image URL)
     ▼                                                         ▼
[ Process 2.0: Service Request Controller ] ◄──────────────────┘
     │
     │ (Write Valid Document)
     ▼
[ Data Store D1: ServiceRequests Collection ]
     ▲
     │ (Read Area & Category Requests)
     ▼
[ Process 3.0: Matching & Directory Engine ] ◄─── [ Data Store D2: Repairers Collection ]
     │
     │ (Filtered Stream)
     ▼
[ Technician Dashboard ]
     │
     │ (Action: Accept Request + Enter Quote)
     ▼
[ Process 4.0: Status State Machine Engine ]
     │
     │ (Update status: pending -> accepted)
     ├───► [ Data Store D1: ServiceRequests Collection ]
     │
     ▼ (Schedule confirmed)
[ Process 5.0: Booking Management Controller ]
     │
     │ (Write Confirmed Appointment)
     ├───► [ Data Store D3: Bookings Collection ]
     ▼
[ Customer Dashboard Stream ]
```

---

## 3.3 Data Store Definitions

| Store ID | Name | Description | Related Mongoose Model |
| :--- | :--- | :--- | :--- |
| **D1** | `servicerequests` | Stores customer problem descriptions, categories, image URLs, preferred times, and lifecycle statuses. | `ServiceRequest.js` |
| **D2** | `repairers` | Stores technician profiles, trade categories array, operating neighborhoods, ratings, and availability flags. | `Repairer.js` |
| **D3** | `bookings` | Stores confirmed repair appointments, agreed prices, scheduled dates, and technician assignments. | `Booking.js` |
| **D4** | `users` | Stores authenticated customer and technician credentials, bcrypt password hashes, roles, and contacts. | `User.js` |
| **D5** | `reviews` | Stores post-repair customer ratings (1 to 5 stars) and feedback comments. | `Review.js` |
