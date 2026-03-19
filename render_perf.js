const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 2 });
    
    // Convert absolute path to file:// URL properly
    const filePath = path.resolve('dashboard_performance.html');
    const fileUrl = 'file://' + filePath;
    console.log("Navigating to", fileUrl);
    
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    const screenshotPath = '/Users/andresmcmahon/.gemini/antigravity/brain/f218c95f-9262-4d7f-8524-7ffec3215612/perf_redesign_test_' + Date.now() + '.webp';
    await page.screenshot({ path: screenshotPath, type: 'webp', quality: 90 });
    
    console.log("Saved performance dashboard screenshot to", screenshotPath);
    await browser.close();
})();
