const express = require('express');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const cors = require('cors');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { google } = require('googleapis');
require('dotenv').config();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const mysql = require('mysql2/promise');
const cron = require('node-cron');
const Stripe = require('stripe');
const { Webhook } = require('svix');

const app = express();
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

// --- Gmail API Initialization (Enterprise Relay) ---
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
const gmailAuth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/gmail.send']
});
const gmail = google.gmail({ version: 'v1', auth: gmailAuth });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- MySQL Initialization ---
const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'alconio',
    connectTimeout: 2000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDB() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255),
                clerk_user_id VARCHAR(255),
                type VARCHAR(50), 
                title VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS client_late_fees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stripe_customer_id VARCHAR(255),
                invoice_id VARCHAR(255),
                fee_amount_cents INT,
                description VARCHAR(255),
                status VARCHAR(50) DEFAULT 'unpaid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS performance_metrics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id VARCHAR(255),
                clerk_user_id VARCHAR(255),
                strategy ENUM('desktop', 'mobile'),
                metrics_json JSON,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX (client_id, strategy),
                INDEX (clerk_user_id)
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS clients (
                email VARCHAR(255) PRIMARY KEY,
                clerk_user_id VARCHAR(255),
                company_name VARCHAR(255),
                website_url VARCHAR(255),
                ga_property_id VARCHAR(255),
                service_plan VARCHAR(50),
                monthly_fee DECIMAL(10, 2),
                ecommerce VARCHAR(10),
                status VARCHAR(50) DEFAULT 'Active',
                last_uptime_status ENUM('up', 'down') DEFAULT 'up',
                last_response_status ENUM('normal', 'slow') DEFAULT 'normal',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (clerk_user_id)
            )
        `);
        // End of base tables

        await db.query(`
            CREATE TABLE IF NOT EXISTS modification_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255),
                clerk_user_id VARCHAR(255),
                title VARCHAR(255),
                description TEXT,
                urgency VARCHAR(50),
                page_section VARCHAR(255),
                status VARCHAR(50) DEFAULT 'received',
                rejection_reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (clerk_user_id)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS site_content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clerk_user_id VARCHAR(255),
                field_name VARCHAR(255),
                field_value TEXT,
                field_type ENUM('text', 'number', 'price') DEFAULT 'text',
                page_section VARCHAR(255),
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (clerk_user_id)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clerk_user_id VARCHAR(255),
                message TEXT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (clerk_user_id)
            )
        `);

        // Migration: Add columns to existing tables if they don't exist
        const migrations = [
            ["clients", "clerk_user_id", "VARCHAR(255) AFTER email"],
            ["clients", "ga_property_id", "VARCHAR(255) AFTER website_url"],
            ["uptime_logs", "clerk_user_id", "VARCHAR(255) AFTER client_id"],
            ["performance_metrics", "clerk_user_id", "VARCHAR(255) AFTER client_id"],
            ["activity_logs", "clerk_user_id", "VARCHAR(255) AFTER user_email"],
            ["modification_requests", "clerk_user_id", "VARCHAR(255) AFTER user_email"],
            ["modification_requests", "rejection_reason", "TEXT AFTER status"],
            ["modification_requests", "updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at"]
        ];

        for (const [table, column, definition] of migrations) {
            try {
                // Check if column exists first to avoid error spam
                const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
                if (columns.length === 0) {
                    console.log(`[SERVER] Migrating: Adding ${column} to ${table}`);
                    await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
                }
            } catch (err) {
                console.warn(`[SERVER] Migration warning for ${table}.${column}:`, err.message);
            }
        }
        console.log("[SERVER] MySQL Tables initialized.");
    } catch (error) {
        console.error("[SERVER] Database initialization failed:", error.message);
    }
}
initDB();

app.use(cors());

// --- Stripe Webhook Endpoint (MUST be before express.json() to capture raw body) ---
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            console.warn("[WEBHOOK] Missing STRIPE_WEBHOOK_SECRET, parsing payload without signature verification.");
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error(`[WEBHOOK] Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const amount = (invoice.amount_paid / 100).toFixed(2);
            await db.query(
                `INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`,
                [invoice.customer_email || 'System', 'SUCCESS', 'Payment Received', `Your payment of $${amount} has been received. Thank you!`]
            );
            await db.query(`UPDATE client_late_fees SET status = 'paid' WHERE invoice_id = ?`, [invoice.id]);
        } 
        else if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const amount = (invoice.amount_due / 100).toFixed(2);
            await db.query(
                `INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`,
                [invoice.customer_email || 'System', 'ERROR', 'Payment Failed', `Your payment of $${amount} was unsuccessful. Please update your payment method to avoid service interruption.`]
            );
        }
        else if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object;
            const previousAttr = event.data.previous_attributes;
            if (previousAttr && previousAttr.cancel_at_period_end !== undefined) {
                const autopayEnabled = !subscription.cancel_at_period_end;
                const title = autopayEnabled ? 'Autopay Enabled' : 'Autopay Disabled';
                let paymentMethod = 'XXXX';
                if (subscription.default_payment_method) {
                    try {
                        const pm = await stripe.paymentMethods.retrieve(subscription.default_payment_method);
                        if (pm.card) paymentMethod = pm.card.last4;
                    } catch(e) {}
                }
                const message = autopayEnabled 
                    ? `Automatic payments have been enabled. Your card ending in ${paymentMethod} will be charged automatically on the 1st of each month.`
                    : `Automatic payments have been disabled. You will need to make payments manually each month.`;
                let email = 'System';
                try {
                    const customer = await stripe.customers.retrieve(subscription.customer);
                    email = customer.email || 'System';
                } catch(e) {}
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, [email, 'INFO', title, message]);
            }
        }
        res.json({ received: true });
    } catch (e) {
        console.error('[WEBHOOK] Error handling event:', e);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// --- Clerk Webhooks Endpoint ---
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const payloadString = req.body.toString('utf8');
        const svixHeaders = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        };
        const secret = process.env.CLERK_WEBHOOK_SECRET;
        let evt;
        if (secret && secret !== 'whsec_your_clerk_webhook_secret_here') {
            const wh = new Webhook(secret);
            try {
                evt = wh.verify(payloadString, svixHeaders);
            } catch (err) {
                console.warn('[WEBHOOK] Clerk signature verification failed.');
                return res.status(400).json({ error: 'Invalid Clerk Signature' });
            }
        } else {
            try {
                evt = JSON.parse(payloadString);
            } catch (err) {
                return res.status(400).json({ error: 'Invalid JSON payload' });
            }
        }
        const { type, data } = evt || {};
        if (!type || !data) return res.status(400).json({ error: 'Malformed webhook event' });
        let email = 'unknown@system.com';
        if (data.email_addresses && data.email_addresses.length > 0) {
            email = data.email_addresses[0].email_address;
        } else if (data.email_address) {
            email = data.email_address;
        } else if (data.identifier) {
            email = data.identifier;
        }
        if (type === 'user.created') {
            const msg = `Welcome to Alconio! Your dashboard is now active. Explore your performance, traffic, and more.`;
            await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                [email, 'SUCCESS', 'Welcome to Alconio', msg]);
        }
        if (type === 'session.created') {
            let device = data.browser || data.client_id || 'a new device';
            let location = data.country || data.ip_address || 'an unknown location';
            const isNewDevice = data.is_new_device || false;
            const isNewLocation = data.is_new_location || false;
            if (isNewDevice) {
                const msg = `New device logged into your account from ${location}. If this wasn't you contact us immediately`;
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'New Device Login', msg]);
            } else if (isNewLocation) {
                const msg = `New location logged into your account. If this wasn't you contact us immediately`;
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'Unfamiliar Location Login', msg]);
            } else {
                const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const msg = `You logged in from ${device} in ${location} at ${timeString}`;
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'INFO', 'Successful Login', msg]);
            }
        }
        else if (type === 'user.login_attempt') {
            if (data.status === 'failed' || data.status === 'unverified') {
                const msg = `Someone tried to log into your account incorrectly. If this wasn't you contact us`;
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'ERROR', 'Failed Login Attempt', msg]);
            }
            if (data.status === 'locked' || (data.failed_attempts && data.failed_attempts >= 5)) {
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'Account Automatically Locked', `Multiple failed login attempts detected on your account. Your account has been temporarily locked for your protection.`]);
            }
        }
        else if (type === 'user.updated') {
            const previous = data.previous_attributes || {};
            if (previous.password_enabled !== undefined && previous.password_enabled !== data.password_enabled) {
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'Password Updated', `Your password was successfully changed. If this wasn't you contact us immediately`]);
            }
            if (previous.email_addresses && previous.email_addresses.length !== data.email_addresses.length) {
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'Email Updated', `Your email address was successfully changed. If this wasn't you contact us immediately`]);
            }
            if (previous.two_factor_enabled !== undefined && previous.two_factor_enabled !== data.two_factor_enabled) {
                if (data.two_factor_enabled === true) {
                    await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                        [email, 'SUCCESS', '2FA Enabled', `Two-factor authentication has been enabled on your account.`]);
                } else {
                    await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                        [email, 'WARNING', '2FA Disabled', `Two-factor authentication has been disabled on your account.`]);
                }
            }
            if (previous.locked !== undefined && previous.locked === false && data.locked === true) {
                 await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'Account Locked', `Your account has been locked due to suspicious login activity. Contact us to restore access.`]);
            }
        }
        res.json({ received: true });
    } catch (e) {
        console.error('[WEBHOOK] Clerk processing error:', e);
        res.status(500).json({ error: 'Failed to process Clerk event' });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer dev_token') {
        const devUserId = 'user_2uBvN6C8PjXJp9Q0R1S2T3U4V5W'; 
        req.auth = { 
            userId: devUserId, 
            sessionClaims: { 
                email: 'dailyinternet2523@gmail.com',
                publicMetadata: { role: 'client', websiteUrl: 'https://arcaico.vercel.app' }
            } 
        };
        req.userRole = 'client';
        req.clerkUserId = devUserId;
        return next();
    }
    next();
});

// app.use(ClerkExpressWithAuth()); // Global middleware to populate req.auth

// Initialize GA4 Client at top level
const analyticsDataClient = (credentials && Object.keys(credentials).length > 0) ? new BetaAnalyticsDataClient({ credentials }) : null;


async function getPrimaryHostname(req) {
    if (!req) {
        console.warn('[SERVER] getPrimaryHostname called without request object');
        return null;
    }

    console.log('[DEBUG] getPrimaryHostname check. req has auth:', !!req.auth, 'req has userId:', !!req.auth?.userId);

    if (!req.auth || !req.auth.userId) return null;

    const clerkUserId = req.auth.userId;

    // 1. Try to get from sessionClaims first (snappy)
    const pub = req.auth.sessionClaims?.publicMetadata || {};
    let websiteUrl = pub.websiteUrl || pub.websiteurl;

    // 2. If missing from session, fetch directly from Clerk API (reliable)
    if (!websiteUrl) {
        try {
            console.log(`[AUTH] Fetching websiteUrl directly from Clerk API for ${clerkUserId}`);
            const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
                headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
            });
            if (clerkRes.ok) {
                const user = await clerkRes.json();
                websiteUrl = user.public_metadata?.websiteUrl || user.public_metadata?.websiteurl;
                console.log(`[AUTH] Got websiteUrl: ${websiteUrl}`);
            } else {
                console.warn(`[AUTH] Clerk API returned ${clerkRes.status} for ${clerkUserId}`);
            }
        } catch (e) {
            console.warn(`[AUTH] Failed to fetch user from Clerk API: ${e.message}`);
        }
    }

    if (websiteUrl) {
        try {
            const urlString = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
            const url = new URL(urlString);
            return url.hostname;
        } catch (e) {
            console.warn(`[AUTH] Invalid websiteUrl: ${websiteUrl}`);
        }
    }

    // 3. Last resort - check database
    try {
        const [rows] = await db.query('SELECT website_url FROM clients WHERE clerk_user_id = ? OR email = ?', 
            [clerkUserId, req.auth?.sessionClaims?.email]);
        if (rows.length > 0 && rows[0].website_url) {
            const dbUrl = rows[0].website_url;
            const urlString = dbUrl.startsWith('http') ? dbUrl : `https://${dbUrl}`;
            const url = new URL(urlString);
            return url.hostname;
        }
    } catch (dbErr) {
        console.warn(`[AUTH] DB fallback for hostname failed: ${dbErr.message}`);
    }

    return null;
}

