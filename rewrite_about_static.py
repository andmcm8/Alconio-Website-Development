import re

with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip GSAP from header entirely if present
content = content.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>', '')
content = content.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>', '')

header_match = re.search(r'([\s\S]*?)<main[^>]*>', content)
header = header_match.group(1) if header_match else ""

footer_match = re.search(r'(<footer class="bg-\[#02010A\][\s\S]*?</footer>)', content)
footer_block = footer_match.group(1) if footer_match else "<!-- FOOTER MISSING -->"

new_main = """<main class="w-full bg-[#000000] text-white">
    
    <!-- 1. STATIC HERO SECTION -->
    <section class="w-full border-b border-white/5 bg-[#020202]">
        <div class="max-w-[1440px] mx-auto min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center px-6 md:px-12 py-20 lg:py-0">
            <!-- Left: Text -->
            <div class="flex flex-col justify-center order-2 lg:order-1 pt-12 lg:pt-0">
                <div class="inline-flex items-center gap-4 mb-6">
                    <div class="h-[2px] w-8 bg-[#1E54FF]"></div>
                    <span class="text-[#1E54FF] font-bold tracking-[0.2em] uppercase text-xs font-body">Architecture First</span>
                </div>
                <h1 class="text-6xl sm:text-7xl xl:text-[7rem] font-bold tracking-tighter leading-[0.9] font-display text-white mb-6">
                    ENGINEER <br />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#1E54FF] to-[#1E54FF]/40">DOMINANCE.</span>
                </h1>
                <p class="text-xl text-slate-400 font-body font-light max-w-md">
                    No bloated retainers. No generic templates. We construct elite, high-performance web architecture.
                </p>
            </div>
            
            <!-- Right: Premium Image -->
            <div class="relative w-full h-[50vh] lg:h-[85vh] order-1 lg:order-2">
                <div class="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10 hidden lg:block"></div>
                <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020202] to-transparent z-10"></div>
                <img src="about_hero.png" alt="Abstract Architecture" class="absolute inset-0 w-full h-full object-cover object-center rounded-2xl lg:rounded-none" />
            </div>
        </div>
    </section>

    <!-- 2. MISSION (ULTRA SHORT, HIGH APERTURE IMAGE) -->
    <section class="relative w-full min-h-[60vh] flex items-center justify-center border-b border-white/5 py-32 px-6">
        <div class="absolute inset-0 z-0">
            <img src="about_mission.png" alt="Mission Data Stream" class="w-full h-full object-cover opacity-30 mix-blend-screen" />
            <div class="absolute inset-0 bg-gradient-to-b from-[#000000] via-black/80 to-[#000000]"></div>
        </div>
        
        <div class="relative z-10 text-center max-w-4xl mx-auto">
            <h2 class="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-tight leading-tight text-white drop-shadow-2xl">
                Alconio exists to <span class="bg-white text-black px-2 italic">destroy</span> agency bloat and deploy elite code.
            </h2>
        </div>
    </section>

    <!-- 3. BENTO VALUES (GRAPHIC FOCUSED, VERY LOW TEXT) -->
    <section class="relative py-32 px-6 max-w-[1440px] mx-auto z-20 w-full">
        <div class="mb-20">
            <h2 class="text-4xl lg:text-5xl font-display font-bold tracking-tight">The Core.</h2>
            <p class="text-slate-400 mt-4 text-lg">Four absolute principles.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div class="bg-white/[0.02] border border-white/5 hover:border-[#1E54FF]/40 transition-colors p-10 flex flex-col items-start gap-4 h-[320px]">
                <span class="material-symbols-outlined text-[#1E54FF] text-4xl mb-auto">my_location</span>
                <h3 class="text-3xl font-display font-bold">Precision</h3>
                <p class="font-body text-slate-400 text-sm">Engineered with identical exactness down to the absolute pixel.</p>
            </div>

            <div class="bg-white/[0.02] border border-white/5 hover:border-[#1E54FF]/40 transition-colors p-10 flex flex-col items-start gap-4 h-[320px]">
                <span class="material-symbols-outlined text-[#1E54FF] text-4xl mb-auto">data_object</span>
                <h3 class="text-3xl font-display font-bold">Honesty</h3>
                <p class="font-body text-slate-400 text-sm">Total engineering honesty and transparent pricing structures.</p>
            </div>

            <div class="bg-[#1E54FF]/10 border border-[#1E54FF]/20 hover:border-[#1E54FF] transition-colors p-10 flex flex-col items-start gap-4 h-[320px]">
                <span class="material-symbols-outlined text-white text-4xl mb-auto">lightbulb</span>
                <h3 class="text-3xl font-display font-bold text-white">Innovation</h3>
                <p class="font-body text-white/70 text-sm">Aggressive integration of Next.js, Headless CMS, and raw AI.</p>
            </div>

            <div class="bg-white/[0.02] border border-white/5 hover:border-[#1E54FF]/40 transition-colors p-10 flex flex-col items-start gap-4 h-[320px]">
                <span class="material-symbols-outlined text-[#1E54FF] text-4xl mb-auto">query_stats</span>
                <h3 class="text-3xl font-display font-bold">Results</h3>
                <p class="font-body text-slate-400 text-sm">Built exclusively to multiply your bottom line.</p>
            </div>

        </div>
    </section>

    <!-- 4. STATIC CONTRAST (STATIC 50/50) -->
    <section class="relative w-full border-y border-white/10 mt-12 bg-black">
        <div class="grid lg:grid-cols-2 max-w-[1440px] mx-auto divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            <!-- Traditional -->
            <div class="p-16 lg:p-24 flex justify-center items-center">
                <div class="max-w-md w-full">
                    <h3 class="text-slate-500 font-display font-bold text-2xl mb-8 tracking-wide uppercase">Traditional Agencies</h3>
                    <div class="space-y-6">
                        <p class="text-slate-300 text-xl font-body border-l-2 border-red-500/50 pl-4 py-1">Sluggish Timelines.</p>
                        <p class="text-slate-300 text-xl font-body border-l-2 border-red-500/50 pl-4 py-1">Bloated Retainers.</p>
                        <p class="text-slate-300 text-xl font-body border-l-2 border-red-500/50 pl-4 py-1">Fragile Templates.</p>
                    </div>
                </div>
            </div>

            <!-- Alconio -->
            <div class="p-16 lg:p-24 flex justify-center items-center bg-[#1E54FF]/[0.03]">
                <div class="max-w-md w-full">
                    <h3 class="text-[#1E54FF] font-display font-black text-2xl mb-8 tracking-wide uppercase">The Alconio Protocol</h3>
                    <div class="space-y-6">
                        <p class="text-white text-3xl font-display font-bold border-l-4 border-[#1E54FF] pl-6 py-2">Instant Execution.</p>
                        <p class="text-white text-3xl font-display font-bold border-l-4 border-[#1E54FF] pl-6 py-2">Fixed Architecture.</p>
                        <p class="text-white text-3xl font-display font-bold border-l-4 border-[#1E54FF] pl-6 py-2">Raw Performance.</p>
                    </div>
                </div>
            </div>
            
        </div>
    </section>

"""

new_content = header + "\n" + new_main + "\n\n" + footer_block + "\n    </main>\n</body>\n</html>"

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("about.html rewritten with high-fidelity graphics, slashed text, and zero animations.")
