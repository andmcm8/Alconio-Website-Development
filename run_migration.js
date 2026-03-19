const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'password',
        database: process.env.DB_NAME || 'alconio'
    });

    console.log("Connected to MySQL. Running migrations...");

    const queries = [
        "ALTER TABLE clients ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER email",
        "ALTER TABLE clients ADD COLUMN IF NOT EXISTS ga_property_id VARCHAR(255) AFTER website_url",
        "ALTER TABLE uptime_logs ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER client_id",
        "ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER client_id",
        "ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER user_email",
        "ALTER TABLE modification_requests ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER user_email"
    ];

    for (const query of queries) {
        try {
            console.log(`Executing: ${query}`);
            await db.execute(query);
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log("Column already exists, skipping.");
            } else {
                console.error(`Error executing query: ${err.message}`);
            }
        }
    }

    await db.end();
    console.log("Migration finished.");
}

runMigration().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
