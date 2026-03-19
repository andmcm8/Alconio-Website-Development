const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

async function debug() {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const propertyId = process.env.GA_PROPERTY_ID;
    const client = new BetaAnalyticsDataClient({ credentials });

    const [report] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            { startDate: '7daysAgo', endDate: 'today' },
            { startDate: '14daysAgo', endDate: '8daysAgo' }
        ],
        metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'bounceRate' },
            { name: 'userEngagementDuration' },
            { name: 'newUsers' },
            { name: 'totalUsers' },
            { name: 'averageSessionDuration' },
            { name: 'engagedSessions' }
        ]
    });

    console.log("=== METRIC HEADERS ===");
    report.metricHeaders.forEach((h, i) => console.log("  [" + i + "] " + h.name));

    console.log("\n=== ALL ROWS ===");
    report.rows.forEach((row, i) => {
        console.log("\nRow " + i + ":");
        console.log("  Dimensions:", row.dimensionValues.map(d => d.value));
        row.metricValues.forEach((m, j) => {
            console.log("    " + report.metricHeaders[j].name + ": " + m.value);
        });
    });

    const currentRow = report.rows.find(r => r.dimensionValues[0].value === 'date_range_0');
    if (currentRow) {
        const sessions = parseInt(currentRow.metricValues[1].value);
        const engagementDuration = parseFloat(currentRow.metricValues[3].value);
        const avgSessionDuration = parseFloat(currentRow.metricValues[6].value);

        console.log("\n=== CALCULATIONS ===");
        console.log("Sessions: " + sessions);
        console.log("userEngagementDuration (raw total): " + engagementDuration);
        console.log("averageSessionDuration (GA4 native): " + avgSessionDuration);
        console.log("Manual avg (engagementDuration / sessions): " + (engagementDuration / sessions));
        console.log("CORRECT avg session: " + Math.round(avgSessionDuration) + "s");
    }
}

debug().catch(console.error);
