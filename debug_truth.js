const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

async function checkTruth() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const client = new BetaAnalyticsDataClient({ credentials });

    console.log("=== THE DEFINITIVE TRUTH (3/3) ===");
    const [response] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '2026-03-03', endDate: '2026-03-03' }],
        metrics: [
            { name: 'totalUsers' },
            { name: 'activeUsers' },
            { name: 'sessions' }
        ]
    });

    if (response.rows && response.rows[0]) {
        const m = response.rows[0].metricValues;
        console.log(`Total Users: ${m[0].value}`);
        console.log(`Active Users: ${m[1].value}`);
        console.log(`Sessions: ${m[2].value}`);
    } else {
        console.log("No data for 3/3");
    }
}

checkTruth().catch(console.error);
