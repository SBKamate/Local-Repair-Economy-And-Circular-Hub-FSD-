const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Repairer = require('../models/Repairer');
const ServiceRequest = require('../models/ServiceRequest');

const seedInitialData = async () => {
  try {
    const existingCustomer = await User.findOne({ email: 'customer@fixnear.com' });
    if (existingCustomer) {
      const match = await existingCustomer.matchPassword('password123');
      if (!match) {
        console.log('🔄 Resetting demo accounts with correct password hash...');
        await User.deleteMany({});
        await Repairer.deleteMany({});
      } else {
        return;
      }
    }

    console.log('🌱 Seeding initial demo data to MongoDB Atlas / Local MongoDB...');

    // In seedInitialData, pass plain password so userSchema.pre('save') handles hashing
    const plainPassword = 'password123';

    // 1. Seed Customer
    const customer = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@fixnear.com',
      password: plainPassword,
      phone: '+91 98765 43210',
      role: 'customer',
    });

    // 2. Seed Repairer 1 (Electronics & Appliances)
    const repUser1 = await User.create({
      name: 'Suresh Kumar (Apex Electronics)',
      email: 'repairer@fixnear.com',
      password: plainPassword,
      phone: '+91 98111 22334',
      role: 'repairer',
    });

    await Repairer.create({
      userId: repUser1._id,
      serviceCategories: ['Electronics', 'Home Appliances'],
      location: 'Koramangala, Bengaluru',
      experience: '7 years',
      description: 'Certified electronics repair technician specializing in circuit boards, TV, microwave, and small appliances.',
      availability: 'Available',
      rating: 4.9,
      totalReviews: 38,
      estimatedCharges: '₹300 - ₹600',
      badge: 'Verified Master Repairer',
    });

    // 3. Seed Repairer 2 (Electrical)
    const repUser2 = await User.create({
      name: 'Priya Verma (Priya Electricals)',
      email: 'priya@fixnear.com',
      password: plainPassword,
      phone: '+91 97222 33445',
      role: 'repairer',
    });

    await Repairer.create({
      userId: repUser2._id,
      serviceCategories: ['Electrical', 'Home Appliances'],
      location: 'Indiranagar, Bengaluru',
      experience: '5 years',
      description: 'Licensed residential electrician specialized in power surges, rewiring, smart switches, and kitchen appliances.',
      availability: 'Available',
      rating: 4.8,
      totalReviews: 29,
      estimatedCharges: '₹250 - ₹500',
      badge: 'Top Rated Fixer',
    });

    // 4. Seed Repairer 3 (Wood & Furniture)
    const repUser3 = await User.create({
      name: 'Arun Rao (Heritage Wood Crafts)',
      email: 'arun@fixnear.com',
      password: plainPassword,
      phone: '+91 96333 44556',
      role: 'repairer',
    });

    await Repairer.create({
      userId: repUser3._id,
      serviceCategories: ['Furniture'],
      location: 'HSR Layout, Bengaluru',
      experience: '12 years',
      description: 'Master carpenter passionate about restoring antique wood, broken chairs, sagging dining tables, and circular wood recycling.',
      availability: 'Available',
      rating: 4.95,
      totalReviews: 54,
      estimatedCharges: '₹400 - ₹850',
      badge: 'Circular Artisan',
    });

    // 5. Seed Repairer 4 (Plumbing)
    const repUser4 = await User.create({
      name: 'Vikram Singh (AquaFix Plumbing)',
      email: 'vikram@fixnear.com',
      password: plainPassword,
      phone: '+91 95444 55667',
      role: 'repairer',
    });

    await Repairer.create({
      userId: repUser4._id,
      serviceCategories: ['Plumbing'],
      location: 'Whitefield, Bengaluru',
      experience: '8 years',
      description: 'Rapid response plumbing specialist for tap leakages, pipe joint sealing, washbasin drainage, and bathroom fittings.',
      availability: 'Available',
      rating: 4.7,
      totalReviews: 41,
      estimatedCharges: '₹200 - ₹450',
      badge: 'Rapid Responder',
    });

    // 6. Seed Sample Initial Requests
    await ServiceRequest.create({
      customerId: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      category: 'Furniture',
      description: 'Study chair leg broke at the joint after heavy weight. Wood split need re-joining and reinforcement brackets.',
      location: 'Koramangala 4th Block, Bengaluru',
      preferredDate: '2026-11-06',
      preferredTime: 'Morning (09:00 AM - 12:00 PM)',
      imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
      status: 'pending',
      estimatedCost: 'Awaiting Quote',
      aiDiagnosis: {
        detectedCategory: 'Furniture',
        confidence: 0.94,
        recommendedAction: 'Structural joint re-gluing and steel bracket bracing',
      },
    });

    console.log('✅ Demo users, repairers, and service requests successfully seeded into MongoDB!');
  } catch (err) {
    console.warn('⚠️ Seeding note:', err.message);
  }
};

module.exports = { seedInitialData };
