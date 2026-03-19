import re

with open("dashboard_performance.html", "r") as f:
    html = f.read()

# 1. Strip out the "All Systems Operational" Hero block entirely
hero_regex = r"<!-- Current Status Hero -->.*?</div>\s*<!-- Core Web Vitals \(LCP, INP, CLS\) -->"
html = re.sub(hero_regex, "<!-- Core Web Vitals (LCP, INP, CLS) -->", html, flags=re.DOTALL)

# 2. Rebuild the 3 Core Vitals to use legacy semi-circle SVGs.
vitals_regex = r"<!-- Core Web Vitals \(LCP, INP, CLS\) -->.*?</div>\s*<!-- Secondary Metrics -->"
new_vitals = """<!-- Core Web Vitals (LCP, FID, CLS) -->
    <div class="glass-panel text-center rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative mt-4">
        <div class="neon-border-top"></div>
        <div class="flex justify-between items-center mb-8 relative z-10 px-4">
            <div>
                <h3 class="text-xl font-bold text-white mb-1 tracking-wide text-left">Core Web Vitals</h3>
                <p class="text-slate-400 text-xs text-left">Real-time assessment of page performance across devices.</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="bg-emerald-900/30 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                    <span class="text-emerald-400 text-xs font-bold tracking-wide">HEALTHY</span>
                </div>
                <button class="px-3 py-1.5 text-xs font-medium rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">refresh</span> Recalculate
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4 pb-4">
            <!-- LCP -->
            <div class="flex flex-col items-center group">
                <div class="relative w-48 h-24 overflow-hidden mb-4">
                    <svg class="w-full h-full" viewBox="0 0 200 100">
                        <path class="gauge-bg" d="M 20,100 A 80,80 0 0,1 180,100"></path>
                        <path class="gauge-progress" d="M 20,100 A 80,80 0 0,1 180,100" stroke-dasharray="251" stroke-dashoffset="30"></path>
                    </svg>
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span class="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,82,255,0.6)]">2.1s</span>
                    </div>
                </div>
                <div class="text-center w-full">
                    <div class="flex items-center justify-center gap-2 mb-1">
                        <h4 class="text-white font-bold text-lg group-hover:text-electric-blue transition-colors">LCP</h4>
                    </div>
                    <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-3">Largest Contentful Paint</p>
                    <span class="inline-block px-3 py-1 bg-electric-blue/20 text-blue-300 text-[10px] font-bold rounded border border-electric-blue/30 shadow-[0_0_10px_rgba(0,82,255,0.2)]">Good (&lt; 2.5s)</span>
                </div>
            </div>
            
            <!-- INP -->
            <div class="flex flex-col items-center group">
                <div class="relative w-48 h-24 overflow-hidden mb-4">
                    <svg class="w-full h-full" viewBox="0 0 200 100">
                        <path class="gauge-bg" d="M 20,100 A 80,80 0 0,1 180,100"></path>
                        <!-- ~20% complete on arc (INP scale: good <200, poor >500) -->
                        <path class="gauge-progress" d="M 20,100 A 80,80 0 0,1 180,100" stroke-dasharray="251" stroke-dashoffset="180"></path>
                    </svg>
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span class="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,82,255,0.6)]">180ms</span>
                    </div>
                </div>
                <div class="text-center w-full">
                    <div class="flex items-center justify-center gap-2 mb-1">
                        <h4 class="text-white font-bold text-lg group-hover:text-electric-blue transition-colors">INP</h4>
                    </div>
                    <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-3">Interaction to Next Paint</p>
                    <span class="inline-block px-3 py-1 bg-slate-500/20 text-slate-300 text-[10px] font-bold rounded border border-slate-500/30">Needs Improvement</span>
                </div>
            </div>

            <!-- CLS -->
            <div class="flex flex-col items-center group">
                <div class="relative w-48 h-24 overflow-hidden mb-4">
                    <svg class="w-full h-full" viewBox="0 0 200 100">
                        <path class="gauge-bg" d="M 20,100 A 80,80 0 0,1 180,100"></path>
                        <path class="gauge-progress" d="M 20,100 A 80,80 0 0,1 180,100" stroke-dasharray="251" stroke-dashoffset="230"></path>
                    </svg>
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span class="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,82,255,0.6)]">0.05</span>
                    </div>
                </div>
                <div class="text-center w-full">
                    <div class="flex items-center justify-center gap-2 mb-1">
                        <h4 class="text-white font-bold text-lg group-hover:text-electric-blue transition-colors">CLS</h4>
                    </div>
                    <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-3">Cumulative Layout Shift</p>
                    <span class="inline-block px-3 py-1 bg-electric-blue/20 text-blue-300 text-[10px] font-bold rounded border border-electric-blue/30 shadow-[0_0_10px_rgba(0,82,255,0.2)]">Good (&lt; 0.1)</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Secondary Metrics -->"""

html = re.sub(vitals_regex, new_vitals, html, flags=re.DOTALL)

with open("dashboard_performance.html", "w") as f:
    f.write(html)
