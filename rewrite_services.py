import re

with open('services.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract header (everything before <main)
header_match = re.search(r'([\s\S]*?)<main[^>]*>', content)
header = header_match.group(1) if header_match else ""

# Extract footer
footer_match = re.search(r'(<!-- ═══════════════════════════════════════════════════════════════\s*SUPER PROFESSIONAL FOOTER[\s\S]*?</footer>\s*</main>\s*</body>\s*</html>)', content)
footer_block = footer_match.group(1) if footer_match else ""

# The new MAIN content
new_main = """<main class="w-full relative min-h-screen pb-0">
    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 px-6 max-w-[95%] mx-auto z-10 w-full">
        <div class="inline-flex items-center gap-4 mb-8">
            <div class="h-[1px] w-12 bg-[#1E51FF]"></div>
            <span class="text-[#1E51FF] font-bold tracking-[0.3em] uppercase text-xs">Our Services</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.85] mb-12 text-white">
            ELITE <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 italic font-serif">SYSTEMS.</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-400 max-w-3xl font-medium leading-relaxed">
            We architect and deploy hyper-efficient digital infrastructure. From massive high-converting web applications to completely autonomous neural workflows. Built to scale, designed to dominate.
        </p>
    </section>

    <!-- Bento Grid Section -->
    <section class="relative py-24 px-6 max-w-[95%] mx-auto z-10 w-full">
        <!-- Grid Container -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 w-full auto-rows-[minmax(300px,_auto)]">
            
            <!-- Bento Box 1: Web Development (Large) -->
            <div class="md:col-span-8 group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-10 lg:p-14 hover:border-[#1E51FF]/30 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-[#1E51FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-16">
                        <span class="material-symbols-outlined text-4xl text-[#1E51FF]">code_blocks</span>
                        <div class="px-4 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold">Primary</div>
                    </div>
                    <div>
                        <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">Web Development</h2>
                        <p class="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                            Ultra-fast, Next.js / React-powered applications that command attention. We don't just build websites; we build high-converting digital environments optimized around flawless user experience.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bento Box 2: SEO & Analytics -->
            <div class="md:col-span-4 group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:border-[#1E51FF]/30 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-[#1E51FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <span class="material-symbols-outlined text-4xl text-white mb-8">show_chart</span>
                    <div>
                        <h3 class="text-2xl font-bold tracking-tight mb-3">SEO & Analytics</h3>
                        <p class="text-slate-400 text-sm font-medium leading-relaxed">
                            Complete technical optimization. Deep-level data tracking to guarantee precise market positioning and verifiable ROI.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bento Box 3: Custom Dashboards -->
            <div class="md:col-span-4 group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:border-[#1E51FF]/30 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-[#1E51FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <span class="material-symbols-outlined text-4xl text-white mb-8">dashboard_customize</span>
                    <div>
                        <h3 class="text-2xl font-bold tracking-tight mb-3">Internal Dashboards</h3>
                        <p class="text-slate-400 text-sm font-medium leading-relaxed">
                            Bespoke admin portals that consolidate your entire operational stack into a single, aggressively efficient interface.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bento Box 4: AI Automation (Massive) -->
            <div class="md:col-span-8 group relative overflow-hidden bg-[#1E51FF]/10 border border-[#1E51FF]/20 rounded-3xl p-10 lg:p-14 transition-all duration-500">
                <!-- Abstract glowing element -->
                <div class="absolute -right-32 -top-32 w-96 h-96 bg-[#1E51FF]/20 rounded-full blur-[100px] group-hover:opacity-100 transition-opacity"></div>
                
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-16">
                        <span class="material-symbols-outlined text-4xl text-[#1E51FF]">smart_toy</span>
                        <div class="px-4 py-1.5 rounded-full bg-[#1E51FF] text-white text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(30,81,255,0.4)]">Premium</div>
                    </div>
                    <div>
                        <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">Neural Automation</h2>
                        <p class="text-slate-300 text-lg max-w-xl font-medium leading-relaxed">
                            Replacing manual friction with intelligent systems. We integrate custom LLMs trained on your exact business context to automate customer support, internal routing, and predictive analytics 24/7/365.
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    </section>

    <!-- Clean Pricing Table Alternative -->
    <section class="relative py-24 px-6 max-w-[95%] mx-auto z-10 w-full border-t border-white/5">
        <div class="mb-16">
            <h2 class="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Investment Tiers</h2>
            <p class="text-slate-400">Architectural excellence, scaled to your current needs.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-white/10 rounded-3xl overflow-hidden bg-white/[0.01]">
            
            <!-- Tier 1 -->
            <div class="p-10 border-b lg:border-b-0 lg:border-r border-white/10 hover:bg-white/[0.02] transition-colors relative">
                <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#1E51FF] mb-4">Foundation</h3>
                <div class="text-4xl font-black mb-2">$4,999</div>
                <div class="text-xs text-slate-500 uppercase tracking-wider font-bold mb-10">Starting Base</div>
                <ul class="space-y-4 text-sm text-slate-300 font-medium mb-12">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Elite Landing Ecosystem
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Mobile Flawlessness
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Sub-second Loads
                    </li>
                </ul>
                <a href="get-started.html" class="block w-full text-center py-4 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">Select</a>
            </div>

            <!-- Tier 2 -->
            <div class="p-10 border-b lg:border-b-0 lg:border-r border-[#1E51FF]/30 bg-[#1E51FF]/5 relative">
                <div class="absolute top-0 left-0 w-full h-[2px] bg-[#1E51FF] shadow-[0_0_20px_rgba(30,81,255,0.6)]"></div>
                <h3 class="text-[10px] font-bold uppercase tracking-widest text-white mb-4">Dominance</h3>
                <div class="text-4xl font-black mb-2">$12,499</div>
                <div class="text-xs text-slate-400 uppercase tracking-wider font-bold mb-10">Most Requested</div>
                <ul class="space-y-4 text-sm text-white font-medium mb-12">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Full Custom Web App
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> AI Chatbot Injection
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> E-Commerce Systems
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Advanced Data Routing
                    </li>
                </ul>
                <a href="get-started.html" class="block w-full text-center py-4 rounded-full bg-[#1E51FF] text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(30,81,255,0.2)]">Select</a>
            </div>

            <!-- Tier 3 -->
            <div class="p-10 hover:bg-white/[0.02] transition-colors relative">
                <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Enterprise</h3>
                <div class="text-4xl font-black mb-2">Custom</div>
                <div class="text-xs text-slate-500 uppercase tracking-wider font-bold mb-10">Infinite Scale</div>
                <ul class="space-y-4 text-sm text-slate-300 font-medium mb-12">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Private LLM Infrastructure
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> Deep Software Pipelines
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-[#1E51FF] text-lg">check</span> 24/7 Priority SLAs
                    </li>
                </ul>
                <a href="get-started.html" class="block w-full text-center py-4 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">Contact Us</a>
            </div>

        </div>
    </section>

"""

new_content = header + "\n" + new_main + "\n\n" + footer_block

with open('services.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("services.html completely rewritten.")
