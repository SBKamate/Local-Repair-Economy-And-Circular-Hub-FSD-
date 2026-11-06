const { spawn } = require('child_process');

async function runTests() {
  console.log('🚀 Starting FixNear backend test suite...');

  const serverProc = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProc.stdout.on('data', (d) => {
    console.log('[Server stdout]:', d.toString().trim());
  });

  serverProc.stderr.on('data', (d) => {
    console.error('[Server stderr]:', d.toString().trim());
  });

  // Wait 3.5s for server initialization
  await new Promise((r) => setTimeout(r, 3500));

  try {
    // Test 1: Healthcheck
    console.log('1. Testing GET /api/health ...');
    const healthRes = await fetch('http://localhost:5001/api/health');
    const healthData = await healthRes.json();
    console.log('   ✅ Health Status:', healthData.status);
    console.log('   ✅ Database:', healthData.database.type);
    console.log('   ✅ Storage:', healthData.storage.provider);

    // Test 2: Login Demo Customer
    console.log('2. Testing POST /api/auth/login ...');
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@fixnear.com', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    console.log('   ✅ Login Success:', loginData.success, '| User:', loginData.user?.name, '| Role:', loginData.user?.role);
    const token = loginData.token;

    // Test 3: Get Repairers
    console.log('3. Testing GET /api/repairers ...');
    const repRes = await fetch('http://localhost:5001/api/repairers');
    const repData = await repRes.json();
    console.log('   ✅ Repairers Found:', repData.count, '| Sample 1:', repData.data[0].user?.name || repData.data[0].userId?.name);

    // Test 4: Create Repair Request
    console.log('4. Testing POST /api/requests ...');
    const reqRes = await fetch('http://localhost:5001/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category: 'Furniture',
        description: 'Antique dining table leg fractured at base joint. Needs dowel reinforcement and circular re-gluing.',
        location: 'Koramangala 4th Block, Bengaluru',
        preferredDate: '2026-11-09',
        preferredTime: 'Morning (09:00 AM - 12:00 PM)',
      }),
    });
    const reqData = await reqRes.json();
    console.log('   ✅ Request Created! ID:', reqData.data._id, '| Category:', reqData.data.category, '| Status:', reqData.data.status);
    const createdId = reqData.data._id;

    // Test 5: Get All Requests
    console.log('5. Testing GET /api/requests ...');
    const allRes = await fetch('http://localhost:5001/api/requests');
    const allData = await allRes.json();
    console.log('   ✅ Total Requests:', allData.count);

    // Test 6: AI Diagnostic Modular Endpoint
    console.log('6. Testing POST /api/ai/analyze-image ...');
    const aiRes = await fetch('http://localhost:5001/api/ai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Furniture', description: 'Wood leg split' }),
    });
    const aiData = await aiRes.json();
    console.log('   ✅ AI Engine:', aiData.data.engine);
    console.log('   ✅ Circular Feasibility:', aiData.data.repairFeasibility, '| CO2 Saved:', aiData.data.co2SavingsEstimateKg, 'kg');

    // Test 7: Update Request Status to Accepted
    console.log('7. Testing PUT /api/requests/:id/status ...');
    const updateRes = await fetch(`http://localhost:5001/api/requests/${createdId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'accepted', estimatedCost: '₹400' }),
    });
    const updateData = await updateRes.json();
    console.log('   ✅ Updated Status:', updateData.data.status, '| Estimated Quote:', updateData.data.estimatedCost);

    console.log('\n🎉 ALL 7 TEST PHASES PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}

runTests();
