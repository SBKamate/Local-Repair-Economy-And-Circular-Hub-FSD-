const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const QA_RESULTS = {
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(name, success, details = '') {
  if (success) {
    QA_RESULTS.passed++;
    console.log(`  [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  } else {
    QA_RESULTS.failed++;
    console.error(`  [FAIL] ${name} -> ${details}`);
  }
  QA_RESULTS.tests.push({ name, success, details });
}

async function runQASuite() {
  console.log('===============================================================');
  console.log('   FIXNEAR - SENIOR QA COMPREHENSIVE AUTOMATED VERIFICATION   ');
  console.log('===============================================================\n');

  // Spawn backend server
  console.log('STEP 1 & 2: Starting Backend Server...');
  const serverProc = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProc.stdout.on('data', (d) => {
    // console.log('[Server]:', d.toString().trim());
  });
  serverProc.stderr.on('data', (d) => {
    // console.error('[Server Err]:', d.toString().trim());
  });

  // Wait 3.5s for server initialization & MongoDB connection
  await new Promise((r) => setTimeout(r, 3500));

  let authToken = null;
  let testCustomerId = null;
  let testRequestId = null;

  try {
    // 1. Healthcheck & DB Connection Verification
    console.log('\n--- VERIFYING SYSTEM HEALTH & MONGODB ---');
    const healthRes = await fetch('http://localhost:5001/api/health');
    const health = await healthRes.json();
    recordTest('Backend Server Starts & Responds (Port 5001)', health.status === 'online', `Status: ${health.status}`);
    recordTest('MongoDB Connection Active', health.database?.connected === true, `Type: ${health.database?.type}`);
    recordTest('Storage Provider Ready', Boolean(health.storage?.provider), `Storage: ${health.storage?.provider}`);

    // 2. Form Validation Testing (Negative Testing)
    console.log('\n--- TESTING FORM VALIDATION & SECURITY (NEGATIVE TESTS) ---');
    
    // 2a. Missing fields on registration
    const invalidRegRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete User' }),
    });
    recordTest('Validation: Rejects Registration with Missing Email/Password', invalidRegRes.status === 400, `HTTP ${invalidRegRes.status}`);

    // 2b. Missing fields on problem report
    const invalidReqRes = await fetch('http://localhost:5001/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Furniture' }), // missing description and location
    });
    recordTest('Validation: Rejects Problem Report with Missing Description/Location', invalidReqRes.status === 400, `HTTP ${invalidReqRes.status}`);

    // 2c. Invalid category rejection
    const invalidCatRes = await fetch('http://localhost:5001/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'RocketScience',
        description: 'Invalid category test description',
        location: 'Bengaluru',
      }),
    });
    recordTest('Validation: Rejects Invalid Product Category', invalidCatRes.status === 400, `HTTP ${invalidCatRes.status}`);

    // 3. Customer Registration & Login Testing
    console.log('\n--- TESTING CUSTOMER REGISTRATION & LOGIN ---');
    const uniqueEmail = `qa_cust_${Date.now()}@fixnear.test`;
    const regRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'QA Test Customer',
        email: uniqueEmail,
        password: 'password123',
        phone: '+91 91234 56789',
        role: 'customer',
      }),
    });
    const regData = await regRes.json();
    recordTest('Customer Registration (New User Creation)', regData.success === true, `User: ${regData.user?.name}`);

    // Test duplicate registration rejection
    const dupRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: uniqueEmail,
        password: 'password123',
        phone: '+91 91234 56789',
        role: 'customer',
      }),
    });
    recordTest('Validation: Rejects Duplicate Email Registration', dupRes.status === 400, `HTTP ${dupRes.status}`);

    // Login with registered user
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: uniqueEmail, password: 'password123' }),
    });
    const loginData = await loginRes.json();
    authToken = loginData.token;
    testCustomerId = loginData.user?._id || loginData.user?.id;
    recordTest('Customer Login & JWT Token Issue', Boolean(authToken), `Token Issued, Role: ${loginData.user?.role}`);

    // Verify /api/auth/me with JWT
    const meRes = await fetch('http://localhost:5001/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meData = await meRes.json();
    recordTest('Protected Auth /me Endpoint Verification', meData.success === true, `Authenticated as: ${meData.user?.email}`);

    // 4. Image Upload & Problem Reporting Testing (Multipart/Form-Data)
    console.log('\n--- TESTING PROBLEM REPORTING & IMAGE UPLOAD ---');
    
    // Create a dummy image file buffer for testing multipart upload
    const dummyImagePath = path.join(__dirname, 'uploads', `test-sample-${Date.now()}.png`);
    const minimalPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPjfDwAEeQHzcwbvtwAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(dummyImagePath, minimalPngBuffer);

    // Build standard multipart request using native Node.js FormData
    const formData = new FormData();
    formData.append('category', 'Electronics');
    formData.append('description', 'QA Test: Microwave oven sparking on turntable ring. Needs capacitor test.');
    formData.append('location', 'Indiranagar 100ft Road, Bengaluru');
    formData.append('preferredDate', '2026-11-12');
    formData.append('preferredTime', 'Afternoon (12:00 PM - 04:00 PM)');
    formData.append('customerName', 'QA Test Customer');
    formData.append('customerPhone', '+91 91234 56789');

    // Attach file
    const fileBlob = new Blob([fs.readFileSync(dummyImagePath)], { type: 'image/png' });
    formData.append('image', fileBlob, 'damaged-sample.png');

    const uploadReqRes = await fetch('http://localhost:5001/api/requests', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    const uploadData = await uploadReqRes.json();
    testRequestId = uploadData.data?._id;
    recordTest('Problem Reporting with Multipart Image Upload', uploadData.success === true, `Created Request ID: ${testRequestId}`);
    recordTest('Image URL Generated & Stored', Boolean(uploadData.data?.imageUrl), `URL: ${uploadData.data?.imageUrl}`);

    // Clean up temporary local test file
    try { fs.unlinkSync(dummyImagePath); } catch (e) {}

    // 5. Verify Storage in MongoDB
    console.log('\n--- VERIFYING STORAGE IN MONGODB ---');
    const fetchSavedReqRes = await fetch(`http://localhost:5001/api/requests/${testRequestId}`);
    const fetchedReq = await fetchSavedReqRes.json();
    recordTest('Service Request Stored in MongoDB and Retrieved by ID', fetchedReq.data?._id === testRequestId, `Matched ID: ${fetchedReq.data?._id}`);
    recordTest('Initial Status Set to Pending', fetchedReq.data?.status === 'pending', `Status: ${fetchedReq.data?.status}`);

    // 6. Verify Customer Dashboard Visibility (/api/requests/my)
    console.log('\n--- VERIFYING CUSTOMER DASHBOARD VISIBILITY ---');
    const myReqRes = await fetch('http://localhost:5001/api/requests/my', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const myReqData = await myReqRes.json();
    const foundInDashboard = myReqData.data?.some((r) => r._id === testRequestId);
    recordTest('Request Appears in Customer Dashboard (GET /api/requests/my)', foundInDashboard, `Found: ${foundInDashboard} (Total customer requests: ${myReqData.count})`);

    // 7. Test Repairer Category & Location Filtering
    console.log('\n--- TESTING REPAIRER DIRECTORY & FILTERING ---');
    
    // Category filter: Furniture
    const furnRepRes = await fetch('http://localhost:5001/api/repairers?category=Furniture');
    const furnData = await furnRepRes.json();
    const allFurniture = furnData.data?.every((r) => r.serviceCategories.includes('Furniture'));
    recordTest('Category Filter: Returns Furniture Repairers', allFurniture && furnData.count > 0, `Count: ${furnData.count}`);

    // Category filter: Plumbing
    const plumbRepRes = await fetch('http://localhost:5001/api/repairers?category=Plumbing');
    const plumbData = await plumbRepRes.json();
    const allPlumbing = plumbData.data?.every((r) => r.serviceCategories.includes('Plumbing'));
    recordTest('Category Filter: Returns Plumbing Repairers', allPlumbing && plumbData.count > 0, `Count: ${plumbData.count}`);

    // Location filter: Koramangala
    const locRepRes = await fetch('http://localhost:5001/api/repairers?location=Koramangala');
    const locData = await locRepRes.json();
    const allKoramangala = locData.data?.every((r) => r.location.toLowerCase().includes('koramangala'));
    recordTest('Location Filter: Returns Repairers in Koramangala', allKoramangala && locData.count > 0, `Count: ${locData.count}`);

    // 8. Test Repairer Action Workflow (Accept Request with Quote)
    console.log('\n--- TESTING REPAIRER DASHBOARD ACTIONS ---');
    // Login as pre-seeded demo repairer
    const repLoginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'repairer@fixnear.com', password: 'password123' }),
    });
    const repLogin = await repLoginRes.json();
    const repToken = repLogin.token;

    // Repairer accepts job and provides quote
    const acceptRes = await fetch(`http://localhost:5001/api/requests/${testRequestId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${repToken}`,
      },
      body: JSON.stringify({ status: 'accepted', estimatedCost: '₹350' }),
    });
    const acceptData = await acceptRes.json();
    recordTest('Repairer Accepts Job & Issues Labor Quote', acceptData.data?.status === 'accepted' && acceptData.data?.estimatedCost === '₹350', `Status: ${acceptData.data?.status}, Quote: ${acceptData.data?.estimatedCost}`);

    // 9. Test Booking Creation
    console.log('\n--- TESTING SERVICE BOOKING CREATION ---');
    const bookRes = await fetch('http://localhost:5001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        repairerId: repLogin.user?.id || repLogin.user?._id,
        serviceRequestId: testRequestId,
        agreedPrice: 350,
        scheduledDate: '2026-11-12',
        notes: 'Please bring testing multimeter.',
      }),
    });
    const bookData = await bookRes.json();
    recordTest('Customer Confirms Booking with Repairer', bookData.success === true, `Booking ID: ${bookData.data?._id}`);

    // 10. Test Modular AI Diagnostic Endpoint
    console.log('\n--- TESTING MODULAR AI DIAGNOSTICS ---');
    const aiRes = await fetch('http://localhost:5001/api/ai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Electronics', description: 'Microwave circuit spark' }),
    });
    const aiData = await aiRes.json();
    recordTest('Modular AI Feasibility Endpoint Returns Assessment', Boolean(aiData.data?.circularScore), `Score: ${aiData.data?.circularScore}/100, Carbon: ${aiData.data?.co2SavingsEstimateKg} kg`);

  } catch (err) {
    console.error('❌ QA Execution Error:', err);
    recordTest('Complete Test Suite Run', false, err.message);
  } finally {
    serverProc.kill();
  }

  console.log('\n===============================================================');
  console.log(`QA RESULTS SUMMARY: ${QA_RESULTS.passed} PASSED | ${QA_RESULTS.failed} FAILED`);
  console.log('===============================================================\n');

  return QA_RESULTS;
}

runQASuite().then((res) => {
  process.exit(res.failed > 0 ? 1 : 0);
});
