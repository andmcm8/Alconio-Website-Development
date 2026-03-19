const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();
const fs = require('fs');

async function checkDual() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const client = new BetaAnalyticsDataClient({ credentials });

    console.log("=== DUAL RANGE CHECK ===");
    const [response] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            { startDate: '7daysAgo', endDate: 'today' },
            { startDate: '14daysAgo', endDate: '8daysAgo' }
        ],
        dimensions: [{ name: 'date' }],
        metrics: [
            { name: 'totalUsers' },
            { name: 'activeUsers' },
            { name: 'sessions' }
        ]
    });

    console.log("Dimension Headers:", JSON.stringify(response.dimensionHeaders));

    // Find row for 3/3
    const row33 = response.rows.find(r => r.dimensionValues[0].value === '20260303');
    if (row33) {
        console.log("Row for 20260303 found!");
        console.log("Dimension Values:", JSON.stringify(row33.dimensionValues));
        console.log("Metric Values:", JSON.stringify(row33.metricValues));
    } else {
        console.log("Row for 20260303 NOT found in dual range report?");
    }
}

checkDual().catch(console.error);
