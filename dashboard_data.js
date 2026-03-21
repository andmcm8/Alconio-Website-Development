// dashboard_data.js
// Central mock data and utility module for the Alconio Dashboard

// --- Live Traffic Data Source ---
// This array will be populated dynamically from Google Analytics.
let rawTrafficData = [];

// Utility to format numbers into compact strings (e.g. 1.2K, 50.4M)
function formatCompactNumber(number) {
    if (number === undefined || number === null) return "0";
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + "G";
    }
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
    }
    if (number >= 1000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    }
    return number.toString();
}

// Helper to grab slices without aggregating, just formatting labels
function extractPeriodData(rawData, pointsToKeep, useWeekdayLabel, isPrevious = false) {
    // Slices exactly the last N points requested
    const dataLength = rawData ? rawData.length : 0;
    const startIndex = isPrevious ? Math.max(0, dataLength - (2 * pointsToKeep)) : Math.max(0, dataLength - pointsToKeep);
    const endIndex = isPrevious ? Math.max(0, dataLength - pointsToKeep) : dataLength;
    const slice = rawData.slice(startIndex, endIndex);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return slice.map(d => {
        const dateObj = new Date(d.timestamp);
        let label = '';

        if (useWeekdayLabel === 'time') {
            let hours = dateObj.getHours();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            label = hours + ampm;
        } else if (useWeekdayLabel === 'weekday') {
            label = weekdays[dateObj.getDay()];
        } else {
            label = (dateObj.getMonth() + 1) + '/' + dateObj.getDate();
        }

        return { label: label, value: d.value };
    });
}

function aggregateData(rawData, period, isPrevious = false) {
    if (period === 'daily') {
        // Last 24 hours (25 points for hourly granularity including start/end)
        return extractPeriodData(rawData, 25, 'time', isPrevious);
    } else if (period === 'weekly') {
        // Last 7 days (7 points for daily granularity)
        return extractPeriodData(rawData, 7, 'weekday', isPrevious);
    } else if (period === 'monthly') {
        // Last 30 days (31 points for daily granularity including start/end)
        return extractPeriodData(rawData, 31, 'date', isPrevious);
    }
}

const MOCK_DATA = {
    overview: {
        totalVisitors: { current: 0, previous: 0, trend: 0 },
        totalUsers: { current: 0, previous: 0, trend: 0 },
        totalSessions: { current: 0, previous: 0, trend: 0 },
        bounceRate: { current: 0, previous: 0, trend: 0 },
        avgSession: { current: 0, previous: 0, trend: 0 },
        chartTotal: { current: 0, previous: 0, trend: 0 },
        screenPageViews: { current: 0, previous: 0, trend: 0 },
        scrolledUsers: { current: 0, previous: 0, trend: 0 },
        screenPageViewsPerUser: { current: 0, previous: 0, trend: 0 }
    },
    timeseries: {
        visitors: {
            daily: [],
            weekly: [],
            monthly: [],
            prevDaily: [],
            prevWeekly: [],
            prevMonthly: []
        },
        sessions: {
            daily: [],
            weekly: [],
            monthly: [],
            prevDaily: [],
            prevWeekly: [],
            prevMonthly: []
        },
        bounceRate: []
    },
    topPages: [],
    landingPages: [],
    geography: {},
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    browsers: [],
    os: [],
    platforms: [],
    channels: [],
    trafficSources: [],
    cities: [],
    referrers: [],
    retention: { new: 0, returning: 0 },
    currentMetrics: {
        totalUsers: 0,
        totalSessions: 0,
        newUsersRatio: 0,
        newUsers: 0,
        returningUsers: 0,
        totalSessions: 0,
        avgSessionDuration: "0m 0s",
        userEngagementDuration: "0m 0s",
        screenPageViews: 0,
        scrolledUsers: 0,
        screenPageViewsPerUser: 0
    },
    pageViewsSeries30d: {
        labels: [],
        views: [],
        scrolled: []
    },
    performance: {
        lcp: { value: 0, status: 'good' },
        inp: { value: 0, status: 'good' },
        cls: { value: 0, status: 'good' },
        ttfb: 0,
        fcp: 0,
        tti: 0,
        tbt: 0,
        speedIndex: 0,
        pageSize: "0MB",
        requests: 0,
        domSize: 0,
        uptime: 100,
        response: 0
    }
};

const paginationState = {
    topPages: { currentPage: 1, itemsPerPage: 6 },
    landingPages: { currentPage: 1, itemsPerPage: 6 },
    referrers: { currentPage: 1, itemsPerPage: 6 },
    channels: { currentPage: 1, itemsPerPage: 6 },
    trafficSources: { currentPage: 1, itemsPerPage: 6 }
};

// Utilities
const mapRootToHomepage = (path) => path === '/' ? '/homepage' : path;

// --- API Configuration ---
function getApiUrl(path) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        return `http://localhost:3000${path}`;
    }
    return `https://arc-data-c40dcc24e2c8.herokuapp.com${path}`;
};

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    // If it has a decimal (like .5), keep one decimal place
    if (num % 1 !== 0) return num.toFixed(1);
    return Math.round(num).toLocaleString();
}

/**
 * Calculates the top Y-axis label based on landmark values and rules:
 * - Minimum: 4
 * - Landmarks: 4, 8, 10, 12, 16, 20
 * - Above 20: Multiples of 10 (30, 40, 50...)
 * - Must be strictly greater than maxVal (cannot be equal)
 */
function getYAxisMax(maxVal) {
    const landmarks = [4, 8, 10, 12, 16, 20];

    // Find the first landmark that is strictly greater than maxVal
    for (const landmark of landmarks) {
        if (landmark > maxVal) return landmark;
    }

    // If above 20, round up to next multiple of 10, then add 10 if equal to maxVal
    let ceiling = Math.ceil((maxVal + 0.1) / 10) * 10;
    return ceiling;
}

function saveDashboardCache() {
    try {
        const userId = window.Clerk?.user?.id || 'last_session';
        const cacheKey = `alconio_dashboard_cache_${userId}`;
        const tsKey = `alconio_dashboard_cache_ts_${userId}`;
        localStorage.setItem(cacheKey, JSON.stringify(MOCK_DATA));
        localStorage.setItem(tsKey, Date.now());
    } catch (e) {
        console.warn("Failed to save dashboard cache:", e);
    }
}

function loadDashboardCache() {
    try {
        const userId = window.Clerk?.user?.id || 'last_session';
        const cacheKey = `alconio_dashboard_cache_${userId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            // Deep merge or replacement
            Object.assign(MOCK_DATA, parsed);

            // Immediately bind the UI with cached data
            bindDashboardUI();
            if (typeof bindAnalyticsLists === 'function') bindAnalyticsLists();

            // Signal to inline loaders that cache is applied
            window.dispatchEvent(new CustomEvent('alconio-cache-applied'));

            console.log(`Dashboard loaded from local cache [${userId}].`);
            return true;
        }
    } catch (e) {
        console.warn("Failed to load dashboard cache:", e);
    }
    return false;
}

function formatDuration(seconds) {
    const totalSeconds = Math.round(seconds);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function calculatePercentageChange(current, previous) {
    if (!previous) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
}

// SVG Generation
function generateLineChartPath(data, width, height, paddingX, paddingY = null, rangeMax = null) {
    if (!data) return '';
    
    paddingY = paddingY !== null ? paddingY : paddingX; // Fallback to single padding

    // Extract values if data contains objects
    let values = typeof data[0] === 'object' ? data.map(d => d.value) : data;

    // Handle empty data by creating a baseline flat line (0)
    if (values.length === 0) {
        return `M${paddingX},${height - paddingY} L${width - paddingX},${height - paddingY}`;
    }

    const min = 0; // Always start from 0 for consistency
    const max = rangeMax !== null ? rangeMax : (Math.max(...values) || 1);
    const range = max - min || 1;

    const points = values.map((val, i) => {
        const x = values.length > 1 
            ? paddingX + (i / (values.length - 1)) * (width - 2 * paddingX)
            : width / 2; // Center single point

        // Normalize val to [0, 1], flip Y axis, then scale to height
        const normalized = (val - min) / range;
        const y = height - paddingY - (normalized * (height - 2 * paddingY));
        return [parseFloat(x), parseFloat(y)]; // Return as array for math
    });

    if (values.length === 1) {
        // For a single point, draw a short flat line at the baseline or the point's Y
        const [x, y] = points[0];
        return `M${padding},${y} L${width - padding},${y}`;
    }

    // Generate simple straight line segments
    let path = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L${points[i][0]},${points[i][1]}`;
    }

    return path;
}

// Global scope expose
window.AlconioData = {
    MOCK: MOCK_DATA,
    formatNumber,
    formatDuration,
    calculatePercentageChange,
    generateLineChartPath
};

let isAnalyticsFetching = false;

