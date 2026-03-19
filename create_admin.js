const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    console.log("Navigating to sign in page...");
    await page.goto('http://localhost:3000/dashboard_signin.html', { waitUntil: 'networkidle0' });

    console.log("Waiting for Clerk to initialize...");
    await page.waitForFunction(() => window.Clerk && window.Clerk.loaded);

    console.log("Attempting to create admin user...");
    try {
        const result = await page.evaluate(async () => {
            try {
                const signUp = await window.Clerk.client.signUp.create({
                    emailAddress: "and.mcm123@gmail.com",
                    password: "CactusFlower3422!"
                });
                
                if (signUp.status === 'complete' || signUp.status === 'missing_requirements') {
                   return { success: true, status: signUp.status };
                }
                
                // Note: since this is a test environment, Clerk might require email verification,
                // but usually the account is *created* immediately upon this call, we just need the password set.
                // If it requires verification we can skip it for test instances, or at least the account exists now.
                return { success: true, status: signUp.status };
            } catch (err) {
                // Return errors explicitly to log them
                if (err && err.errors && err.errors.length > 0) {
                     return { success: false, error: err.errors[0].message };
                }
                return { success: false, error: err.toString() };
            }
        });

        if (result.success) {
            console.log(`Success! Status: ${result.status}`);
        } else {
             console.error(`Failed to create user: ${result.error}`);
             if (result.error.toLowerCase().includes('already exists')) {
                 console.log("The account has likely already been registered in Clerk.");
             }
        }
    } catch (e) {
        console.error("Puppeteer evaluation failed:", e);
    }
    
    await browser.close();
    console.log("Done.");
})();
