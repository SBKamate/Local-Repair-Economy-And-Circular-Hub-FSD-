const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { uploadImage } = require('../services/storageService');
const mockDB = require('../services/mockDatabase');

// @desc    Create a new service request with uploaded image
// @route   POST /api/requests
// @access  Private (or Public with guest info)
exports.createRequest = async (req, res, next) => {
  try {
    const { category, description, location, preferredDate, preferredTime, customerName, customerPhone } = req.body;

    // Validation
    if (!category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product category, problem description, and location.',
      });
    }

    const validCategories = ['Furniture', 'Electronics', 'Home Appliances', 'Plumbing', 'Electrical', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`,
      });
    }

    // Process image upload
    const uploadedMedia = await uploadImage(req.file, req);

    // AI heuristic / diagnosis stub for future image classification
    const aiDiagnosis = {
      detectedCategory: category,
      confidence: 0.92,
      recommendedAction: `Inspect ${category.toLowerCase()} hardware and assess repairable components rather than discarding.`,
    };

    let customerId = req.user ? req.user._id : null;
    const finalCustomerName = (req.user && req.user.name) || customerName || 'FixNear Customer';
    const finalCustomerPhone = (req.user && req.user.phone) || customerPhone || '+91 98765 43210';

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      if (!customerId) {
        const demoCust = await User.findOne({ email: 'customer@fixnear.com' });
        if (demoCust) {
          customerId = demoCust._id;
        } else {
          const newCust = await User.create({
            name: finalCustomerName,
            email: `guest_${Date.now()}@fixnear.com`,
            password: 'password123',
            phone: finalCustomerPhone,
            role: 'customer',
          });
          customerId = newCust._id;
        }
      }

      const newRequest = await ServiceRequest.create({
        customerId,
        customerName: finalCustomerName,
        customerPhone: finalCustomerPhone,
        imageUrl: uploadedMedia.url,
        imagePublicId: uploadedMedia.publicId,
        category,
        description,
        location,
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: preferredTime || 'Morning (09:00 AM - 12:00 PM)',
        status: 'pending',
        aiDiagnosis,
      });

      return res.status(201).json({
        success: true,
        message: 'Repair request submitted successfully! Local repairers have been notified.',
        data: newRequest,
      });
    } else {
      if (!customerId) customerId = 'usr_cust_001';
      const newMockRequest = {
        _id: `req_${Date.now()}`,
        customerId,
        customerName: finalCustomerName,
        customerPhone: finalCustomerPhone,
        imageUrl: uploadedMedia.url,
        imagePublicId: uploadedMedia.publicId,
        category,
        description,
        location,
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: preferredTime || 'Morning (09:00 AM - 12:00 PM)',
        status: 'pending',
        assignedRepairerId: null,
        assignedRepairerName: '',
        estimatedCost: 'Awaiting Quote',
        aiDiagnosis,
        createdAt: new Date(),
      };

      mockDB.requests.unshift(newMockRequest);

      return res.status(201).json({
        success: true,
        message: 'Repair request submitted successfully! (Stored in Dev Database)',
        data: newMockRequest,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's requests (Customer sees their requests; Repairer sees their accepted or category requests)
// @route   GET /api/requests/my
// @access  Private
exports.getMyRequests = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id.toString() : '';
    const userRole = req.user ? req.user.role : 'customer';
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      let requests;
      if (userRole === 'repairer') {
        // Repairer sees requests assigned to them or pending requests matching their categories
        requests = await ServiceRequest.find({
          $or: [{ assignedRepairerId: req.user._id }, { status: 'pending' }],
        }).sort({ createdAt: -1 });
      } else {
        requests = await ServiceRequest.find({ customerId: req.user._id }).sort({ createdAt: -1 });
      }

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } else {
      let requests;
      if (userRole === 'repairer') {
        requests = mockDB.requests.filter(
          (r) => (r.assignedRepairerId && r.assignedRepairerId.toString() === userId) || r.status === 'pending'
        );
      } else {
        requests = mockDB.requests.filter(
          (r) => r.customerId && r.customerId.toString() === userId
        );
      }

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get all requests (with category, location, and status filters)
// @route   GET /api/requests
// @access  Public
exports.getAllRequests = async (req, res, next) => {
  try {
    const { category, location, status, search } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (status && status !== 'All') filter.status = status;
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (search) {
        filter.$or = [
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }

      const requests = await ServiceRequest.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } else {
      let filtered = [...mockDB.requests];

      if (category && category !== 'All') {
        filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
      }
      if (status && status !== 'All') {
        filtered = filtered.filter((r) => r.status.toLowerCase() === status.toLowerCase());
      }
      if (location) {
        filtered = filtered.filter((r) => r.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.description.toLowerCase().includes(query) ||
            r.category.toLowerCase().includes(query) ||
            r.location.toLowerCase().includes(query)
        );
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Public
exports.getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const request = await ServiceRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Repair request not found' });
      }
      return res.status(200).json({ success: true, data: request });
    } else {
      const request = mockDB.requests.find((r) => r._id === id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Repair request not found' });
      }
      return res.status(200).json({ success: true, data: request });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Update request status (Accept / Reject / Complete)
// @route   PUT /api/requests/:id/status
// @access  Private
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, estimatedCost } = req.body;

    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const request = await ServiceRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      if (status) request.status = status;
      if (estimatedCost) request.estimatedCost = estimatedCost;

      if (status === 'accepted' && req.user) {
        request.assignedRepairerId = req.user._id;
        request.assignedRepairerName = req.user.name;
      }

      await request.save();
      return res.status(200).json({
        success: true,
        message: `Request status updated to '${status}'.`,
        data: request,
      });
    } else {
      const request = mockDB.requests.find((r) => r._id === id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Service request not found' });
      }

      if (status) request.status = status;
      if (estimatedCost) request.estimatedCost = estimatedCost;

      if (status === 'accepted' && req.user) {
        request.assignedRepairerId = req.user._id;
        request.assignedRepairerName = req.user.name;
      }

      return res.status(200).json({
        success: true,
        message: `Request status updated to '${status}'.`,
        data: request,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
exports.deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const request = await ServiceRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      // Check ownership
      if (req.user && req.user.role !== 'admin' && request.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this request' });
      }

      await ServiceRequest.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Request deleted successfully' });
    } else {
      const index = mockDB.requests.findIndex((r) => r._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      mockDB.requests.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Request deleted successfully' });
    }
  } catch (err) {
    next(err);
  }
};
