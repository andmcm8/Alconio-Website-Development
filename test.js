const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        // Listen to console and page errors
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
        
        await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 2 });
        const fileUrl = 'http://localhost:8081/dashboard_analytics.html';
        console.log("Loading", fileUrl);
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        // Wait for jsVectorMap to render the map paths
        await page.waitForSelector('#map path', { timeout: 10000 });
        
        // Hover over the United States
        console.log("Hovering over US map path...");
        await page.hover('#map path[data-code="US"]');
        
        // Wait a tiny bit for tooltip transition
        await page.evaluate(() => new Promise(res => setTimeout(res, 500)));
        
        // Inspect the tooltip in the DOM
        const tooltipDetails = await page.evaluate(() => {
            const el = document.querySelector('.jvm-tooltip');
            if (!el) return 'No tooltip element found in DOM';
            const styles = window.getComputedStyle(el);
            return {
                html: el.innerHTML,
                parent: el.parentElement.tagName,
                display: styles.display,
                opacity: styles.opacity,
                left: styles.left,
                top: styles.top,
                width: styles.width,
                height: styles.height,
                color: styles.color,
                bg: styles.backgroundColor
            };
        });
        
        console.log("TOOLTIP DOM STATE:", tooltipDetails);
    } catch (err) {
        console.error("Puppeteer fail", err);
    }
})();
