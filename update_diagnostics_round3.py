import re

with open("dashboard_performance.html", "r", encoding="utf-8") as f:
    html = f.read()

diagnostics_regex = r"<!-- Secondary Metrics -->.*?</div>\s*<!-- Server & Uptime -->"

def make_card(name, value, unit, tt_title, tt_desc, svg_path):
    # Determine the span for unit if it exists
    unit_html = f'<span class="text-sm font-bold text-slate-400 pb-1">{unit}</span>' if unit else ''
    
    return f"""
            <!-- {name} -->
            <div class="glass-card rounded-xl p-5 border border-white/5 flex flex-col justify-between h-32 relative overflow-visible transition-colors hover:border-white/10">
                <!-- Background decoration -->
                <div class="absolute inset-0 z-0 opacity-[0.07] pointer-events-none overflow-hidden rounded-xl">
                    <svg class="w-full h-full text-electric-blue" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="{svg_path}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"></path>
                    </svg>
                </div>
                
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
                    <span class="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{value}</span>
                    {unit_html}
                </div>
            </div>"""

cards_html = ""
cards_html += make_card("TTFB", "120", "ms", "Time to First Byte", "Measures the time between the request and when the first byte of response arrives.", "M0,60 Q25,30 50,60 T100,60")
cards_html += make_card("FCP", "0.8", "s", "First Contentful Paint", "Time when the first text or image is painted on the user's screen.", "M10,90 L10,60 M30,90 L30,40 M50,90 L50,20 M70,90 L70,50 M90,90 L90,10")
cards_html += make_card("TTI", "2.4", "s", "Time to Interactive", "How long it takes the page to become fully interactive.", "M10,50 L30,50 L40,30 L60,30 L70,70 L90,70")
cards_html += make_card("TBT", "150", "ms", "Total Blocking Time", "Sum of all periods blocking user input between FCP and TTI.", "M0,80 L20,80 L20,40 L40,40 L40,80 L60,80 L60,20 L80,20 L80,80 L100,80")
cards_html += make_card("Speed Index", "1.2", "s", "Speed Index", "How quickly the contents of a page are visibly populated.", "M10,80 L80,20 M20,90 L90,30 M30,100 L100,40")
cards_html += make_card("Page Size", "2.4", "MB", "Total Page Size", "Total bytes transferred across network for this document.", "M20,40 C20,20 80,20 80,40 C80,60 20,60 20,40 M20,40 L20,80 C20,100 80,100 80,80 L80,40")
cards_html += make_card("Requests", "45", "", "Network Requests", "Total number of HTTP requests required to fully load the page.", "M50,50 L20,20 M50,50 L80,20 M50,50 L20,80 M50,50 L80,80")
cards_html += make_card("DOM Size", "842", "", "DOM Elements", "Total number of distinct HTML nodes rendered natively.", "M50,20 L50,40 M50,40 L20,70 M50,40 L80,70 M20,70 L10,90 M20,70 L30,90 M80,70 L70,90 M80,70 L90,90")

new_diagnostics = f"""<!-- Secondary Metrics -->
    <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative mt-4">
        <div class="neon-border-top"></div>
        <h3 class="text-base font-bold text-white mb-6 relative z-10 border-b border-white/5 pb-4">Diagnostic Metrics</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
{cards_html}
        </div>
    </div>

    <!-- Server & Uptime -->"""

# Also strip out the old `<style>` update I did for .tooltip-custom since we're using inline tailwind group hover now.
html = re.sub(r"<style>.*?\.tooltip-custom\s*\{.*?</style>", "", html, flags=re.DOTALL)

html = re.sub(diagnostics_regex, new_diagnostics, html, flags=re.DOTALL)

with open("dashboard_performance.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated diagnostic metrics successfully.")
