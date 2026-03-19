import re

with open("dashboard_performance.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update Core Web Vitals to remove glass-panel and match SVG arc style.
vitals_regex = r"<!-- Core Web Vitals.*?-->.*?<!-- Secondary Metrics -->"
new_vitals = """<!-- Core Web Vitals (LCP, FID, CLS) -->
    <div class="mb-10 px-2 lg:px-8 mt-4">
        <div class="flex justify-between items-center mb-8 relative z-10">
            <div>
                <h3 class="text-2xl font-bold text-white mb-1 tracking-wide text-left">Core Web Vitals</h3>
                <p class="text-slate-400 text-sm text-left">Real-time assessment of page performance across devices.</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="bg-emerald-900/40 border border-emerald-500/30 px-3 py-1.5 rounded flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                    <span class="text-emerald-400 text-sm font-bold tracking-wider">HEALTHY</span>
                </div>
                <button class="px-4 py-2 text-sm font-bold rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">refresh</span> Recalculate
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 px-4">
            <!-- LCP -->
            <div class="flex flex-col items-center group">
                <div class="relative w-64 h-32 overflow-hidden mb-6">
                    <svg class="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet">
                        <!-- Dark background arc -->
                        <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" class="stroke-slate-800/50" stroke-width="12" stroke-linecap="round"></path>
                        <!-- Glowing progress arc -->
                        <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" class="stroke-electric-blue drop-shadow-[0_0_15px_rgba(0,82,255,0.8)]" stroke-width="12" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="60" style="transition: stroke-dashoffset 1.5s ease-out;"></path>
                    </svg>
                    <!-- Centered Value -->
                    <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-baseline gap-1">
                        <span class="text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">0.8</span>
                        <span class="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">s</span>
                    </div>
                </div>
                <div class="text-center w-full">
                    <h4 class="text-white font-bold text-xl tracking-wider mb-2">LCP</h4>
                    <p class="text-[10px] text-slate-400 uppercase tracking-widest mb-4">LARGEST CONTENTFUL PAINT</p>
                    <span class="inline-block px-4 py-1.5 bg-[#0a1930] text-blue-400 text-xs font-semibold rounded border border-electric-blue/30">Good (&lt; 2.5s)</span>
                </div>
            </div>
            
            <!-- FID / INP -->
            <div class="flex flex-col items-center group">
                <div class="relative w-64 h-32 overflow-hidden mb-6">
                    <svg class="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet">
                        <!-- Dark background arc -->
                        <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" class="stroke-slate-800/50" stroke-width="12" stroke-linecap="round"></path>
                        <!-- Glowing progress arc -->
                        <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" class="stroke-electric-blue drop-shadow-[0_0_15px_rgba(0,82,255,0.8)]" stroke-width="12" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="190" style="transition: stroke-dashoffset 1.5s ease-out;"></path>
                    </svg>
                    <!-- Centered Value -->
                    <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-baseline gap-1">
                        <span class="text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">12</span>
                        <span class="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">ms</span>
                    </div>
                </div>
                <div class="text-center w-full">
                    <h4 class="text-white font-bold text-xl tracking-wider mb-2">FID</h4>
                    <p class="text-[10px] text-slate-400 uppercase tracking-widest mb-4">FIRST INPUT DELAY</p>
                    <span class="inline-block px-4 py-1.5 bg-[#0a1930] text-blue-400 text-xs font-semibold rounded border border-electric-blue/30">Good (&lt; 100ms)</span>
                </div>
            </div>

            <!-- CLS -->
            <div class="flex flex-col items-center group">
                <div class="relative w-64 h-32 overflow-hidden mb-6">
                    <svg class="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet">
                        <!-- Dark background arc -->
                        <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" class="stroke-slate-800/50" stroke-width="12" stroke-linecap="round"></path>
                        <!-- Glowing progress arc -->
                        <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" class="stroke-electric-blue drop-shadow-[0_0_15px_rgba(0,82,255,0.8)]" stroke-width="12" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="260" style="transition: stroke-dashoffset 1.5s ease-out;"></path>
                    </svg>
                    <!-- Centered Value -->
                    <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-baseline gap-1">
                        <span class="text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">0.01</span>
                    </div>
                </div>
                <div class="text-center w-full">
                    <h4 class="text-white font-bold text-xl tracking-wider mb-2">CLS</h4>
                    <p class="text-[10px] text-slate-400 uppercase tracking-widest mb-4">CUMULATIVE LAYOUT SHIFT</p>
                    <span class="inline-block px-4 py-1.5 bg-[#0a1930] text-blue-400 text-xs font-semibold rounded border border-electric-blue/30">Good (&lt; 0.1)</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Secondary Metrics -->"""


# 2. Update Diagnostic Metrics to be shorter, plain glass-card, white text, no SVG bg.
diagnostics_regex = r"<!-- Secondary Metrics -->.*?</div>\s*<!-- Server & Uptime -->"
def make_card_clean(name, value, unit, tt_title, tt_desc):
    unit_html = f'<span class="text-sm font-bold text-slate-400 pb-1">{unit}</span>' if unit else ''
    return f"""
            <!-- {name} -->
            <div class="glass-card rounded-xl p-5 border border-white/5 flex flex-col justify-between h-24 relative transition-colors hover:border-white/10 hover:bg-white/5">
                <div class="flex items-center gap-2 relative z-20 hover:z-[100]">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{name}</span>
                    <div class="cursor-help relative group">
                        <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0a0f18] border border-electric-blue/50 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,1)] z-[9999] p-3 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 text-left">
                            <p class="text-[11px] text-white font-bold mb-1 border-b border-white/10 pb-1.5">{tt_title}</p>
                            <p class="text-[9px] text-slate-400 leading-relaxed mt-1.5">{tt_desc}</p>
                            <!-- triangle pointer -->
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-electric-blue/50"></div>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0a0f18] -mt-[1px]"></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-end gap-1 relative z-10">
                    <span class="text-2xl font-bold text-white tracking-tight">{value}</span>
                    {unit_html}
                </div>
            </div>"""

cards_html = ""
cards_html += make_card_clean("TTFB", "120", "ms", "Time to First Byte", "Measures the time between the request and when the first byte of response arrives.")
cards_html += make_card_clean("FCP", "0.8", "s", "First Contentful Paint", "Time when the first text or image is painted on the user's screen.")
cards_html += make_card_clean("TTI", "2.4", "s", "Time to Interactive", "How long it takes the page to become fully interactive.")
cards_html += make_card_clean("TBT", "150", "ms", "Total Blocking Time", "Sum of all periods blocking user input between FCP and TTI.")
cards_html += make_card_clean("Speed Index", "1.2", "s", "Speed Index", "How quickly the contents of a page are visibly populated.")
cards_html += make_card_clean("Page Size", "2.4", "MB", "Total Page Size", "Total bytes transferred across network for this document.")
cards_html += make_card_clean("Requests", "45", "", "Network Requests", "Total number of HTTP requests required to fully load the page.")
cards_html += make_card_clean("DOM Size", "842", "", "DOM Elements", "Total number of distinct HTML nodes rendered natively.")

new_diagnostics = f"""<!-- Secondary Metrics -->
    <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative mt-4 px-2 lg:px-8">
        <h3 class="text-base font-bold text-white mb-6 relative z-10 border-b border-white/5 pb-4">Diagnostic Metrics</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
{cards_html}
        </div>
    </div>

    <!-- Server & Uptime -->"""

# 3. Completely replace the "Server & Uptime" section with the new dark full-width graph
uptime_regex = r"<!-- Server & Uptime -->.*?</main>"
new_uptime = """<!-- Server & Uptime -->
    <div class="glass-panel rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative mt-8 overflow-hidden bg-[#050914]">
        
        <!-- Header -->
        <div class="flex justify-between items-start p-6 pb-0 relative z-10">
            <div>
                <h3 class="text-2xl font-bold text-white mb-2 tracking-wide">Uptime History</h3>
                <p class="text-slate-400 text-sm">Last 30 Days <span class="mx-2">•</span> <span class="text-emerald-400 font-bold tracking-wide text-base">99.98% Uptime</span></p>
            </div>
            <div class="flex items-center gap-2">
                <button class="w-10 h-10 rounded bg-[#111827] hover:bg-[#1f2937] border border-white/5 text-slate-400 transition-all flex items-center justify-center">
                    <span class="material-symbols-outlined text-lg">refresh</span>
                </button>
                <button class="w-10 h-10 rounded bg-[#111827] hover:bg-[#1f2937] border border-white/5 text-slate-400 transition-all flex items-center justify-center">
                    <span class="material-symbols-outlined text-lg">download</span>
                </button>
            </div>
        </div>

        <!-- The Dark Gradient Graph Area -->
        <div class="relative w-full h-[300px] mt-8 group">
            
            <!-- Deep blue bottom gradient -->
            <div class="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#0d2a5a] via-[#04102b]/60 to-transparent pointer-events-none"></div>

            <!-- The SVG Line -->
            <svg class="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <!-- Drop shadow line -->
                <path d="M 0,220 L 50,220 L 80,210 L 120,220 L 200,220 L 210,210 L 230,220 L 320,220 L 340,230 L 360,220 L 450,220 L 480,215 L 510,220 L 560,220 L 580,225 L 610,220 L 620,290 L 640,220 L 730,220 L 750,215 L 780,220 L 1000,220" fill="none" class="stroke-black/50" stroke-width="6" vector-effect="non-scaling-stroke"></path>
                
                <!-- Main electric blue line -->
                <path d="M 0,220 L 50,220 L 80,210 L 120,220 L 200,220 L 210,210 L 230,220 L 320,220 L 340,230 L 360,220 L 450,220 L 480,215 L 510,220 L 560,220 L 580,225 L 610,220 L 620,290 L 640,220 L 730,220 L 750,215 L 780,220 L 1000,220" fill="none" class="stroke-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.6)]" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>
            </svg>

            <!-- Graph Bottom Fill specifically under the line -->
            <svg class="absolute bottom-0 left-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <path d="M 0,300 L 0,220 L 50,220 L 80,210 L 120,220 L 200,220 L 210,210 L 230,220 L 320,220 L 340,230 L 360,220 L 450,220 L 480,215 L 510,220 L 560,220 L 580,225 L 610,220 L 620,290 L 640,220 L 730,220 L 750,215 L 780,220 L 1000,220 L 1000,300 Z" fill="url(#blue-gradient)"></path>
                <defs>
                    <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#0052FF" stop-opacity="1" />
                        <stop offset="100%" stop-color="#0052FF" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <!-- The Red Outage Point and Marker -->
            <!-- Positioned statically at 62% width (620 x-coord approximation) -->
            <div class="absolute left-[62%] bottom-[10px] -translate-x-1/2 flex flex-col items-center">
                <!-- Red vertical line tracing up to the tooltip -->
                <div class="w-[1px] h-24 bg-red-600/60 mb-8 z-10"></div>
                <!-- Red Outage Circle indicator -->
                <div class="absolute bottom-0 w-2.5 h-4 border-2 border-red-500 rounded-full drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] bg-[#050914] z-20"></div>
            </div>

            <!-- Floating Red Outage Tooltip Label -->
            <div class="absolute left-[62%] bottom-[50px] -translate-x-1/2 z-30">
                <div class="bg-[#050914] border border-red-600 rounded drop-shadow-[0_0_12px_rgba(239,68,68,0.2)] px-3 py-1.5 flex items-center gap-1.5 shadow-2xl">
                    <span class="text-xs font-semibold text-slate-300">5m Outage <span class="text-slate-500 text-[10px] mx-0.5">•</span> Oct 12</span>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- Extra padding at the bottom of main -->
<div class="h-12 w-full"></div>

</main>"""

html = re.sub(vitals_regex, new_vitals, html, flags=re.DOTALL)
html = re.sub(diagnostics_regex, new_diagnostics, html, flags=re.DOTALL)
html = re.sub(uptime_regex, new_uptime, html, flags=re.DOTALL)

with open("dashboard_performance.html", "w", encoding="utf-8") as f:
    f.write(html)