// --- CLERK METADATA SECURE FETCHING & CACHING ---
const clerkMetadataCache = new Map();
const CLERK_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function getClerkUserMetadata(userId) {
    if (!userId) return null;
    
    const cached = clerkMetadataCache.get(userId);
    if (cached && (Date.now() - cached.timestamp < CLERK_CACHE_TTL)) {
        return cached.metadata;
    }

    try {
        console.log(`[CLERK] Fetching private metadata for user: ${userId}`);
        const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Clerk API error: ${response.status}`);
        
        const userData = await response.json();
        const metadata = {
            publicMetadata: userData.public_metadata || {},
            privateMetadata: userData.private_metadata || {}
        };

        clerkMetadataCache.set(userId, {
            metadata,
            timestamp: Date.now()
        });

        return metadata;
    } catch (err) {
        console.error(`[CLERK] Error fetching metadata for ${userId}:`, err.message);
        return null;
    }
}

// Helper to get client property ID from Clerk private metadata
async function getClientPropertyId(req) {
    // 1. Bypass check (if localhost and mock session)
    if (process.env.NODE_ENV === 'development' && req.headers['x-mock-session'] === 'true') {
        return process.env.GA_PROPERTY_ID || '476231264';
    }

    // 1b. Dev token bypass (local development without Clerk)
    if (req.headers.authorization === 'Bearer dev_token') {
        return process.env.GA_PROPERTY_ID || '476231264';
    }

    // 2. Extract Clerk User ID
    const userId = req.auth ? req.auth.userId : (req.session ? req.session.userId : null);
    if (!userId) {
        console.warn("[AUTH] No user ID found for property ID lookup.");
        return null;
    }

    // 3. Fetch Metadata (from cache or API)
    const metadata = await getClerkUserMetadata(userId);
    if (!metadata) return null;

    const priv = metadata.privateMetadata || {};
    const pub = metadata.publicMetadata || {};

    // 4. Client-Specific ID (Preferred)
    if (priv.ga4PropertyId) {
        return priv.ga4PropertyId;
    }

    // 5. Admin Fallback (use environment variable)
    if (pub.role === 'admin') {
        return process.env.GA_PROPERTY_ID;
    }

    console.warn(`[AUTH] No ga4PropertyId found for user ${userId}.`);
    return null;
}

// Helper to check if current user is an admin
function isAdmin(req) {
    const userEmail = req.auth?.sessionClaims?.email;
    const role = req.auth?.sessionClaims?.publicMetadata?.role;
    return role === 'admin' || userEmail === 'and.mcm123@gmail.com';
}

// Sync clients from JSON to MySQL to ensure clerk_user_id is available in DB
async function syncClientsFromJSON() {
    try {
        const clientsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'clients.json'), 'utf8'));
        console.log(`[SERVER] Syncing ${clientsData.length} clients from JSON to MySQL...`);
        
        for (const client of clientsData) {
            if (client.email && client.clerk_user_id) {
                await db.query(`
                    INSERT INTO clients (email, clerk_user_id, website_url, ga_property_id)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    clerk_user_id = VALUES(clerk_user_id),
                    ga_property_id = VALUES(ga_property_id),
                    website_url = VALUES(website_url)
                `, [client.email, client.clerk_user_id, client.website || '', client.ga_property_id || '']);
            }
        }
        console.log("[SERVER] Merchant sync complete.");
    } catch (err) {
        console.error("[SERVER] Failed to sync clients from JSON:", err.message);
    }
}
syncClientsFromJSON();

async function seedSiteContent(clerkUserId) {
    const existing = await db.query('SELECT id FROM site_content WHERE clerk_user_id = ? LIMIT 1', [clerkUserId]);
    if (existing[0].length > 0) return;

    const dummyData = [
        ['Hero Title', 'Scale Your Business with AI', 'text', 'Homepage'],
        ['Hero Subtitle', 'Expert guidance for modern enterprises', 'text', 'Homepage'],
        ['About Title', 'Our Mission', 'text', 'About'],
        ['About Description', 'We empower businesses through innovative technology.', 'text', 'About'],
        ['Standard Plan Price', '99', 'price', 'Pricing'],
        ['Premium Plan Price', '199', 'price', 'Pricing']
    ];

    for (const [name, val, type, section] of dummyData) {
        await db.query(`
            INSERT INTO site_content (clerk_user_id, field_name, field_value, field_type, page_section)
            VALUES (?, ?, ?, ?, ?)
        `, [clerkUserId, name, val, type, section]);
    }
    console.log(`[SERVER] Seeded site_content for user: ${clerkUserId}`);
}

/**
 * Helper to fetch total users from GA4 for a specific date range
 */
async function getTrafficVolume(propertyId, startDate, endDate) {
    if (!analyticsDataClient) return 0;
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            metrics: [{ name: 'totalUsers' }]
        });
        return parseInt(response?.rows?.[0]?.metricValues?.[0]?.value || 0);
    } catch (err) {
        console.error(`[SERVER] GA4 Traffic Volume error (${propertyId}):`, err.message);
        return 0;
    }
}

// Middleware to ensure user is authenticated
const requireAuth = (req, res, next) => {
    // Role and Context extraction from PUBLIC metadata (in JWT)
    if (req.auth?.sessionClaims?.publicMetadata) {
        const metadata = req.auth.sessionClaims.publicMetadata;
        req.userRole = metadata.role || 'client';
        req.clerkUserId = req.auth.userId;
    } else if (req.auth?.userId) {
        req.userRole = 'client';
        req.clerkUserId = req.auth.userId;
    }

    if (!req.clerkUserId) {
        return res.status(401).json({ error: "Unauthorized. Please sign in." });
    }

    next();
};

app.get('/api/analytics/heatmap', requireAuth, async (req, res) => {
    try {
        const propertyId = await getClientPropertyId(req);
        console.log(`[SERVER] Heatmap request for property: ${propertyId}`);

        if (!propertyId || propertyId === 'null') {
            console.error('[SERVER] Heatmap failed: No valid property ID');
            return res.status(400).json({ error: 'Property ID is required' });
        }

        if (!analyticsDataClient) {
            return res.status(500).json({ error: "Analytics client not initialized" });
        }

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '365daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
        });

        const heatmapData = {};
        if (response.rows) {
            response.rows.forEach(row => {
                const dateStr = row.dimensionValues[0].value; // YYYYMMDD
                const users = parseInt(row.metricValues[0].value);

                // Format as YYYY-MM-DD for easier front-end handling
                const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
                heatmapData[formattedDate] = users;
            });
        }

        console.log(`[SERVER] Heatmap success: ${Object.keys(heatmapData).length} days`);
        res.json(heatmapData);
    } catch (error) {
        console.error('[SERVER] Heatmap Error:', error);
        res.status(500).json({ error: 'Heatmap API failed', details: error.message });
    }
});

// --- Modifications & Site Content APIs ---

app.get('/api/content', requireAuth, async (req, res) => {
    try {
        const clerkUserId = req.clerkUserId;
        // Auto-seed if empty
        await seedSiteContent(clerkUserId);

        const [rows] = await db.query('SELECT * FROM site_content WHERE clerk_user_id = ? ORDER BY page_section', [clerkUserId]);
        
        // Group by page_section
        const grouped = rows.reduce((acc, row) => {
            acc[row.page_section] = acc[row.page_section] || [];
            acc[row.page_section].push(row);
            return acc;
        }, {});

        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/content/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { field_value } = req.body;
        const clerkUserId = req.clerkUserId;

        const [result] = await db.query(
            'UPDATE site_content SET field_value = ? WHERE id = ? AND clerk_user_id = ?',
            [field_value, id, clerkUserId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Unauthorized or record not found" });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/modifications', requireAuth, async (req, res) => {
    try {
        const clerkUserId = req.clerkUserId;
        const [rows] = await db.query('SELECT * FROM modification_requests WHERE clerk_user_id = ? ORDER BY created_at DESC', [clerkUserId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/modifications', requireAuth, async (req, res) => {
    try {
        const { title, description, category, urgency, page_section } = req.body;
        const clerkUserId = req.clerkUserId;
        const userEmail = req.auth?.sessionClaims?.email || '';

        await db.query(
            'INSERT INTO modification_requests (clerk_user_id, user_email, title, category, description, urgency, page_section, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [clerkUserId, userEmail, title, category || 'General', description, urgency || 'normal', page_section || 'all', 'received']
        );

        res.json({ success: true });
    } catch (err) {
        console.error("[SERVER] Post Modification Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/modifications', requireAuth, async (req, res) => {
    try {
        if (!isAdmin(req)) return res.status(403).json({ error: "Admin only" });
        const [rows] = await db.query('SELECT * FROM modification_requests ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/modifications/:id/status', requireAuth, async (req, res) => {
    try {
        if (!isAdmin(req)) return res.status(403).json({ error: "Admin only" });

        const { id } = req.params;
        const { status, rejection_reason } = req.body;

        const [requestRows] = await db.query('SELECT clerk_user_id, user_email, title FROM modification_requests WHERE id = ?', [id]);
        if (requestRows.length === 0) return res.status(404).json({ error: "Request not found" });
        
        const { clerk_user_id, user_email, title } = requestRows[0];

        await db.query(
            'UPDATE modification_requests SET status = ?, rejection_reason = ? WHERE id = ?',
            [status, rejection_reason || null, id]
        );

        // Prepare message
        let statusMsg = "";
        switch (status) {
            case 'received': statusMsg = "Your modification request has been received and is being reviewed."; break;
            case 'in_progress': statusMsg = "Your modification request is now in progress."; break;
            case 'completed': statusMsg = "Your modification request has been completed and is now live."; break;
            case 'rejected': statusMsg = `Your modification request was not approved. ${rejection_reason || ''}`; break;
        }

        // 1. In-app notification
        await db.query(
            'INSERT INTO notifications (clerk_user_id, message) VALUES (?, ?)',
            [clerk_user_id, statusMsg]
        );

        // 2. Email notification
        if (user_email) {
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Alconio Support" <support@alconio.com>',
                to: user_email,
                subject: `Update on your modification request: ${title}`,
                text: statusMsg
            };

            transporter.sendMail(mailOptions).catch(err => {
                console.error("[SERVER] Email sending failed:", err.message);
            });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- Notifications APIs ---

app.get('/api/notifications', requireAuth, async (req, res) => {
    try {
        const clerkUserId = req.clerkUserId;
        const [rows] = await db.query('SELECT * FROM notifications WHERE clerk_user_id = ? ORDER BY created_at DESC LIMIT 10', [clerkUserId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/notifications/unread-count', requireAuth, async (req, res) => {
    try {
        const clerkUserId = req.clerkUserId;
        const [rows] = await db.query('SELECT COUNT(*) as count FROM notifications WHERE clerk_user_id = ? AND is_read = FALSE', [clerkUserId]);
        res.json({ count: rows[0].count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/notifications/:id/read', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const clerkUserId = req.clerkUserId;
        await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND clerk_user_id = ?', [id, clerkUserId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const analyticsCache = {};
const ANALYTICS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// --- Sparkline Rolling Window Endpoint ---
app.get('/api/analytics/sparklines', requireAuth, async (req, res) => {
    const propertyId = await getClientPropertyId(req);
    if (!propertyId) return res.status(400).json({ error: 'No property ID' });
    if (!analyticsDataClient) return res.status(500).json({ error: 'Analytics client not initialized' });

    try {
        const [report] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '13daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'totalUsers' },
                { name: 'sessions' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' }
            ],
            orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
        });

        // Build daily lookup: YYYYMMDD -> { users, sessions, bounceRate, avgDuration }
        const dailyData = {};
        const now = new Date();

        // Prefill 14 days (day 0 = today, day 13 = 13 days ago)
        for (let i = 0; i <= 13; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            dailyData[key] = { users: 0, sessions: 0, bounceRate: 0, avgDuration: 0 };
        }

        // Populate from GA4 response
        if (report.rows) {
            const h = report.metricHeaders.reduce((acc, header, i) => { acc[header.name] = i; return acc; }, {});
            report.rows.forEach(row => {
                const key = row.dimensionValues[0].value;
                dailyData[key] = {
                    users: parseInt(row.metricValues[h['totalUsers']]?.value || 0),
                    sessions: parseInt(row.metricValues[h['sessions']]?.value || 0),
                    bounceRate: parseFloat(row.metricValues[h['bounceRate']]?.value || 0),
                    avgDuration: parseFloat(row.metricValues[h['averageSessionDuration']]?.value || 0)
                };
            });
        }

        // Build sorted array (oldest first): day 13 ago -> today
        const sortedDays = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            sortedDays.push(dailyData[key] || { users: 0, sessions: 0, bounceRate: 0, avgDuration: 0 });
        }
        // sortedDays has 14 entries: index 0 = 13 days ago, index 13 = today

        // Compute 7 rolling windows of 7 days each
        // Point 1 (oldest): sortedDays[1..7], Point 7 (newest): sortedDays[7..13] (ends today)
        const visitors = [], sessions = [], bounceRate = [], avgSession = [];
        
        for (let p = 0; p < 7; p++) {
            const windowStart = p + 1;
            const windowEnd = windowStart + 7;
            const window = sortedDays.slice(windowStart, windowEnd);
            const windowLen = window.length || 1;

            visitors.push(window.reduce((s, d) => s + d.users, 0));
            sessions.push(window.reduce((s, d) => s + d.sessions, 0));
            bounceRate.push(+(window.reduce((s, d) => s + d.bounceRate, 0) / windowLen * 100).toFixed(1));
            avgSession.push(+(window.reduce((s, d) => s + d.avgDuration, 0) / windowLen).toFixed(1));
        }

        res.json({
            visitors,
            sessions,
            bounceRate,
            avgSession
        });

    } catch (error) {
        console.error('[SERVER] Sparkline Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/analytics', requireAuth, async (req, res) => {
    const propertyId = await getClientPropertyId(req);
    if (!propertyId || propertyId === 'YOUR_PROPERTY_ID_HERE') {
        return res.status(500).json({ error: "Missing GA Property ID for this account." });
    }

    if (!analyticsDataClient) {
        return res.status(500).json({ error: "Analytics client not initialized. Check GOOGLE_CREDENTIALS." });
    }

    const period = req.query.period || '7days';
    console.log(`[SERVER] GA4 Request for period: ${period}`);

    // Check Cache (TEMPORARILY DISABLED FOR DIAGNOSTICS)
    let days = 7;
    if (period === '30days') days = 30;
    else if (period === '90days') days = 90;
    else if (period === 'today' || period === 'daily') days = 0;

    const dateRanges = [
        { startDate: days === 0 ? 'today' : `${days}daysAgo`, endDate: 'today' },
        { startDate: days === 0 ? 'yesterday' : `${days * 2}daysAgo`, endDate: days === 0 ? 'yesterday' : `${days + 1}daysAgo` }
    ];

    // 2. FIXED OVERVIEW RANGE (Always 7 days for the top cards)
    const overviewDateRanges = [
        { startDate: '6daysAgo', endDate: 'today' }, // 7 days inclusive: 6, 5, 4, 3, 2, 1, 0
        { startDate: '13daysAgo', endDate: '7daysAgo' } // previous 7 days
    ];



    try {
        // Helper to run reports safely and concurrently
        const safeRunReport = async (options) => {
            try {
                const [report] = await analyticsDataClient.runReport(options);
                return report;
            } catch (e) {
                console.error(`[GA4] Report failed for ${options.dimensions?.[0]?.name || 'unknown'}:`, e.message);
                return { rows: [], metricHeaders: options.metrics.map(m => ({ name: m.name })), totals: [] };
            }
        };

        // Query 3: Breakdown Reports - ALL TIME data, NOT affected by period toggle
        const allTimeRange = [{ startDate: '2020-01-01', endDate: 'today' }];
        const thirtyDaysRange = [{ startDate: '30daysAgo', endDate: 'today' }];
        const sevenDaysRange = [{ startDate: '7daysAgo', endDate: 'today' }];

        // Execute all reports in parallel
        const [
            mainReport,
            statsReport,
            channelReport,
            deviceReport,
            platformReport,
            sourceReport,
            pagesReport,
            geoReport,
            countryReport,
            landingPagesReport,
            pageViews30DayReport,
            referrersReport,
            retentionReport
        ] = await Promise.all([
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRanges,
                dimensions: [{ name: (period === 'daily' || period === 'today') ? 'dateHour' : 'date' }],
                metrics: [{ name: 'totalUsers' }, { name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'scrolledUsers' }],
                orderBys: [{ dimension: { dimensionName: (period === 'daily' || period === 'today') ? 'dateHour' : 'date' }, desc: false }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: overviewDateRanges,
                metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'bounceRate' }, { name: 'userEngagementDuration' }, { name: 'newUsers' }, { name: 'totalUsers' }, { name: 'averageSessionDuration' }, { name: 'screenPageViews' }, { name: 'scrolledUsers' }, { name: 'screenPageViewsPerUser' }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
                dimensionFilter: { notExpression: { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { value: '(not set)' } } } },
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'deviceCategory' }, { name: 'browser' }, { name: 'operatingSystem' }],
                metrics: [{ name: 'activeUsers' }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'platform' }],
                metrics: [{ name: 'activeUsers' }],
                dimensionFilter: { notExpression: { filter: { fieldName: 'platform', stringFilter: { value: '(not set)' } } } }
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'sessionSourceMedium' }],
                metrics: [{ name: 'activeUsers' }, { name: 'engagementRate' }],
                dimensionFilter: { notExpression: { filter: { fieldName: 'sessionSourceMedium', stringFilter: { value: '(not set)' } } } },
                limit: 10,
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'pagePath' }],
                metrics: [{ name: 'screenPageViews' }],
                dimensionFilter: { notExpression: { filter: { fieldName: 'pagePath', stringFilter: { value: '(not set)' } } } },
                limit: 20,
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'country' }, { name: 'city' }],
                metrics: [{ name: 'activeUsers' }],
                limit: 100,
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'country' }, { name: 'countryId' }],
                metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
                limit: 250,
                dimensionFilter: { notExpression: { filter: { fieldName: 'countryId', stringFilter: { value: '(not set)' } } } },
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'landingPage' }],
                metrics: [{ name: 'sessions' }],
                dimensionFilter: { notExpression: { filter: { fieldName: 'landingPage', stringFilter: { value: '(not set)' } } } },
                limit: 50,
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: thirtyDaysRange,
                dimensions: [{ name: 'date' }],
                metrics: [{ name: 'screenPageViews' }, { name: 'scrolledUsers' }, { name: 'activeUsers' }],
                orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: allTimeRange,
                dimensions: [{ name: 'sessionSource' }],
                metrics: [{ name: 'activeUsers' }],
                dimensionFilter: {
                    andGroup: {
                        expressions: [
                            { notExpression: { filter: { fieldName: 'sessionSource', stringFilter: { value: '(not set)' } } } },
                            { notExpression: { filter: { fieldName: 'sessionSource', stringFilter: { value: 'direct' } } } },
                            { notExpression: { filter: { fieldName: 'sessionSource', stringFilter: { value: '(direct)' } } } }
                        ]
                    }
                },
                limit: 50,
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
            }),
            safeRunReport({
                property: `properties/${propertyId}`,
                dateRanges: sevenDaysRange,
                dimensions: [{ name: 'newVsReturning' }],
                metrics: [{ name: 'activeUsers' }]
            })
        ]);

        const processRows = (report) => {
            if (!report || !report.rows) return [];
            return report.rows;
        };

        const mainRows = processRows(mainReport);
        const statsRows = processRows(statsReport);

        // Gap Filling Logic for Timeseries (Dynamic Period)
        const fillGaps = (rows, rangeIdx, type, headers) => {
            const data = {};
            const result = [];
            const now = new Date();
            const isDaily = type === 'daily' || type === 'today';
            const numDays = (type === 'monthly' || type === '30days' || type === 'last_month') ? 31 : 7;
            console.log(`[SERVER] fillGaps for "${type}" (rangeIdx: ${rangeIdx}), numDays: ${numDays}`);

            // Initial filter by range
            const filteredRows = rows.filter(r => {
                return r.dimensionValues && r.dimensionValues.length > 1
                    ? r.dimensionValues[1].value === `date_range_${rangeIdx}`
                    : rangeIdx === 0;
            });


            // Map existing data using dynamic header indices
            const nameIdxMap = (headers || []).reduce((acc, h, i) => {
                acc[h.name] = i;
                return acc;
            }, {});

            filteredRows.forEach(r => {
                const key = r.dimensionValues[0].value;
                const rowData = {
                    sessions: parseInt(r.metricValues[nameIdxMap['sessions']]?.value || 0),
                    users: parseInt(r.metricValues[nameIdxMap['totalUsers']]?.value || 0),
                    views: parseInt(r.metricValues[nameIdxMap['screenPageViews']]?.value || 0),
                    scrolledUsers: parseInt(r.metricValues[nameIdxMap['scrolledUsers']]?.value || 0)
                };
                data[key] = rowData;
            });

            if (isDaily) {
                for (let i = 0; i < 25; i++) {
                    const d = new Date(now);
                    d.setHours(now.getHours() - (24 - i) - (rangeIdx === 1 ? 24 : 0));
                    const YYYY = d.getFullYear();
                    const MM = String(d.getMonth() + 1).padStart(2, '0');
                    const DD = String(d.getDate()).padStart(2, '0');
                    const HH = String(d.getHours()).padStart(2, '0');
                    const key = `${YYYY}${MM}${DD}${HH}`;

                    result.push({
                        label: d.getHours() % 12 === 0 ? (d.getHours() === 0 ? '12am' : '12pm') : (d.getHours() % 12) + (d.getHours() >= 12 ? 'pm' : 'am'),
                        users: data[key]?.users || 0,
                        sessions: data[key]?.sessions || 0,
                        views: data[key]?.views || 0,
                        scrolledUsers: data[key]?.scrolledUsers || 0,
                        fullKey: key
                    });
                }
            } else {
                for (let i = 0; i < numDays; i++) {
                    const d = new Date(now);
                    d.setDate(now.getDate() - (numDays - 1 - i) - (rangeIdx * numDays));
                    const YYYY = d.getFullYear();
                    const MM = String(d.getMonth() + 1).padStart(2, '0');
                    const DD = String(d.getDate()).padStart(2, '0');
                    const key = `${YYYY}${MM}${DD}`;

                    result.push({
                        label: `${d.getMonth() + 1}/${d.getDate()}`,
                        users: data[key]?.users || 0,
                        sessions: data[key]?.sessions || 0,
                        views: data[key]?.views || 0,
                        scrolledUsers: data[key]?.scrolledUsers || 0,
                        fullKey: key
                    });
                }
            }
            return result;
        };

        const currentSeries = fillGaps(mainRows, 0, period, mainReport.metricHeaders);
        const previousSeries = fillGaps(mainRows, 1, period, mainReport.metricHeaders);

        const getTotals = (rows, report, rangeIdx) => {
            const h = report.metricHeaders.reduce((acc, header, i) => {
                acc[header.name] = i;
                return acc;
            }, {});

            const rangeRows = rows.filter(r => {
                const dimIdx = r.dimensionValues?.length > 1 ? 1 : 0;
                if (!r.dimensionValues || r.dimensionValues.length === 0) return rangeIdx === 0;
                return r.dimensionValues[dimIdx]?.value === `date_range_${rangeIdx}`;
            });

            if (rangeRows.length === 0) {
                return { activeUsers: 0, totalUsers: 0, sessions: 0, bounceRate: 0, avgDuration: 0, totalNewUsers: 0, userEngagementDuration: 0, avgUserDuration: 0, screenPageViews: 0, scrolledUsers: 0, screenPageViewsPerUser: 0 };
            }

            const row = rangeRows[0];
            const getMetric = (name) => parseFloat(row.metricValues[h[name]]?.value || 0);

            const activeUsers = getMetric('activeUsers');
            const totalUsers = getMetric('totalUsers');
            const sessions = getMetric('sessions');
            const bounceRate = getMetric('bounceRate');
            const avgDuration = getMetric('averageSessionDuration');
            const totalNewUsers = getMetric('newUsers');
            const userEngagementDuration = getMetric('userEngagementDuration');
            const screenPageViews = getMetric('screenPageViews');
            const scrolledUsers = getMetric('scrolledUsers');
            const screenPageViewsPerUser = getMetric('screenPageViewsPerUser');

            return { activeUsers, totalUsers, sessions, bounceRate, avgDuration, totalNewUsers, userEngagementDuration, avgUserDuration: activeUsers > 0 ? (userEngagementDuration / activeUsers) : 0, screenPageViews, scrolledUsers, screenPageViewsPerUser };
        };

        const currentTotals = getTotals(statsRows, statsReport, 0);
        const previousTotals = getTotals(statsRows, statsReport, 1);


        const currentDynamic = getTotals(mainRows, mainReport, 0);
        const previousDynamic = getTotals(mainRows, mainReport, 1);



        const formatDuration = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}m ${secs}s`;
        };

        const calculateTrend = (curr, prev) => {
            if (!prev) return 0;
            return ((curr - prev) / prev) * 100;
        };

        const deviceRows = processRows(deviceReport);
        const browsers = deviceRows.reduce((acc, r) => {
            const name = r.dimensionValues[1].value;
            acc[name] = (acc[name] || 0) + parseInt(r.metricValues[0].value);
            return acc;
        }, {});
        const os = deviceRows.reduce((acc, r) => {
            const name = r.dimensionValues[2].value;
            acc[name] = (acc[name] || 0) + parseInt(r.metricValues[0].value);
            return acc;
        }, {});
        const pageViews30DayRows = processRows(pageViews30DayReport);
        const pageViewsSeries = fillGaps(pageViews30DayRows, 0, "30days", pageViews30DayReport.metricHeaders);        const h30 = pageViews30DayReport.metricHeaders.reduce((acc, header, i) => {
            acc[header.name] = i;
            return acc;
        }, {});
        // Use report totals if available for better accuracy (GA4 de-duplicates activeUsers in totals)
        const pv30Totals = pageViews30DayReport.totals?.[0]?.metricValues;
        
        // Manual aggregation fallback if totals are missing
        const manual30DayViews = pageViews30DayRows.reduce((sum, r) => sum + parseInt(r.metricValues[h30['screenPageViews']]?.value || 0), 0);
        const manual30DayScrolled = pageViews30DayRows.reduce((sum, r) => sum + parseInt(r.metricValues[h30['scrolledUsers']]?.value || 0), 0);
        const manual30DayActiveUsers = pageViews30DayRows.reduce((sum, r) => sum + parseInt(r.metricValues[h30['activeUsers']]?.value || 0), 0);

        const total30DayViews = pv30Totals ? parseInt(pv30Totals[h30['screenPageViews']]?.value || 0) : manual30DayViews;
        const total30DayScrolled = pv30Totals ? parseInt(pv30Totals[h30['scrolledUsers']]?.value || 0) : manual30DayScrolled;
        const total30DayActiveUsers = pv30Totals ? parseInt(pv30Totals[h30['activeUsers']]?.value || 0) : manual30DayActiveUsers;
        
        // Final fallback for views per user calculation (prevent divide by zero)
        const viewsPerUser30Day = total30DayActiveUsers > 0 ? (total30DayViews / total30DayActiveUsers) : 0;

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');

        const response = {
            timeseries: {
                labels: currentSeries.map(s => s.label),
                currentSessions: currentSeries.map(s => s.sessions),
                previousSessions: previousSeries.map(s => s.sessions),
                currentViews: currentSeries.map(s => s.views),
                previousViews: previousSeries.map(s => s.views),
                currentScrolled: currentSeries.map(s => s.scrolledUsers),
                previousScrolled: previousSeries.map(s => s.scrolledUsers),
                // Dedicated 30-day series for the Screen Page Views graph
                pageViews30Day: {
                    labels: (typeof pageViewsSeries !== 'undefined' ? pageViewsSeries : []).map(s => s.label),
                    views: (typeof pageViewsSeries !== 'undefined' ? pageViewsSeries : []).map(s => s.views),
                    scrolled: (typeof pageViewsSeries !== 'undefined' ? pageViewsSeries : []).map(s => s.scrolledUsers)
                },
                // Compatibility for main chart
                current: currentSeries.map(s => s.users),
                previous: previousSeries.map(s => s.users)
            },
            overview: {
                totalVisitors: { 
                    value: currentTotals.totalUsers,
                    trend: calculateTrend(currentTotals.totalUsers, previousTotals.totalUsers)
                },
                activeUsers: { 
                    value: currentTotals.activeUsers,
                    trend: calculateTrend(currentTotals.activeUsers, previousTotals.activeUsers)
                },
                screenPageViews: {
                    value: currentTotals.screenPageViews,
                    trend: calculateTrend(currentTotals.screenPageViews, previousTotals.screenPageViews)
                },
                scrolledUsers: {
                    value: currentTotals.scrolledUsers,
                    trend: calculateTrend(currentTotals.scrolledUsers, previousTotals.scrolledUsers)
                },
                screenPageViewsPerUser: {
                    value: (currentTotals.screenPageViews / (currentTotals.totalUsers || 1)).toFixed(2),
                    trend: calculateTrend(currentTotals.screenPageViewsPerUser, previousTotals.screenPageViewsPerUser)
                },
                totalSessions: { 
                    value: Math.round(currentTotals.sessions),
                    trend: calculateTrend(currentTotals.sessions, previousTotals.sessions)
                },
                bounceRate: { 
                    value: (currentTotals.bounceRate * 100).toFixed(1) + '%',
                    trend: calculateTrend(currentTotals.bounceRate, previousTotals.bounceRate)
                },

                avgSession: { 
                    value: currentTotals.avgDuration,
                    trend: calculateTrend(currentTotals.avgDuration, previousTotals.avgDuration)
                },
                userEngagementDuration: { 
                    value: currentTotals.avgUserDuration,
                    trend: calculateTrend(currentTotals.avgUserDuration, previousTotals.avgUserDuration)
                }
            },
            breakdowns: {
                channels: processRows(channelReport).map(r => ({
                    name: r.dimensionValues[0].value,
                    sessions: parseInt(r.metricValues[0].value),
                    users: parseInt(r.metricValues[1].value),
                    engagementRate: (parseFloat(r.metricValues[2].value) * 100).toFixed(1)
                })),
                devices: deviceRows.reduce((acc, row) => {
                    const cat = row.dimensionValues[0].value.toLowerCase();
                    acc[cat] = (acc[cat] || 0) + parseInt(row.metricValues[0].value);
                    return acc;
                }, {}),
                browsers: Object.entries(browsers).map(([name, users]) => ({ name, users })),
                os: Object.entries(os).map(([name, users]) => ({ name, users })),
                platforms: processRows(platformReport).map(r => ({
                    name: r.dimensionValues[0].value,
                    users: parseInt(r.metricValues[0].value)
                })),
                sources: processRows(sourceReport).map(r => ({
                    name: r.dimensionValues[0].value,
                    users: parseInt(r.metricValues[0].value),
                    engagementRate: (parseFloat(r.metricValues[1].value) * 100).toFixed(1)
                })),
                pages: processRows(pagesReport).map(r => ({
                    path: r.dimensionValues[0].value,
                    views: parseInt(r.metricValues[0].value)
                })),
                geo: processRows(geoReport).map(r => ({
                    country: r.dimensionValues[0].value,
                    city: r.dimensionValues[1].value,
                    users: parseInt(r.metricValues[2]?.value || r.metricValues[0].value)
                })),
                countriesDetailed: processRows(countryReport).map(r => ({
                    country: r.dimensionValues[0].value,
                    countryId: r.dimensionValues[1].value,
                    sessions: parseInt(r.metricValues[0].value),
                    users: parseInt(r.metricValues[1].value)
                })),
                retention: processRows(retentionReport).reduce((acc, r) => {
                    const key = r.dimensionValues[0].value.toLowerCase(); // 'new' or 'returning'
                    acc[key] = parseInt(r.metricValues[0].value);
                    return acc;
                }, { 'new': 0, 'returning': 0 })
            },
            topPages: processRows(pagesReport).map(r => ({
                path: r.dimensionValues[0].value,
                views: parseInt(r.metricValues[0].value)
            })),
            landingPages: processRows(landingPagesReport).map(r => ({
                path: r.dimensionValues[0].value,
                sessions: parseInt(r.metricValues[0].value)
            })),
            geography: processRows(geoReport).map(r => ({
                country: r.dimensionValues[0].value,
                city: r.dimensionValues[1].value,
                users: parseInt(r.metricValues[2]?.value || r.metricValues[0].value)
            })),
            referrers: processRows(referrersReport).map(r => ({
                name: r.dimensionValues[0].value,
                value: parseInt(r.metricValues[0].value)
            }))
        };

        // Update analytics cache
        analyticsCache[period] = {
            data: response,
            timestamp: Date.now()
        };

        res.json(response);

    } catch (error) {
        console.error("[SERVER] GA4 Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Memory cache for performance results
const performanceCache = {
    desktop: { data: null, timestamp: 0 },
    mobile: { data: null, timestamp: 0 }
};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms


/**
 * Reusable function to perform PageSpeed Insights analysis
 * Saves result to DB and updates memory cache
 */
async function performPSIAnalysis(userEmail, clerkUserId, strategy, targetUrl = null) {
    const url = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

    console.log(`[SERVER] Performance analysis (fetch) for: ${url} (${strategy}) for user ${clerkUserId}`);

    // Use API Key first if available, then JWT/Service Account
    let psiClient;
    if (process.env.GOOGLE_API_KEY) {
        psiClient = google.pagespeedonline({ version: 'v5', auth: process.env.GOOGLE_API_KEY });
    } else if (credentials) {
        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/pagespeedonline']
        );
        psiClient = google.pagespeedonline({ version: 'v5', auth });
    } else {
        throw new Error("No PageSpeed Insights API Key or Credentials found.");
    }

    const psiRes = await psiClient.pagespeedapi.runpagespeed({
        url: url,
        category: ['performance'],
        strategy: strategy
    });

    if (!psiRes.data || !psiRes.data.lighthouseResult) {
        console.error('[SERVER] PSI Response missing lighthouseResult:', JSON.stringify(psiRes.data, null, 2));
        throw new Error("PageSpeed Insights returned invalid data (lighthouseResult missing)");
    }

    const data = psiRes.data;
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse.audits || {};
    
    if (Object.keys(audits).length === 0) {
        console.warn('[SERVER] PSI audits object is empty!');
    }

    const getStatus = (score) => {
        if (score >= 0.9) return 'good';
        if (score >= 0.5) return 'needs-improvement';
        return 'poor';
    };

    const safeAuditValue = (key, property = 'numericValue', defaultValue = 0) => {
        const audit = audits[key];
        if (!audit || audit[property] === undefined || audit[property] === null) return defaultValue;
        return audit[property];
    };

    const safeAuditScore = (key) => {
        const audit = audits[key];
        return (audit && audit.score !== undefined) ? audit.score : 0;
    };

    const response = {
        url: url,
        strategy: strategy,
        lcp: {
            value: (safeAuditValue('largest-contentful-paint') / 1000).toFixed(1),
            status: getStatus(safeAuditScore('largest-contentful-paint'))
        },
        inp: {
            value: Math.round(safeAuditValue('interaction-to-next-paint') || safeAuditValue('max-potential-fid') || safeAuditValue('total-blocking-time')),
            status: getStatus(safeAuditScore('interaction-to-next-paint') || safeAuditScore('max-potential-fid') || (safeAuditScore('total-blocking-time') * 0.8))
        },
        cls: {
            value: (safeAuditValue('cumulative-layout-shift') || 0).toFixed(3),
            status: getStatus(safeAuditScore('cumulative-layout-shift'))
        },
        ttfb: Math.round(safeAuditValue('server-response-time')),
        fcp: (safeAuditValue('first-contentful-paint') / 1000).toFixed(1),
        tti: (safeAuditValue('interactive') / 1000).toFixed(1),
        tbt: Math.round(safeAuditValue('total-blocking-time')),
        speedIndex: (safeAuditValue('speed-index') / 1000).toFixed(1),
        pageSize: (safeAuditValue('total-byte-weight') / (1024 * 1024)).toFixed(2),
        requests: audits['network-requests']?.details?.items?.length || audits['diagnostics']?.details?.items?.[0]?.numRequests || 0,
        domSize: audits['dom-size']?.numericValue || parseInt(audits['dom-size']?.displayValue?.replace(/[^0-9]/g, '')) || 0,
        uptime: 100,
        response: Math.round(safeAuditValue('server-response-time'))
    };

    // Legacy FID override - retired by Google in favor of INP
    if (!audits['interaction-to-next-paint'] && audits['max-potential-fid']) {
        response.inp = {
            value: Math.round(audits['max-potential-fid'].numericValue),
            status: getStatus(audits['max-potential-fid'].score)
        };
    }

    // Save to DB
    try {
        await db.query(
            'INSERT INTO performance_metrics (client_id, clerk_user_id, strategy, metrics_json) VALUES (?, ?, ?, ?)',
            [userEmail, clerkUserId, strategy, JSON.stringify(response)]
        );
    } catch (saveError) {
        console.error('[SERVER] Failed to save performance metrics to DB:', saveError.message);
    }

    return response;
}

/**
 * Compares today's metrics with yesterday's and fires notifications if needed
 */
async function compareMetricsAndNotify(userEmail, strategy, currentData) {
    try {
        // Lookup clerk_user_id for this metrics comparison
        const [clientRows] = await db.query('SELECT clerk_user_id FROM clients WHERE email = ?', [userEmail]);
        if (clientRows.length === 0) return;
        const clerkUserId = clientRows[0].clerk_user_id;

        // Fetch the immediately preceding record
        const [rows] = await db.query(
            'SELECT metrics_json FROM performance_metrics WHERE client_id = ? AND strategy = ? AND timestamp < NOW() ORDER BY timestamp DESC LIMIT 1',
            [userEmail, strategy]
        );

        if (rows.length === 0) return; // Need at least two points to compare

        const prevData = rows[0].metrics_json;
        const strategyLabel = strategy.charAt(0).toUpperCase() + strategy.slice(1);

        // helper to check if a set of metrics is passing overall (no "poor" status)
        const isPassing = (data) => data.lcp.status !== 'poor' && data.inp.status !== 'poor' && data.cls.status !== 'poor';

        const prevPassing = isPassing(prevData);
        const currPassing = isPassing(currentData);

        // 1. Overall Status Notifications
        if (prevPassing && !currPassing) {
            await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                [userEmail, clerkUserId, 'PERFORMANCE', 'CWV Status: Failed', `Your ${strategyLabel} website is no longer passing Core Web Vitals. This may be affecting your Google search ranking.`]);
        } else if (!prevPassing && currPassing) {
            await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                [userEmail, clerkUserId, 'PERFORMANCE', 'CWV Status: Improved', `Your ${strategyLabel} website is now passing Core Web Vitals.`]);
        }

        // 2. Individual Metric Notifications
        const metrics = [
            { key: 'lcp', name: 'LCP', unit: 's', desc: 'page is loading too slowly' },
            { key: 'inp', name: 'INP', unit: 'ms', desc: 'page is responding too slowly to user interactions' },
            { key: 'cls', name: 'CLS', unit: '', desc: 'page is shifting around too much while loading' }
        ];

        for (const m of metrics) {
            const prev = prevData[m.key];
            const curr = currentData[m.key];

            // Drop to Poor
            if (prev.status !== 'poor' && curr.status === 'poor') {
                const val = curr.value + m.unit;
                await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                    [userEmail, clerkUserId, 'PERFORMANCE', `${m.name} Dropped`, `Your ${strategyLabel} ${m.name} score has dropped to Poor (${val}). Your ${m.desc} which is hurting your Google search ranking.`]);
            }
            // Recovery from Poor
            else if (prev.status === 'poor' && curr.status !== 'poor') {
                await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                    [userEmail, clerkUserId, 'PERFORMANCE', `${m.name} Recovered`, `Your ${strategyLabel} ${m.name} score has improved and is no longer in Poor territory.`]);
            }
        }
    } catch (err) {
        console.error(`[SERVER] Comparison failed for ${userEmail} (${strategy}):`, err.message);
    }
}


