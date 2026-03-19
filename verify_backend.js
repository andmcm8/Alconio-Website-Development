const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();
const fs = require('fs');

async function verify() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    const period = 'weekly';
    const timeseriesDateRanges = [
        { startDate: '7daysAgo', endDate: 'today' },
        { startDate: '14daysAgo', endDate: '8daysAgo' }
    ];

    // Query 1: Dynamic Timeseries (Graph)
    const [mainReport] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: timeseriesDateRanges,
        dimensions: [
            { name: 'date' }
        ],
        metrics: [
            { name: 'totalUsers' },   // 0
            { name: 'activeUsers' },  // 1
            { name: 'sessions' }     // 2
        ],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
    });

    const processRows = (report) => {
        if (!report || !report.rows) return [];
        return report.rows;
    };

    const mainRows = processRows(mainReport);

    const fillGaps = (rows, rangeIdx, type) => {
        const data = {};
        const result = [];
        const now = new Date();
        const numDays = 7;

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

        for (let i = 0; i < numDays; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() - (numDays - 1 - i) - (rangeIdx * numDays));
            const YYYY = d.getFullYear();
            const MM = String(d.getMonth() + 1).padStart(2, '0');
            const DD = String(d.getDate()).padStart(2, '0');
            const key = `${YYYY}${MM}${DD}`;

            result.push({
                label: `${parseInt(MM)}/${parseInt(DD)}`,
                value: data[key]?.users || 0,
                fullKey: key
            });
        }
        return result;
    };

    const currentSeries = fillGaps(mainRows, 0, period);

    console.log("=== CURRENT SERIES VALUES ===");
    currentSeries.forEach(s => {
        console.log(`${s.fullKey}: ${s.value}`);
    });
}

verify().catch(console.error);
