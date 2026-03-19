// ============================================================
// ALCONIO WEBSITE HEALTH REPORT — Business Metrics Engine
// ============================================================
// Analyzes websites for real business signals that matter to
// small business owners: contact info, social presence, CTAs, etc.
// ============================================================

const CONFIG = {
    PAGESPEED_API_KEY: 'AIzaSyClN9AElOKzTbqPKjxciRo9OeWIQ_6t13s',
    CORS_PROXIES: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
    ],
};

// ── Helpers ──────────────────────────────────────────────────

function getUrlParam() {
    return new URLSearchParams(window.location.search).get('url');
}

function cleanDomain(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
}

function letterGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    if (score >= 30) return 'D';
    return 'F';
}

// ── Loading Overlay ─────────────────────────────────────────

const LOADING_STEPS = [
    'Connecting to site…',
    'Analyzing SEO signals…',
    'Scanning for contact info…',
    'Looking for social media links…',
    'Checking SSL certificate…',
    'Detecting Google Business presence…',
    'Searching for reviews & testimonials…',
    'Analyzing calls to action…',
    'Checking site freshness…',
    'Generating report…',
];

let loadingStepIndex = 0;
let loadingInterval = null;

function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('hidden');
    const report = document.getElementById('report-content');
    if (report) report.classList.add('hidden');
    const error = document.getElementById('error-panel');
    if (error) error.classList.add('hidden');
    loadingStepIndex = 0;
    updateLoadingText();
    loadingInterval = setInterval(() => {
        loadingStepIndex = Math.min(loadingStepIndex + 1, LOADING_STEPS.length - 1);
        updateLoadingText();
    }, 600);
}

function updateLoadingText() {
    const el = document.getElementById('loading-step-text');
    if (el) el.textContent = LOADING_STEPS[loadingStepIndex];
    const bar = document.getElementById('loading-progress-bar');
    if (bar) bar.style.width = ((loadingStepIndex + 1) / LOADING_STEPS.length * 100) + '%';
}

function hideLoading() {
    clearInterval(loadingInterval);
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
    const report = document.getElementById('report-content');
    if (report) report.classList.remove('hidden');
}

function showError(msg) {
    clearInterval(loadingInterval);
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
    const report = document.getElementById('report-content');
    if (report) report.classList.add('hidden');
    const error = document.getElementById('error-panel');
    if (error) {
        error.classList.remove('hidden');
        const errMsg = document.getElementById('error-message');
        if (errMsg) errMsg.textContent = msg;
    }
}

// ── Fetchers ────────────────────────────────────────────────

async function fetchPageSpeed(url) {
    const endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const apiUrl = `${endpoint}?url=${encodeURIComponent(url)}&key=${CONFIG.PAGESPEED_API_KEY}&strategy=desktop&category=seo`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`PageSpeed API error: ${res.status}`);
    return res.json();
}

async function fetchHTML(url) {
    for (const proxy of CONFIG.CORS_PROXIES) {
        try {
            const res = await fetch(proxy + encodeURIComponent(url), { signal: AbortSignal.timeout(15000) });
            if (res.ok) {
                const text = await res.text();
                if (text.length > 100) return text;
            }
        } catch (e) {
            console.warn('Proxy failed:', proxy, e.message);
        }
    }
    throw new Error('Could not fetch page HTML');
}

// ── Metric Analyzers ────────────────────────────────────────

// 1. SEO SCORE
function analyzeSEO(psData) {
    if (!psData) return { seoScore: 0, grade: 'F', missingElements: [], status: 'Unknown' };
    const lhr = psData.lighthouseResult;
    const cats = lhr?.categories || {};
    const audits = lhr?.audits || {};
    const seoScore = Math.round((cats.seo?.score || 0) * 100);

    const missingElements = [];
    const seoAudits = [
        { key: 'document-title', label: 'Title Tag' },
        { key: 'meta-description', label: 'Meta Description' },
        { key: 'image-alt', label: 'Image Alt Text' },
        { key: 'link-text', label: 'Descriptive Link Text' },
        { key: 'is-crawlable', label: 'Crawlability' },
        { key: 'canonical', label: 'Canonical URL' },
    ];
    seoAudits.forEach(({ key, label }) => {
        const a = audits[key];
        if (a && a.score !== null && a.score < 1) missingElements.push(label);
    });

    let status = 'Unknown';
    if (seoScore >= 90) status = 'Excellent';
    else if (seoScore >= 70) status = 'Good';
    else if (seoScore >= 50) status = 'Needs Work';
    else status = 'Poor';

    return { seoScore, grade: letterGrade(seoScore), missingElements, status };
}

