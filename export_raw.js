const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();
const fs = require('fs');

async function exportRaw() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const client = new BetaAnalyticsDataClient({ credentials });

    const [mainReport] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [
            { name: 'totalUsers' },
            { name: 'activeUsers' },
            { name: 'sessions' }
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }]
    });

    fs.writeFileSync('raw_main_report.json', JSON.stringify(mainReport, null, 2));
    console.log("Exported raw_main_report.json");
}

exportRaw().catch(console.error);
