const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();
const fs = require('fs');

async function verifyFull() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    const period = 'weekly';
    const timeseriesDateRanges = [
        { startDate: '7daysAgo', endDate: 'today' },
        { startDate: '14daysAgo', endDate: '8daysAgo' }
    ];

    const [mainReport] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: timeseriesDateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [
            { name: 'totalUsers' },
            { name: 'activeUsers' },
            { name: 'sessions' }
        ],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
    });

    const fillGaps = (rows, rangeIdx, type) => {
        const data = {};
        const result = [];
        const now = new Date();
        const filteredRows = rows.filter(r => {
            return mainReport.dimensionHeaders.length > 1
                ? r.dimensionValues[1].value === `date_range_${rangeIdx}`
                : rangeIdx === 0;
        });

        filteredRows.forEach(r => {
            const key = r.dimensionValues[0].value;
            data[key] = {
                sessions: parseInt(r.metricValues[2].value),
                users: parseInt(r.metricValues[0].value)
            };
        });

        for (let i = 0; i < 7; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() - (6 - i) - (rangeIdx * 7));
            const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            result.push({ fullKey: key, value: data[key]?.users || 0 });
        }
        return result;
    };

    const currentSeries = fillGaps(mainReport.rows, 0, period);
    console.log(JSON.stringify(currentSeries, null, 2));
}

verifyFull().catch(console.error);
