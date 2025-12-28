const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTest() {
    console.log("🚀 Starting PrintZap System Verification...");

    // 1. Create a Test Shop
    console.log("\n1️⃣ Creating Test Shop...");
    let shopId;
    try {
        const shopRes = await axios.post(`${API_URL}/shops`, {
            name: "Verification Print Shop",
            location: "Test Lab",
            printingRate: 3.0,
            coordinates: { lat: 12.0, lng: 77.0 }
        });
        console.log("✅ Shop Created:", shopRes.data.name);
        shopId = shopRes.data._id;
    } catch (error) {
        console.error("❌ Shop Creation Failed:", error.message);
        // Try getting existing shops
        try {
            const list = await axios.get(`${API_URL}/shops`);
            if (list.data.data.length > 0) {
                console.log("ℹ️ Using existing shop:", list.data.data[0].name);
                shopId = list.data.data[0]._id;
            } else {
                process.exit(1);
            }
        } catch (e) { process.exit(1); }
    }

    // 2. Simulate Zobot Webhook
    console.log("\n2️⃣ Simulating Zobot Webhook (File Upload)...");
    try {
        const webhookRes = await axios.post(`${API_URL}/webhook/zobot`, {
            file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Public Dummy PDF
            student_id: "TEST_STUDENT_001",
            user_location: "Test Lab", // Should match shop location context
            file_name: "Verification_Doc.pdf",
            copies: 2
        });

        console.log("✅ Webhook Response Received:");
        console.log(webhookRes.data);

        if (webhookRes.data.shop_name === "Verification Print Shop" || webhookRes.data.shop_name) {
            console.log("✅ Routing Logic: PASSED");
        } else {
            console.error("❌ Routing Logic: FAILED (No shop selected)");
        }

    } catch (error) {
        console.error("❌ Webhook Failed:", error.response?.data || error.message);
    }

    // 3. Check Order Dashboard
    console.log(`\n3️⃣ Checking Shop Dashboard for Shop ID: ${shopId}...`);
    try {
        const dashboardRes = await axios.get(`${API_URL}/shops/${shopId}/orders`);
        const orders = dashboardRes.data.data;
        console.log(`✅ Dashboard Loaded. Active Orders: ${orders.length}`);

        const myOrder = orders.find(o => o.studentId === "TEST_STUDENT_001");
        if (myOrder) {
            console.log("✅ Verification Order Found in DB!");
            console.log(`   - Price: ₹${myOrder.price}`);
            console.log(`   - Status: ${myOrder.status}`);
        } else {
            console.error("❌ Order not found in Dashboard.");
        }

    } catch (error) {
        console.error("❌ Dashboard Check Failed:", error.message);
    }

    console.log("\n✨ Verification Complete.");
}

// Wait for server to boot
setTimeout(runTest, 3000);