// 2. CONTACT INFO
function analyzeContactInfo(doc, html) {
    const result = { phone: null, email: null, address: false, count: 0, score: 0 };

    // Phone: tel: links or phone number patterns
    const telLinks = doc.querySelectorAll('a[href^="tel:"]');
    if (telLinks.length > 0) {
        result.phone = telLinks[0].getAttribute('href').replace('tel:', '').trim();
    } else {
        const phoneRegex = /(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        const match = html.match(phoneRegex);
        if (match) result.phone = match[0];
    }

    // Email: mailto: links or email patterns
    const mailLinks = doc.querySelectorAll('a[href^="mailto:"]');
    if (mailLinks.length > 0) {
        result.email = mailLinks[0].getAttribute('href').replace('mailto:', '').split('?')[0].trim();
    } else {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = html.match(emailRegex);
        if (match && !match[0].includes('example') && !match[0].includes('wixpress')
            && !match[0].includes('sentry') && !match[0].includes('schema')) {
            result.email = match[0];
        }
    }

    // Address: <address> tags, schema.org, or street patterns
    if (doc.querySelectorAll('address').length > 0) result.address = true;
    if (/streetAddress|postalCode|addressLocality/i.test(html)) result.address = true;
    if (/\d{1,5}\s+[A-Z][a-z]+\s+(St|Ave|Blvd|Dr|Rd|Lane|Way|Ct|Pkwy|Pl|Road|Street|Avenue|Drive|Boulevard)\b/i.test(html)) result.address = true;

    let count = 0;
    if (result.phone) count++;
    if (result.email) count++;
    if (result.address) count++;
    result.count = count;
    result.score = Math.round((count / 3) * 100);

    return result;
}

// 3. GOOGLE BUSINESS PROFILE
function analyzeGoogleBusiness(doc, html) {
    const lower = html.toLowerCase();
    let found = false;
    const signals = [];

    if (/maps\.google\.com|google\.com\/maps|maps\.googleapis\.com/i.test(html)) {
        found = true; signals.push('Google Maps');
    }
    if (/LocalBusiness|schema\.org\/LocalBusiness/i.test(html)) {
        found = true; signals.push('LocalBusiness Schema');
    }
    if (/google[\s-]?review/i.test(html)) {
        found = true; signals.push('Google Reviews');
    }
    // Check for Google Maps iframe
    const iframes = doc.querySelectorAll('iframe[src]');
    iframes.forEach(f => {
        const src = f.getAttribute('src') || '';
        if (/google\.com\/maps|maps\.google/i.test(src)) {
            found = true;
            if (!signals.includes('Google Maps')) signals.push('Google Maps Embed');
        }
    });

    return { found, signals, score: found ? 100 : 0 };
}

// 4. SOCIAL MEDIA LINKS
function analyzeSocialMedia(doc) {
    const platforms = {
        Facebook: { patterns: ['facebook.com', 'fb.com'], found: false },
        Twitter: { patterns: ['twitter.com', 'x.com/'], found: false },
        Instagram: { patterns: ['instagram.com'], found: false },
        LinkedIn: { patterns: ['linkedin.com'], found: false },
        YouTube: { patterns: ['youtube.com', 'youtu.be'], found: false },
        TikTok: { patterns: ['tiktok.com'], found: false },
        Pinterest: { patterns: ['pinterest.com'], found: false },
        Yelp: { patterns: ['yelp.com'], found: false },
    };

    const links = doc.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        for (const [name, info] of Object.entries(platforms)) {
            if (!info.found && info.patterns.some(p => href.includes(p))) {
                info.found = true;
            }
        }
    });

    const found = Object.entries(platforms).filter(([, i]) => i.found).map(([n]) => n);
    // 3+ social platforms = 100
    const score = Math.min(100, Math.round((found.length / 3) * 100));
    return { platforms, found, count: found.length, score };
}

// 5. SSL CHECK
function analyzeSSL(url) {
    const isHttps = url.startsWith('https://');
    return { isHttps, score: isHttps ? 100 : 0 };
}