// Initialize Data Bindings
async function initDashboardWithLiveAnalytics(options = {}) {
    const { skipCache = false, onlyUpdateChart = false } = options;

    // 0. Load from cache immediately for "instant" feel (if not skipping)
    if (!skipCache) {
        loadDashboardCache();
    }

    if (isAnalyticsFetching) return;
    isAnalyticsFetching = true;

    try {
        // Find if we have a preferred period from the UI, default to weekly
        const activeBtn = document.querySelector('.chart-period-btn.active');
        let periodParam = activeBtn ? activeBtn.getAttribute('data-period') : 'weekly';

        // Analytics Page Default: 30 Days (Monthly)
        if (!activeBtn && window.location.pathname.includes('dashboard_analytics.html')) {
            periodParam = 'monthly';
        }

        const apiPeriod = periodParam === 'daily' ? 'today' : (periodParam === 'monthly' ? '30days' : '7days');

        // Handle Clerk Session Safely (especially on localhost)
        // Authentication Logic (matching fetchGA4Data bypass)
        let token = null;
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            token = "dev_token";
        } else if (window.Clerk && window.Clerk.session) {
            token = await window.Clerk.session.getToken();
        }

        const fetchOptions = token ? {
            headers: { 'Authorization': `Bearer ${token}` }
        } : {};

        const response = await fetch(getApiUrl(`/api/analytics?period=${apiPeriod}`), fetchOptions);
        if (!response.ok) throw new Error("GA4 API request failed");

        const liveData = await response.json();
        
        // Forcefully clean up any "Today(x/y)" or "Today (x/ y)" strings coming from older cached APIs or Heroku
        const cleanLabel = (lbl) => {
            if (!lbl) return lbl;
            return lbl.replace(/today\s*\(?/gi, '').replace(/\)/g, '').replace(/\s+/g, '');
        };
        
        if (liveData && liveData.timeseries) {
            if (liveData.timeseries.labels) {
                liveData.timeseries.labels = liveData.timeseries.labels.map(l => {
                    // Ignore times like 12pm, clean dates
                    if (l && typeof l === 'string' && (l.includes('am') || l.includes('pm'))) return l;
                    return cleanLabel(l);
                });
            } else {
                liveData.timeseries.labels = [];
            }
            
            if (liveData.timeseries.current === undefined) liveData.timeseries.current = [];
            if (liveData.timeseries.previous === undefined) liveData.timeseries.previous = [];
            if (liveData.timeseries.currentSessions === undefined) liveData.timeseries.currentSessions = [];
            if (liveData.timeseries.previousSessions === undefined) liveData.timeseries.previousSessions = [];

            if (liveData.timeseries.pageViews30Day && liveData.timeseries.pageViews30Day.labels) {
                liveData.timeseries.pageViews30Day.labels = liveData.timeseries.pageViews30Day.labels.map(cleanLabel);
            }
        } else {
            // Ensure timeseries object exists for fallback mapping
            liveData.timeseries = { labels: [], current: [], previous: [], currentSessions: [], previousSessions: [] };
        }

        console.log(`[DEBUG] Received GA4 data for period: ${apiPeriod}`, {
            hasTimeseries: !!liveData.timeseries,
            currentPoints: liveData.timeseries?.current?.length,
            labels: liveData.timeseries?.labels?.length
        });

        // 1. Overview Map (Current vs Previous benchmarks)
        const mapOverview = (key, liveKey) => {
            const data = liveData.overview[liveKey];
            if (!data) return;
            let current = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
            // Round current for the main overview metrics
            current = Math.round(current);
            let previous = current / (1 + (data.trend / 100));

            MOCK_DATA.overview[key] = { current, previous, trend: data.trend >= 0 ? 'up' : 'down' };
        };

        mapOverview('totalVisitors', 'totalVisitors');
        mapOverview('totalUsers', 'totalVisitors');
        mapOverview('totalSessions', 'totalSessions');
        mapOverview('bounceRate', 'bounceRate');
        mapOverview('avgSession', 'avgSession');
        mapOverview('userEngagementDuration', 'userEngagementDuration');
        // NOTE: chartTotal is NOT mapped from API. It is computed in drawMainChart by summing visible graph values.

        // Derived Metrics for Engagement Rate and New Users
        const bounceData = liveData.overview['bounceRate'];
        if (bounceData) {
            let bCurr = typeof bounceData.value === 'string' ? parseFloat(bounceData.value) : bounceData.value;
            let eCurr = Math.max(0, 100 - bCurr);
            let bPrev = bCurr / (1 + (bounceData.trend / 100));
            let ePrev = Math.max(0, 100 - bPrev);
            let eTrend = ePrev ? ((eCurr - ePrev) / ePrev) * 100 : 0;
            MOCK_DATA.overview['engagementRate'] = { current: eCurr, previous: ePrev, trend: eTrend >= 0 ? 'up' : 'down' };
            MOCK_DATA.overview['engagementRate_trend_raw'] = eTrend;
        }

        const newUsersCurr = Math.round(liveData.breakdowns?.userType?.new || 0);
        MOCK_DATA.overview['newUsers'] = { current: newUsersCurr, previous: newUsersCurr, trend: 'up' };

        // 2. Timeseries Mapping
        const targetPeriod = periodParam === 'daily' ? 'daily' : (periodParam === 'monthly' ? 'monthly' : 'weekly');
        const prevKey = 'prev' + targetPeriod.charAt(0).toUpperCase() + targetPeriod.slice(1);


        MOCK_DATA.timeseries.visitors[targetPeriod] = liveData.timeseries.current.map((v, i) => ({
            label: liveData.timeseries.labels[i],
            value: v
        }));
        MOCK_DATA.timeseries.visitors[prevKey] = liveData.timeseries.previous.map((v, i) => ({
            label: liveData.timeseries.labels[i],
            value: v
        }));

        MOCK_DATA.timeseries.sessions[targetPeriod] = liveData.timeseries.currentSessions.map((v, i) => ({
            label: liveData.timeseries.labels[i],
            value: v
        }));
        MOCK_DATA.timeseries.sessions[prevKey] = liveData.timeseries.previousSessions.map((v, i) => ({
            label: liveData.timeseries.labels[i],
            value: v
        }));

        // Map Page Views (30-day series)
        if (liveData.timeseries?.pageViews30Day && Array.isArray(liveData.timeseries.pageViews30Day.labels)) {
            MOCK_DATA.pageViewsSeries30d = {
                labels: liveData.timeseries.pageViews30Day.labels,
                views: liveData.timeseries.pageViews30Day.views,
                scrolled: liveData.timeseries.pageViews30Day.scrolled
            };
        } else {
            MOCK_DATA.pageViewsSeries30d = { labels: [], views: [], scrolled: [] };
        }

        // 3. Detailed Metrics & Lists (ROBUST SAFETY WRAPPERS)
        const getVal = (path, defaultValue = 0) => {
            try {
                const parts = path.split('.');
                let current = liveData;
                for (const part of parts) {
                    if (current === null || current === undefined) return defaultValue;
                    current = current[part];
                }
                return (current && typeof current === 'object' && 'value' in current) ? (current.value || 0) : (current || defaultValue);
            } catch (e) {
                return defaultValue;
            }
        };

        console.log("[DEBUG] Mapping overview metrics", liveData.overview);
        MOCK_DATA.currentMetrics = {
            totalUsers: Math.round(getVal('overview.totalVisitors')),
            totalSessions: Math.round(getVal('overview.totalSessions')),
            newUsers: Math.round(liveData.breakdowns?.userType?.new || 0),
            returningUsers: Math.round(liveData.breakdowns?.userType?.returning || 0),
            newUsersRatio: (( (liveData.breakdowns?.userType?.new || 0) / ( (liveData.breakdowns?.userType?.new || 0) + (liveData.breakdowns?.userType?.returning || 0) || 1)) * 100).toFixed(1),
            totalSessions: Math.round(getVal('overview.totalSessions')),
            avgSessionDuration: formatDuration(getVal('overview.avgSession')),
            userEngagementDuration: formatDuration(getVal('overview.userEngagementDuration')),
            screenPageViews: Math.round(getVal('overview.screenPageViews')),
            scrolledUsers: Math.round(getVal('overview.scrolledUsers')),
            screenPageViewsPerUser: getVal('overview.screenPageViewsPerUser')
        };

        MOCK_DATA.topPages = liveData.topPages.map(p => ({
            path: mapRootToHomepage(p.path),
            views: p.views
        }));

        MOCK_DATA.landingPages = (liveData.landingPages || []).map(p => ({
            path: mapRootToHomepage(p.path),
            sessions: p.sessions
        }));

        const sourceNormalization = {
            'google': 'Google',
            'bing': 'Bing',
            'facebook.com': 'Facebook',
            'm.facebook.com': 'Facebook',
            'l.facebook.com': 'Facebook',
            't.co': 'Twitter',
            'twitter.com': 'Twitter',
            'linkedin.com': 'LinkedIn',
            'lnkd.in': 'LinkedIn',
            'instagram.com': 'Instagram',
            'youtube.com': 'YouTube',
            'baidu': 'Baidu',
            'duckduckgo': 'DuckDuckGo',
            'yahoo': 'Yahoo'
        };

        MOCK_DATA.referrers = (liveData.referrers || []).map(r => {
            let cleanName = r.name;
            if (sourceNormalization[cleanName.toLowerCase()]) {
                cleanName = sourceNormalization[cleanName.toLowerCase()];
            } else {
                // Generic cleanup: remove .com, .net, etc. and capitalize first letter
                cleanName = cleanName.replace(/\.(com|net|org|edu|gov|io|co|me|biz|info).*$/i, '');
                cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            }
            return {
                name: cleanName,
                value: r.value
            };
        });
        
        // Ensure sorting by value descending
        MOCK_DATA.referrers.sort((a, b) => b.value - a.value);

        const channelColorMap = {
            'Organic Search': '#0d33f2',
            'Direct': '#3b82f6',
            'Paid Search': '#60a5fa',
            'Social': '#8b5cf6',
            'Referral': '#a78bfa'
        };

        const channelMap = {
            'Organic Search': 'Organic Search',
            'Direct': 'Direct',
            'Paid Search': 'Paid Search',
            'Social': 'Social',
            'Organic Social': 'Social',
            'Referral': 'Referral',
            'Organic Video': 'Social',
            'Email': 'Direct',
            'Affiliates': 'Referral'
        };

        // Initialize with default 5 categories at 0
        const aggregated = {
            'Organic Search': { users: 0, sessions: 0 },
            'Direct': { users: 0, sessions: 0 },
            'Paid Search': { users: 0, sessions: 0 },
            'Social': { users: 0, sessions: 0 },
            'Referral': { users: 0, sessions: 0 }
        };

        // Aggregate live data
        (liveData.breakdowns.channels || []).forEach(c => {
            const normalized = channelMap[c.name] || 'Direct'; // Default to Direct or ignore others? User said have *these exact categories*.
            if (aggregated[normalized]) {
                aggregated[normalized].users += (c.users || 0);
                aggregated[normalized].sessions += (c.sessions || 0);
            }
        });

        MOCK_DATA.channels = Object.keys(aggregated).map(name => ({
            channelGroup: name,
            users: aggregated[name].users,
            sessions: aggregated[name].sessions,
            color: channelColorMap[name]
        })).sort((a, b) => b.users - a.users);

        MOCK_DATA.trafficSources = (liveData.breakdowns.trafficSources || []).map(s => ({
            sourceMedium: s.name,
            users: s.users,
            engagementRate: s.engagementRate
        }));

        MOCK_DATA.geography = {};
        MOCK_DATA.cities = [];
        const countriesDetailed = liveData.breakdowns?.countriesDetailed || [];
        MOCK_DATA.countries = countriesDetailed; // Use detailed country stats for map
        
        const skipValues = ['(not set)', 'unknown', ''];
        
        // Map Geography for list displays
        (liveData.geography || []).forEach(g => {
            const countryLower = (g.country || '').toLowerCase();
            const cityLower = (g.city || '').toLowerCase();
            if (skipValues.includes(countryLower) || skipValues.includes(cityLower)) return;
            if (!MOCK_DATA.geography[g.country]) {
                MOCK_DATA.geography[g.country] = { users: 0, sessions: 0 };
            }
            MOCK_DATA.geography[g.country].users += g.users;
            MOCK_DATA.geography[g.country].sessions += g.users;
            MOCK_DATA.cities.push({
                city: g.city,
                country: g.country,
                users: g.users
            });
        });

        MOCK_DATA.devices = liveData.breakdowns.devices;
        MOCK_DATA.browsers = liveData.breakdowns.browsers;
        MOCK_DATA.os = liveData.breakdowns.os;
        MOCK_DATA.platforms = liveData.breakdowns.platforms;
        MOCK_DATA.retention = liveData.breakdowns.retention || { 'new': 0, 'returning': 0 };

        console.log("[INFO] Live Dashboard data locked in (including retention).");
        saveDashboardCache();

    } catch (error) {
        console.error("Critical Dashboard Refresh Error:", error);
    } finally {
        isAnalyticsFetching = false;
    }

    if (onlyUpdateChart) {
        const activeBtn = document.querySelector('.chart-period-btn.active');
        const periodParam = activeBtn ? activeBtn.getAttribute('data-period') : 'weekly';
        drawMainChart(periodParam);
    } else {
        bindDashboardUI(); // Defined in dashboard_data.js
        if (typeof bindAnalyticsLists === 'function') bindAnalyticsLists();
        
        // ALWAYS update the main chart after a full refresh to ensure live data is shown
        const activeBtn = document.querySelector('.chart-period-btn.active');
        if (activeBtn) {
            drawMainChart(activeBtn.getAttribute('data-period'));
        }
    }
}

// Auto-refresh every 5 minutes
setInterval(initDashboardWithLiveAnalytics, 5 * 60 * 1000);

let currentPerfStrategy = 'desktop';

