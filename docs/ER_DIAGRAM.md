# 4. Entity Relationship Diagram (ERD) 🗄️

## 4.1 ER Diagram Model

FixNear utilizes a relational document model implemented in MongoDB using Mongoose ObjectIds for cross-document references:

```
+------------------------------------+          1 : 1          +------------------------------------+
|               USER                 |-------------------------|              REPAIRER              |
+------------------------------------+                         +------------------------------------+
| _id: ObjectId [PK]                 |                         | _id: ObjectId [PK]                 |
| name: String                       |                         | userId: ObjectId [FK -> User._id]  |
| email: String [Unique]             |                         | serviceCategories: [String]        |
| password: String [bcrypt Hash]     |                         | location: String                   |
| phone: String                      |                         | experience: String                 |
| role: 'customer' | 'repairer'      |                         | availability: 'Available' | 'Busy' |
| createdAt: Date                    |                         | rating: Number (e.g. 4.9)          |
+------------------------------------+                         | totalReviews: Number               |
                   │ 1                                         | estimatedCharges: String           |
                   │                                           | badge: String                      |
                   │ 1 : N                                     +------------------------------------+
                   ▼                                                              │
+------------------------------------+                                            │
|          SERVICE_REQUEST           |                                            │
+------------------------------------+                                            │
| _id: ObjectId [PK]                 |                                            │
| customerId: ObjectId [FK -> User]  |                                            │
| customerName: String               |                                            │
| customerPhone: String              |                                            │
| imageUrl: String                   |                                            │
| imagePublicId: String              |                                            │
| category: Enum (6 categories)      |                                            │
| description: String                |                                            │
| location: String                   |                                            │
| preferredDate: String              |                                            │
| preferredTime: String              |                                            │
| status: 'pending'|'accepted'|...   |                                            │
| assignedRepairerId: ObjectId [FK]  |                                            │
| assignedRepairerName: String       |                                            │
| estimatedCost: String              |                                            │
| aiDiagnosis: Object                |                                            │
| createdAt: Date                    |                                            │
+------------------------------------+                                            │
                   │ 1                                                            │
                   │                                                              │
                   │ 1 : 1                                                        │
                   ▼                                                              ▼
+---------------------------------------------------------------------------------------------------+
|                                              BOOKING                                              |
+---------------------------------------------------------------------------------------------------+
| _id: ObjectId [PK]                                                                                |
| customerId: ObjectId [FK -> User._id]                                                             |
| repairerId: ObjectId [FK -> User._id]                                                             |
| serviceRequestId: ObjectId [FK -> ServiceRequest._id]                                             |
| agreedPrice: Number (e.g., 350)                                                                   |
| scheduledDate: String                                                                             |
| status: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'                       |
| notes: String                                                                                     |
| createdAt: Date                                                                                   |
+---------------------------------------------------------------------------------------------------+
                   │ 1
                   │
                   │ 1 : 1
                   ▼
+---------------------------------------------------------------------------------------------------+
|                                              REVIEW                                               |
+---------------------------------------------------------------------------------------------------+
| _id: ObjectId [PK]                                                                                |
| customerId: ObjectId [FK -> User._id]                                                             |
| repairerId: ObjectId [FK -> User._id]                                                             |
| rating: Number (1 to 5)                                                                           |
| comment: String                                                                                   |
| createdAt: Date                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 4.2 Cardinality & Relationship Breakdown

1. **User to Repairer (1 : 1 Optional):**
   * Each `User` with role `'repairer'` has exactly one corresponding `Repairer` profile record storing service capabilities, location, experience, and ratings.
2. **User to ServiceRequest (1 : N):**
   * A customer user can create multiple `ServiceRequest` records over time as household items require repair.
3. **ServiceRequest to Booking (1 : 1 Optional):**
   * Once a technician accepts a repair request and customer schedules it, a `Booking` document is created referencing both the customer, technician, and service request.
4. **User to Review (1 : N):**
   * Customers can submit reviews and ratings for technicians upon job completion.