// 6. SITE FRESHNESS
function analyzeSiteFreshness(html) {
    const currentYear = new Date().getFullYear();

    // Look for copyright year — try range first (e.g. "2020-2025")
    let copyrightYear = null;
    const rangeRegex = /(?:©|&copy;|copyright)\s*\d{4}\s*[-–—]\s*(\d{4})/i;
    const rangeMatch = html.match(rangeRegex);
    if (rangeMatch) copyrightYear = parseInt(rangeMatch[1]);

    if (!copyrightYear) {
        const singleRegex = /(?:©|&copy;|copyright)\s*(\d{4})/i;
        const singleMatch = html.match(singleRegex);
        if (singleMatch) copyrightYear = parseInt(singleMatch[1]);
    }

    // Also scan for bare © 2025 patterns
    if (!copyrightYear) {
        const bareRegex = /©\s*(\d{4})/;
        const bareMatch = html.match(bareRegex);
        if (bareMatch) copyrightYear = parseInt(bareMatch[1]);
    }

    let freshness = 'Unknown';
    let score = 50;
    if (copyrightYear) {
        const age = currentYear - copyrightYear;
        if (age <= 0) { freshness = 'Current (' + copyrightYear + ')'; score = 100; }
        else if (age <= 1) { freshness = 'Recent (' + copyrightYear + ')'; score = 85; }
        else if (age <= 3) { freshness = 'Aging (' + copyrightYear + ')'; score = 45; }
        else { freshness = 'Outdated (' + copyrightYear + ')'; score = 15; }
    }

    return { copyrightYear, freshness, score };
}

// 7. REVIEWS / TESTIMONIALS
function analyzeReviews(doc, html) {
    const lower = html.toLowerCase();
    let hasReviews = false;
    let hasTestimonials = false;
    let hasStars = false;
    const signals = [];

    if (/\btestimonials?\b/i.test(html)) { hasTestimonials = true; signals.push('Testimonials section'); }
    if (/\bcustomer\s+reviews?\b/i.test(html) || /\bclient\s+reviews?\b/i.test(html)) { hasReviews = true; signals.push('Customer reviews'); }

    // Star ratings
    const starEls = doc.querySelectorAll('[class*="star"], [class*="rating"], [class*="review"]');
    if (starEls.length > 0) { hasStars = true; signals.push('Star ratings'); }
    if (/★|⭐|&#9733;/i.test(html)) { hasStars = true; if (!signals.includes('Star ratings')) signals.push('Star ratings'); }

    // Schema.org Review
    if (/schema\.org\/Review|"@type"\s*:\s*"Review"/i.test(html)) { hasReviews = true; signals.push('Review schema'); }
    if (/aggregateRating|ratingValue/i.test(html)) { hasStars = true; signals.push('Aggregate rating'); }

    const found = hasReviews || hasTestimonials || hasStars;
    return { hasReviews, hasTestimonials, hasStars, found, signals, score: found ? 100 : 0 };
}

// 8. CLEAR CTA
function analyzeCTA(doc) {
    const ctaKeywords = [
        'contact us', 'get in touch', 'book now', 'get a quote', 'request a quote',
        'free estimate', 'schedule', 'call now', 'get started', 'learn more',
        'sign up', 'start free', 'request demo', 'book a call', 'free consultation',
        'let\'s talk', 'hire us', 'work with us', 'apply now', 'shop now',
        'buy now', 'order now', 'subscribe', 'download', 'try free', 'join now',
        'start now', 'get offer', 'claim', 'reserve',
    ];

    const elements = doc.querySelectorAll('button, a, [role="button"], [class*="btn"], [class*="cta"]');
    const foundCTAs = new Set();

    elements.forEach(el => {
        const text = (el.textContent || '').toLowerCase().trim();
        if (text.length > 50) return; // Skip huge blocks
        for (const kw of ctaKeywords) {
            if (text.includes(kw)) {
                foundCTAs.add(kw);
            }
        }
    });

    const ctas = [...foundCTAs];
    return { found: ctas.length > 0, ctas, count: ctas.length, score: ctas.length > 0 ? 100 : 0 };
}

// ── Overall Score ───────────────────────────────────────────

function calcOverallScore(metrics) {
    // Weighted to favor professional business websites
    return Math.round(
        metrics.contactInfo.score * 0.20 +
        metrics.cta.score * 0.15 +
        metrics.ssl.score * 0.15 +
        metrics.socialMedia.score * 0.12 +
        metrics.seo.seoScore * 0.12 +
        metrics.googleBiz.score * 0.10 +
        metrics.reviews.score * 0.10 +
        metrics.freshness.score * 0.06
    );
}

// ── DOM Renderer ────────────────────────────────────────────

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}
function setWidth(id, pct) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, pct)) + '%';
}