/**
 * Checks all-time traffic milestones and fires notifications
 */
async function checkTrafficMilestones(email, propertyId) {
    if (!analyticsDataClient) return;
    try {
        // Query total all-time visitors (from earliest date allowed by GA4)
        const totalVisitors = await getTrafficVolume(propertyId, '2020-01-01', 'today');
        
        const milestones = [1000, 5000, 10000, 25000, 50000, 75000, 100000, 250000, 500000, 750000, 1000000];
        
        for (const milestone of milestones) {
            if (totalVisitors >= milestone) {
                // Check if already notified
                const [rows] = await db.query(
                    'SELECT 1 FROM traffic_milestones WHERE client_id = ? AND milestone_value = ?',
                    [email, milestone]
                );
                
                if (rows.length === 0) {
                    // Fire notification
                    const [clientRowsMilestone] = await db.query('SELECT clerk_user_id FROM clients WHERE email = ?', [email]);
                    const clerkUserIdMilestone = clientRowsMilestone[0]?.clerk_user_id;

                    await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                        [email, clerkUserIdMilestone, 'SUCCESS', 'New Visitor Milestone!', `Your website has reached ${milestone.toLocaleString()} total visitors! 🎉`]);
                    
                    // Store in milestones table
                    await db.query(`INSERT INTO traffic_milestones (client_id, milestone_value) VALUES (?, ?)`,
                        [email, milestone]);
                }
            }
        }
    } catch (err) {
        console.error(`[SERVER] Milestone check failed for ${email}:`, err.message);
    }
}

