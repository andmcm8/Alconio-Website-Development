const { google } = require('googleapis');
require('dotenv').config();

async function listProperties() {
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

        console.log("Listing Accounts...");
        const res = await analyticsadmin.accounts.list();
        const accounts = res.data.accounts || [];

        if (accounts.length === 0) {
            console.log("No accounts found for these credentials.");
            return;
        }

        for (const account of accounts) {
            console.log(`Account: ${account.displayName} (${account.name})`);
            const propRes = await analyticsadmin.properties.list({
                filter: `parent:${account.name}`
            });
            const properties = propRes.data.properties || [];
            for (const prop of properties) {
                console.log(`  - Property: ${prop.displayName} (${prop.name})`);
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
listProperties();
