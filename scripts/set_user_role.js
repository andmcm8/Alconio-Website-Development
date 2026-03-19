/**
 * Clerk User Role Management Script
 * 
 * This script allows you to set a user's role in Clerk publicMetadata correctly.
 * 
 * Usage:
 * 1. Find the User ID in Clerk Dashboard (format: user_...)
 * 2. Run: node scripts/set_user_role.js <USER_ID> <ROLE>
 *    Example: node scripts/set_user_role.js user_2tp... admin
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables manually
function loadEnv() {
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        console.error("Error: .env file not found at " + envPath);
        process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let key = match[1];
            let value = match[2] || '';
            if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            env[key] = value;
        }
    });
    return env;
}

const env = loadEnv();
const CLERK_SECRET_KEY = env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
    console.error("Error: CLERK_SECRET_KEY not found in .env");
    process.exit(1);
}

const userId = process.argv[2];
const role = process.argv[3]; // 'admin' or 'client'
const clientId = process.argv[4];
const websiteUrl = process.argv[5];
const ga4PropertyId = process.argv[6];
const ga4MeasurementId = process.argv[7];

if (!userId || !role) {
    console.log("Usage: node scripts/set_user_role.js <USER_ID> <ROLE> [clientId] [websiteUrl] [ga4PropertyId] [ga4MeasurementId]");
    console.log("Roles: admin, client");
    console.log("Example Cloud Client: node scripts/set_user_role.js user_123 client 123 https://example.com 123456789 G-XXXXX");
    process.exit(0);
}

// Build metadata objects dynamically
const publicMetadata = { role };
const privateMetadata = {};

if (role === 'client') {
    if (clientId) publicMetadata.clientId = clientId;
    if (websiteUrl) publicMetadata.websiteUrl = websiteUrl;
    if (ga4PropertyId) privateMetadata.ga4PropertyId = ga4PropertyId;
    if (ga4MeasurementId) privateMetadata.ga4MeasurementId = ga4MeasurementId;
}

const data = JSON.stringify({
    public_metadata: publicMetadata,
    private_metadata: privateMetadata
});

const options = {
    hostname: 'api.clerk.com',
    port: 443, // Changed to 443 standard
    path: `/v1/users/${userId}/metadata`,
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Setting role '${role}' for user ${userId}...`);

const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("✅ Success! Role updated in Clerk.");
            console.log("User must sign out and sign back in for the change to take effect in their session.");
        } else {
            console.error(`❌ Error ${res.statusCode}:`, responseBody);
        }
    });
});

req.on('error', (e) => {
    console.error("❌ Request error:", e.message);
});

req.write(data);
req.end();