async function initPerformanceData(forceRefresh = false) {
    const requestedStrategy = currentPerfStrategy; // Capture what we wanted
    try {
        const btn = document.getElementById('recalculate-perf');
        const loader = document.getElementById('perf-bg-loader');
        const tsLabel = document.getElementById('perf-last-updated');
        
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">refresh</span> Syncing...';
        }

        let token = null;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            token = "dev_token";
        }
        if (!token && window.Clerk && window.Clerk.session) {
            token = await window.Clerk.session.getToken();
        }

        // --- STAGE 1: Instant Load (Cached Data) ---
        // Only show cache first if NOT a forced refresh
        if (!forceRefresh) {
            try {
                const cachedRes = await fetch(getApiUrl(`/api/performance?strategy=${requestedStrategy}&cachedOnly=true`), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (cachedRes.ok) {
                    const cachedData = await cachedRes.json();
                    if (cachedData && cachedData.isCached && currentPerfStrategy === requestedStrategy) {
                        updatePerformanceUI(cachedData);
                        if (tsLabel && cachedData.dbTimestamp) {
                            const date = new Date(cachedData.dbTimestamp);
                            tsLabel.innerText = `Last updated: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                            tsLabel.classList.add('opacity-100');
                        }
                    }
                }
            } catch (e) {
                console.warn("Cached load failed:", e);
            }
        }

        // --- STAGE 2: Background Refresh (Synchronous for the API, but async to user click) ---
        // We force a refresh in the background unless explicitly told not to
        if (loader) loader.classList.remove('hidden');
        
        const response = await fetch(getApiUrl(`/api/performance?strategy=${requestedStrategy}&refresh=true`), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("PSI API request failed");
        const perfData = await response.json();

        // ONLY UPDATE UI if the user is still looking at the strategy we fetched for
        if (currentPerfStrategy === requestedStrategy) {
            updatePerformanceUI(perfData);

            if (tsLabel) {
                tsLabel.innerText = `Last updated: Just now`;
                tsLabel.classList.add('opacity-100');
            }
        } else {
            console.log(`[DEBUG] Ignoring background refresh for ${requestedStrategy} because user switched to ${currentPerfStrategy}`);
        }

    } catch (e) {
        console.error("Performance refresh failed:", e);
    } finally {
        // Only reset button state if we are still on the same strategy OR if all pending syncs are finished
        const btn = document.getElementById('recalculate-perf');
        const loader = document.getElementById('perf-bg-loader');
        if (currentPerfStrategy === requestedStrategy) {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span class="material-symbols-outlined text-sm">refresh</span> Recalculate';
            }
            if (loader) loader.classList.add('hidden');
        }
    }
}

// Helper to update performance UI metrics smoothly
function updatePerformanceUI(perfData) {
    // Update target URL display
    const urlDisplay = document.querySelector('.text-slate-400.text-sm.text-left span:first-child');
    if (urlDisplay && perfData.url) {
        // Find the main text part vs labels
        if (!urlDisplay.id) { // Ensure we don't overwrite the whole flex container
             const urlContainer = document.querySelector('.text-slate-400.text-sm.text-left');
             if (urlContainer && urlContainer.children[0]) {
                 urlContainer.children[0].innerHTML = `Real-time assessment for <span class="text-blue-400 font-mono">${perfData.url.replace('https://', '')}</span>`;
             }
        }
    }

    MOCK_DATA.performance = { ...MOCK_DATA.performance, ...perfData };
    bindDashboardUI(); // Re-bind with new data
    saveDashboardCache();
}

function updateStrategyUI(strategy) {
    currentPerfStrategy = strategy;
    const desktopBtn = document.getElementById('strategy-desktop');
    const mobileBtn = document.getElementById('strategy-mobile');

    if (strategy === 'desktop') {
        desktopBtn.className = 'px-4 py-1.5 rounded-md text-sm font-bold transition-all bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2';
        mobileBtn.className = 'px-4 py-1.5 rounded-md text-sm font-bold transition-all text-slate-400 hover:text-white flex items-center gap-2';
    } else {
        mobileBtn.className = 'px-4 py-1.5 rounded-md text-sm font-bold transition-all bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2';
        desktopBtn.className = 'px-4 py-1.5 rounded-md text-sm font-bold transition-all text-slate-400 hover:text-white flex items-center gap-2';
    }

    // Trigger fresh fetch for new strategy
    initPerformanceData();
}

// Global expose for performance triggers
window.initPerformanceData = initPerformanceData;

// --- Rolling Window Sparkline Data ---
let sparklineData = null; // Will hold { visitors: [], sessions: [], bounceRate: [], avgSession: [] }

async function fetchSparklineData() {
    try {
        let token = null;
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal) {
            token = 'dev_token';
        } else if (window.Clerk && window.Clerk.session) {
            token = await window.Clerk.session.getToken();
        }

        const fetchOptions = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
        const response = await fetch(getApiUrl('/api/analytics/sparklines'), fetchOptions);
        if (!response.ok) throw new Error('Sparkline API failed');
        sparklineData = await response.json();
        console.log('[INFO] Sparkline rolling window data loaded:', sparklineData);
        renderRollingSparklines();
    } catch (e) {
        console.warn('[WARN] Failed to fetch sparkline data:', e.message);
    }
}

function renderRollingSparklines() {
    if (!sparklineData) return;

    const metricMap = {
        'visitors': sparklineData.visitors,
        'sessions': sparklineData.sessions,
        'bounceRate': sparklineData.bounceRate,
        'avgSession': sparklineData.avgSession,
        'engagementRate': sparklineData.bounceRate ? sparklineData.bounceRate.map(v => Math.max(0, 100 - (typeof v === 'object' ? v.value : v))) : []
    };

    document.querySelectorAll('.sparkline-container').forEach(svg => {
        const metric = svg.getAttribute('data-sparkline');
        let values = metricMap[metric];
        
        // Fallback for engagementRate to sessions shape if bounce array is missing
        if (metric === 'engagementRate' && (!values || values.length === 0)) {
            values = metricMap['sessions'];
        }

        if (!values || values.length === 0) return;

        let strokeColor = '#0052FF';
        let dropShadowColor = 'rgba(0,82,255,0.8)';
        
        if (metric === 'engagementRate') {
            strokeColor = '#10B981'; // emerald-500
            dropShadowColor = 'rgba(16,185,129,0.8)';
        }

        // Generate path for the sparkline (3px padding prevents the 2.5px stroke from clipping at the top/bottom)
        // With viewBox="0 0 100 30"
        const pathData = generateLineChartPath(values, 100, 30, 3);
        
        // Area generation (close the path at the bottom corners). We use the actual width/height.
        const areaData = `${pathData} L 97,30 L 3,30 Z`;
        
        const gradientId = `spark-grad-${metric}`;

        svg.innerHTML = `
            <defs>
                <linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.3"></stop>
                    <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"></stop>
                </linearGradient>
            </defs>
            <path d="${areaData}" fill="url(#${gradientId})" stroke="none"></path>
            <path d="${pathData}" fill="none" class="drop-shadow-[0_0_5px_${dropShadowColor.replace(/ /g, '')}]" vector-effect="non-scaling-stroke" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
        `;
    });
}

function bindDashboardUI() {

    // Bind numeric metrics using data-metric
    document.querySelectorAll('[data-metric]').forEach(el => {
        const key = el.getAttribute('data-metric');
        // chartTotal is computed in drawMainChart — skip here
        if (key === 'chartTotal') return;
        if (MOCK_DATA.overview[key]) {
            let val = MOCK_DATA.overview[key];
            if (typeof val === 'object') val = val.current;

            let roundedVal = Math.round(val);
            if (key === 'engagementRate') {
                roundedVal = val.toFixed(1); // keep 1 decimal for engagement rate
            }

            if (key === 'avgSession' || key === 'userEngagementDuration') {
                el.innerText = formatDuration(Math.round(val));
            } else if (key === 'bounceRate' || key === 'engagementRate') {
                el.innerText = roundedVal + '%';
            } else {
                el.innerText = Math.round(val).toLocaleString();
            }
            
            // Special handling for New Users bar
            if (key === 'newUsers') {
                const total = MOCK_DATA.currentMetrics?.totalUsers || val || 1;
                const pct = Math.min(100, Math.max(0, (val / total) * 100));
                const bar = document.getElementById('newUsersProgressBar');
                if (bar) bar.style.width = pct + '%';
            }
        }
    });

    // Bind trend labels using data-trend
    document.querySelectorAll('[data-trend]').forEach(el => {
        const key = el.getAttribute('data-trend');
        // chartTotal trends are computed in drawMainChart — skip here
        if (key === 'chartTotal') return;
        const data = MOCK_DATA.overview[key];
        
        if (data) {
            let isPositive = data.current >= (data.previous || 0);

            let displayVal = '';
            if (key === 'avgSession' || key === 'userEngagementDuration') {
                const diff = data.current - data.previous;
                displayVal = (diff >= 0 ? '+' : '') + Math.round(diff) + 's';
            } else if (key === 'engagementRate' && MOCK_DATA.overview['engagementRate_trend_raw'] !== undefined) {
                const diff = MOCK_DATA.overview['engagementRate_trend_raw'];
                isPositive = diff >= 0;
                displayVal = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
            } else {
                const pct = calculatePercentageChange(data.current, data.previous);
                displayVal = (pct >= 0 ? '+' : '') + pct + '%';
            }

            el.innerText = displayVal;
            el.className = isPositive 
                ? 'text-emerald-400 flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-900/40 border border-emerald-500/30 shadow-sm mb-1'
                : 'text-rose-400 flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-900/40 border border-rose-500/30 shadow-sm mb-1';

            // Hide trend label for newUsers if required
            if (key === 'newUsers') el.classList.add('hidden');

            // Sync Trend Icons
            const iconEl = document.querySelector(`[data-trend-icon="${key}"]`);
            if (iconEl) {
                iconEl.innerText = isPositive ? 'trending_up' : 'trending_down';
                iconEl.className = `material-symbols-outlined text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`;
            }

            // Sync Trend Labels Context (e.g. "vs last week", "vs last 24h")
            const labelEl = el.nextElementSibling;
            if (labelEl && (labelEl.innerText.includes('vs last') || labelEl.innerText.includes('vs.') || labelEl.innerText.includes('this week'))) {
                const activeBtn = document.querySelector('.chart-period-btn.active');
                const periodParam = activeBtn ? activeBtn.getAttribute('data-period') : 'weekly';

                if (key === 'chartTotal') { // ONLY 'chartTotal' (chart header) is dynamic across periods
                    if (periodParam === 'daily') labelEl.innerText = 'vs last 24h';
                    else if (periodParam === 'monthly') labelEl.innerText = 'vs last 30d';
                    else labelEl.innerText = 'vs last week';
                } else {
                    labelEl.innerText = 'vs last week';
                }
            }
        }
    });

    // Draw Rolling Window Sparklines (from dedicated /api/analytics/sparklines endpoint)
    renderRollingSparklines();

    const yAxisContainer = document.getElementById('main-chart-y-axis');

    // Initial draw (dynamically checking which button is active)
    const activeBtn = document.querySelector('.chart-period-btn.active');
    if (activeBtn) {
        drawMainChart(activeBtn.getAttribute('data-period'));
    } else {
        const defaultPeriod = window.location.pathname.includes('dashboard_analytics.html') ? 'monthly' : 'weekly';
        drawMainChart(defaultPeriod);
    }

    // Attach button listeners
    const periodBtns = document.querySelectorAll('.chart-period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active style from all
            periodBtns.forEach(b => {
                b.classList.remove('active', 'font-bold', 'bg-electric-blue', 'text-white', 'shadow-[0_0_10px_rgba(0,82,255,0.4)]');
                b.classList.add('font-medium', 'hover:bg-white/10', 'text-slate-400', 'hover:text-white');
            });

            // Add active style to clicked
            const clicked = e.currentTarget;
            clicked.classList.remove('font-medium', 'hover:bg-white/10', 'text-slate-400', 'hover:text-white');
            clicked.classList.add('active', 'font-bold', 'bg-electric-blue', 'text-white', 'shadow-[0_0_10px_rgba(0,82,255,0.4)]');

            const period = clicked.getAttribute('data-period');

            // OPTIMISTIC UPDATE: Draw immediately with existing data
            drawMainChart(period);

            // Draw chart for selected period and trigger a live re-fetch for accuracy
            initDashboardWithLiveAnalytics({ skipCache: true, onlyUpdateChart: true });
        });
    });

    // Initialize the interactive map if we're on the analytics page with valid data
    initWorldMap();


    // Bind dynamic progress bars using data-progress-bar
    document.querySelectorAll('[data-progress-bar]').forEach(el => {
        const key = el.getAttribute('data-progress-bar');
        let pct = 0;

        if (key === 'newUsersRatio') {
            pct = parseFloat(MOCK_DATA.currentMetrics.newUsersRatio) || 0;
        } else if (key === 'avgSession') {
            const current = MOCK_DATA.overview.avgSession?.current || 0;
            const target = 180; // 3 minutes
            pct = Math.min((current / target) * 100, 100);
        } else if (key === 'userEngagementDuration') {
            const current = MOCK_DATA.overview.userEngagementDuration?.current || 0;
            const target = 120; // 2 minutes
            pct = Math.min((current / target) * 100, 100);
        }

        if (pct > 0) {
            el.style.width = `${pct}%`;
        }
    });

    // Top Pages
    const topPagesContainer = document.getElementById('top-pages-overview');
    if (topPagesContainer && MOCK_DATA.topPages.length > 0) {
        const highestViews = Math.max(...MOCK_DATA.topPages.map(p => p.views));

        let html = '';
        MOCK_DATA.topPages.slice(0, 5).forEach(page => {
            const pct = (page.views / highestViews) * 100;
            html += `
            <div class="flex items-center justify-between group cursor-pointer">
                <div class="flex flex-col">
                    <span class="text-xs font-medium text-white group-hover:text-electric-blue transition-colors truncate max-w-[180px]">${page.path}</span>
                    <span class="text-[10px] text-slate-500">Active now</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-white">${page.views.toLocaleString()}</span>
                    <div class="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-electric-blue" style="width: ${pct}%"></div>
                    </div>
                </div>
            </div>`;
        });
        topPagesContainer.innerHTML = html;
    }

    function initWorldMap() {
        // Analytics Page Specifics
        const mapContainer = document.getElementById('jsvectormap-world');
        if (mapContainer && typeof jsVectorMap !== 'undefined') {
            const countriesData = MOCK_DATA.countries || [];

            // Build stats dictionary and find max sessions
            const countryStats = {};
            let maxSessions = 0;
            countriesData.forEach(c => {
                if (c.countryId && c.countryId !== '(not set)') {
                    countryStats[c.countryId] = {
                        name: c.country,
                        sessions: c.sessions || 0,
                        users: c.users || 0
                    };
                    if (c.sessions > maxSessions) maxSessions = c.sessions;
                }
            });

            // 7 Shades logic
            const buckets = [0.02, 0.07, 0.15, 0.30, 0.50, 0.75, 1.0];
            const colors = [
                'rgba(30, 84, 255, 0.10)',
                'rgba(30, 84, 255, 0.20)',
                'rgba(30, 84, 255, 0.35)',
                'rgba(30, 84, 255, 0.50)',
                'rgba(30, 84, 255, 0.65)',
                'rgba(30, 84, 255, 0.82)',
                '#1E54FF'
            ];
            const neutralColor = '#1a2744'; // Solid dark slate-blue for 0 data countries

            let dynamicStyles = '';
            Object.keys(countryStats).forEach(code => {
                const sessions = countryStats[code].sessions;
                let shadeIndex = 0;
                if (maxSessions > 0 && sessions > 0) {
                    const ratio = sessions / maxSessions;
                    shadeIndex = buckets.findIndex(b => ratio <= b);
                    if (shadeIndex === -1) shadeIndex = 6;
                    dynamicStyles += `#jsvectormap-world path[data-code="${code}"] { fill: ${colors[shadeIndex]} !important; }\n`;
                    dynamicStyles += `#jsvectormap-world path[data-code="${code}"]:hover { fill: #3B6BFF !important; }\n`;
                }
            });

            // Inject dynamic styles for colored countries
            let styleEl = document.getElementById('dynamic-map-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'dynamic-map-styles';
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = dynamicStyles;

            // Update Legend colors (no tooltips)
            // Legend is purely visual — no session range tooltips

            // Clear existing map if any
            mapContainer.innerHTML = '';

            const map = new jsVectorMap({
                selector: '#jsvectormap-world',
                map: 'world',
                backgroundColor: 'transparent',
                zoomButtons: false,
                zoomOnScroll: false,
                zoomOnScrollSpeed: 1,
                draggable: false,
                regionStyle: {
                    initial: {
                        fill: neutralColor,
                        stroke: 'none',
                        strokeWidth: 0,
                    },
                    hover: {
                        fill: '#243356',
                        stroke: 'none',
                        strokeWidth: 0,
                        cursor: 'pointer',
                    }
                },
                onRegionTooltipShow: function (event, tooltip, code) {
                    const stats = countryStats[code] || { name: tooltip.text(), users: 0, sessions: 0 };
                    const countryName = stats.name || tooltip.text();

                    tooltip.css({ backgroundColor: 'rgba(0,0,0,0.92)', borderColor: 'rgba(30,84,255,0.15)' });

                    setTimeout(() => {
                        const tooltipHtml =
                            '<div style="font-weight:700;font-size:13px;margin-bottom:6px;display:flex;align-items:center;gap:6px;">' + 
                                countryName + 
                                '<span style="background:rgba(30,84,255,0.2);color:#3b82f6;font-size:8px;padding:1px 4px;border-radius:2px;text-transform:uppercase;letter-spacing:0.5px;">All Time</span>' +
                            '</div>' +
                            '<div style="color:#94a3b8;font-size:10px;">Sessions: <span style="color:#fff;font-weight:600;">' + stats.sessions.toLocaleString() + '</span></div>' +
                            '<div style="color:#94a3b8;font-size:10px;margin-top:2px;">Users: <span style="color:#fff;font-weight:600;">' + stats.users.toLocaleString() + '</span></div>';
                        tooltip.getElement().innerHTML = tooltipHtml;
                    }, 0);
                },
            });
        }
    }

    // Pie Chart Updates
    const deviceChart = document.getElementById('device-pie-chart');
    if (deviceChart && MOCK_DATA.devices) {
        const d = MOCK_DATA.devices;
        const total = (d.mobile || 0) + (d.desktop || 0) + (d.tablet || 0);

        // Calculate Percentages
        const getPct = (val) => total > 0 ? Math.round((val / total) * 100) : 0;
        const mobilePct = getPct(d.mobile || 0);
        const desktopPct = getPct(d.desktop || 0);
        const tabletPct = getPct(d.tablet || 0);

        // Individual Legend Label Updates
        const mobileLabel = document.getElementById('device-mobile-pct');
        if (mobileLabel) mobileLabel.innerText = mobilePct + '%';
        const desktopLabel = document.getElementById('device-desktop-pct');
        if (desktopLabel) desktopLabel.innerText = desktopPct + '%';
        const tabletLabel = document.getElementById('device-tablet-pct');
        if (tabletLabel) tabletLabel.innerText = tabletPct + '%';

        // Prepare segments for sorting
        // Priority: Mobile (0) > Desktop (1) > Tablet (2)
        const segments = [
            { label: 'Mobile', value: d.mobile || 0, pct: mobilePct, color: '#0052FF', priority: 0 },
            { label: 'Desktop', value: d.desktop || 0, pct: desktopPct, color: '#ffffff', priority: 1 },
            { label: 'Tablet', value: d.tablet || 0, pct: tabletPct, color: '#93c5fd', priority: 2 }
        ];

        // Sort by value (descending), then by priority (ascending) for ties
        segments.sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return a.priority - b.priority;
        });

        // Update SVG attributes in sorted order (starts at 12 o'clock clockwise)
        deviceChart.setAttribute('data-values', segments.map(s => s.value).join(', '));
        deviceChart.setAttribute('data-colors', segments.map(s => s.color).join(', '));
        deviceChart.setAttribute('data-labels', segments.map(s => s.label).join(', '));

        // Central Label: Dominant category (first in sorted list)
        const dominant = segments[0];
        const centerPct = document.getElementById('device-dominant-percentage');
        const centerLabel = document.getElementById('device-dominant-label');
        if (centerPct) centerPct.innerText = dominant.pct;
        if (centerLabel) centerLabel.innerText = dominant.label;

        // Re-trigger the dynamic SVG generation
        if (window.renderDynamicPies) {
            window.renderDynamicPies();
        }
    }

    // Platform Pie Chart Update
    const platformChart = document.getElementById('platform-pie-chart');
    if (platformChart && MOCK_DATA.platforms) {
        const p = MOCK_DATA.platforms;
        // Group by Web vs App (GA4 platform dimension usually returns 'web', 'android', 'ios')
        let webUsers = 0;
        let appUsers = 0;

        p.forEach(item => {
            if ((item.name || '').toLowerCase() === 'web') {
                webUsers += item.users;
            } else {
                appUsers += item.users;
            }
        });

        const total = webUsers + appUsers;
        const getPct = (val) => total > 0 ? Math.round((val / total) * 100) : 0;
        const webPct = getPct(webUsers);
        const appPct = getPct(appUsers);

        // Update Labels
        const webLabel = document.getElementById('platform-web-pct');
        if (webLabel) webLabel.innerText = webPct + '%';
        const appLabel = document.getElementById('platform-app-pct');
        if (appLabel) appLabel.innerText = appPct + '%';

        // Dominant
        const dominantPct = webPct >= appPct ? webPct : appPct;
        const dominantLabel = webPct >= appPct ? 'Web' : 'App';
        const centerPct = document.getElementById('platform-dominant-percentage');
        const centerLabel = document.getElementById('platform-dominant-label');
        if (centerPct) centerPct.innerText = dominantPct;
        if (centerLabel) centerLabel.innerText = dominantLabel;

        // Update SVG attributes
        // Sorted: Web (0) vs App (1)
        const segments = [
            { label: 'Web', value: webUsers, pct: webPct, color: '#0052FF' },
            { label: 'App', value: appUsers, pct: appPct, color: '#ffffff' }
        ].sort((a, b) => b.value - a.value);

        platformChart.setAttribute('data-values', segments.map(s => s.value).join(', '));
        platformChart.setAttribute('data-colors', segments.map(s => s.color).join(', '));
        platformChart.setAttribute('data-labels', segments.map(s => s.label).join(', '));

        if (window.renderDynamicPies) {
            window.renderDynamicPies();
        }
    }

    // Retention Pie Chart Update (Main Card)
    const retentionChart = document.getElementById('new-returning-pie-chart');
    if (retentionChart && MOCK_DATA.retention) {
        const r = MOCK_DATA.retention;
        const total = (r.new || 0) + (r.returning || 0);
        const getPct = (val) => total > 0 ? (val / total * 100).toFixed(1) : "0.0";
        const newPct = getPct(r.new || 0);
        const returningPct = getPct(r.returning || 0);

        // Update Labels in the Legend
        const newLegendVal = document.querySelector('[data-new-users]');
        if (newLegendVal) newLegendVal.innerText = formatCompactNumber(r.new || 0);
        const returningLegendVal = document.querySelector('[data-returning-users]');
        if (returningLegendVal) returningLegendVal.innerText = formatCompactNumber(r.returning || 0);

        // Central Percentage and Label
        const centerPct = document.getElementById('metric-new-vs-returning-pct');
        if (centerPct) centerPct.innerText = newPct;

        // Update SVG attributes
        const segments = [
            { label: 'New', value: r.new || 0, pct: newPct, color: '#0052FF' },
            { label: 'Returning', value: r.returning || 0, pct: returningPct, color: '#ffffff' }
        ].sort((a, b) => b.value - a.value);

        retentionChart.setAttribute('data-values', segments.map(s => s.value).join(', '));
        retentionChart.setAttribute('data-colors', segments.map(s => s.color).join(', '));
        retentionChart.setAttribute('data-labels', segments.map(s => s.label).join(', '));

        if (window.renderDynamicPies) {
            window.renderDynamicPies();
        }
    }

    // Performance Page Specifics
    document.querySelectorAll('[data-perf]').forEach(el => {
        const key = el.getAttribute('data-perf');
        if (MOCK_DATA.performance[key] !== undefined) {
            let val = MOCK_DATA.performance[key];
            let status = null;

            // Handle objects with status (Core Web Vitals)
            if (typeof val === 'object') {
                status = val.status;
                val = val.value;
            }

            // Formatting - removing redundant units as they are in HTML
            if (['lcp', 'fcp', 'tti', 'speedIndex', 'inp', 'ttfb', 'tbt'].includes(key)) {
                el.innerText = val;
            } else if (key === 'pageSize') {
                el.innerText = val;
            } else if (key === 'uptime') {
                el.innerText = val + '%';
            } else {
                el.innerText = (val !== null && val !== undefined) ? val.toLocaleString() : '0';
            }

            // Arc Updates
            const arcConfig = {
                lcp: { id: 'lcp-arc', max: 2.5 },
                inp: { id: 'inp-arc', max: 200 }, // INP Good threshold is < 200ms
                cls: { id: 'cls-arc', max: 0.1 }
            };

            if (arcConfig[key]) {
                const arc = document.getElementById(arcConfig[key].id);
                if (arc) {
                    const ratio = Math.min(1, val / arcConfig[key].max);
                    const offset = 283 * (1 - ratio);
                    arc.style.strokeDashoffset = offset;

                    // Unified color: Always #1E51FF as requested
                    arc.style.stroke = '#1E51FF';
                }
            }

            // Status Badge Updates for Core Web Vitals
            if (status) {
                // Find the badge container near this element 
                // In the HTML structure, the badge is the next sibling div of the h3 container
                const cardContainer = el.closest('.relative.h-32') || el.closest('.relative.h-24');
                if (cardContainer) {
                    const badge = cardContainer.querySelector('.absolute.top-3.right-3');
                    if (badge) {
                        badge.className = 'absolute top-3 right-3 px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase backdrop-blur-md border';
                        if (status === 'good') {
                            badge.classList.add('bg-blue-900/40', 'text-blue-300', 'border-blue-500/30');
                            badge.innerText = 'Good';
                        } else if (status === 'needs-improvement') {
                            badge.classList.add('bg-indigo-900/40', 'text-indigo-300', 'border-indigo-500/30');
                            badge.innerText = 'Needs Improvement';
                        } else {
                            badge.classList.add('bg-rose-900/40', 'text-rose-300', 'border-rose-500/30');
                            badge.innerText = 'Poor';
                        }
                    }
                }
            }
        }
    });

    // --- Uptime History Section ---
    const refreshUptimeBtn = document.getElementById('refresh-uptime');
    if (refreshUptimeBtn && !refreshUptimeBtn.hasListener) {
        refreshUptimeBtn.addEventListener('click', () => fetchUptimeHistory());
        refreshUptimeBtn.hasListener = true;
    }

    // Load initial uptime data if UI is visible
    if (document.getElementById('uptime-history-svg')) {
        fetchUptimeHistory();
    }
}

