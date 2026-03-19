const { google } = require('googleapis');
require('dotenv').config();

async function checkSpecificProperty(propertyId) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });

        const analyticsadmin = google.analyticsadmin({
            version: 'v1beta',
            auth
        });

        console.log(`Checking Property: ${propertyId}...`);
        try {
            const [propRes] = await analyticsadmin.properties.get({
                name: `properties/${propertyId}`
            });
            console.log(`Property Name: ${propRes.data.displayName}`);
        } catch (e) {
            console.error(`Error getting property: ${e.message}`);
        }

        try {
            const [streamsRes] = await analyticsadmin.properties.dataStreams.list({
                parent: `properties/${propertyId}`
            });
            const streams = streamsRes.data.dataStreams || [];
            console.log(`Data Streams: ${streams.length}`);
            for (const stream of streams) {
                console.log(`  - Stream: ${stream.displayName}, ID: ${stream.webStreamData?.measurementId}`);
            }
        } catch (e) {
            console.error(`Error listing streams: ${e.message}`);
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

const propId = process.argv[2] || '472282239';
checkSpecificProperty(propId);
