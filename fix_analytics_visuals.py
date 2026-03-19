#!/usr/bin/env python3
"""
Fix Analytics Page Visuals:
1. Section headers → white text, slightly more spacing below
2. Screen Page Views → condense chart height, fit Scrolled Users inside, remove "3.2"
3. Donut/pie charts → premium thick-ring style matching reference image
4. Global Distribution → full interactive SVG world map with hover tooltips
"""

with open('dashboard_analytics.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ═══════════════════════════════════════════════════════════
# 1. FIX SECTION HEADERS → white text + a bit more margin-bottom
# ═══════════════════════════════════════════════════════════
# The CSS class .section-title currently has color: #fff already
# but let's make sure and add margin-bottom to .section-header
old_section_css = """.section-header {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 0.5rem;
            margin-top: 3rem;
        }
        .section-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: inline-block;
        }"""

new_section_css = """.section-header {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 1rem;
            margin-top: 3rem;
        }
        .section-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: inline-block;
            text-shadow: 0 0 10px rgba(255,255,255,0.15);
        }"""

html = html.replace(old_section_css, new_section_css)

# ═══════════════════════════════════════════════════════════
# 2. SCREEN PAGE VIEWS — reduce height so Scrolled Users fits inside
# ═══════════════════════════════════════════════════════════

# Change the container height from h-[296px] to h-auto (let it flex)
html = html.replace(
    'lg:col-span-8 glass-panel rounded-lg p-4 border border-white/10 flex flex-col relative h-[296px]',
    'lg:col-span-8 glass-panel rounded-lg p-4 border border-white/10 flex flex-col relative h-auto'
)

# Limit the chart area height
html = html.replace(
    '<div class="flex-1 w-full h-full relative pl-8 pb-4 pr-4">\n<div class="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[9px] text-slate-500 font-mono text-right pr-2">\n<span>50k</span>',
    '<div class="w-full relative pl-8 pb-4 pr-4" style="height:160px">\n<div class="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[9px] text-slate-500 font-mono text-right pr-2">\n<span>50k</span>'
)

# Remove the "3.2" span inside "Views per User"
html = html.replace(
    'Views per User <span class="text-[12px] font-mono text-white">3.2</span>',
    'Views per User'
)

# Make the bottom section spacing tighter
html = html.replace(
    '<div class="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">',
    '<div class="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">'
)


# ═══════════════════════════════════════════════════════════
# 3. DONUT/PIE CHARTS — premium thick-ring with gap/glow like ref image
# ═══════════════════════════════════════════════════════════

# Add new CSS for premium donut style
donut_css = """
        /* Premium donut chart style */
        .premium-donut {
            filter: drop-shadow(0 0 12px rgba(0, 82, 255, 0.4));
        }
        .premium-donut .donut-track {
            fill: none;
            stroke: rgba(255,255,255,0.06);
        }
        .premium-donut .donut-value {
            fill: transparent;
            stroke-linecap: round;
            transition: stroke-dashoffset 1s ease;
        }
        .premium-donut .donut-secondary {
            fill: transparent;
            stroke-linecap: round;
        }
"""
html = html.replace('.donut-segment {', donut_css + '        .donut-segment {')

# --- "New vs Returning" donut (68% / 32%) ---
old_new_returning_donut = """<div class="relative w-40 h-40 mt-4">
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<circle class="stroke-white/5" cx="18" cy="18" fill="none" r="14" stroke-width="8"></circle>
<circle class="donut-segment stroke-[#0d33f2] drop-shadow-[0_0_4px_#0d33f2]" cx="18" cy="18" r="14" stroke-dasharray="68.4 100" stroke-dashoffset="0"></circle>
<circle class="donut-segment stroke-indigo-300" cx="18" cy="18" r="14" stroke-dasharray="31.6 100" stroke-dashoffset="-68.4"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-bold text-white">68<span class="text-sm">%</span></span>
<span class="text-[8px] text-slate-400 uppercase">New</span>
</div>
</div>"""

new_new_returning_donut = """<div class="relative w-44 h-44 mt-4 premium-donut">
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
<circle class="donut-track" cx="21" cy="21" r="16" stroke-width="5"></circle>
<circle class="donut-value" cx="21" cy="21" r="16" stroke-width="5" stroke="#0052FF" stroke-dasharray="68.4 100" stroke-dashoffset="0" style="filter: drop-shadow(0 0 6px rgba(0,82,255,0.8))"></circle>
<circle class="donut-secondary" cx="21" cy="21" r="16" stroke-width="5" stroke="rgba(255,255,255,0.25)" stroke-dasharray="30 100" stroke-dashoffset="-70"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-3xl font-bold text-white" style="text-shadow: 0 0 15px rgba(255,255,255,0.3);">68<span class="text-lg">%</span></span>
<span class="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">New</span>
</div>
</div>"""

html = html.replace(old_new_returning_donut, new_new_returning_donut)

# --- "Device" donut (60% Mobile / 30% Desktop / 10% Tablet) ---
old_device_donut = """<div class="relative w-32 h-32 mt-4">
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<circle class="stroke-white/5" cx="18" cy="18" fill="none" r="14" stroke-width="8"></circle>
<circle class="donut-segment stroke-[#0d33f2] drop-shadow-[0_0_4px_#0d33f2]" cx="18" cy="18" r="14" stroke-dasharray="60 100" stroke-dashoffset="0"></circle>
<circle class="donut-segment stroke-blue-400" cx="18" cy="18" r="14" stroke-dasharray="30 100" stroke-dashoffset="-60"></circle>
<circle class="donut-segment stroke-indigo-300" cx="18" cy="18" r="14" stroke-dasharray="10 100" stroke-dashoffset="-90"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-xl font-bold text-white">60<span class="text-xs">%</span></span>
<span class="text-[8px] text-slate-400 uppercase">Mobile</span>
</div>
</div>"""

new_device_donut = """<div class="relative w-36 h-36 mt-4 premium-donut">
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
<circle class="donut-track" cx="21" cy="21" r="16" stroke-width="5"></circle>
<circle class="donut-value" cx="21" cy="21" r="16" stroke-width="5" stroke="#0052FF" stroke-dasharray="60 100" stroke-dashoffset="0" style="filter: drop-shadow(0 0 6px rgba(0,82,255,0.8))"></circle>
<circle class="donut-secondary" cx="21" cy="21" r="16" stroke-width="5" stroke="rgba(96,165,250,0.7)" stroke-dasharray="28 100" stroke-dashoffset="-62"></circle>
<circle class="donut-secondary" cx="21" cy="21" r="16" stroke-width="5" stroke="rgba(255,255,255,0.2)" stroke-dasharray="8 100" stroke-dashoffset="-92"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-bold text-white" style="text-shadow: 0 0 15px rgba(255,255,255,0.3);">60<span class="text-sm">%</span></span>
<span class="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Mobile</span>
</div>
</div>"""

html = html.replace(old_device_donut, new_device_donut)

# --- "Platform" donut (75% Web / 25% App) ---
old_platform_donut = """<div class="relative w-32 h-32 mt-4">
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<circle class="stroke-white/5" cx="18" cy="18" fill="none" r="14" stroke-width="8"></circle>
<circle class="donut-segment stroke-[#0d33f2] drop-shadow-[0_0_4px_#0d33f2]" cx="18" cy="18" r="14" stroke-dasharray="75 100" stroke-dashoffset="0"></circle>
<circle class="donut-segment stroke-blue-400" cx="18" cy="18" r="14" stroke-dasharray="25 100" stroke-dashoffset="-75"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-xl font-bold text-white">75<span class="text-xs">%</span></span>
<span class="text-[8px] text-slate-400 uppercase">Web</span>
</div>
</div>"""

new_platform_donut = """<div class="relative w-36 h-36 mt-4 premium-donut">
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
<circle class="donut-track" cx="21" cy="21" r="16" stroke-width="5"></circle>
<circle class="donut-value" cx="21" cy="21" r="16" stroke-width="5" stroke="#0052FF" stroke-dasharray="75 100" stroke-dashoffset="0" style="filter: drop-shadow(0 0 6px rgba(0,82,255,0.8))"></circle>
<circle class="donut-secondary" cx="21" cy="21" r="16" stroke-width="5" stroke="rgba(96,165,250,0.7)" stroke-dasharray="23 100" stroke-dashoffset="-77"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-bold text-white" style="text-shadow: 0 0 15px rgba(255,255,255,0.3);">75<span class="text-sm">%</span></span>
<span class="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Web</span>
</div>
</div>"""

html = html.replace(old_platform_donut, new_platform_donut)


# ═══════════════════════════════════════════════════════════
# 4. GLOBAL DISTRIBUTION → full interactive SVG world map
# ═══════════════════════════════════════════════════════════

old_map_section = """<div class="lg:col-span-7 glass-panel rounded-lg p-0 border border-white/10 relative h-[400px] overflow-hidden">
<div class="neon-border-top"></div>
<div class="absolute top-4 left-4 z-20">
<h3 class="text-[13px] font-bold text-white uppercase tracking-wider mb-1">Global Distribution</h3>
</div>
<div class="w-full h-full relative bg-[#010102] flex items-center justify-center">
<svg class="w-[120%] h-[120%] opacity-40 absolute top-[-10%] left-[-10%]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 400">
<path d="M100,100 C150,50 250,50 300,150 C250,250 150,200 100,100" fill="#1e293b" stroke="#334155" stroke-width="0.5"></path>
<path d="M350,100 C400,50 500,50 550,120 C500,200 400,200 350,100" fill="#1e293b" stroke="#334155" stroke-width="0.5"></path>
<path d="M600,80 C700,50 850,80 900,150 C850,250 700,200 600,80" fill="#1e293b" stroke="#334155" stroke-width="0.5"></path>
<path d="M150,250 C200,200 280,200 300,350 C250,400 150,350 150,250" fill="#1e293b" stroke="#334155" stroke-width="0.5"></path>
</svg>
<div class="absolute top-[30%] left-[25%] w-3 h-3 bg-[#0d33f2] rounded-full shadow-[0_0_15px_#0d33f2] animate-pulse"></div>
<div class="absolute top-[35%] left-[48%] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-pulse" style="animation-delay: 0.5s;"></div>
<div class="absolute top-[28%] left-[72%] w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff] animate-pulse" style="animation-delay: 1.2s;"></div>
</div>
</div>"""

new_map_section = """<div class="lg:col-span-7 glass-panel rounded-lg p-0 border border-white/10 relative h-[400px] overflow-hidden">
<div class="neon-border-top"></div>
<div class="absolute top-4 left-4 z-20">
<h3 class="text-[13px] font-bold text-white uppercase tracking-wider mb-1">Global Distribution</h3>
</div>
<div class="w-full h-full relative bg-[#010102]" id="world-map-container">
<!-- Tooltip -->
<div id="map-tooltip" style="display:none; position:absolute; z-index:50; pointer-events:none; background:rgba(0,0,0,0.92); border:1px solid rgba(0,82,255,0.5); border-radius:8px; padding:10px 14px; color:white; font-size:11px; box-shadow:0 0 20px rgba(0,82,255,0.3); min-width:140px; backdrop-filter:blur(12px);">
<div id="map-tooltip-name" style="font-weight:700; font-size:13px; margin-bottom:4px;"></div>
<div id="map-tooltip-users" style="color:#94a3b8; font-size:10px;"></div>
<div id="map-tooltip-sessions" style="color:#94a3b8; font-size:10px; margin-top:2px;"></div>
</div>
<!-- Interactive SVG World Map -->
<svg id="world-map-svg" viewBox="0 0 1010 666" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; padding: 20px 10px;">
</svg>
</div>
<script>
(function(){
// Country data with users & sessions
const countryData = {
  US: { name: "United States", users: 38201, sessions: 52100 },
  CA: { name: "Canada", users: 8100, sessions: 11400 },
  MX: { name: "Mexico", users: 2400, sessions: 3200 },
  BR: { name: "Brazil", users: 4500, sessions: 6100 },
  AR: { name: "Argentina", users: 1200, sessions: 1800 },
  GB: { name: "United Kingdom", users: 15400, sessions: 21300 },
  FR: { name: "France", users: 5800, sessions: 8100 },
  DE: { name: "Germany", users: 10200, sessions: 14500 },
  ES: { name: "Spain", users: 3100, sessions: 4200 },
  IT: { name: "Italy", users: 2900, sessions: 3800 },
  SE: { name: "Sweden", users: 1800, sessions: 2400 },
  NO: { name: "Norway", users: 1200, sessions: 1600 },
  PL: { name: "Poland", users: 2100, sessions: 2800 },
  RU: { name: "Russia", users: 3200, sessions: 4500 },
  CN: { name: "China", users: 6100, sessions: 8400 },
  JP: { name: "Japan", users: 4200, sessions: 5800 },
  KR: { name: "South Korea", users: 2800, sessions: 3900 },
  IN: { name: "India", users: 7400, sessions: 10200 },
  AU: { name: "Australia", users: 5600, sessions: 7800 },
  ZA: { name: "South Africa", users: 1500, sessions: 2100 },
  EG: { name: "Egypt", users: 900, sessions: 1200 },
  NG: { name: "Nigeria", users: 1100, sessions: 1500 },
  SA: { name: "Saudi Arabia", users: 1800, sessions: 2500 },
  AE: { name: "UAE", users: 2200, sessions: 3100 },
  TR: { name: "Turkey", users: 1600, sessions: 2200 },
  ID: { name: "Indonesia", users: 1900, sessions: 2600 },
  TH: { name: "Thailand", users: 1100, sessions: 1500 },
  CL: { name: "Chile", users: 800, sessions: 1100 },
  CO: { name: "Colombia", users: 1300, sessions: 1700 },
  PE: { name: "Peru", users: 600, sessions: 900 },
  NZ: { name: "New Zealand", users: 1200, sessions: 1700 },
  UA: { name: "Ukraine", users: 1400, sessions: 1900 },
  NL: { name: "Netherlands", users: 2600, sessions: 3500 },
  BE: { name: "Belgium", users: 1100, sessions: 1500 },
  CH: { name: "Switzerland", users: 1900, sessions: 2600 },
  AT: { name: "Austria", users: 1300, sessions: 1800 },
  PT: { name: "Portugal", users: 1000, sessions: 1400 },
  IE: { name: "Ireland", users: 1500, sessions: 2100 },
  FI: { name: "Finland", users: 900, sessions: 1200 },
  DK: { name: "Denmark", users: 1100, sessions: 1500 },
};

// Simplified world map paths (country code → SVG path)
const mapPaths = {
  US: "M55,175 L130,175 L135,185 L140,175 L175,170 L190,185 L225,180 L230,195 L210,210 L190,210 L145,220 L110,215 L80,210 L60,200 Z",
  CA: "M55,90 L80,80 L125,75 L180,80 L230,90 L250,110 L240,140 L225,155 L195,165 L160,165 L125,170 L90,170 L55,160 L45,140 L40,115 Z",
  MX: "M80,215 L120,220 L145,225 L155,240 L150,260 L135,275 L115,270 L95,255 L80,240 Z",
  BR: "M200,295 L235,280 L270,275 L290,290 L295,320 L285,360 L270,390 L245,400 L220,395 L200,375 L190,345 L195,315 Z",
  AR: "M210,400 L235,405 L250,420 L255,455 L250,490 L240,510 L225,515 L215,500 L205,465 L200,430 Z",
  CL: "M195,405 L210,400 L205,465 L200,500 L195,510 L190,500 L185,460 L190,425 Z",
  CO: "M165,270 L190,265 L200,280 L195,300 L180,310 L165,300 L160,285 Z",
  PE: "M160,310 L180,315 L190,340 L185,365 L170,375 L155,360 L150,335 Z",
  GB: "M420,120 L430,115 L440,120 L440,145 L430,155 L420,148 L418,135 Z",
  FR: "M430,160 L455,155 L470,165 L470,190 L455,195 L435,190 L425,175 Z",
  DE: "M465,130 L490,125 L500,140 L498,165 L480,170 L465,160 L460,145 Z",
  ES: "M415,195 L445,190 L455,200 L450,215 L430,220 L410,215 L408,205 Z",
  IT: "M470,175 L485,170 L495,190 L490,215 L480,230 L470,225 L465,205 L468,190 Z",
  SE: "M480,65 L495,60 L505,75 L505,115 L498,125 L485,120 L478,100 L475,80 Z",
  NO: "M460,55 L475,50 L485,65 L480,100 L470,115 L460,108 L455,85 L458,70 Z",
  PL: "M500,130 L525,125 L535,140 L530,158 L515,162 L500,155 L497,142 Z",
  NL: "M445,135 L460,130 L465,140 L460,150 L448,152 L443,145 Z",
  BE: "M440,150 L455,148 L460,155 L455,163 L442,165 L438,158 Z",
  CH: "M455,170 L470,168 L475,178 L470,186 L458,188 L452,180 Z",
  AT: "M475,160 L498,157 L505,168 L500,178 L482,180 L475,172 Z",
  PT: "M400,195 L415,192 L418,210 L412,222 L400,218 L397,205 Z",
  IE: "M405,120 L418,118 L422,130 L418,142 L408,145 L402,135 Z",
  FI: "M505,50 L520,45 L530,58 L528,90 L520,105 L508,100 L502,75 L503,60 Z",
  DK: "M460,115 L475,112 L478,122 L472,132 L462,130 L458,122 Z",
  UA: "M530,135 L560,130 L575,142 L570,160 L550,165 L535,158 L528,148 Z",
  RU: "M560,50 L700,30 L820,45 L860,80 L850,125 L800,150 L720,155 L650,148 L590,140 L560,120 L550,85 Z",
  TR: "M555,175 L590,170 L610,180 L605,195 L580,200 L560,195 L550,185 Z",
  SA: "M580,225 L610,215 L625,230 L620,260 L600,270 L585,260 L575,245 Z",
  AE: "M625,245 L645,240 L650,252 L640,260 L628,258 Z",
  EG: "M530,220 L555,215 L560,235 L555,260 L540,265 L525,255 L522,235 Z",
  NG: "M470,290 L495,285 L505,300 L500,320 L485,325 L470,315 L465,300 Z",
  ZA: "M510,400 L540,390 L555,405 L550,435 L535,445 L515,440 L505,420 Z",
  IN: "M640,210 L670,195 L695,210 L700,250 L690,285 L670,295 L650,280 L640,250 Z",
  CN: "M700,120 L770,110 L810,130 L820,170 L800,205 L760,215 L720,210 L700,190 L690,160 Z",
  JP: "M830,155 L845,145 L855,160 L850,185 L840,195 L828,188 L825,170 Z",
  KR: "M810,175 L825,170 L830,185 L825,200 L815,202 L808,192 Z",
  ID: "M740,320 L780,310 L820,315 L840,325 L830,340 L790,345 L750,340 L735,330 Z",
  TH: "M730,260 L745,255 L755,270 L750,295 L740,305 L728,295 L725,275 Z",
  AU: "M780,380 L840,365 L890,375 L910,405 L905,445 L880,465 L840,470 L800,460 L775,435 L770,405 Z",
  NZ: "M920,460 L935,455 L945,468 L940,485 L930,490 L918,480 Z",
};

const maxUsers = Math.max(...Object.values(countryData).map(c => c.users));

const svg = document.getElementById('world-map-svg');
const tooltip = document.getElementById('map-tooltip');
const tooltipName = document.getElementById('map-tooltip-name');
const tooltipUsers = document.getElementById('map-tooltip-users');
const tooltipSessions = document.getElementById('map-tooltip-sessions');
const container = document.getElementById('world-map-container');

// Draw countries
Object.entries(mapPaths).forEach(([code, d]) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('data-code', code);

  const data = countryData[code];
  if (data) {
    const intensity = Math.max(0.12, (data.users / maxUsers));
    const r = Math.round(0 + intensity * 0);
    const g = Math.round(20 + intensity * 62);
    const b = Math.round(60 + intensity * 195);
    path.setAttribute('fill', `rgba(${r}, ${g}, ${b}, ${Math.min(intensity + 0.15, 1)})`);
    path.setAttribute('stroke', `rgba(0, 82, 255, ${Math.min(intensity * 0.8 + 0.15, 0.7)})`);
  } else {
    path.setAttribute('fill', 'rgba(30, 41, 59, 0.4)');
    path.setAttribute('stroke', 'rgba(51, 65, 85, 0.3)');
  }
  path.setAttribute('stroke-width', '1');
  path.style.cursor = data ? 'pointer' : 'default';
  path.style.transition = 'all 0.2s ease';

  path.addEventListener('mouseenter', function(e) {
    if (!data) return;
    path.style.filter = 'drop-shadow(0 0 8px rgba(0,82,255,0.6)) brightness(1.3)';
    path.style.strokeWidth = '2';
    tooltipName.textContent = data.name;
    tooltipUsers.textContent = 'Users: ' + data.users.toLocaleString();
    tooltipSessions.textContent = 'Sessions: ' + data.sessions.toLocaleString();
    tooltip.style.display = 'block';
  });

  path.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top - 10;
    if (x + 160 > rect.width) x = e.clientX - rect.left - 170;
    if (y + 80 > rect.height) y = e.clientY - rect.top - 80;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  });

  path.addEventListener('mouseleave', function() {
    path.style.filter = '';
    path.style.strokeWidth = '1';
    tooltip.style.display = 'none';
  });

  svg.appendChild(path);
});
})();
</script>
</div>"""

html = html.replace(old_map_section, new_map_section)

with open('dashboard_analytics.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("All 4 fixes applied successfully!")