async function fetchUptimeHistory(days = 30) {
    try {
        const token = await getAuthToken();
        const fetchOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(getApiUrl(`/api/performance/uptime?days=${days}`), fetchOptions);
        if (!response.ok) throw new Error("Uptime API failed");
        
        const data = await response.json();
        updateUptimeUI(data);
    } catch (e) {
        console.error("[PERF] Uptime fetch error:", e);
    }
}

function updateUptimeUI(data) {
    const percentageLabel = document.getElementById('uptime-percentage-label');
    const mainLine = document.getElementById('uptime-main-line');
    const shadowLine = document.getElementById('uptime-shadow-line');
    const fillArea = document.getElementById('uptime-fill-area');
    const markersContainer = document.getElementById('uptime-markers-container');

    if (percentageLabel) {
        percentageLabel.innerText = `${data.uptime}% Uptime`;
        // Dynamic color based on uptime
        const val = parseFloat(data.uptime);
        if (val < 99) {
            percentageLabel.className = "text-rose-400 font-bold tracking-wide text-base";
        } else if (val < 99.9) {
            percentageLabel.className = "text-amber-400 font-bold tracking-wide text-base";
        } else {
            percentageLabel.className = "text-emerald-400 font-bold tracking-wide text-base";
        }
    }

    if (!data.history || data.history.length === 0) return;

    const width = 1000;
    const height = 300;
    const vPadding = 40; // Vertical padding for base line
    const points = data.history.length;
    
    // Generate Path Data
    // We treat status 'up' as y=220 and 'down' as y=280 (closer to bottom)
    // response_time can also subtly affect the line height for 'up' status
    
    let pathArr = [];
    markersContainer.innerHTML = '';

    data.history.forEach((log, i) => {
        const x = (i / (points - 1)) * width;
        let y = 220; // Default UP

        if (log.status === 'down') {
            y = 280;
            // Add Outage Marker
            const marker = document.createElement('div');
            marker.className = "absolute bottom-[10px] -translate-x-1/2 flex flex-col items-center group/marker";
            marker.style.left = `${(x / width) * 100}%`;
            marker.innerHTML = `
                <div class="w-[1px] h-24 bg-red-600/40 mb-8 z-10"></div>
                <div class="absolute bottom-0 w-2.5 h-4 border-2 border-red-500 rounded-full drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] bg-[#050914] z-20"></div>
                <div class="absolute bottom-[50px] left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover/marker:opacity-100 transition-opacity">
                    <div class="bg-[#050914] border border-red-600 rounded px-3 py-1.5 flex items-center gap-1.5 shadow-2xl whitespace-nowrap">
                        <span class="text-xs font-semibold text-slate-300">Outage <span class="text-slate-500 text-[10px] mx-0.5">•</span> ${new Date(log.checked_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            markersContainer.appendChild(marker);
        } else {
            // Subtly fluctuate based on response time (100ms -> 0px, 2000ms -> 40px)
            const responseFluctuation = Math.min(40, (log.response_time / 2000) * 40);
            y = 220 - responseFluctuation;
        }
        
        pathArr.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    });

    const d = pathArr.join(' ');
    if (mainLine) mainLine.setAttribute('d', d);
    if (shadowLine) shadowLine.setAttribute('d', d);
    if (fillArea) fillArea.setAttribute('d', `${d} L${width},${height} L0,${height} Z`);
}

// Add getAuthToken helper if it doesn't exist (centralized auth logic)
async function getAuthToken() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) return "dev_token";
    if (window.Clerk && window.Clerk.session) {
        return await window.Clerk.session.getToken();
    }
    return null;
}

// Unified pagination rendering for Content tables
function renderPaginatedList(key, data, containerId, indicatorId) {
    const listElement = document.getElementById(containerId);
    const indicatorElement = document.getElementById(indicatorId);

    if (!listElement || !indicatorElement) return;

    if (!data || data.length === 0) {
        const colspan = (key === 'channels' || key === 'trafficSources') ? 3 : 2;
        listElement.innerHTML = `<tr><td colspan="${colspan}" class="p-4 text-center text-slate-500 italic">No data available</td></tr>`;
        indicatorElement.innerText = '1 / 1';
        return;
    }

    const state = paginationState[key];
    const totalPages = Math.ceil(data.length / state.itemsPerPage) || 1;

    if (state.currentPage > totalPages) state.currentPage = totalPages;
    if (state.currentPage < 1) state.currentPage = 1;

    indicatorElement.innerText = `${state.currentPage} / ${totalPages}`;

    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const paginatedItems = data.slice(start, end);

    let html = '';
    paginatedItems.forEach(item => {
        if (key === 'channels') {
            html += `<tr>
                <td class="py-2.5 text-slate-300 truncate max-w-[150px]">
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${item.color || '#94a3b8'}"></span>
                        ${item.channelGroup}
                    </div>
                </td>
                <td class="py-2.5 font-mono text-right text-white">${item.users.toLocaleString()}</td>
                <td class="py-2.5 font-mono text-right text-white">${item.sessions.toLocaleString()}</td>
            </tr>`;
        } else if (key === 'trafficSources') {
            html += `<tr><td class="py-2.5 text-slate-300 truncate max-w-[150px]">${item.sourceMedium}</td><td class="py-2.5 font-mono text-right text-white">${item.users.toLocaleString()}</td><td class="py-2.5 font-mono text-right text-white">${item.engagementRate}%</td></tr>`;
        } else {
            const rawLabel = item.path || item.name || '';
            let labelHtml = rawLabel;
            
            // Clean up root paths to look professional instead of a lone "/"
            const isHomepage = rawLabel === '/' || rawLabel === '' || rawLabel.toLowerCase() === '(not set)' || rawLabel === '/homepage';
            
            if (isHomepage && (key === 'topPages' || key === 'landingPages')) {
                labelHtml = `<span class="text-blue-400">/homepage</span>`;
            } else if (!rawLabel) {
                 labelHtml = '/';
            }

            let val = 0;
            if (item.views !== undefined) val = item.views;
            else if (item.sessions !== undefined) val = item.sessions;
            else if (item.value !== undefined) val = item.value;
            else if (item.users !== undefined) val = item.users;

            const displayValue = (typeof val === 'number') ? val.toLocaleString() : val;
            html += `<tr><td class="py-2.5 text-slate-300 truncate max-w-[150px]" title="${rawLabel}">${labelHtml}</td><td class="py-2.5 font-mono text-right text-white">${displayValue}</td></tr>`;
        }
    });
    listElement.innerHTML = html;
}

function bindAnalyticsLists() {
    const skipValues = ['(not set)', 'unknown', ''];

    // Top Countries List
    const topCountriesList = document.getElementById('top-countries-list');
    if (topCountriesList && MOCK_DATA.geography) {
        let html = '';
        // Sort countries by users descending
        const sortedCountries = Object.keys(MOCK_DATA.geography)
            .filter(c => !skipValues.includes(c.toLowerCase()))
            .sort((a, b) => MOCK_DATA.geography[b].users - MOCK_DATA.geography[a].users)
            .slice(0, 50);
        sortedCountries.forEach(country => {
            const data = MOCK_DATA.geography[country];
            html += `<tr><td class="py-1.5 text-slate-300 flex items-center gap-2">${country}</td><td class="py-1.5 text-right font-mono text-white">${data.users.toLocaleString()}</td></tr>`;
        });
        topCountriesList.innerHTML = html || '<tr><td colspan="2" class="p-4 text-center text-slate-500 italic">No data available</td></tr>';
    }

    // Top Cities List
    const topCitiesList = document.getElementById('top-cities-list');
    if (topCitiesList && MOCK_DATA.cities) {
        const skipValues = ['(not set)', 'unknown', ''];
        let html = '';
        const filteredCities = MOCK_DATA.cities
            .filter(c => !skipValues.includes((c.city || '').toLowerCase()) && !skipValues.includes((c.country || '').toLowerCase()))
            .slice(0, 50);
        filteredCities.forEach(c => {
            html += `<tr><td class="py-1.5 text-slate-300">${c.city}</td><td class="py-1.5 text-right font-mono text-white">${Math.round(c.users).toLocaleString()}</td></tr>`;
        });
        topCitiesList.innerHTML = html || '<tr><td colspan="2" class="p-4 text-center text-slate-500 italic">No data available</td></tr>';
    }

    // Browsers List
    const browserList = document.getElementById('browser-list');
    if (browserList && MOCK_DATA.browsers && MOCK_DATA.browsers.length > 0) {
        let html = '';
        const total = MOCK_DATA.browsers.reduce((acc, b) => acc + (b.users || 0), 0);

        // Sort by users descending
        const sorted = [...MOCK_DATA.browsers].sort((a, b) => (b.users || 0) - (a.users || 0)).slice(0, 4);

        sorted.forEach(b => {
            const count = b.users || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            html += `<div><div class="flex justify-between text-[10px] text-slate-300 mb-1"><span>${b.name}</span> <span class="font-mono text-white">${pct}%</span></div><div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="h-full bg-blue-500 rounded-full" style="width: ${pct}%"></div></div></div>`;
        });
        browserList.innerHTML = html;
    }

    // OS List
    const osList = document.getElementById('os-list');
    if (osList && MOCK_DATA.os && MOCK_DATA.os.length > 0) {
        let html = '';
        const total = MOCK_DATA.os.reduce((acc, o) => acc + (o.users || 0), 0);

        // Sort by users descending
        const sorted = [...MOCK_DATA.os].sort((a, b) => (b.users || 0) - (a.users || 0)).slice(0, 4);

        sorted.forEach(o => {
            const count = o.users || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            html += `<div><div class="flex justify-between text-[10px] text-slate-300 mb-1"><span>${o.name}</span> <span class="font-mono text-white">${pct}%</span></div><div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: ${pct}%"></div></div></div>`;
        });
        osList.innerHTML = html;
    }

    // Acquisition sections are now handled via renderPaginatedList at the end

    renderPaginatedList('topPages', MOCK_DATA.topPages, 'page-path-list', 'page-path-indicator');
    renderPaginatedList('landingPages', MOCK_DATA.landingPages, 'landing-page-list', 'landing-page-indicator');
    renderPaginatedList('referrers', MOCK_DATA.referrers, 'referrer-list', 'referrer-indicator');
    renderPaginatedList('channels', MOCK_DATA.channels || [], 'channel-group-list', 'channel-indicator');
    renderPaginatedList('trafficSources', MOCK_DATA.trafficSources || [], 'source-medium-list', 'source-indicator');
}

