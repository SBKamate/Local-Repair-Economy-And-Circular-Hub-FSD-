# 2. Use Case Diagram & Actor Matrix 👥

## 2.1 Actors in the FixNear System

1. **Customer (Resident / Consumer):**
   * An individual seeking local repair services for damaged household furniture, electronics, appliances, plumbing, or electrical fixtures.
2. **Technician (Local Repair Specialist / Pro):**
   * An independent artisan, electrician, plumber, or repair shop owner seeking neighborhood customer jobs matching their skills.
3. **System Administrator:**
   * Oversees user accounts, monitors circular economy platform metrics, and manages platform configuration.

---

## 2.2 Use Case Diagram

```
                             +-----------------------------------+
                             |          FixNear System           |
                             |                                   |
    ( Customer ) ----------->| UC-1: Register / Log In           |<----------- ( Technician )
         │                   |                                   |                  │
         ├──────────────────>| UC-2: Upload Damaged Product Photo|                  │
         │                   |                                   |                  │
         ├──────────────────>| UC-3: Submit Repair Request       |                  │
         │                   |                                   |                  │
         ├──────────────────>| UC-4: Search & Filter Repairers   |                  │
         │                   |                                   |                  │
         ├──────────────────>| UC-5: Track Repair Lifecycle      |                  │
         │                   |                                   |                  │
         │                   | UC-6: View Incoming Job Stream    |<─────────────────┤
         │                   |                                   |                  │
         │                   | UC-7: Inspect Photo & Issue Quote |<─────────────────┤
         │                   |                                   |                  │
         ├──────────────────>| UC-8: Confirm Booking Schedule    |<─────────────────┤
         │                   |                                   |                  │
         │                   | UC-9: Toggle Availability Status  |<─────────────────┤
         │                   |                                   |                  │
         └──────────────────>| UC-10: Leave Review & Rating      |                  │
                             |                                   |
                             | UC-11: AI Circular Feasibility    | (Automated Diagnostic)
                             +-----------------------------------+
```

---

## 2.3 Detailed Use Case Specifications

### UC-3: Submit Repair Request
* **Primary Actor:** Customer
* **Pre-conditions:** Customer navigates to `/report`.
* **Flow of Events:**
  1. Customer drags and drops an image of the damaged product.
  2. System previews the image and allows replacement or removal.
  3. Customer selects product category (Furniture, Electronics, Home Appliances, Plumbing, Electrical, Other).
  4. Customer enters problem description, neighborhood location, and preferred repair date/time.
  5. System validates all mandatory fields.
  6. System uploads the image and saves the service request in MongoDB with status `pending`.
  7. System displays confirmation reference ID and circular carbon savings.

### UC-7: Inspect Photo & Issue Quote
* **Primary Actor:** Technician
* **Pre-conditions:** Technician logged in and viewing `/dashboard/repairer`.
* **Flow of Events:**
  1. System queries and displays requests in the technician's area matching their registered trade categories.
  2. Technician clicks on the damage photo to view zoom inspection.
  3. Technician clicks **"Accept Job"** and inputs an estimated service charge (e.g., `₹350 - ₹500`).
  4. System updates request status to `accepted`, assigns technician details, and alerts the customer.

### UC-8: Confirm Booking Schedule
* **Primary Actors:** Customer & Technician
* **Pre-conditions:** A repair request is created.
* **Flow of Events:**
  1. Customer browses matched technicians on `/repairers` or from request details.
  2. Customer clicks **"Book Repair"** to launch the booking modal.
  3. Customer picks active request reference, selects preferred date, and confirms agreed price.
  4. System writes a confirmed `Booking` document to MongoDB and marks the request as accepted.
