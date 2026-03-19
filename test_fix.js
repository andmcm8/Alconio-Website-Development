// dashboard_data.js
// Central mock data and utility module for the Alconio Dashboard

// --- Live Traffic Data Source ---
// This array will be populated dynamically from Google Analytics.
let rawTrafficData = [];

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
        // Last 24 hours (4 points of 6-hour intervals)
        return extractPeriodData(rawData, 4, 'time', isPrevious);
    } else if (period === 'weekly') {
        // Last 7 days (28 points)
        return extractPeriodData(rawData, 28, 'weekday', isPrevious);
    } else if (period === 'monthly') {
        // Last 30 days (120 points)
        return extractPeriodData(rawData, 120, 'date', isPrevious);
    }
}

const MOCK_DATA = {
    overview: {
        totalVisitors: { current: 0, previous: 0, trend: 0 },
        totalUsers: { current: 0, previous: 0, trend: 0 },
        activeUsers: { current: 0, previous: 0, trend: 0 },
        bounceRate: { current: 0, previous: 0, trend: 0 },
        avgSession: { current: 0, previous: 0, trend: 0 },
        chartTotal: { current: 0, previous: 0, trend: 0 }
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
    channels: [],
    trafficSources: [],
    cities: [],
    referrers: [],
    currentMetrics: {
        totalUsers: 0,
        activeUsers: 0,
        newUsersRatio: 0,
        newUsers: 0,
        returningUsers: 0,
        totalSessions: 0,
        avgSessionDuration: "0m 0s",
        userEngagementDuration: "0m 0s",
        screenPageViews: 0
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

// Utilities
const mapRootToHomepage = (path) => path === '/' ? '/homepage' : path;

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toLocaleString();
}

function saveDashboardCache() {
    try {
        localStorage.setItem('alconio_dashboard_cache', JSON.stringify(MOCK_DATA));
        localStorage.setItem('alconio_dashboard_cache_ts', Date.now());
    } catch (e) {
        console.warn("Failed to save dashboard cache:", e);
    }
}

function loadDashboardCache() {
    try {
        const cached = localStorage.getItem('alconio_dashboard_cache');
        if (cached) {
            const parsed = JSON.parse(cached);
            // Deep merge or replacement
            Object.assign(MOCK_DATA, parsed);

            // Immediately bind the UI with cached data
            bindDashboardUI();
            if (typeof bindAnalyticsLists === 'function') bindAnalyticsLists();

            // Signal to inline loaders that cache is applied
            window.dispatchEvent(new CustomEvent('alconio-cache-applied'));

            console.log("Dashboard loaded from local cache.");
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
function generateLineChartPath(data, width, height, padding, rangeMax = null) {
    if (!data || data.length === 0) return '';

    // Extract values if data contains objects
    const values = typeof data[0] === 'object' ? data.map(d => d.value) : data;

    const min = 0; // Always start from 0 for consistency
    const max = rangeMax !== null ? rangeMax : (Math.max(...values) || 1);
    const range = max - min || 1;

    const points = values.map((val, i) => {
        const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
        // Normalize val to [0, 1], flip Y axis, then scale to height
        const normalized = (val - min) / range;
        const y = height - padding - (normalized * (height - 2 * padding));
        return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
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
        const periodParam = activeBtn ? activeBtn.getAttribute('data-period') : 'weekly';
        const apiPeriod = periodParam === 'daily' ? 'today' : (periodParam === 'monthly' ? '30days' : '7days');

        const response = await fetch(`/api/analytics?period=${apiPeriod}`);
        if (!response.ok) throw new Error("GA4 API request failed");

        const liveData = await response.json();

        // 1. Overview Map (Current vs Previous benchmarks)
        const mapOverview = (key, liveKey) => {
            const data = liveData.overview[liveKey];
            let current = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
            // Round current for the main overview metrics
            current = Math.round(current);
            let previous = current / (1 + (data.trend / 100));

            MOCK_DATA.overview[key] = { current, previous, trend: data.trend >= 0 ? 'up' : 'down' };
        };

        mapOverview('totalVisitors', 'totalVisitors');
        mapOverview('totalUsers', 'totalVisitors');
        mapOverview('activeUsers', 'totalSessions');
        mapOverview('bounceRate', 'bounceRate');
        mapOverview('avgSession', 'avgSession');
        // NOTE: chartTotal is NOT mapped from API. It is computed in drawMainChart by summing visible graph values.

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

        // 3. Detailed Metrics & Lists
        MOCK_DATA.currentMetrics = {
            totalUsers: Math.round(liveData.overview.totalVisitors.value),
            activeUsers: Math.round(liveData.overview.activeUsers.value),
            newUsers: Math.round(liveData.breakdowns.userType.new),
            returningUsers: Math.round(liveData.breakdowns.userType.returning),
            newUsersRatio: ((liveData.breakdowns.userType.new / (liveData.breakdowns.userType.new + liveData.breakdowns.userType.returning || 1)) * 100).toFixed(1),
            totalSessions: Math.round(liveData.overview.totalSessions.value),
            avgSessionDuration: Math.round(liveData.overview.avgSession.value),
            screenPageViews: Math.round(liveData.topPages.reduce((a, b) => a + b.views, 0))
        };

        MOCK_DATA.topPages = liveData.topPages.map(p => ({
            ...p,
            path: mapRootToHomepage(p.path)
        }));
        MOCK_DATA.channels = liveData.breakdowns.channels.map(c => ({
            channelGroup: c.name,
            users: c.users,
            sessions: c.sessions
        }));

        MOCK_DATA.geography = {};
        MOCK_DATA.cities = [];
        MOCK_DATA.countries = liveData.countries || [];
        liveData.geography.forEach(g => {
            // Map country for the world map
            MOCK_DATA.geography[g.country] = { users: g.users, sessions: g.users };
            // Add to cities list
            MOCK_DATA.cities.push({
                city: g.city,
                country: g.country,
                users: g.users
            });
        });

        MOCK_DATA.devices = liveData.breakdowns.devices;
        MOCK_DATA.browsers = liveData.breakdowns.browsers;
        MOCK_DATA.os = liveData.breakdowns.os;
        MOCK_DATA.trafficSources = liveData.breakdowns.trafficSources;

        console.log("Live Dashboard data locked in.");
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
    }
}

// Auto-refresh every 5 minutes
setInterval(initDashboardWithLiveAnalytics, 5 * 60 * 1000);

function bindDashboardUI() {

    // Bind numeric metrics using data-metric
    document.querySelectorAll('[data-metric]').forEach(el => {
        const key = el.getAttribute('data-metric');
        // chartTotal is computed in drawMainChart by summing graph values — skip here
        if (key === 'chartTotal') return;
        if (MOCK_DATA.overview[key]) {
            let val = MOCK_DATA.overview[key];
            if (typeof val === 'object') val = val.current;

            // Final safety rounding for UI
            const roundedVal = Math.round(val);

            if (key === 'avgSession') {
                el.innerText = formatDuration(roundedVal);
            } else if (key === 'bounceRate') {
                el.innerText = roundedVal + '%';
            } else {
                el.innerText = roundedVal.toLocaleString();
            }
        }
    });

    // Bind trend labels using data-trend
    document.querySelectorAll('[data-trend]').forEach(el => {
        const key = el.getAttribute('data-trend');
        // chartTotal trends are computed in drawMainChart — skip here
        if (key === 'chartTotal') return;
        const data = MOCK_DATA.overview[key];

        if (data && data.previous) {
            let isPositive = data.current >= data.previous;
            // Lower is better for bounce rate
            if (key === 'bounceRate') isPositive = !isPositive;

            let displayVal = '';
            if (key === 'avgSession') {
                const diff = data.current - data.previous;
                displayVal = (diff >= 0 ? '+' : '') + diff + 's';
            } else {
                const pct = calculatePercentageChange(data.current, data.previous);
                displayVal = (pct >= 0 ? '+' : '') + pct + '%';
            }

            el.innerText = displayVal;
            el.className = `text-[10px] font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`;

            // Sync Trend Icons
            const iconEl = document.querySelector(`[data-trend-icon="${key}"]`);
            if (iconEl) {
                iconEl.innerText = isPositive ? 'trending_up' : 'trending_down';
                iconEl.className = `material-symbols-outlined text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`;
            }

            // Sync Trend Labels Context (e.g. "vs last week", "vs last 24h")
            const labelEl = el.nextElementSibling;
            if (labelEl && (labelEl.innerText.includes('vs last') || labelEl.innerText.includes('vs.'))) {
                const activeBtn = document.querySelector('.chart-period-btn.active');
                const periodParam = activeBtn ? activeBtn.getAttribute('data-period') : 'weekly';

                if (key === 'chartTotal') { // ONLY 'chartTotal' (chart header) is dynamic across periods
                    if (periodParam === 'daily') labelEl.innerText = 'vs last 24h';
                    else if (periodParam === 'monthly') labelEl.innerText = 'vs last 30d';
                    else labelEl.innerText = 'vs last week';
                } else if (key === 'totalVisitors' || key === 'totalUsers') {
                    labelEl.innerText = 'this week';
                } else {
                    // All other metrics (Sessions, Bounce Rate, Avg Session) are fixed to 7-day benchmarks
                    labelEl.innerText = 'vs last week';
                }
            }
        }
    });

    // Draw Adaptive Sparklines
    document.querySelectorAll('.sparkline-container').forEach(svg => {
        const metric = svg.getAttribute('data-sparkline');
        let data = MOCK_DATA.timeseries[metric];

        // If the data is nested by period (like visitors), default to weekly for sparklines
        if (data && !Array.isArray(data) && data.weekly) {
            data = data.weekly;
        }
        if (data) {
            const pathData = generateLineChartPath(data, 100, 30, 2);

            // Replicate original stroke colors based on metric
            let color = '#0052FF'; // default
            if (metric === 'sessions' || metric === 'visitors') color = 'white';
            if (metric === 'bounceRate') color = '#38bdf8';

            svg.innerHTML = `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`;
        }
    });

    const yAxisContainer = document.getElementById('main-chart-y-axis');

    // Initial draw (dynamically checking which button is active)
    const activeBtn = document.querySelector('.chart-period-btn.active');
    if (activeBtn) {
        drawMainChart(activeBtn.getAttribute('data-period'));
    } else {
        drawMainChart('weekly'); // Fallback
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
            initDashboardWithLiveAnalytics({ skipCache: true, onlyUpdateChart: false });
        });
    });

    // Initialize the interactive map if we're on the analytics page with valid data
    initWorldMap();


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
                'rgba(59, 130, 246, 0.10)',
                'rgba(59, 130, 246, 0.25)',
                'rgba(59, 130, 246, 0.40)',
                'rgba(59, 130, 246, 0.55)',
                'rgba(59, 130, 246, 0.70)',
                'rgba(59, 130, 246, 0.85)',
                'rgba(59, 130, 246, 1.00)'
            ];
            const neutralColor = 'rgba(30, 41, 59, 0.4)'; // Neutral dark color for 0 data

            let dynamicStyles = '';
            Object.keys(countryStats).forEach(code => {
                const sessions = countryStats[code].sessions;
                let shadeIndex = 0;
                if (maxSessions > 0 && sessions > 0) {
                    const ratio = sessions / maxSessions;
                    shadeIndex = buckets.findIndex(b => ratio <= b);
                    if (shadeIndex === -1) shadeIndex = 6;
                    dynamicStyles += `#jsvectormap-world path[data-code="${code}"] { fill: ${colors[shadeIndex]} !important; stroke: rgba(0,82,255,0.2) !important; }\n`;
                    dynamicStyles += `#jsvectormap-world path[data-code="${code}"]:hover { fill: #0052FF !important; stroke: rgba(0,82,255,0.8) !important; }\n`;
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

            // Update Legend Tooltips with ranges
            if (maxSessions > 0) {
                let prevThreshold = 0;
                buckets.forEach((bucketPct, idx) => {
                    const threshold = Math.ceil(bucketPct * maxSessions);
                    const legendBox = document.getElementById(`legend-color-${idx}`);
                    if (legendBox) {
                        legendBox.setAttribute('title', `${prevThreshold} - ${threshold} sessions`);
                    }
                    prevThreshold = threshold + 1;
                });
            }

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
                        stroke: '#1a2540',
                        strokeWidth: 0.5,
                    },
                    hover: {
                        fill: neutralColor, // if 0 data, stays neutral on hover
                        stroke: 'rgba(255, 255, 255, 0.1)',
                        strokeWidth: 1,
                        cursor: 'pointer',
                    }
                },
                onRegionTooltipShow: function (event, tooltip, code) {
                    const stats = countryStats[code] || { name: tooltip.text(), users: 0, sessions: 0 };
                    const countryName = stats.name || tooltip.text();

                    tooltip.css({ backgroundColor: 'rgba(0,0,0,0.92)', borderColor: 'rgba(0,82,255,0.5)' });

                    setTimeout(() => {
                        const tooltipHtml =
                            '<div style="font-weight:700;font-size:13px;margin-bottom:4px;">' + countryName + '</div>' +
                            '<div style="color:#94a3b8;font-size:10px;">Sessions: <span style="color:#fff">' + stats.sessions.toLocaleString() + '</span></div>' +
                            '<div style="color:#94a3b8;font-size:10px;margin-top:2px;">Users: <span style="color:#fff">' + stats.users.toLocaleString() + '</span></div>';
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

// New vs Returning Chart Update (specifically for dashboard_analytics.html)
const newVsReturningPct = document.getElementById('metric-new-vs-returning-pct');
if (newVsReturningPct && MOCK_DATA.currentMetrics) {
    newVsReturningPct.innerText = MOCK_DATA.currentMetrics.newUsersRatio;
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

        // Formatting
        if (['lcp', 'fcp', 'tti', 'speedIndex'].includes(key)) {
            el.innerText = val + 's';
        } else if (['inp', 'ttfb', 'tbt'].includes(key)) {
            el.innerText = val + 'ms';
        } else if (key === 'pageSize') {
            el.innerText = val;
        } else if (key === 'uptime') {
            el.innerText = val + '%';
        } else {
            el.innerText = val.toLocaleString();
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
}

function bindAnalyticsLists() {
    // Top Countries List
    const topCountriesList = document.getElementById('top-countries-list');
    if (topCountriesList && MOCK_DATA.geography) {
        let html = '';
        Object.keys(MOCK_DATA.geography).slice(0, 8).forEach(country => {
            const data = MOCK_DATA.geography[country];
            html += `<tr><td class="py-1.5 text-slate-300 flex items-center gap-2">${country}</td><td class="py-1.5 text-right font-mono text-white">${data.users.toLocaleString()}</td></tr>`;
        });
        topCountriesList.innerHTML = html || '<tr><td colspan="2" class="p-4 text-center text-slate-500 italic">No data available</td></tr>';
    }

    // Top Cities List
    const topCitiesList = document.getElementById('top-cities-list');
    if (topCitiesList && MOCK_DATA.cities) {
        let html = '';
        MOCK_DATA.cities.slice(0, 8).forEach(c => {
            html += `<tr><td class="py-1.5 text-slate-300">${c.city}</td><td class="py-1.5 text-right font-mono text-white">${Math.round(c.users).toLocaleString()}</td></tr>`;
        });
        topCitiesList.innerHTML = html || '<tr><td colspan="2" class="p-4 text-center text-slate-500 italic">No data available</td></tr>';
    }

    // Browsers List
    const browserList = document.getElementById('browser-list');
    if (browserList && MOCK_DATA.browsers) {
        let html = '';
        MOCK_DATA.browsers.forEach(b => {
            const val = Math.round(b.users || b.value || 0);
            html += `<div><div class="flex justify-between text-[10px] text-slate-300 mb-1"><span>${b.name}</span> <span class="font-mono text-white">${val}%</span></div><div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="h-full bg-blue-500 rounded-full" style="width: ${val}%"></div></div></div>`;
        });
        browserList.innerHTML = html;
    }

    // OS List
    const osList = document.getElementById('os-list');
    if (osList && MOCK_DATA.os) {
        let html = '';
        MOCK_DATA.os.forEach(o => {
            const val = Math.round(o.users || o.value || 0);
            html += `<div><div class="flex justify-between text-[10px] text-slate-300 mb-1"><span>${o.name}</span> <span class="font-mono text-white">${val}%</span></div><div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: ${val}%"></div></div></div>`;
        });
        osList.innerHTML = html;
    }

    // Channel Grouping
    const channelList = document.getElementById('channel-group-list');
    if (channelList && MOCK_DATA.channels) {
        let html = '';
        const colors = ['#0d33f2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
        MOCK_DATA.channels.slice(0, 5).forEach((c, idx) => {
            html += `<tr><td class="py-2 text-slate-300 flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full" style="background-color: ${colors[idx % colors.length]}"></div>${c.channelGroup}</td><td class="py-2 font-mono text-right text-white">${c.users.toLocaleString()}</td><td class="py-2 font-mono text-right text-white">${c.sessions.toLocaleString()}</td></tr>`;
        });
        channelList.innerHTML = html;
    }

    // Source / Medium
    const sourceList = document.getElementById('source-medium-list');
    if (sourceList && MOCK_DATA.trafficSources) {
        let html = '';
        MOCK_DATA.trafficSources.slice(0, 5).forEach(s => {
            html += `<tr><td class="py-2 text-slate-300">${s.sourceMedium}</td><td class="py-2 font-mono text-right text-white">${s.sessions.toLocaleString()}</td><td class="py-2 font-mono text-right text-white">${s.engagementRate}%</td></tr>`;
        });
        sourceList.innerHTML = html;
    }

    // Page Paths
    const pathList = document.getElementById('page-path-list');
    if (pathList && MOCK_DATA.topPages) {
        let html = '';
        MOCK_DATA.topPages.slice(0, 8).forEach(p => {
            html += `<tr><td class="py-2.5 text-slate-300 truncate max-w-[150px]" title="${p.path}">${p.path}</td><td class="py-2.5 font-mono text-right text-white">${p.views.toLocaleString()}</td></tr>`;
        });
        pathList.innerHTML = html;
    }

    // Landing Pages
    const landingList = document.getElementById('landing-page-list');
    if (landingList && MOCK_DATA.landingPages) {
        let html = '';
        MOCK_DATA.landingPages.slice(0, 8).forEach(l => {
            html += `<tr><td class="py-2.5 text-slate-300 truncate max-w-[150px]" title="${l.path}">${l.path}</td><td class="py-2.5 font-mono text-right text-white">${l.sessions.toLocaleString()}</td></tr>`;
        });
        landingList.innerHTML = html || '<tr><td colspan="2" class="p-4 text-center text-slate-500 italic">No data available</td></tr>';
    }

    // Referrers
    const referrerList = document.getElementById('referrer-list');
    if (referrerList && MOCK_DATA.referrers) {
        let html = '';
        MOCK_DATA.referrers.slice(0, 8).forEach(r => {
            html += `<tr><td class="py-2.5 text-slate-300 truncate max-w-[150px]" title="${r.name}">${r.name}</td><td class="py-2.5 font-mono text-right text-white">${r.value.toLocaleString()}</td></tr>`;
        });
        referrerList.innerHTML = html || '<tr><td colspan="2" class="p-4 text-center text-slate-500 italic">No data available</td></tr>';
    }
}

function drawMainChart(period) {
    const prevChartLine = document.querySelector('.main-chart-previous');
    const mainChartFill = document.querySelector('.main-chart-fill');
    const mainChartLineGlow = document.querySelector('.main-chart-line-glow');
    const mainChartLine = document.querySelector('.main-chart-line');
    const yAxisContainer = document.getElementById('main-chart-y-axis');

    if (!mainChartLine || !MOCK_DATA.timeseries.visitors[period]) return;

    const data = MOCK_DATA.timeseries.visitors[period];
    const prevKey = 'prev' + period.charAt(0).toUpperCase() + period.slice(1);
    const prevData = MOCK_DATA.timeseries.visitors[prevKey] || data;

    // 1. Dynamic Y-Axis Scaling (Landmark values)
    const allVals = [...data.map(d => d.value), ...prevData.map(d => d.value)];
    const maxVal = Math.max(...allVals, 10); // Minimum scale of 10

    let roundingFactor = 10;
    if (maxVal > 1000000) roundingFactor = 250000;
    else if (maxVal > 500000) roundingFactor = 100000;
    else if (maxVal > 100000) roundingFactor = 25000;
    else if (maxVal > 50000) roundingFactor = 10000;
    else if (maxVal > 10000) roundingFactor = 2500;
    else if (maxVal > 5000) roundingFactor = 1000;
    else if (maxVal > 1000) roundingFactor = 250;
    else if (maxVal > 100) roundingFactor = 50;
    else roundingFactor = 10;

    const yMax = Math.ceil(maxVal / roundingFactor) * roundingFactor;
    const step = yMax / 4;

    if (yAxisContainer) {
        const spans = yAxisContainer.querySelectorAll('span');
        if (spans.length === 5) {
            spans[0].innerText = formatNumber(yMax);
            spans[1].innerText = formatNumber(yMax * 0.75);
            spans[2].innerText = formatNumber(yMax * 0.5);
            spans[3].innerText = formatNumber(yMax * 0.25);
            spans[4].innerText = 0;
        }
    }

    // 2. X-Axis Labels (Interval & Alignment logic)
    const xAxisContainer = document.getElementById('main-chart-x-axis');
    if (xAxisContainer) {
        let labels = [];
        if (period === 'daily') {
            for (let i = 0; i < 24; i++) {
                if ((23 - i) % 3 === 0) labels.push(`<span>${data[i].label}</span>`);
                else labels.push('<span></span>');
            }
        } else if (period === 'weekly') {
            labels = data.map(d => `<span>${d.label}</span>`);
        } else if (period === 'monthly') {
            for (let i = 0; i < 30; i++) {
                if ((29 - i) % 5 === 0) labels.push(`<span>${data[i].label}</span>`);
                else labels.push('<span></span>');
            }
        }
        xAxisContainer.innerHTML = labels.join('');
    }

    // 3. Generate Paths using the new rangeMax parameter
    const pathData = generateLineChartPath(data, 1000, 300, 0, yMax);
    const prevPathData = generateLineChartPath(prevData, 1000, 300, 0, yMax);

    // Transition settings
    [mainChartLine, mainChartFill, mainChartLineGlow, prevChartLine].forEach(el => {
        if (el) el.style.transition = 'd 0.3s ease-in-out';
    });

    if (mainChartLine) mainChartLine.setAttribute('d', pathData);
    if (mainChartLineGlow) mainChartLineGlow.setAttribute('d', pathData);
    if (mainChartFill) mainChartFill.setAttribute('d', `${pathData} L1000,300 L0,300 Z`);
    if (prevChartLine) prevChartLine.setAttribute('d', prevPathData);

    // === CHART TOTAL: Sum the visible graph values ===
    const chartSum = data.reduce((sum, d) => sum + d.value, 0);
    const prevChartSum = prevData.reduce((sum, d) => sum + d.value, 0);

    // Update the chart header number
    document.querySelectorAll('[data-metric="chartTotal"]').forEach(el => {
        el.innerText = chartSum.toLocaleString();
    });

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
});
