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
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">TTFB</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Time to First Byte</p>
                            <p class="text-[9px] text-slate-400 leading-tight">Measures the time between the request and when the first byte of response arrives.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">120</span>
                    <span class="text-sm font-bold text-blue-300/60 pb-1">ms</span>
                </div>
            </div>
            
            <!-- FCP -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">FCP</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">First Contentful Paint</p>
                            <p class="text-[9px] text-slate-400 leading-tight">Time when the first text or image is painted on the user's screen.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">0.8</span>
                    <span class="text-sm font-bold text-blue-300/60 pb-1">s</span>
                </div>
            </div>
            
            <!-- TTI -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">TTI</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Time to Interactive</p>
                            <p class="text-[9px] text-slate-400 leading-tight">How long it takes the page to become fully interactive.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">2.4</span>
                    <span class="text-sm font-bold text-blue-300/60 pb-1">s</span>
                </div>
            </div>

            <!-- TBT -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">TBT</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Total Blocking Time</p>
                            <p class="text-[9px] text-slate-400 leading-tight">Sum of all periods blocking user input between FCP and TTI.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">150</span>
                    <span class="text-sm font-bold text-blue-300/60 pb-1">ms</span>
                </div>
            </div>

            <!-- Speed Index -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Speed Index</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Speed Index</p>
                            <p class="text-[9px] text-slate-400 leading-tight">How quickly the contents of a page are visibly populated.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">1.2</span>
                    <span class="text-sm font-bold text-blue-300/60 pb-1">s</span>
                </div>
            </div>

            <!-- Page Size -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Page Size</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Total Page Size</p>
                            <p class="text-[9px] text-slate-400 leading-tight">Total bytes transferred across network for this document.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">2.4</span>
                    <span class="text-sm font-bold text-blue-300/60 pb-1">MB</span>
                </div>
            </div>

            <!-- Network Requests -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Requests</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">Network Requests</p>
                            <p class="text-[9px] text-slate-400 leading-tight">Total number of HTTP requests required to fully load the page.</p>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">45</span>
                </div>
            </div>

            <!-- DOM Elements -->
            <div class="glass-card rounded-xl p-5 border-t-2 border-electric-blue flex flex-col justify-between h-32 relative group">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">DOM Size</span>
                    <div class="cursor-help">
                        <span class="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/40 flex items-center justify-center text-xs font-bold pb-[1px]" style="font-family: serif;">i</span>
                        <div class="tooltip-custom absolute bottom-[70px] right-0 mb-2 w-48 bg-black/90 border border-electric-blue/30 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-50 p-2 pointer-events-none">
                            <p class="text-[10px] text-white font-bold mb-1 border-b border-white/10 pb-1">DOM Elements</p>
                            <p class="text-[9px] text-slate-400 leading-tight">Total number of distinct HTML nodes rendered natively.</p>
                            <div class="absolute top-full right-[20px] border-4 border-transparent border-t-black/90 drop-shadow-[0_2px_0_rgba(0,82,255,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-end gap-1">
                    <span class="text-3xl font-bold text-electric-blue drop-shadow-[0_0_8px_rgba(0,82,255,0.4)] tracking-tight">842</span>
                </div>
            </div>

        </div>
    </div>

    <!-- Server & Uptime -->"""

html = re.sub(diagnostics_regex, new_diagnostics, html, flags=re.DOTALL)

with open("dashboard_performance.html", "w") as f:
    f.write(html)
