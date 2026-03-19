
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

async function testWtd() {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const propertyId = process.env.GA_PROPERTY_ID;
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    const now = new Date();
    const currentDay = now.getDay();
    const wtdStart = new Date(now);
    wtdStart.setDate(now.getDate() - currentDay);
    const formatDate = (d) => d.toISOString().split('T')[0];

    const prevWtdStart = new Date(wtdStart);
    prevWtdStart.setDate(wtdStart.getDate() - 7);
    const prevWtdEnd = new Date(now);
    prevWtdEnd.setDate(now.getDate() - 7);

    const wtdDateRanges = [
        { startDate: formatDate(wtdStart), endDate: 'today' },
        { startDate: formatDate(prevWtdStart), endDate: formatDate(prevWtdEnd) }
    ];

    console.log("WTD Ranges:", JSON.stringify(wtdDateRanges, null, 2));

    const [wtdReport] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: wtdDateRanges,
        metrics: [{ name: 'totalUsers' }]
    });

    console.log("Report Rows:", JSON.stringify(wtdReport.rows, null, 2));
}

testWtd().catch(console.error);