app.get('/api/performance', requireAuth, async (req, res) => {
    try {
        const strategy = req.query.strategy === 'mobile' ? 'mobile' : 'desktop';
        const hostname = await getPrimaryHostname(req);
        const url = `https://${hostname}`;
        const forceRefresh = req.query.refresh === 'true';

        // Check for cachedOnly request
        const cachedOnly = req.query.cachedOnly === 'true';
        const userEmail = req.auth?.sessionClaims?.email || 'admin@alconio.com';
        const clerkUserId = req.clerkUserId;

        try {
            const [rows] = await db.query(
                'SELECT metrics_json, timestamp FROM performance_metrics WHERE clerk_user_id = ? AND strategy = ? ORDER BY timestamp DESC LIMIT 1',
                [clerkUserId, strategy]
            );

            if (rows.length > 0) {
                const cachedData = rows[0].metrics_json;
                const dbTimestamp = new Date(rows[0].timestamp).getTime();
                const now = Date.now();
                
                // If data is older than 24 hours, auto-refresh (as per requirements)
                const isStale = (now - dbTimestamp > 24 * 60 * 60 * 1000);
                
                if (!forceRefresh && !isStale) {
                    return res.json({ 
                        ...cachedData, 
                        isCached: true, 
                        dbTimestamp: rows[0].timestamp,
                        serverTime: new Date().toISOString()
                    });
                }
                
                if (cachedOnly && !isStale) {
                    return res.json({ 
                        ...cachedData, 
                        isCached: true, 
                        dbTimestamp: rows[0].timestamp,
                        serverTime: new Date().toISOString()
                    });
                }
            }
        } catch (dbError) {
            console.error('[SERVER] Database cache fetch failed:', dbError.message);
        }

        if (!hostname) {
            return res.status(400).json({ error: "No website URL found in your account metadata." });
        }
        
        const response = await performPSIAnalysis(userEmail, clerkUserId, strategy, hostname);
        res.json(response);
    } catch (error) {
        console.error("[SERVER] PSI Error at:", error.stack);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

app.get('/api/performance/uptime', requireAuth, async (req, res) => {
    try {
        const userEmail = req.auth?.sessionClaims?.email || 'admin@alconio.com';
        const days = parseInt(req.query.days) || 30;

        // Fetch logs for the last X days
        const [logs] = await db.query(`
            SELECT status, response_time, checked_at 
            FROM uptime_logs 
            WHERE clerk_user_id = ? 
            AND checked_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            ORDER BY checked_at ASC
        `, [req.clerkUserId, days]);

        // Calculate overall uptime percentage
        const totalChecks = logs.length;
        const upChecks = logs.filter(l => l.status === 'up').length;
        const uptimePercentage = totalChecks > 0 ? ((upChecks / totalChecks) * 100).toFixed(2) : '100.00';

        res.json({
            uptime: uptimePercentage,
            history: logs,
            period: days,
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        console.error("[SERVER] Uptime API Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// --- Provisioning Helpers ---
function generateSecurePassword() {
    const length = 12;
    const charset = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*'
    };
    
    // Ensure at least one of each
    let password = [
        charset.upper[Math.floor(Math.random() * charset.upper.length)],
        charset.lower[Math.floor(Math.random() * charset.lower.length)],
        charset.numbers[Math.floor(Math.random() * charset.numbers.length)],
        charset.special[Math.floor(Math.random() * charset.special.length)]
    ];
    
    // Fill the rest randomly
    const allChars = Object.values(charset).join('');
    for (let i = password.length; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    
    // Shuffle the array
    return password.sort(() => Math.random() - 0.5).join('');
}

// Webhooks moved earlier

// --- Admin Notification Endpoints ---
app.post('/api/admin/notifications/modification', requireAuth, async (req, res) => {
    const adminEmail = req.auth?.sessionClaims?.email || 'and.mcm123@gmail.com';
    if (adminEmail !== 'and.mcm123@gmail.com') {
        return res.status(403).json({ error: "Unauthorized. Admin only." });
    }

    const { targetEmail, status, modificationTitle } = req.body;
    if (!targetEmail || !status) return res.status(400).json({ error: "Missing required fields" });

    let title = 'Modification Update';
    let message = '';
    let type = 'INFO';

    switch (status.toLowerCase()) {
        case 'received':
            message = `We received your modification request${modificationTitle ? ' for "' + modificationTitle + '"' : ''}. We will get back to you shortly.`;
            break;
        case 'in_progress':
            message = `Your modification request${modificationTitle ? ' "' + modificationTitle + '"' : ''} is currently being worked on.`;
            break;
        case 'completed':
            message = `Your modification${modificationTitle ? ' "' + modificationTitle + '"' : ''} has been completed. Check your website to see the changes.`;
            type = 'SUCCESS';
            break;
        case 'rejected':
            message = `Your modification request${modificationTitle ? ' "' + modificationTitle + '"' : ''} was unable to be completed. Please contact us for more information.`;
            type = 'ERROR';
            break;
        default:
            return res.status(400).json({ error: "Invalid status" });
    }

    try {
        await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
            [targetEmail, type, title, message]);
        res.json({ success: true, message: "Notification sent" });
    } catch (e) {
        console.error('[SERVER] Error sending modification notification:', e);
        res.status(500).json({ error: "Failed to send notification" });
    }
});

app.post('/api/admin/notifications/announcement', requireAuth, async (req, res) => {
    const adminEmail = req.auth?.sessionClaims?.email || 'and.mcm123@gmail.com';
    if (adminEmail !== 'and.mcm123@gmail.com') {
        return res.status(403).json({ error: "Unauthorized. Admin only." });
    }

    const { announcementType, featureName, description, date, startTime, endTime } = req.body;
    
    let title = 'System Announcement';
    let message = '';
    let type = 'INFO';

    switch (announcementType) {
        case 'new_feature':
            title = `New Feature: ${featureName}`;
            message = description;
            type = 'SUCCESS';
            break;
        case 'maintenance_scheduled':
            title = 'Scheduled Maintenance';
            message = `Scheduled maintenance on ${date} from ${startTime} to ${endTime}. Your dashboard may be temporarily unavailable.`;
            type = 'WARNING';
            break;
        case 'maintenance_completed':
            title = 'Maintenance Completed';
            message = 'Scheduled maintenance has been completed. Everything is back to normal.';
            type = 'SUCCESS';
            break;
        case 'back_online':
            title = 'Dashboard Back Online';
            message = 'The dashboard is back online. We apologize for any inconvenience.';
            type = 'SUCCESS';
            break;
        default:
            return res.status(400).json({ error: "Invalid announcement type" });
    }

    try {
        // Broadcast to all active clients
        const clientsData = fs.readFileSync(CLIENTS_FILE, 'utf8');
        const clients = JSON.parse(clientsData);
        
        for (const client of clients) {
            await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                [client.email, type, title, message]);
        }
        
        res.json({ success: true, message: `Announcement sent to ${clients.length} clients` });
    } catch (e) {
        console.error('[SERVER] Error broadcasting announcement:', e);
        res.status(500).json({ error: "Failed to broadcast announcement" });
    }
});

app.post('/api/resources/modification', requireAuth, async (req, res) => {
    try {
        const userEmail = req.auth?.sessionClaims?.email || 'admin@alconio.com';
        const { title, description, urgency, pageSection } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        await db.query(`
            INSERT INTO modification_requests (user_email, clerk_user_id, title, description, urgency, page_section)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [userEmail, req.clerkUserId, title, description, urgency, pageSection]);

        // Also log this in activity_logs
        await db.query(`
            INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message)
            VALUES (?, ?, ?, ?, ?)
        `, [userEmail, req.clerkUserId, 'INFO', 'Modification Request Submitted', `We've received your request for "${title}". Our team will review it shortly.`]);

        res.json({ success: true, message: "Modification request submitted successfully" });
    } catch (error) {
        console.error("[SERVER] Modification Request Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/resources/modifications', requireAuth, async (req, res) => {
    try {
        let query = `SELECT * FROM modification_requests ORDER BY created_at DESC`;
        let params = [];

        if (!isAdmin(req)) {
            query = `SELECT * FROM modification_requests WHERE clerk_user_id = ? ORDER BY created_at DESC`;
            params = [req.clerkUserId];
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("[SERVER] Get Modifications Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// express.json() moved earlier

const CLIENTS_FILE = path.join(__dirname, 'clients.json');

// Ensure clients.json exists
if (!fs.existsSync(CLIENTS_FILE)) {
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify([]));
}

app.get('/api/clients', requireAuth, (req, res) => {
    try {
        const data = fs.readFileSync(CLIENTS_FILE, 'utf8');
        let clients = JSON.parse(data);

        // RBAC: Clients only see themselves
        if (!isAdmin(req)) {
            clients = clients.filter(c => c.clerk_user_id === req.clerkUserId);
            if (clients.length === 0) {
                return res.status(403).json({ error: "Access denied. You do not have permission to view this data." });
            }
        }

        res.json(clients);
    } catch (error) {
        console.error("[SERVER] Error reading clients.json:", error);
        res.status(500).json({ error: "Failed to load clients" });
    }
});

app.get('/api/activity-logs', requireAuth, async (req, res) => {
    try {
        // If super admin, fetch all logs. Otherwise, fetch client specific logs.
        let query = `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100`;
        let params = [];
        
        if (!isAdmin(req)) {
            query = `SELECT * FROM activity_logs WHERE clerk_user_id = ? ORDER BY created_at DESC LIMIT 100`;
            params = [req.clerkUserId];
        }
        
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (e) {
        console.error('[SERVER] MySQL Error fetching activity logs, serving fallback mock data:', e.message);
        // Fallback mock logs so the UI doesn't break while MySQL is unavailable
        const fallbackLogs = [
            { created_at: new Date().toISOString(), type: 'SUCCESS', title: 'MySQL Not Connected', message: 'This is a sample log because your database is offline.' },
            { created_at: new Date(Date.now() - 3600000).toISOString(), type: 'WARNING', title: 'Database Missing', message: 'Add DB_HOST, DB_USER, DB_PASS, DB_NAME to .env to see real logs.' },
            { created_at: new Date(Date.now() - 86400000).toISOString(), type: 'ERROR', title: 'Action Required', message: 'You have not configured your MySQL database yet.' },
            { created_at: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'SECURITY', title: 'System Setup', message: 'Activity log system deployed successfully.' }
        ];
        res.json(fallbackLogs);
    }
});

app.post('/api/onboarding/provision', async (req, res) => {
    const { email, companyName, websiteUrl, servicePlan, monthlyFee, ecommerce, ga4PropertyId, ga4MeasurementId, clientId } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const password = generateSecurePassword();
    
    // Normalize email for Clerk (strip + aliases)
    const normalizedEmail = email.replace(/\+.*(?=@)/, '');
    
    console.log(`[PROVISION] Generating account for ${normalizedEmail} (Base: ${email})...`);

    try {
        // 1. Create Clerk Account
        const clerkRes = await fetch('https://api.clerk.com/v1/users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_address: [normalizedEmail],
                password: password,
                skip_password_requirement: false,
                public_metadata: {
                    role: 'client',
                    companyName: companyName,
                    websiteUrl: websiteUrl,
                    servicePlan: (servicePlan || 'standard').toLowerCase(),
                    ecommerceEnabled: !!ecommerce
                },
                private_metadata: {
                    monthlyFee: Number(monthlyFee) || 0,
                    ga4PropertyId: ga4PropertyId
                }
            })
        });

        const clerkData = await clerkRes.json();
        if (!clerkRes.ok) {
            console.error("[CLERK ERROR]", clerkData);
            throw new Error(clerkData.errors?.[0]?.message || "Failed to create Clerk account");
        }

        console.log(`[PROVISION] Clerk account created for ${normalizedEmail}. ID: ${clerkData.id}`);

        // 2. Save to MySQL
        const clientId = Date.now().toString();
        await db.query(`
            INSERT INTO clients (id, name, website_url, ga_property_id, service_plan, monthly_fee, ecommerce, email, clerk_user_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            clientId,
            companyName,
            websiteUrl,
            ga4PropertyId,
            servicePlan,
            monthlyFee,
            ecommerce ? 'Yes' : 'No',
            normalizedEmail,
            clerkData.id,
            'Active'
        ]);

        console.log(`[PROVISION] Client saved to MySQL.`);

        // 3. Sync to clients.json
        try {
            const fs = require('fs').promises;
            const clientsPath = path.join(__dirname, 'clients.json');
            let clients = [];
            try {
                const data = await fs.readFile(clientsPath, 'utf8');
                clients = JSON.parse(data);
            } catch (e) {
                console.warn("[PROVISION] Could not read clients.json, starting fresh.");
            }

            clients.push({
                id: clientId,
                name: companyName,
                website: websiteUrl,
                plan: servicePlan,
                fee: String(monthlyFee),
                ecommerce: ecommerce ? 'Yes' : 'No',
                email: normalizedEmail,
                status: 'Active',
                date: new Date().toLocaleDateString(),
                ga_property_id: ga4PropertyId,
                clerk_user_id: clerkData.id
            });

            await fs.writeFile(clientsPath, JSON.stringify(clients, null, 2));
            console.log(`[PROVISION] Sync to clients.json success.`);
        } catch (jsonErr) {
            console.error("[PROVISION] JSON Sync Error:", jsonErr);
        }

        // 4. Send Welcome Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Alconio" <${process.env.GMAIL_USER}>`,
            to: email, // Still send to the original provided email
            subject: 'Welcome to Alconio - Your Account is Ready',
            text: `Welcome to Alconio! We've automatically provisioned your admin account.

Your login credentials:
Email: ${normalizedEmail}
Password: ${password}

Login here: https://arcaico.vercel.app/dashboard_signin.html

If you have any questions, feel free to reach out.`,
            html: `
                <div style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #0052FF; margin-top: 0;">Welcome to Alconio!</h2>
                    <p style="color: #000000; line-height: 1.6;">We've automatically provisioned your admin account and your dashboard environment is being initialized.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #000000; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Your Credentials</p>
                        <p style="margin: 10px 0 5px 0; color: #1e293b;"><strong>Email:</strong> ${normalizedEmail}</p>
                        <p style="margin: 0; color: #1e293b;"><strong>Password:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${password}</code></p>
                    </div>
                    <a href="https://arcaico.vercel.app/dashboard_signin.html" style="display: inline-block; background-color: #0052FF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">Login to Dashboard</a>
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                        This is an automated message. Please keep your credentials secure.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[PROVISION] Welcome email sent to ${email}.`);

        // 3. Save Client Data locally
        try {
            const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
            const newClient = {
                id: clientId || Date.now().toString(),
                name: companyName || "New Client",
                website: websiteUrl || "",
                plan: servicePlan || "Standard",
                fee: monthlyFee || "0.00",
                ecommerce: ecommerce || "No",
                email: normalizedEmail,
                clerk_user_id: clerkData.id,
                status: "Active",
                date: new Date().toLocaleDateString(),
                ga_property_id: ga4PropertyId,
                ga_measurement_id: ga4MeasurementId
            };
            clients.push(newClient);
            fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2));
            console.log(`[PROVISION] Client ${newClient.name} saved to clients.json.`);
        } catch (err) {
            console.error("[PROVISION ERROR] Failed to save client data:", err);
        }

        res.json({ 
            success: true, 
            message: "Account provisioned and email sent.",
            password: password,
            clerkUserId: clerkData.id
        });

    } catch (error) {
        console.error("[PROVISION ERROR]", error);
        res.status(500).json({ error: error.message });
    }
});

// =============================================
// STRIPE BILLING ROUTES
// =============================================
// Helper: Get or create a Stripe customer for the authenticated user
async function getOrCreateStripeCustomer(req) {
    const userId = req.auth?.userId;
    const email = req.auth?.sessionClaims?.email;

    if (!userId) throw new Error("Unauthorized: No user ID provided");

    // Search for existing customer by metadata
    const existing = await stripe.customers.search({
        query: `metadata['clerk_user_id']:'${userId}'`
    });

    if (existing.data.length > 0) {
        return existing.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
        email: email,
        metadata: { clerk_user_id: userId }
    });

    return customer;
}

// GET /api/billing/customer - Get billing overview
app.get('/api/billing/customer', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 1,
            expand: ['data.default_payment_method', 'data.latest_invoice']
        });

        const activeSub = subscriptions.data.find(s => ['active', 'trialing', 'past_due'].includes(s.status));

        // Get upcoming invoice if subscription exists
        let upcomingInvoice = null;
        if (activeSub) {
            try {
                upcomingInvoice = await stripe.invoices.retrieveUpcoming({
                    customer: customer.id
                });
            } catch (e) {
                // No upcoming invoice
            }
        }

        // Get customer balance
        const balance = customer.balance || 0; // in cents, negative = credit

        res.json({
            customerId: customer.id,
            email: customer.email,
            balance: balance,
            subscription: activeSub ? {
                id: activeSub.id,
                status: activeSub.status,
                currentPeriodEnd: activeSub.current_period_end,
                cancelAtPeriodEnd: activeSub.cancel_at_period_end,
                plan: {
                    amount: activeSub.items.data[0]?.price?.unit_amount || 0,
                    interval: activeSub.items.data[0]?.price?.recurring?.interval || 'month',
                    productName: activeSub.items.data[0]?.price?.product || ''
                },
                collectionMethod: activeSub.collection_method
            } : null,
            upcomingInvoice: upcomingInvoice ? {
                amountDue: upcomingInvoice.amount_due,
                dueDate: upcomingInvoice.due_date || upcomingInvoice.next_payment_attempt
            } : null
        });
    } catch (error) {
        console.error('[BILLING] Customer error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/billing/payment-methods - List payment methods
app.get('/api/billing/payment-methods', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);

        const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.id,
            type: 'card'
        });

        // Also get bank accounts
        const bankMethods = await stripe.paymentMethods.list({
            customer: customer.id,
            type: 'us_bank_account'
        });

        // Get default payment method
        const fullCustomer = await stripe.customers.retrieve(customer.id);
        const defaultPm = fullCustomer.invoice_settings?.default_payment_method;

        const allMethods = [
            ...paymentMethods.data.map(pm => ({
                id: pm.id,
                type: 'card',
                brand: pm.card.brand,
                last4: pm.card.last4,
                expMonth: pm.card.exp_month,
                expYear: pm.card.exp_year,
                isDefault: pm.id === defaultPm
            })),
            ...bankMethods.data.map(pm => ({
                id: pm.id,
                type: 'bank',
                bankName: pm.us_bank_account?.bank_name || 'Bank Account',
                last4: pm.us_bank_account?.last4 || '****',
                accountType: pm.us_bank_account?.account_type || 'checking',
                isDefault: pm.id === defaultPm
            }))
        ];

        res.json({ paymentMethods: allMethods, defaultPaymentMethod: defaultPm });
    } catch (error) {
        console.error('[BILLING] Payment methods error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/setup-intent - Create a SetupIntent for in-app card collection
app.post('/api/billing/setup-intent', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);

        const setupIntent = await stripe.setupIntents.create({
            customer: customer.id,
            // Explicitly define payment methods instead of automatic to force them to show up without Stripe Dashboard configuration
            payment_method_types: ['card', 'us_bank_account', 'paypal', 'cashapp'],
            usage: 'off_session'
        });

        res.json({ clientSecret: setupIntent.client_secret });
    } catch (error) {
        console.error('[BILLING] Setup intent error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/set-default - Set default payment method
app.post('/api/billing/set-default', requireAuth, async (req, res) => {
    try {
        const { paymentMethodId } = req.body;
        if (!paymentMethodId) return res.status(400).json({ error: 'paymentMethodId required' });

        const customer = await getOrCreateStripeCustomer(req);

        await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: paymentMethodId }
        });

        // Also update any active subscription's default payment method
        const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 1 });
        if (subs.data.length > 0) {
            await stripe.subscriptions.update(subs.data[0].id, {
                default_payment_method: paymentMethodId
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('[BILLING] Set default error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/billing/payment-method/:id - Remove a payment method
app.delete('/api/billing/payment-method/:id', requireAuth, async (req, res) => {
    try {
        await stripe.paymentMethods.detach(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('[BILLING] Detach error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/billing/invoices - List invoices
app.get('/api/billing/invoices', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);

        const invoices = await stripe.invoices.list({
            customer: customer.id,
            limit: 20,
            expand: ['data.charge']
        });

        const formatted = invoices.data.map(inv => ({
            id: inv.id,
            number: inv.number,
            date: inv.created,
            dueDate: inv.due_date,
            amount: inv.amount_due,
            amountPaid: inv.amount_paid,
            status: inv.status, // draft, open, paid, void, uncollectible
            description: inv.lines?.data?.[0]?.description || 'Monthly Dashboard Access',
            pdfUrl: inv.invoice_pdf,
            hostedUrl: inv.hosted_invoice_url,
            periodStart: inv.period_start,
            periodEnd: inv.period_end
        }));

        res.json({ invoices: formatted });
    } catch (error) {
        console.error('[BILLING] Invoices error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/billing/invoice/:id/pdf - Redirect to invoice PDF
app.get('/api/billing/invoice/:id/pdf', requireAuth, async (req, res) => {
    try {
        const invoice = await stripe.invoices.retrieve(req.params.id);
        if (invoice.invoice_pdf) {
            res.redirect(invoice.invoice_pdf);
        } else {
            res.status(404).json({ error: 'No PDF available for this invoice' });
        }
    } catch (error) {
        console.error('[BILLING] Invoice PDF error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/create-subscription - Create a subscription
app.post('/api/billing/create-subscription', requireAuth, async (req, res) => {
    try {
        const { priceId } = req.body;
        const customer = await getOrCreateStripeCustomer(req);

        // Check if already has an active subscription
        const existingSubs = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1
        });

        if (existingSubs.data.length > 0) {
            return res.status(400).json({ error: 'Customer already has an active subscription' });
        }

        // If no priceId passed, create a price for $100/month
        let actualPriceId = priceId;
        if (!actualPriceId) {
            // Search for existing product or create one
            const products = await stripe.products.list({ limit: 1, active: true });
            let product;
            if (products.data.length > 0 && products.data[0].name === 'Monthly Dashboard Access') {
                product = products.data[0];
            } else {
                product = await stripe.products.create({
                    name: 'Monthly Dashboard Access',
                    description: 'Alconio client dashboard access and analytics'
                });
            }

            const prices = await stripe.prices.list({ product: product.id, active: true, limit: 1 });
            if (prices.data.length > 0) {
                actualPriceId = prices.data[0].id;
            } else {
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: 10000, // $100.00
                    currency: 'usd',
                    recurring: { interval: 'month' }
                });
                actualPriceId = price.id;
            }
        }

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: actualPriceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription'
            },
            expand: ['latest_invoice.payment_intent']
        });

        res.json({
            subscriptionId: subscription.id,
            status: subscription.status,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
        });
    } catch (error) {
        console.error('[BILLING] Create subscription error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/cancel-subscription - Cancel subscription at period end
app.post('/api/billing/cancel-subscription', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);
        const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 1 });

        if (subs.data.length === 0) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        const updated = await stripe.subscriptions.update(subs.data[0].id, {
            cancel_at_period_end: true
        });

        res.json({ success: true, cancelAt: updated.cancel_at });
    } catch (error) {
        console.error('[BILLING] Cancel error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/toggle-autopay - Toggle auto collection
app.post('/api/billing/toggle-autopay', requireAuth, async (req, res) => {
    try {
        const { enabled } = req.body;
        const customer = await getOrCreateStripeCustomer(req);
        const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 1 });

        if (subs.data.length === 0) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        const updated = await stripe.subscriptions.update(subs.data[0].id, {
            collection_method: enabled ? 'charge_automatically' : 'send_invoice',
            ...(enabled ? {} : { days_until_due: 7 })
        });

        res.json({ success: true, collectionMethod: updated.collection_method });
    } catch (error) {
        console.error('[BILLING] Toggle autopay error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/pay-now - Pay an outstanding invoice
app.post('/api/billing/pay-now', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);

        // Find open invoices
        const invoices = await stripe.invoices.list({
            customer: customer.id,
            status: 'open',
            limit: 1
        });

        if (invoices.data.length === 0) {
            return res.status(404).json({ error: 'No outstanding invoices found' });
        }

        const invoice = invoices.data[0];

        // If the invoice has a payment_intent, return its client_secret for front-end confirmation
        if (invoice.payment_intent) {
            const pi = await stripe.paymentIntents.retrieve(invoice.payment_intent);
            if (pi.status === 'requires_payment_method' || pi.status === 'requires_confirmation') {
                return res.json({
                    clientSecret: pi.client_secret,
                    invoiceId: invoice.id,
                    amount: invoice.amount_due
                });
            }
        }

        // Otherwise, try to pay it directly
        const paid = await stripe.invoices.pay(invoice.id);
        res.json({ success: true, status: paid.status });
    } catch (error) {
        console.error('[BILLING] Pay now error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/billing/portal - Create Stripe Customer Portal session
app.post('/api/billing/portal', requireAuth, async (req, res) => {
    try {
        const customer = await getOrCreateStripeCustomer(req);

        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: `${req.headers.origin || 'http://localhost:8081'}/dashboard_billing.html`
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('[BILLING] Portal error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/billing/config - Return publishable key for front-end
app.get('/api/billing/config', (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.use(express.static('.')); // Serve static files from root for dashboard access

// --- CRON JOBS ---
cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Running daily billing checks...');
    try {
        const now = Date.now() / 1000;
        
        // 1. PAYMENT REMINDERS (Active Subscriptions)
        const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 100 });
        for (const sub of subscriptions.data) {
            const daysUntilDue = Math.round((sub.current_period_end - now) / 86400);
            let reminderMsg = null;
            
            const cost = (sub.plan.amount / 100).toFixed(2);
            if (daysUntilDue === 5) reminderMsg = `Your payment of $${cost} is due in 5 days`;
            else if (daysUntilDue === 2) reminderMsg = `Your payment of $${cost} is due in 48 hours`;
            else if (daysUntilDue === 1) reminderMsg = `Your payment of $${cost} is due in 24 hours`;

            if (reminderMsg) {
                const customer = await stripe.customers.retrieve(sub.customer);
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [customer.email || 'System', 'INFO', 'Payment Reminder', reminderMsg]);
            }
        }

        // 2. LATE PAYMENTS & FEES (Open Invoices)
        const openInvoices = await stripe.invoices.list({ status: 'open', limit: 100 });
        for (const inv of openInvoices.data) {
            const dueDate = inv.due_date || inv.created;
            const daysOverdue = Math.floor((now - dueDate) / 86400);
            const customer = await stripe.customers.retrieve(inv.customer);
            const email = customer.email || 'System';
            const baseAmount = inv.amount_due / 100;

            // Calculate accumulated late fees from our DB
            const [rows] = await db.query(`SELECT SUM(fee_amount_cents) as total FROM client_late_fees WHERE invoice_id = ? AND status = 'unpaid'`, [inv.id]);
            const accumulatedFees = (rows[0].total || 0) / 100;
            const totalOwed = (baseAmount + accumulatedFees).toFixed(2);

            if (daysOverdue === 0) {
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'WARNING', 'Payment Due Today', `Your payment is due today`]);
            } else if (daysOverdue === 1) {
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'WARNING', 'Payment Overdue', `Payment overdue — please pay within 7 days to avoid late fees`]);
            } else if (daysOverdue === 7) {
                // Day 7: Flat $10 fee
                await db.query(`INSERT INTO client_late_fees (stripe_customer_id, invoice_id, fee_amount_cents, description) VALUES (?, ?, ?, ?)`, 
                    [inv.customer, inv.id, 1000, 'Day 7 Flat Feed ($10)']);
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'ERROR', 'Late Fee Applied', `A $10 late fee has been applied to your account. Please pay immediately.`]);
            } else if (daysOverdue === 14 || daysOverdue === 21) {
                // Additional 5% of ORIGINAL amount 
                const percentageFeeCents = Math.round(inv.amount_due * 0.05);
                const percFeeStr = (percentageFeeCents / 100).toFixed(2);
                await db.query(`INSERT INTO client_late_fees (stripe_customer_id, invoice_id, fee_amount_cents, description) VALUES (?, ?, ?, ?)`, 
                    [inv.customer, inv.id, percentageFeeCents, `Day ${daysOverdue} Percentage Fee (5%)`]);
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'ERROR', 'Late Fee Escalation', `An additional $${percFeeStr} late fee (5%) has been applied to your account.`]);
            } else if (daysOverdue === 30) {
                // Suspend account
                try {
                    // Find active subscription for this invoice and pause/cancel it
                    if (inv.subscription) {
                        await stripe.subscriptions.update(inv.subscription, { pause_collection: { behavior: 'mark_uncollectible' } });
                    }
                } catch(e) { console.error('Suspend failed:', e); }
                
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'SECURITY', 'Account Suspended', `Your account has been suspended due to non-payment. Please pay your outstanding balance to restore access.`]);
            } else if (daysOverdue > 1 && daysOverdue < 30) {
                // Daily reminder while overdue
                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`, 
                    [email, 'WARNING', 'Account Overdue', `Your account balance of $${totalOwed} is overdue. A late fee of $${accumulatedFees} has been applied. Please pay immediately to avoid service interruption.`]);
            }
        }
        // 3. PERFORMANCE HEALTH AUDITING (Daily CWV Checks)
        const [clients] = await db.query('SELECT email, clerk_user_id, website_url FROM clients WHERE website_url IS NOT NULL');
        for (const c of clients) {
            const email = c.email;
            const clerkUserId = c.clerk_user_id;
            const websiteUrl = c.website_url;
            console.log(`[CRON] Auditing performance for: ${email} (${websiteUrl})`);
            
            for (const strategy of ['desktop', 'mobile']) {
                try {
                    // 1. Perform fresh scan
                    const currentData = await performPSIAnalysis(email, clerkUserId, strategy, websiteUrl);
                    
                    // 2. Compare with yesterday and notify
                    await compareMetricsAndNotify(email, strategy, currentData);
                } catch (perfErr) {
                    console.error(`[CRON] Performance audit failed for ${email} (${strategy}):`, perfErr.message);
                }
            }
        }

        // 4. TRAFFIC NOTIFICATIONS (Weekly/Monthly Changes & Milestones)
        const [gaClients] = await db.query('SELECT DISTINCT client_id FROM performance_metrics');
        for (const c of gaClients) {
            const email = c.client_id;
            
            // Get property ID for this user
            // We can look it up from performance_metrics if we stored it, or better, from our local clients.json or just a quick query
            // Since we need it for GA4, let's try to get it from the latest sessionClaims if available, or just use the one stored in clients.json
            let propertyId = null;
            try {
                const clients_data = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
                const client = clients_data.find(cl => cl.email === email);
                propertyId = client?.ga_property_id;
            } catch (err) { console.error('Failed to get propertyId from clients.json:', err.message); }

            if (!propertyId) continue;

            // A. Milestones (Daily)
            await checkTrafficMilestones(email, propertyId);

            // B. Weekly Changes (Every Sunday)
            const dayOfWeek = new Date().getDay(); // 0 = Sunday
            if (dayOfWeek === 0) {
                const thisWeek = await getTrafficVolume(propertyId, '7daysAgo', 'today');
                const lastWeek = await getTrafficVolume(propertyId, '14daysAgo', '8daysAgo');
                
                if (lastWeek > 0) {
                    const diff = thisWeek - lastWeek;
                    const pct = Math.round((diff / lastWeek) * 100);
                    
                    if (Math.abs(pct) >= 20) {
                        const trend = pct > 0 ? 'up' : 'down';
                        const emoji = pct > 0 ? '📈' : '📉';
                        await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`,
                            [email, 'INFO', `Traffic ${trend.charAt(0).toUpperCase() + trend.slice(1)} This Week`, 
                            `Your website traffic is ${trend} ${Math.abs(pct)}% this week (${thisWeek} visitors vs ${lastWeek} last week) ${emoji}`]);
                    }
                }
            }

            // C. Monthly Changes (1st of the month)
            const dayOfMonth = new Date().getDate();
            if (dayOfMonth === 1) {
                const thisMonth = await getTrafficVolume(propertyId, '30daysAgo', 'today');
                const lastMonth = await getTrafficVolume(propertyId, '60daysAgo', '31daysAgo');
                
                if (lastMonth > 0) {
                    const diff = thisMonth - lastMonth;
                    const pct = Math.round((diff / lastMonth) * 100);
                    
                    if (Math.abs(pct) >= 15) {
                        const trend = pct > 0 ? 'more' : 'fewer';
                        const emoji = pct > 0 ? '📈' : '📉';
                        await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`,
                            [email, 'INFO', `Monthly Traffic Update`, 
                            `Your website had ${Math.abs(pct)}% ${trend} visitors this month (${thisMonth} visitors vs ${lastMonth} last month) ${emoji}`]);
                    }
                }
            }
        }

    } catch(e) {
        console.error('[CRON] Error checking system health:', e.message);
    }
});

// --- Website Health Monitoring (Every 25 Minutes) ---
cron.schedule('*/25 * * * *', async () => {
    console.log('[CRON] Running Website Health Check...');
    try {
        // Sync clients.json to MySQL clients table first
        const clientsData = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
        for (const client of clientsData) {
            await db.query(`
                INSERT INTO clients (email, website_url) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE website_url = VALUES(website_url)
            `, [client.email, client.website]);
        }

        const [clients] = await db.query('SELECT email, website_url, last_uptime_status, last_response_status FROM clients');
        const now = new Date();

        for (const client of clients) {
            if (!client.website_url) continue;

            const url = client.website_url.startsWith('http') ? client.website_url : `https://${client.website_url}`;
            let status = 'up';
            let responseTime = 0;
            const startTime = Date.now();

            try {
                const response = await fetch(url, { method: 'GET', timeout: 10000 });
                responseTime = Date.now() - startTime;
                if (!response.ok) status = 'down';
            } catch (err) {
                status = 'down';
                responseTime = Date.now() - startTime;
            }

            // Log to uptime_logs
            // Lookup clerk_user_id for this client
            const [clientRowsUptime] = await db.query('SELECT clerk_user_id FROM clients WHERE email = ?', [client.email]);
            const clerkUserIdUptime = clientRowsUptime[0]?.clerk_user_id;

            await db.query(`INSERT INTO uptime_logs (client_id, clerk_user_id, status, response_time, checked_at) VALUES (?, ?, ?, ?, ?)`,
                [client.email, clerkUserIdUptime, status, responseTime, now]);

            // Notification Logic
            const prevUptime = client.last_uptime_status;
            const prevResponse = client.last_response_status;

            // 1. Site goes down
            if (prevUptime === 'up' && status === 'down') {
                await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                    [client.email, clerkUserIdUptime, 'WEBSITE_HEALTH', 'Website Down', "Your website is currently down and unreachable. We are monitoring the situation and will notify you when it's back up"]);
                
                await db.query('UPDATE clients SET last_uptime_status = ? WHERE email = ?', ['down', client.email]);
            }
            // 2. Site recovers
            else if (prevUptime === 'down' && status === 'up') {
                // Calculate downtime
                const [lastDown] = await db.query(`
                    SELECT checked_at FROM uptime_logs 
                    WHERE client_id = ? AND status = 'down' AND checked_at < ?
                    ORDER BY checked_at DESC LIMIT 1
                `, [client.email, now]);

                let downtimeStr = 'some time';
                if (lastDown.length > 0) {
                    const diffMs = now - new Date(lastDown[0].checked_at);
                    const mins = Math.floor(diffMs / 60000);
                    const hours = Math.floor(mins / 60);
                    if (hours > 0) {
                        downtimeStr = `${hours} hour${hours > 1 ? 's' : ''} ${mins % 60} minute${mins % 60 !== 1 ? 's' : ''}`;
                    } else {
                        downtimeStr = `${mins} minute${mins !== 1 ? 's' : ''}`;
                    }
                }

                await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`,
                    [client.email, 'WEBSITE_HEALTH', 'Website Recovered', `Your website is back online. It was down for ${downtimeStr}`]);
                
                await db.query('UPDATE clients SET last_uptime_status = ? WHERE email = ?', ['up', client.email]);
            }
            // 3. Site down for 1+ hour
            else if (status === 'down') {
                const [firstDown] = await db.query(`
                    SELECT checked_at FROM uptime_logs 
                    WHERE client_id = ? AND status = 'down' 
                    AND checked_at > (SELECT MAX(checked_at) FROM uptime_logs WHERE client_id = ? AND status = 'up')
                    ORDER BY checked_at ASC LIMIT 1
                `, [client.email, client.email]);

                if (firstDown.length > 0) {
                    const diffMs = now - new Date(firstDown[0].checked_at);
                    if (diffMs >= 3600000) {
                        // Check if we already fired this hour+ notification
                        const [alreadyNotified] = await db.query(`
                            SELECT 1 FROM activity_logs 
                            WHERE user_email = ? AND title = 'Critical Downtime' AND created_at > ?
                        `, [client.email, new Date(now - diffMs)]);

                        if (alreadyNotified.length === 0) {
                            await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                                [client.email, clerkUserIdUptime, 'WEBSITE_HEALTH', 'Critical Downtime', "Your website has been down for over an hour. Please contact us immediately"]);
                        }
                    }
                }
            }

            // Performance Logic
            if (status === 'up') {
                // 4. Slow Response (> 2000ms)
                if (responseTime > 2000 && prevResponse === 'normal') {
                    await db.query(`INSERT INTO activity_logs (user_email, clerk_user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                        [client.email, clerkUserIdUptime, 'WEBSITE_HEALTH', 'Slow Response Time', `Your website is responding slowly (${responseTime}ms). This may be affecting user experience`]);
                    await db.query('UPDATE clients SET last_uptime_status = ?, last_response_status = ? WHERE email = ?', ['up', 'slow', client.email]);
                }
                // 5. Normal Response (< 1000ms after slow)
                else if (responseTime < 1000 && prevResponse === 'slow') {
                    await db.query(`INSERT INTO activity_logs (user_email, type, title, message) VALUES (?, ?, ?, ?)`,
                        [client.email, 'WEBSITE_HEALTH', 'Response Time Normal', "Your website response time is back to normal"]);
                    await db.query('UPDATE clients SET last_response_status = ? WHERE email = ?', ['normal', client.email]);
                }
            }
        }
    } catch (err) {
        console.error('[CRON] Health Check Failed:', err.message);
    }
});

// --- Consultation Lead API ---
app.post('/api/consultation', async (req, res) => {
    try {
        const { name, email, business, tier, brief } = req.body;

        if (!name || !email || !business || !tier || !brief) {
            return res.status(400).json({ error: "All fields are required to initiate consultation." });
        }

        // 1. Audit Log (FAIL-SAFE: Always capture data first)
        const leadEntry = {
            timestamp: new Date().toISOString(),
            name, email, business, tier, brief
        };
        
        try {
            const leadsFilePath = path.join(__dirname, 'leads.json');
            
            let leads = [];
            try {
                if (fs.existsSync(leadsFilePath)) {
                    const existingData = fs.readFileSync(leadsFilePath, 'utf8');
                    leads = JSON.parse(existingData);
                }
            } catch (e) { console.error("[SERVER] Lead read error:", e); }
            
            leads.push(leadEntry);
            fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2));
            console.log(`[LEAD] Audit log updated for ${business}`);
        } catch (auditErr) {
            console.error("[SERVER] Audit log failure:", auditErr);
        }

        // 2. Email Relay
        const mailOptions = {
            from: `"Alconio Leads" <${process.env.EMAIL_USER}>`,
            to: 'hello@alconio.com',
            subject: `[LEAD] New Strategy Consultation: ${business}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Space Grotesk', -apple-system, sans-serif; background-color: #05080e; color: #ffffff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #111620; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; overflow: hidden; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6); }
                        .header { background: linear-gradient(135deg, #1E51FF 0%, #0A1635 100%); padding: 60px 40px; text-align: center; position: relative; }
                        .header::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(30, 81, 255, 0.2), transparent); }
                        .logo-text { font-size: 28px; font-weight: 900; letter-spacing: 0.2em; color: #ffffff; position: relative; z-index: 1; }
                        .content { padding: 48px; }
                        .title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4em; color: #1E51FF; margin-bottom: 40px; text-align: center; }
                        .lead-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 32px; }
                        .field { margin-bottom: 28px; }
                        .field:last-child { margin-bottom: 0; }
                        .label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #4b5563; margin-bottom: 10px; display: block; }
                        .value { font-size: 16px; color: #e5e7eb; line-height: 1.6; font-weight: 500; }
                        .tier-badge { display: inline-block; padding: 6px 16px; border-radius: 100px; background: rgba(30, 81, 255, 0.1); border: 1px solid rgba(30, 81, 255, 0.2); color: #1E51FF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
                        .footer { padding: 40px; text-align: center; font-size: 11px; color: #374151; border-top: 1px solid rgba(255, 255, 255, 0.03); letter-spacing: 0.05em; }
                        .accent { color: #1E51FF; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-text">ALCONIO</div>
                        </div>
                        <div class="content">
                            <h1 class="title">Strategic Intake Report</h1>
                            <div class="lead-card">
                                <div class="field">
                                    <span class="label">Principal Correspondent</span>
                                    <div class="value">${name}</div>
                                </div>
                                <div class="field">
                                    <span class="label">Direct Communication</span>
                                    <div class="value accent">${email}</div>
                                </div>
                                <div class="field">
                                    <span class="label">Corporate Entity</span>
                                    <div class="value">${business}</div>
                                </div>
                                <div class="field">
                                    <span class="label">Architecture Tier</span>
                                    <div class="tier-badge">${tier}</div>
                                </div>
                                <div class="field">
                                    <span class="label">Project Parameters</span>
                                    <div class="value" style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03);">${brief}</div>
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            &copy; ${new Date().getFullYear()} <span class="accent">ALCONIO</span> TECHNOLOGIES<br/>
                            This encrypted transmission is intended for internal strategy analysis.
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        const emailHtml = mailOptions.html;

        // 2. Email Relay (Decoupled background process via Gmail API)
        setImmediate(async () => {
            try {
                const subject = `[LEAD] New Strategy Consultation: ${business}`;
                const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
                const messageParts = [
                    `From: "Alconio Leads" <${credentials.client_email}>`,
                    `To: hello@alconio.com`,
                    `Content-Type: text/html; charset=utf-8`,
                    `MIME-Version: 1.0`,
                    `Subject: ${utf8Subject}`,
                    '',
                    emailHtml,
                ];
                const message = messageParts.join('\n');
                const encodedMessage = Buffer.from(message)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                await gmailAuth.authorize();
                await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: encodedMessage,
                    },
                });
                console.log(`[LEAD] Gmail API dispatch success for ${business}`);
            } catch (mailErr) {
                console.error("[SERVER] Gmail API Relay failed (Lead is safe in leads.json):", mailErr.message);
                
                // Fallback attempt with SMTP if configured (optional)
                try {
                    const info = await transporter.sendMail({
                        from: `"Alconio Leads" <${process.env.EMAIL_USER}>`,
                        to: 'hello@alconio.com',
                        replyTo: email,
                        subject: `[LEAD] New Strategy Consultation: ${business}`,
                        html: emailHtml
                    });
                    console.log(`[LEAD] SMTP Fallback success for ${business}. MessageID: ${info.messageId}`);
                } catch (e) {
                    console.error("[SERVER] SMTP Fallback also failed:", e);
                }
            }
        });

        return res.status(200).json({ success: true, message: "Success V3" });
    } catch (err) {
        console.error("[SERVER] Consultation core failure:", err);
        res.status(500).json({ error: "Critical integration error", details: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Analytics API proxy server running on http://localhost:${PORT}`);
});