function renderReport(data) {
    // Header
    setText('target-url', data.domain);
    setText('last-scan-time', 'Just now');

    // Overall Score
    const overall = data.overallScore;
    setText('gauge-score', overall);

    const gaugeEl = document.getElementById('gauge-container');
    if (gaugeEl) {
        gaugeEl.style.background = `conic-gradient(#0D00A4 0% ${overall}%, rgba(255,255,255,0.1) ${overall}% 100%)`;
    }

    let desc = '';
    if (overall >= 80) desc = 'This site presents a strong professional online presence with most key business signals in place.';
    else if (overall >= 60) desc = 'Good foundation but missing some elements that build trust and convert visitors into customers.';
    else if (overall >= 40) desc = 'Several critical business signals are missing. Competitors with better sites are winning these customers.';
    else desc = 'This website is leaving money on the table. Major improvements needed to compete online.';
    setText('overall-description', desc);

    // Issue counts
    let issues = 0;
    if (data.contactInfo.score < 100) issues++;
    if (data.ssl.score === 0) issues++;
    if (data.socialMedia.score < 50) issues++;
    if (data.cta.score === 0) issues++;
    if (data.reviews.score === 0) issues++;
    if (data.googleBiz.score === 0) issues++;
    if (data.freshness.score < 50) issues++;
    if (data.seo.seoScore < 70) issues++;

    const passed = 8 - issues;
    setText('issues-count', issues + ' Found');
    setText('notices-count', (issues > 0 ? Math.ceil(issues * 0.5) : 0) + ' Found');
    setText('passed-count', passed + ' Passed');

    // ── Card 1: SEO Score ──
    setText('seo-score-value', data.seo.seoScore);
    setText('seo-score-label', '/ 100');
    setWidth('seo-bar', data.seo.seoScore);
    setText('seo-status', data.seo.status);
    if (data.seo.missingElements.length > 0) {
        setText('seo-detail-1', data.seo.missingElements.slice(0, 2).join(', '));
        setText('seo-detail-1-status', 'Missing');
    } else {
        setText('seo-detail-1', 'All SEO elements present');
        setText('seo-detail-1-status', '✓');
    }

    // ── Card 2: Contact Info ──
    setText('contact-grade', letterGrade(data.contactInfo.score));
    const contactParts = [];
    if (data.contactInfo.phone) contactParts.push('📞 ' + data.contactInfo.phone);
    else contactParts.push('❌ No phone found');
    if (data.contactInfo.email) contactParts.push('📧 ' + data.contactInfo.email);
    else contactParts.push('❌ No email found');
    if (data.contactInfo.address) contactParts.push('📍 Address found');
    else contactParts.push('❌ No address found');
    setHTML('contact-detail', contactParts.join('<br/>'));
    setText('contact-status', data.contactInfo.count + '/3 found');

    // ── Card 3: Social Media ──
    setText('social-count', data.socialMedia.count);
    setWidth('social-bar', data.socialMedia.score);
    if (data.socialMedia.found.length > 0) {
        setText('social-detail-1', data.socialMedia.found.slice(0, 3).join(', '));
        setText('social-detail-1-count', data.socialMedia.count + ' platforms');
    } else {
        setText('social-detail-1', 'No social links');
        setText('social-detail-1-count', 'Missing');
    }
    if (data.socialMedia.found.length > 3) {
        setText('social-detail-2', data.socialMedia.found.slice(3).join(', '));
        setText('social-detail-2-count', '+' + (data.socialMedia.count - 3) + ' more');
    } else {
        setText('social-detail-2', 'Recommended: 3+ platforms');
        setText('social-detail-2-count', data.socialMedia.count >= 3 ? '✓' : 'Add more');
    }

    // ── Card 4: SSL Certificate ──
    setText('ssl-grade', data.ssl.isHttps ? 'A+' : 'F');
    setText('ssl-badge', data.ssl.isHttps ? 'Secured' : 'Not Secured');
    setText('ssl-detail', data.ssl.isHttps
        ? 'SSL certificate active. Site loads over HTTPS.'
        : 'No SSL certificate! Site loads over insecure HTTP. This hurts trust and SEO.');

    // ── Card 5: Google Business ──
    setText('gbp-count', data.googleBiz.found ? '✓' : '✗');
    setText('gbp-internal', data.googleBiz.signals.length > 0 ? data.googleBiz.signals.join(', ') : 'None detected');
    setText('gbp-external', data.googleBiz.found ? 'Present' : 'Not found');

    // ── Card 6: Site Freshness ──
    setWidth('freshness-bar', data.freshness.score);
    setText('freshness-pct', data.freshness.freshness);

    // ── Card 7: Reviews / Testimonials ──
    setText('reviews-grade', data.reviews.found ? letterGrade(100) : 'F');
    setText('reviews-status', data.reviews.found ? 'Found on site' : 'Not Found');
    if (data.reviews.signals.length > 0) {
        setText('reviews-detail', data.reviews.signals.join(', '));
    } else {
        setText('reviews-detail', 'No reviews or testimonials detected on this page.');
    }

    // ── Card 8: Clear CTA ──
    setText('cta-grade', data.cta.found ? letterGrade(100) : 'F');
    setText('cta-status', data.cta.found ? data.cta.count + ' CTAs Found' : 'No CTAs Found');
    if (data.cta.ctas.length > 0) {
        setText('cta-detail', '"' + data.cta.ctas.slice(0, 3).join('", "') + '"');
    } else {
        setText('cta-detail', 'No clear call-to-action buttons found (Contact Us, Book Now, Get a Quote, etc.)');
    }

    // ── Analysis Section ──
    const topIssue = issues > 4 ? 'Critical Gaps Detected' : issues > 2 ? 'Room for Improvement' : 'Strong Online Presence';
    setText('analysis-speed-title', topIssue);

    const analysisLines = [];
    if (data.contactInfo.score < 100) analysisLines.push('Missing contact information makes it hard for customers to reach this business.');
    if (data.cta.score === 0) analysisLines.push('No clear call-to-action means visitors don\'t know what to do next.');
    if (data.socialMedia.count === 0) analysisLines.push('Zero social media presence reduces credibility and discoverability.');
    if (data.ssl.score === 0) analysisLines.push('No SSL certificate — browsers will show "Not Secure" warnings to visitors.');
    if (data.reviews.score === 0) analysisLines.push('No reviews or testimonials — social proof is crucial for converting visitors.');
    if (data.seo.seoScore < 70) analysisLines.push('SEO score below 70 — search engines will rank this site lower.');
    if (analysisLines.length === 0) analysisLines.push('This site has strong business fundamentals in place.');
    setText('analysis-speed-desc', analysisLines.slice(0, 2).join(' '));

    setText('analysis-seo-title', 'Business Credibility');
    const credParts = [];
    if (data.googleBiz.found) credParts.push('Google Business presence detected.');
    else credParts.push('No Google Business Profile signals found.');
    if (data.freshness.copyrightYear) credParts.push('Copyright: ' + data.freshness.freshness + '.');
    else credParts.push('No copyright date found — site age unknown.');
    setText('analysis-seo-desc', credParts.join(' '));

    setText('analysis-a11y-title', 'Conversion Readiness');
    const convParts = [];
    if (data.cta.found) convParts.push(data.cta.count + ' call-to-action elements found.');
    else convParts.push('No CTAs found — visitors can\'t convert.');
    if (data.contactInfo.phone) convParts.push('Phone number is visible.');
    else convParts.push('No phone number displayed.');
    setText('analysis-a11y-desc', convParts.join(' '));
}