function drawMainChart(period) {
    const isAnalytics = !!document.getElementById('analytics-page');
    const vPadding = isAnalytics ? 20 : 8; // Maintain ultimate precision for Analytics, preserve Overview
    const prevChartLine = document.querySelector('.main-chart-previous');
    const mainChartFill = document.querySelector('.main-chart-fill');
    const mainChartLineGlow = document.querySelector('.main-chart-line-glow');
    const mainChartLine = document.querySelector('.main-chart-line');
    const yAxisContainer = document.getElementById('main-chart-y-axis');

    if (!mainChartLine) return;

    let data = MOCK_DATA.timeseries.visitors[period] || [];
    
    // FALLBACK: If data is empty, create a dummy 7-point/24-point flat line to maintain UI
    if (data.length === 0) {
        const fallbackCount = (period === 'monthly') ? 30 : (period === 'daily' ? 24 : 7);
        data = Array.from({ length: fallbackCount }, (_, i) => ({ label: '', value: 0 }));
    }

    const prevKey = 'prev' + period.charAt(0).toUpperCase() + period.slice(1);
    let prevData = MOCK_DATA.timeseries.visitors[prevKey] || data;
    if (prevData.length === 0) prevData = data;

    // 1. Dynamic Y-Axis Scaling (Refined Landmarks)
    const allVals = [...data.map(d => d.value), ...prevData.map(d => d.value)];
    const maxVal = Math.max(...allVals, 0);

    const yMax = getYAxisMax(maxVal);
    const step = yMax / 4;

    if (yAxisContainer) {
        const spans = yAxisContainer.querySelectorAll('span');
        if (spans.length === 5) {
            spans[0].innerText = formatNumber(yMax);
            spans[1].innerText = formatNumber(yMax - step);
            spans[2].innerText = formatNumber(yMax - (step * 2));
            spans[3].innerText = formatNumber(yMax - (step * 3));
            spans[4].innerText = 0;

            const chartSvg = document.querySelector('#main-chart-parent svg');
            if (chartSvg) {
                const svgRect = chartSvg.getBoundingClientRect();
                const parentRect = yAxisContainer.parentElement.getBoundingClientRect();
                
                yAxisContainer.style.setProperty('display', 'block', 'important');
                yAxisContainer.style.setProperty('padding', '0', 'important');
                yAxisContainer.style.setProperty('margin', '0', 'important');
                yAxisContainer.style.setProperty('position', 'absolute', 'important');
                yAxisContainer.style.setProperty('bottom', 'auto', 'important');
                yAxisContainer.style.setProperty('left', '0', 'important');
                yAxisContainer.style.setProperty('width', '32px', 'important'); // Width-8 is 2rem (32px)
                
                const vPaddingPx = (vPadding / 300) * svgRect.height;
                const contentHeight = svgRect.height - (vPaddingPx * 2);
                
                yAxisContainer.style.setProperty('top', (svgRect.top - parentRect.top + vPaddingPx) + 'px', 'important');
                yAxisContainer.style.setProperty('height', contentHeight + 'px', 'important');
                yAxisContainer.style.setProperty('boxSizing', 'border-box', 'important');

                // Draw Horizontal Grid Lines to match labels exactly (Analytics only)
                const hLines = chartSvg.querySelectorAll('.horizontal-grid-line');
                hLines.forEach(l => l.remove());
                const staticHPath = chartSvg.querySelector('path[d^="M0,75"]');
                if (staticHPath) staticHPath.style.opacity = '0'; // Hide misaligned static grid

                for (let i = 0; i <= 4; i++) {
                    const yPos = vPadding + (i * 0.25) * (300 - 2 * vPadding);
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", 0);
                    line.setAttribute("y1", yPos);
                    line.setAttribute("x2", 1000);
                    line.setAttribute("y2", yPos);
                    line.setAttribute("stroke", "rgba(255,255,255,0.05)");
                    line.setAttribute("stroke-width", "1");
                    line.setAttribute("class", "horizontal-grid-line");
                    chartSvg.appendChild(line); // Use appendChild to keep natural order (Top -> Bottom)
                }

                // Final Precise Mapping: Match HTML label centers to physical line positions
                const gridLines = chartSvg.querySelectorAll('.horizontal-grid-line');
                const offsetParentRect = (yAxisContainer.offsetParent || yAxisContainer.parentElement).getBoundingClientRect();
                
                spans.forEach((span, i) => {
                    if (gridLines[i]) {
                        const lineRect = gridLines[i].getBoundingClientRect();
                        const targetY = lineRect.top - offsetParentRect.top + (lineRect.height / 2);
                        
                        span.style.setProperty('position', 'absolute', 'important');
                        span.style.setProperty('right', '8px', 'important');
                        span.style.setProperty('top', targetY + 'px', 'important');
                        span.style.setProperty('transform', 'translateY(-50%)', 'important');
                        span.style.setProperty('margin', '0', 'important');
                        span.style.setProperty('lineHeight', '1', 'important');
                        span.style.setProperty('display', 'block', 'important');
                    }
                });
            }
        }
    }

    // 2. Calculate Strict Geometric Points for Grid Lines and Labels
    // Monthly: 31 lines (one per day). Others: 7 lines (even intervals).
    let numLines = (period === 'monthly') ? 31 : 7;

    const points = data.length;
    let visualPoints = [];

    if (numLines > 0) {
        if (points > 1) {
            for (let i = 0; i < numLines; i++) {
                const pct = i / (numLines - 1); // Perfect geometric spacing
                const idx = Math.round(pct * (points - 1)); // Nearest data index for the label
                visualPoints.push({ pct, idx });
            }
        } else if (points === 1) {
            // Handle single point case
            visualPoints.push({ pct: 0.5, idx: 0 });
        }
    }

    // 3. Draw X-Axis Labels — FULLY PROGRAMMATIC from current date/time
    const xAxisContainer = document.getElementById('main-chart-x-axis');
    const getSvgElement = () => mainChartLine ? mainChartLine.closest('svg') : null;
    const chartSvg = getSvgElement();

    if (xAxisContainer && chartSvg) {
        // Generate programmatic labels based on current date/time
        const now = new Date();
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let programmaticLabels = []; // { idx, label } — idx is the visual point index to place label at

        if (period === 'daily') {
            // 24 hours: generate labels for every 3-4 hours across the full range
            // numLines = 7, so we show all 7 labels spanning 24 hours
            // Data has 24 points (hours 0..23 going back from now)
            const totalHours = 24;
            for (let i = 0; i < numLines; i++) {
                const hoursAgo = Math.round((1 - (i / (numLines - 1))) * (totalHours - 1));
                const dt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
                let h = dt.getHours();
                const ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12;
                h = h ? h : 12;
                programmaticLabels.push({ vpIndex: i, label: h + ampm });
            }
        } else if (period === 'weekly') {
            // 7 days: one label per day, ending at today
            for (let i = 0; i < 7; i++) {
                const dt = new Date(now);
                dt.setDate(now.getDate() - (6 - i));
                programmaticLabels.push({ vpIndex: i, label: weekdays[dt.getDay()] });
            }
        } else if (period === 'monthly') {
            // 30 days: labels every 6 days
            // numLines = 31 (one per day)
            const totalDays = 30;
            for (let i = 0; i < numLines; i++) {
                const showLabel = (i % 6 === 0) || (i === numLines - 1);
                if (showLabel) {
                    const daysAgo = totalDays - i;
                    const dt = new Date(now);
                    dt.setDate(now.getDate() - daysAgo);
                    programmaticLabels.push({ vpIndex: i, label: (dt.getMonth() + 1) + '/' + dt.getDate() });
                }
            }
        }

        let labels = [];
        programmaticLabels.forEach(pl => {
            const vp = visualPoints[pl.vpIndex];
            if (!vp) return;
            const xPos = vPadding + vp.pct * (1000 - 2 * vPadding);
            const leftPct = (xPos / 1000) * 100;
            const transform = 'translateX(-50%)';
            labels.push(`<span style="position: absolute; left: ${leftPct}%; transform: ${transform}; white-space: nowrap;">${pl.label}</span>`);
        });
        
        // Coordinate synchronization via dynamic measurement
        const svgStyle = window.getComputedStyle(chartSvg);
        const svgPL = parseFloat(svgStyle.paddingLeft) || 0;
        const svgPR = parseFloat(svgStyle.paddingRight) || 0;
        
        const svgRect = chartSvg.getBoundingClientRect();
        const parentRect = xAxisContainer.parentElement.getBoundingClientRect();
        
        xAxisContainer.className = 'absolute bottom-10 text-[9px] text-slate-500 font-mono';
        xAxisContainer.style.position = 'absolute';
        xAxisContainer.style.left = (svgRect.left - parentRect.left + svgPL) + 'px';
        xAxisContainer.style.width = (svgRect.width - svgPL - svgPR) + 'px';
        xAxisContainer.style.padding = '0';
        xAxisContainer.style.margin = '0';
        xAxisContainer.style.boxSizing = 'border-box';
        xAxisContainer.style.display = 'block'; 
        xAxisContainer.innerHTML = labels.join('');
    }

    // 4. Generate Paths using the new rangeMax parameter + vertical padding to prevent clipping
    const pathData = generateLineChartPath(data, 1000, 300, vPadding, null, yMax);
    const prevPathData = generateLineChartPath(prevData, 1000, 300, vPadding, null, yMax);

    // 5. Draw Vertical Grid Lines EXACTLY matching label coordinates
    if (chartSvg) {
        const oldLines = chartSvg.querySelectorAll('.vertical-grid-line');
        oldLines.forEach(l => l.remove());

        if (visualPoints.length > 0) {
            const svgWidth = 1000;
            const svgHeight = 300;
            
            visualPoints.forEach((vp) => {
                // Calculate xPos accounting for padding, same as generateLineChartPath
                const xPos = vPadding + vp.pct * (svgWidth - 2 * vPadding);
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", xPos);
                line.setAttribute("y1", 0);
                line.setAttribute("x2", xPos);
                line.setAttribute("y2", svgHeight);
                line.setAttribute("stroke", "rgba(255,255,255,0.15)");
                line.setAttribute("stroke-width", "1");
                line.setAttribute("stroke-dasharray", "4 4");
                line.setAttribute("class", "vertical-grid-line");
                
                const firstPath = chartSvg.querySelector('path');
                if (firstPath) {
                    firstPath.insertAdjacentElement('afterend', line);
                } else {
                    chartSvg.prepend(line);
                }
            });
        }
    }

    // Transition settings
    [mainChartLine, mainChartFill, mainChartLineGlow, prevChartLine].forEach(el => {
        if (el) el.style.transition = 'd 0.3s ease-in-out';
    });

    if (mainChartLine) mainChartLine.setAttribute('d', pathData);
    if (mainChartLineGlow) mainChartLineGlow.setAttribute('d', pathData);
    // Fill should end at the very bottom of the SVG (300) regardless of padding
    if (mainChartFill) {
        if (pathData) {
            // For fill, we need to ensure it's a closed loop
            // If pathData is "M x,y L x+0.1,y", we need to append the bottom corners
            mainChartFill.setAttribute('d', `${pathData} L1000,300 L0,300 Z`);
        } else {
            mainChartFill.setAttribute('d', '');
        }
    }
    if (prevChartLine) prevChartLine.setAttribute('d', prevPathData);

    // === CHART TOTAL: Sum the visible graph values ===
    const chartSum = data.reduce((sum, d) => sum + d.value, 0);
    const prevChartSum = prevData.reduce((sum, d) => sum + d.value, 0);

    // Update the chart header number
    document.querySelectorAll('[data-metric="chartTotal"]').forEach(el => {
        el.innerText = chartSum.toLocaleString();
    });

    // Sync Total Visitors card ONLY when in Weekly view to match the chart total exactly
    if (period === 'weekly') {
        document.querySelectorAll('[data-metric="totalVisitors"]').forEach(el => {
            el.innerText = chartSum.toLocaleString();
        });

        // Also sync the trend percentage and icon
        const chartTrendPct = prevChartSum > 0 ? ((chartSum - prevChartSum) / prevChartSum * 100) : 0;
        const chartTrendPositive = chartTrendPct >= 0;
        
        document.querySelectorAll('[data-trend="totalVisitors"]').forEach(el => {
            el.innerText = (chartTrendPositive ? '+' : '') + chartTrendPct.toFixed(1) + '%';
            el.className = chartTrendPositive 
                ? 'text-emerald-400 flex items-center text-[10px] font-bold bg-emerald-900/40 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(16,185,129,0.2)] mb-1'
                : 'text-rose-400 flex items-center text-[10px] font-bold bg-rose-900/40 border border-rose-500/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(244,63,94,0.2)] mb-1';
        });

        const iconEl = document.querySelector('[data-trend-icon="totalVisitors"]');
        if (iconEl) {
            iconEl.innerText = chartTrendPositive ? 'trending_up' : 'trending_down';
            iconEl.className = `material-symbols-outlined text-sm ${chartTrendPositive ? 'text-emerald-400' : 'text-rose-400'}`;
        }
    }

    // Update the chart trend percentage
    const chartTrendPct = prevChartSum > 0 ? ((chartSum - prevChartSum) / prevChartSum * 100) : 0;
    const chartTrendPositive = chartTrendPct >= 0;
    document.querySelectorAll('[data-trend="chartTotal"]').forEach(el => {
        el.innerText = (chartTrendPositive ? '+' : '') + chartTrendPct.toFixed(1) + '%';
        el.className = `text-sm font-bold ${chartTrendPositive ? 'text-emerald-400' : 'text-rose-400'}`;
    });
    document.querySelectorAll('[data-trend-icon="chartTotal"]').forEach(el => {
        el.innerText = chartTrendPositive ? 'trending_up' : 'trending_down';
        el.className = `material-symbols-outlined text-sm ${chartTrendPositive ? 'text-emerald-400' : 'text-rose-400'}`;
    });

    // Update the "vs. previous period" label
    const periodLabel = period === 'daily' ? 'vs last 24h' : (period === 'monthly' ? 'vs last 30d' : 'vs last week');
    document.querySelectorAll('[data-trend="chartTotal"]').forEach(el => {
        const labelEl = el.nextElementSibling;
        if (labelEl && (labelEl.innerText.includes('vs') || labelEl.innerText.includes('period'))) {
            labelEl.innerText = periodLabel;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboardWithLiveAnalytics();
    initContentPagination();
    if (window.location.pathname.includes('dashboard_analytics.html') || document.getElementById('heatmap-grid-7row')) {
        initHeatmapData();
    }
});

function initContentPagination() {
    const configs = [
        { key: 'topPages', prev: 'page-path-prev', next: 'page-path-next', data: () => MOCK_DATA.topPages, container: 'page-path-list', indicator: 'page-path-indicator' },
        { key: 'landingPages', prev: 'landing-page-prev', next: 'landing-page-next', data: () => MOCK_DATA.landingPages, container: 'landing-page-list', indicator: 'landing-page-indicator' },
        { key: 'referrers', prev: 'referrer-prev', next: 'referrer-next', data: () => MOCK_DATA.referrers, container: 'referrer-list', indicator: 'referrer-indicator' },
        { key: 'channels', prev: 'channel-prev', next: 'channel-next', data: () => MOCK_DATA.channels, container: 'channel-group-list', indicator: 'channel-indicator' },
        { key: 'trafficSources', prev: 'source-prev', next: 'source-next', data: () => MOCK_DATA.trafficSources, container: 'source-medium-list', indicator: 'source-indicator' }
    ];

    configs.forEach(cfg => {
        const prevBtn = document.getElementById(cfg.prev);
        const nextBtn = document.getElementById(cfg.next);

        if (prevBtn && !prevBtn.onclick) {
            prevBtn.onclick = () => {
                const state = paginationState[cfg.key];
                if (state.currentPage > 1) {
                    state.currentPage--;
                    renderPaginatedList(cfg.key, cfg.data(), cfg.container, cfg.indicator);
                }
            };
        }

        if (nextBtn && !nextBtn.onclick) {
            nextBtn.onclick = () => {
                const state = paginationState[cfg.key];
                const data = cfg.data() || [];
                const totalPages = Math.ceil(data.length / state.itemsPerPage) || 1;
                if (state.currentPage < totalPages) {
                    state.currentPage++;
                    renderPaginatedList(cfg.key, data, cfg.container, cfg.indicator);
                }
            };
        }
    });
}

async function initHeatmapData() {
    const grid = document.getElementById('heatmap-grid-7row');
    const monthLabelsRow = document.getElementById('heatmap-month-labels');
    if (!grid) return;

    try {
        // Authentication Logic (matching fetchGA4Data bypass)
        let token = null;
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            token = "dev_token";
        } else if (window.Clerk && window.Clerk.session) {
            token = await window.Clerk.session.getToken();
        }

        const fetchOptions = token ? {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        } : {
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await fetch(getApiUrl('/api/analytics/heatmap'), fetchOptions);
        if (!response.ok) throw new Error("Heatmap API failed");
        const data = await response.json();

        // Standard Heatmap Layout: 7 rows (Sun-Sat), 23 columns (161 days)
        // logic: Bottom-right is TODAY. Moving UP is prev day. 
        // When reaching top, next earliest is bottom of prev column.

        const totalCells = 7 * 23;
        const maxUsers = Math.max(...Object.values(data), 10); // avoid div by zero

        grid.innerHTML = '';
        if (monthLabelsRow) monthLabelsRow.innerHTML = '<div></div>'; // Reset except first empty cell

        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayRows = [];

        // Create 7 row containers
        for (let r = 0; r < 7; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'contents'; // Let them flow into the grid-cols container

            const label = document.createElement('div');
            label.className = 'text-[9px] text-slate-500 font-medium flex items-center justify-end pr-2';
            label.innerText = weekdays[r];
            rowDiv.appendChild(label);

            dayRows[r] = rowDiv;
        }

        const now = new Date();
        const cellsByColumn = []; // To track column starts for month labels

        // We fill 23 columns. Each column has 7 days.
        // Col 22 (rightmost) bottom cell is Today.
        for (let col = 0; col < 23; col++) {
            cellsByColumn[col] = [];
            for (let row = 0; row < 7; row++) {
                // Calculate "distance" from Today (Bottom-Right)
                // Bottom-right is (row=6, col=22) -> index 0
                // Up one is (row=5, col=22) -> index 1
                // ...
                // Top-right is (row=0, col=22) -> index 6
                // Bottom of next left is (row=6, col=21) -> index 7

                const distanceRatio = (22 - col) * 7 + (6 - row);
                const cellDate = new Date(now);
                cellDate.setDate(now.getDate() - distanceRatio);
                const dateKey = cellDate.toISOString().split('T')[0];
                const val = data[dateKey] || 0;

                const cell = document.createElement('div');
                cell.className = 'h-8 rounded-sm transition-all cursor-pointer relative group z-10 hover:outline hover:outline-1 hover:outline-white hover:z-[60]';

                const ratio = Math.log(val + 1) / Math.log(maxUsers + 1);
                const blue = Math.round(20 + (ratio * 235));
                cell.style.backgroundColor = val > 0 ? `rgb(10, 40, ${blue})` : '#0a0a0f';

                // Smart Tooltip Positioning
                // User requested all popups to be ABOVE the boxes.
                // For the rightmost columns (20, 21, 22), we need to shift the tooltip to the left (right-0)
                const verticalPosClass = 'bottom-full mb-2';
                const horizontalPosClass = col > 20 ? 'right-0' : 'left-1/2 -translate-x-1/2';

                cell.innerHTML = `
                    <div class="absolute ${verticalPosClass} ${horizontalPosClass} hidden group-hover:block bg-[#050508] border border-blue-500/30 text-white text-[11px] px-3 py-2 rounded-lg z-[999] whitespace-nowrap shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl border-l-[3px] border-l-blue-500">
                        <div class="text-slate-400 font-medium mb-1 border-b border-white/5 pb-1">${cellDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        <div class="flex items-center justify-between gap-4">
                             <span class="text-xs text-blue-400 font-bold">Users:</span>
                             <span class="text-white font-mono">${val.toLocaleString()}</span>
                        </div>
                    </div>
                `;

                cellsByColumn[col][row] = cell;

                // Handle Month Labels (Check if this is the first day of a month)
                if (row === 0 && monthLabelsRow) {
                    const monthLabel = document.createElement('div');
                    monthLabel.className = 'text-[8px] text-slate-500 font-mono text-center';
                    // Only show month name if it's the start of a month or the very first column
                    if (cellDate.getDate() <= 7 || col === 0) {
                        monthLabel.innerText = cellDate.toLocaleString('default', { month: 'short' });
                    }
                    monthLabelsRow.appendChild(monthLabel);
                }
            }
        }

        // Now append to DOM in order: Rows first
        // Wait, the container is grid-cols-[50px_repeat(23,1fr)]
        // So we need to output: Label, Col0Cell, Col1Cell... Col22Cell for EACH row
        grid.innerHTML = '';
        for (let r = 0; r < 7; r++) {
            const label = document.createElement('div');
            label.className = 'text-[9px] text-slate-500 font-medium flex items-center justify-end pr-2 h-8';
            label.innerText = weekdays[r];
            grid.appendChild(label);

            for (let c = 0; c < 23; c++) {
                grid.appendChild(cellsByColumn[c][r]);
            }
        }

    } catch (e) {
        console.error("Heatmap initialization error:", e);
        grid.innerHTML = `<div class="p-4 text-red-500 text-xs col-span-24 text-center">Failed to load heatmap: ${e.message}</div>`;
    }
}
// --- New: Screen Page Views Chart logic ---
function drawPageViewsChart() {
    const data = MOCK_DATA.pageViewsSeries30d;
    if (!data || !data.views || data.views.length === 0) return;

    const width = 1000;
    const height = 200;

    const chartSvg = document.getElementById('page-views-chart-svg');
    const path = document.getElementById('page-views-chart-path');
    const xAxisContainer = document.getElementById('page-views-x-axis');
    const totalEl = document.getElementById('screen-page-views-total');
    const scrolledEl = document.getElementById('scrolled-users-value');
    const viewsPerUserEl = document.getElementById('views-per-user-value');

    if (!chartSvg || !path) return;

    // Use a small delay to ensure layout is ready
    setTimeout(() => {
        const svgRect = chartSvg.getBoundingClientRect();
        if (svgRect.width === 0) {
            // If still hidden, try again once more after a longer delay
            setTimeout(drawPageViewsChart, 500);
            return;
        }

        // Add grid lines
        let gridLinesGroup = chartSvg.querySelector('.chart-grid-lines');
        if (!gridLinesGroup) {
            gridLinesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            gridLinesGroup.setAttribute('class', 'chart-grid-lines');
            chartSvg.insertBefore(gridLinesGroup, path);
        }
        gridLinesGroup.innerHTML = '';
        
        const vPadding = 0; // Remove internal padding for exact match with edge labels
        const points = data.labels.length;
        const numLines = 31;
        
        for (let i = 0; i < numLines; i++) {
            const pct = i / (numLines - 1); 
            const xPos = pct * width;
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', xPos);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', xPos);
            line.setAttribute('y2', height);
            line.setAttribute('stroke', 'rgba(255,255,255,0.1)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '4 4');
            gridLinesGroup.appendChild(line);
        }

        // Update Totals
        if (totalEl) totalEl.textContent = Number(MOCK_DATA.currentMetrics.screenPageViews).toLocaleString();
        if (scrolledEl) scrolledEl.textContent = Number(MOCK_DATA.currentMetrics.scrolledUsers).toLocaleString();
        if (viewsPerUserEl) viewsPerUserEl.textContent = Number(MOCK_DATA.currentMetrics.screenPageViewsPerUser).toFixed(2);

        // Update X-Axis (Dates)
        if (xAxisContainer) {
            xAxisContainer.innerHTML = '';
            xAxisContainer.style.display = 'flex';
            xAxisContainer.style.justifyContent = 'space-between';
            xAxisContainer.style.width = '100%';
            xAxisContainer.style.padding = '0';
            xAxisContainer.style.position = 'static'; // Use natural layout flow if possible

            // To avoid overlap, we'll only show ~6 labels
            const step = Math.floor(points / 5) || 1;
            for (let i = 0; i < points; i += step) {
                const span = document.createElement('span');
                span.textContent = data.labels[i];
                xAxisContainer.appendChild(span);
            }
            // Always show the last label if it's not already there
            if ((points - 1) % step !== 0) {
                const lastSpan = document.createElement('span');
                lastSpan.textContent = data.labels[points - 1];
                xAxisContainer.appendChild(lastSpan);
            }
        }

        // Draw Line
        const maxVal = Math.max(...data.views, 0);
        const yMax = maxVal === 0 ? 100 : getYAxisMax(maxVal); 
        
        // Update Y-Axis Labels
        const yAxisLabelsContainer = document.getElementById('page-views-y-axis-labels');
        if (yAxisLabelsContainer) {
            yAxisLabelsContainer.innerHTML = '';
            const step = yMax / 4;
            for (let i = 0; i <= 4; i++) {
                const span = document.createElement('span');
                span.textContent = formatNumber(yMax - (step * i));
                yAxisLabelsContainer.appendChild(span);
            }
        }

        const hPadding = 0;
        const vPaddingLine = 20;
        const pathData = data.views.map((val, i) => {
            const x = (i / (points - 1)) * width;
            const y = height - (vPaddingLine + (val / yMax) * (height - 2 * vPaddingLine));
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        }).join(' ');

        if (path) {
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', '#0d33f2');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
        }

        // Dynamic Horizontal Grid Lines
        const existingHLines = chartSvg.querySelectorAll('.horizontal-grid-line');
        existingHLines.forEach(l => l.remove());

        for (let i = 0; i <= 4; i++) {
            const yPos = vPaddingLine + (i * 0.25) * (height - 2 * vPaddingLine);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", 0);
            line.setAttribute("y1", yPos);
            line.setAttribute("x2", 1000);
            line.setAttribute("y2", yPos);
            line.setAttribute("stroke", "rgba(255,255,255,0.05)");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("class", "horizontal-grid-line");
            chartSvg.appendChild(line);
        }
    }, 100);
}

// Ensure it's called after injection
const originalDrawAll = window.drawAllCharts;
window.drawAllCharts = () => {
    if (typeof originalDrawAll === 'function') originalDrawAll();
    drawPageViewsChart();
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial draw if data is present
    if (MOCK_DATA.pageViewsSeries30d.views.length > 0) {
        drawPageViewsChart();
    }
    
    // Fetch and render the 4 stat card rolling sparklines
    fetchSparklineData();

    if (window.location.pathname.includes('dashboard_resources.html')) {
        initResourcesPage();
    }
    if (window.location.pathname.includes('dashboard_help.html')) {
        initHelpPage();
    }
    if (window.location.pathname.includes('dashboard_docs.html')) {
        initDocsPage();
    }
    if (window.location.pathname.includes('dashboard_performance.html')) {
        initPerformancePage();
    }
});

function initPerformancePage() {
    const desktopBtn = document.getElementById('strategy-desktop');
    const mobileBtn = document.getElementById('strategy-mobile');
    const refreshBtn = document.getElementById('recalculate-perf');

    if (desktopBtn) desktopBtn.addEventListener('click', () => updateStrategyUI('desktop'));
    if (mobileBtn) mobileBtn.addEventListener('click', () => updateStrategyUI('mobile'));
    if (refreshBtn) refreshBtn.addEventListener('click', () => initPerformanceData(true));

    // Initial load
    initPerformanceData();
}

/**
 * Resources Page Initialization
 */
async function initResourcesPage() {
    // 1. Modification Request Modal Logic
    const openModBtn = document.getElementById('new-modification-request-btn');
    const modal = document.getElementById('modification-modal');
    const closeModBtn = document.getElementById('close-mod-modal');
    const cancelModBtn = document.getElementById('cancel-mod-request');
    const modForm = document.getElementById('modification-form');

    const toggleModal = (show) => {
        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    if (openModBtn) openModBtn.addEventListener('click', () => toggleModal(true));
    if (closeModBtn) closeModBtn.addEventListener('click', () => toggleModal(false));
    if (cancelModBtn) cancelModBtn.addEventListener('click', () => toggleModal(false));
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.absolute.inset-0')) toggleModal(false);
        });
    }

    if (modForm) {
        modForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = modForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin px-2">sync</span> Submitting...';

            const payload = {
                title: document.getElementById('mod-title').value,
                description: document.getElementById('mod-desc').value,
                urgency: document.getElementById('mod-urgency').value,
                pageSection: document.getElementById('mod-page').value
            };

            try {
                const response = await fetch(getApiUrl('/api/resources/modification'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    if (typeof showToast === 'function') {
                        showToast("Modification request submitted successfully!", "success");
                    } else {
                        alert("Request submitted successfully!");
                    }
                    toggleModal(false);
                    modForm.reset();
                } else {
                    throw new Error("Failed to submit request");
                }
            } catch (error) {
                console.error("Submission error:", error);
                if (typeof showToast === 'function') {
                    showToast("Failed to submit request. Please try again.", "error");
                } else {
                    alert("Failed to submit request.");
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // 2. Search Functional Logic
    const searchInput = document.getElementById('resource-search-input');
    const resourceCards = document.querySelectorAll('.resource-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            resourceCards.forEach(card => {
                const targetText = card.getAttribute('data-search-target');
                if (!targetText) return; // Skip cards that aren't meant to be searched/filtered (like the search box itself)

                const cardTitle = card.querySelector('h3')?.innerText.toLowerCase() || '';
                const cardDesc = card.querySelector('p')?.innerText.toLowerCase() || '';
                
                const matches = query === '' || 
                               targetText.toLowerCase().includes(query) || 
                               cardTitle.includes(query) || 
                               cardDesc.includes(query);

                if (matches) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }

    // 3. Tag Logic
    const resourceTags = document.querySelectorAll('.resource-tag');
    resourceTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagVal = tag.getAttribute('data-tag');
            if (searchInput) {
                searchInput.value = tagVal;
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
            }
        });
    });

    // 4. System Status Binding
    try {
        const statusRes = await fetch(getApiUrl('/api/performance/uptime'));
        if (statusRes.ok) {
            const data = await statusRes.json();
            const uptimePct = data.uptime || '100.00';
            const history = data.history || [];
            
            const statusIndicator = document.getElementById('system-status-indicator');
            const uptimeValue = document.getElementById('system-uptime-value');
            const uptimeBar = document.getElementById('system-uptime-bar');

            if (uptimeValue) uptimeValue.innerText = `${uptimePct}%`;
            if (uptimeBar) uptimeBar.style.width = `${uptimePct}%`;

            if (history.length > 0) {
                const latest = history[history.length - 1];
                if (latest.status === 'down' && statusIndicator) {
                    statusIndicator.className = "px-2 py-1 rounded bg-rose-900/30 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5";
                    statusIndicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Service Interruption';
                }
            }
        }
    } catch (e) {
        console.warn("Failed to fetch system status for resources page:", e);
    }
}

