const bcrypt = require('bcryptjs');

// In-memory mock database for fallback mode when MongoDB is not running
class MockDatabase {
  constructor() {
    this.users = [];
    this.repairers = [];
    this.requests = [];
    this.bookings = [];
    this.reviews = [];
    this.initSeedData();
  }

  async initSeedData() {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // Seed Demo Customer
    const demoCustomer = {
      _id: 'usr_cust_001',
      name: 'Rohan Sharma',
      email: 'customer@fixnear.com',
      password: defaultPassword,
      phone: '+91 98765 43210',
      role: 'customer',
      createdAt: new Date('2026-10-01'),
    };

    // Seed Demo Repairer User
    const demoRepairerUser = {
      _id: 'usr_rep_001',
      name: 'Suresh Kumar',
      email: 'repairer@fixnear.com',
      password: defaultPassword,
      phone: '+91 98111 22334',
      role: 'repairer',
      createdAt: new Date('2026-10-02'),
    };

    // Additional Repairer Users
    const repUser2 = {
      _id: 'usr_rep_002',
      name: 'Priya Electricals (Priya Verma)',
      email: 'priya@fixnear.com',
      password: defaultPassword,
      phone: '+91 97222 33445',
      role: 'repairer',
      createdAt: new Date('2026-10-03'),
    };

    const repUser3 = {
      _id: 'usr_rep_003',
      name: 'Apex Wood Crafts (Arun Rao)',
      email: 'arun@fixnear.com',
      password: defaultPassword,
      phone: '+91 96333 44556',
      role: 'repairer',
      createdAt: new Date('2026-10-04'),
    };

    const repUser4 = {
      _id: 'usr_rep_004',
      name: 'AquaFix Plumbing Care (Vikram Singh)',
      email: 'vikram@fixnear.com',
      password: defaultPassword,
      phone: '+91 95444 55667',
      role: 'repairer',
      createdAt: new Date('2026-10-05'),
    };

    const repUser5 = {
      _id: 'usr_rep_005',
      name: 'CoolTech Appliances (Mohit Patel)',
      email: 'mohit@fixnear.com',
      password: defaultPassword,
      phone: '+91 94555 66778',
      role: 'repairer',
      createdAt: new Date('2026-10-06'),
    };

    this.users.push(demoCustomer, demoRepairerUser, repUser2, repUser3, repUser4, repUser5);

    // Seed Repairer Profiles
    this.repairers.push(
      {
        _id: 'rep_prof_001',
        userId: demoRepairerUser._id,
        user: demoRepairerUser,
        serviceCategories: ['Electronics', 'Home Appliances'],
        location: 'Koramangala, Bengaluru',
        experience: '7 years',
        description: 'Certified electronics repair technician with expertise in microwave, mixers, motherboards, circuit boards and TV troubleshooting.',
        availability: 'Available',
        rating: 4.9,
        totalReviews: 38,
        estimatedCharges: '₹300 - ₹600',
        badge: 'Verified Master Repairer',
      },
      {
        _id: 'rep_prof_002',
        userId: repUser2._id,
        user: repUser2,
        serviceCategories: ['Electrical', 'Home Appliances'],
        location: 'Indiranagar, Bengaluru',
        experience: '5 years',
        description: 'Licensed residential electrician specialized in power surges, rewiring, smart switches, and kitchen appliances.',
        availability: 'Available',
        rating: 4.8,
        totalReviews: 29,
        estimatedCharges: '₹250 - ₹500',
        badge: 'Top Rated Fixer',
      },
      {
        _id: 'rep_prof_003',
        userId: repUser3._id,
        user: repUser3,
        serviceCategories: ['Furniture'],
        location: 'HSR Layout, Bengaluru',
        experience: '12 years',
        description: 'Master carpenter passionate about restoring antique wood, broken chairs, sagging dining tables, and circular wood recycling.',
        availability: 'Busy',
        rating: 4.95,
        totalReviews: 54,
        estimatedCharges: '₹400 - ₹850',
        badge: 'Circular Artisan',
      },
      {
        _id: 'rep_prof_004',
        userId: repUser4._id,
        user: repUser4,
        serviceCategories: ['Plumbing'],
        location: 'Whitefield, Bengaluru',
        experience: '8 years',
        description: 'Rapid response plumbing specialist for tap leakages, pipe joint sealing, washbasin drainage, and bathroom fittings.',
        availability: 'Available',
        rating: 4.7,
        totalReviews: 41,
        estimatedCharges: '₹200 - ₹450',
        badge: 'Rapid Responder',
      },
      {
        _id: 'rep_prof_005',
        userId: repUser5._id,
        user: repUser5,
        serviceCategories: ['Home Appliances', 'Electronics'],
        location: 'BTM Layout, Bengaluru',
        experience: '6 years',
        description: 'Washing machine, refrigerator, and small kitchen appliance repair and circular part replacement.',
        availability: 'Available',
        rating: 4.6,
        totalReviews: 22,
        estimatedCharges: '₹350 - ₹700',
        badge: 'Eco Repair Partner',
      }
    );

    // Seed Sample Service Requests
    this.requests.push(
      {
        _id: 'req_001',
        customerId: demoCustomer._id,
        customerName: demoCustomer.name,
        customerPhone: demoCustomer.phone,
        category: 'Furniture',
        description: 'Study chair leg broke at the joint joint after heavy weight. Wood split need re-joining and reinforcement brackets.',
        location: 'Koramangala 4th Block, Bengaluru',
        preferredDate: '2026-11-06',
        preferredTime: '10:00 AM - 12:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        status: 'pending',
        assignedRepairerId: null,
        assignedRepairerName: '',
        estimatedCost: 'Awaiting Quote',
        aiDiagnosis: {
          detectedCategory: 'Furniture',
          confidence: 0.94,
          recommendedAction: 'Structural joint re-gluing and steel bracket bracing',
        },
        createdAt: new Date('2026-11-03T10:30:00Z'),
      },
      {
        _id: 'req_002',
        customerId: demoCustomer._id,
        customerName: demoCustomer.name,
        customerPhone: demoCustomer.phone,
        category: 'Electronics',
        description: 'Microwave oven sparking inside and not heating food properly. Turntable motor also making humming sound.',
        location: 'Koramangala 4th Block, Bengaluru',
        preferredDate: '2026-11-07',
        preferredTime: '02:00 PM - 04:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
        status: 'accepted',
        assignedRepairerId: demoRepairerUser._id,
        assignedRepairerName: 'Suresh Kumar',
        estimatedCost: '₹450 - ₹600',
        aiDiagnosis: {
          detectedCategory: 'Electronics',
          confidence: 0.89,
          recommendedAction: 'Magnetron mica sheet replacement & diode check',
        },
        createdAt: new Date('2026-11-02T14:15:00Z'),
      },
      {
        _id: 'req_003',
        customerId: demoCustomer._id,
        customerName: demoCustomer.name,
        customerPhone: demoCustomer.phone,
        category: 'Plumbing',
        description: 'Kitchen sink pipe joint is dripping continuously causing cabinet wood damping.',
        location: 'Koramangala 4th Block, Bengaluru',
        preferredDate: '2026-11-01',
        preferredTime: '11:00 AM',
        imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
        status: 'completed',
        assignedRepairerId: repUser4._id,
        assignedRepairerName: 'AquaFix Plumbing Care',
        estimatedCost: '₹250',
        aiDiagnosis: {
          detectedCategory: 'Plumbing',
          confidence: 0.96,
          recommendedAction: 'P-trap washer replacement and teflon tape reseal',
        },
        createdAt: new Date('2026-10-30T09:00:00Z'),
      }
    );

    // Seed Bookings
    this.bookings.push({
      _id: 'bk_001',
      customerId: demoCustomer._id,
      repairerId: demoRepairerUser._id,
      serviceRequestId: 'req_002',
      agreedPrice: 500,
      status: 'confirmed',
      scheduledDate: '2026-11-07',
      notes: 'Please bring testing multimeter and spare microwave diode.',
      createdAt: new Date('2026-11-02T15:00:00Z'),
    });
  }
}

const mockDB = new MockDatabase();

module.exports = mockDB;