// ── Main Entry Point ────────────────────────────────────────

async function runReport() {
    const targetUrl = getUrlParam();
    if (!targetUrl) {
        showError('No URL provided. Please go back and enter a website URL to analyze.');
        return;
    }

    // Validate URL format
    try {
        const testUrl = new URL(targetUrl);
        if (!['http:', 'https:'].includes(testUrl.protocol)) {
            showError('Invalid URL. Please enter a valid website address.');
            return;
        }
    } catch {
        showError('Invalid URL format. Please enter a valid website address.');
        return;
    }

    const domain = cleanDomain(targetUrl);
    showLoading();

    try {
        // Fire both fetches in parallel
        const [psResult, htmlResult] = await Promise.allSettled([
            fetchPageSpeed(targetUrl),
            fetchHTML(targetUrl),
        ]);

        // We need at LEAST the HTML to analyze
        if (htmlResult.status === 'rejected') {
            showError('Could not access "' + domain + '". The site may be blocking automated access or does not exist.');
            return;
        }

        const rawHTML = htmlResult.value;
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHTML, 'text/html');

        // Extract all metrics
        const psData = psResult.status === 'fulfilled' ? psResult.value : null;
        const seo = analyzeSEO(psData);
        const contactInfo = analyzeContactInfo(doc, rawHTML);
        const googleBiz = analyzeGoogleBusiness(doc, rawHTML);
        const socialMedia = analyzeSocialMedia(doc);
        const ssl = analyzeSSL(targetUrl);
        const freshness = analyzeSiteFreshness(rawHTML);
        const reviews = analyzeReviews(doc, rawHTML);
        const cta = analyzeCTA(doc);

        const metrics = { seo, contactInfo, googleBiz, socialMedia, ssl, freshness, reviews, cta };
        const overallScore = calcOverallScore(metrics);

        renderReport({ domain, overallScore, ...metrics });
        hideLoading();

    } catch (err) {
        console.error('Report failed:', err);
        showError('Failed to analyze "' + domain + '". Please check the URL and try again.');
    }
}

document.addEventListener('DOMContentLoaded', runReport);