/**
 * Help Page Initialization
 */
function initHelpPage() {
    // 1. FAQ Toggles - Refactored for independent toggling
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const icon = item.querySelector('.material-symbols-outlined');
        if (icon) icon.style.transition = 'transform 0.3s ease';
        
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Independent toggle: Just toggle the state of the clicked item
            if (isActive) {
                item.classList.remove('active');
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 2. Search Logic - Refactored for industry-standard keyword recognition
    const searchInput = document.getElementById('help-search-input');
    const faqCategories = document.querySelectorAll('.space-y-12.relative.z-10 > div');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const keywords = query.split(/\s+/).filter(k => k.length > 1);
            
            faqCategories.forEach(category => {
                const items = category.querySelectorAll('.faq-item');
                let hasVisibleItems = false;
                
                items.forEach(item => {
                    const question = item.querySelector('h4').innerText.toLowerCase();
                    const answer = item.querySelector('.faq-answer').innerText.toLowerCase();
                    const combinedContent = question + " " + answer;
                    
                    let isMatch = false;
                    
                    if (query === '') {
                        isMatch = true;
                    } else if (combinedContent.includes(query)) {
                        // Priority: Full phrase match
                        isMatch = true;
                    } else if (keywords.length > 0) {
                        // Industry standard: Check for individual keywords (AND logic for higher relevance)
                        isMatch = keywords.every(kw => combinedContent.includes(kw));
                    }
                    
                    if (isMatch) {
                        item.style.display = '';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show/hide category based on visible items
                category.style.display = hasVisibleItems ? '' : 'none';
            });
        });
    }

    // 3. Contact Actions
    const chatBtn = document.getElementById('start-chat-btn');
    const emailBtn = document.getElementById('email-support-btn');
    
    if (chatBtn) {
        chatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof showToast === 'function') {
                showToast("Connecting to live support agent...", "info");
            } else {
                alert("Connecting to live support agent...");
            }
        });
    }
    
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'mailto:support@alconio.com';
        });
    }
}

/**
 * Documentation Page Initialization
 */
function initDocsPage() {
    const searchInput = document.getElementById('docs-search-input');
    const docCards = document.querySelectorAll('.glass-panel.rounded-2xl.p-6');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            docCards.forEach(card => {
                const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
                const list = card.querySelector('ul')?.innerText.toLowerCase() || '';
                
                if (query === '' || title.includes(query) || list.includes(query)) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }
}
