import re

with open("dashboard_performance.html", "r") as f:
    html = f.read()

diagnostics_regex = r"<!-- Secondary Metrics -->.*?</div>\s*<!-- Server & Uptime -->"

new_diagnostics = """<!-- Secondary Metrics -->
    <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative mt-4">
        <div class="neon-border-top"></div>
        <h3 class="text-base font-bold text-white mb-6 relative z-10 border-b border-white/5 pb-4">Diagnostic Metrics</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <!-- TTFB -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">TTFB</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <!-- CSS Tooltip -->
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Time to First Byte</p>
                        <p class="text-[9px] text-slate-400 leading-tight">Measures the time between the request and when the first byte of response arrives.</p>
                        <!-- triangle arrow -->
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">120ms</span>
            </div>
            
            <!-- FCP -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">FCP</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">First Contentful Paint</p>
                        <p class="text-[9px] text-slate-400 leading-tight">Time when the first text or image is painted on the user's screen.</p>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">0.8s</span>
            </div>
            
            <!-- TTI -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">TTI</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Time to Interactive</p>
                        <p class="text-[9px] text-slate-400 leading-tight">How long it takes the page to become fully interactive.</p>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">2.4s</span>
            </div>

            <!-- TBT -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">TBT</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Total Blocking Time</p>
                        <p class="text-[9px] text-slate-400 leading-tight">Sum of all periods blocking user input between FCP and TTI.</p>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">150ms</span>
            </div>

            <!-- Speed Index -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">Speed Index</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Speed Index</p>
                        <p class="text-[9px] text-slate-400 leading-tight">How quickly the contents of a page are visibly populated.</p>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">1.2s</span>
            </div>

            <!-- Page Size -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">Page Size</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Total Page Size</p>
                        <p class="text-[9px] text-slate-400 leading-tight">Total bytes transferred across network for this document.</p>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">2.4 MB</span>
            </div>

            <!-- Network Requests -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">Requests</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Network Requests</p>
                        <p class="text-[9px] text-slate-400 leading-tight">Total number of HTTP requests required to fully load the page.</p>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">45</span>
            </div>

            <!-- DOM Elements -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-obsidian border border-white/5 shadow-inner">
                <div class="flex items-center gap-2 group relative cursor-help">
                    <span class="text-sm font-bold text-slate-300 tracking-wide">DOM Size</span>
                    <span class="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-[10px] font-bold pb-[1px]" style="font-family: serif;">i</span>
                    <div class="tooltip-custom absolute right-0 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                        <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">DOM Elements</p>
                        <p class="text-[9px] text-slate-400 leading-tight">Total number of distinct HTML nodes rendered natively.</p>
                        <!-- arrow offset for right-aligned tooltip -->
                        <div class="absolute top-full right-[20px] border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                    </div>
                </div>
                <span class="text-lg font-bold text-white font-mono">842</span>
            </div>

        </div>
    </div>

    <!-- Server & Uptime -->"""

html = re.sub(diagnostics_regex, new_diagnostics, html, flags=re.DOTALL)

with open("dashboard_performance.html", "w") as f:
    f.write(html)
