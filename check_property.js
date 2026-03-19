const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

async function checkProperty() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const client = new BetaAnalyticsDataClient({ credentials });

    console.log(`Checking Property ID: ${propertyId}`);
    
    try {
        // We can use a simple report to see if we get ANY data and what dimensions are available
        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }],
            limit: 1
        });

        console.log("Property connection SUCCESSFUL.");
        console.log("Sample Data:", JSON.stringify(response.rows, null, 2));
    } catch (e) {
        console.error("Property connection FAILED:", e.message);
    }
}

checkProperty();
