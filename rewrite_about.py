import re

with open('about.html', 'r', encoding='utf-8') as f:
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
            <span class="text-[#1E51FF] font-bold tracking-[0.3em] uppercase text-xs">Our Purpose</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.85] mb-12 text-white">
            RADICAL <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 italic font-serif">ACCESSIBILITY.</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-400 max-w-3xl font-medium leading-relaxed mb-8">
            We noticed a systemic failure in the digital landscape. High-performance websites and elite AI systems were being gatekept by astronomical costs, preventing visionary businesses from reaching their true scale.
        </p>
        
        <p class="text-xl md:text-2xl text-white max-w-3xl font-medium leading-relaxed">
            The choice was binary: pay for overpriced enterprise bloat or settle for templated mediocrity. We rejected both.
        </p>
    </section>

    <!-- The Mission Statement (Massive Divider) -->
    <section class="relative py-24 px-6 z-10 w-full bg-[#1E51FF]/5 border-y border-[#1E51FF]/20 my-16 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(30,81,255,0.1)_0%,transparent_50%)]"></div>
        <div class="max-w-[95%] mx-auto">
            <h2 class="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight max-w-5xl">
                Alconio exists to level the playing field. <span class="text-slate-500 italic font-serif">We make enterprise power available to every visionary.</span>
            </h2>
        </div>
    </section>

    <!-- Values Bento Grid -->
    <section class="relative py-24 px-6 max-w-[95%] mx-auto z-10 w-full">
        <div class="mb-16">
            <h2 class="text-4xl lg:text-5xl font-bold tracking-tight mb-4">The Pillars</h2>
            <p class="text-slate-400">The structural integrity behind everything we build.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 w-full auto-rows-[minmax(350px,_auto)]">
            
            <!-- Value 1 -->
            <div class="md:col-span-4 group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:border-[#1E51FF]/30 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-[#1E51FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <!-- Graphic Element -->
                <div class="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <span class="material-symbols-outlined text-[15rem] text-white">architecture</span>
                </div>
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <span class="material-symbols-outlined text-4xl text-[#1E51FF] mb-8">architecture</span>
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight mb-4">Deep Innovation</h3>
                        <p class="text-slate-400 text-base font-medium leading-relaxed">
                            We don't use templates. We architect custom systems from the ground up, ensuring your tech is uniquely calibrated to your market.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Value 2 (Center Highlight) -->
            <div class="md:col-span-4 group relative overflow-hidden bg-[#1E51FF]/10 border border-[#1E51FF]/30 rounded-3xl p-10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(30,81,255,0.15)]">
                <div class="absolute top-0 left-0 w-full h-[2px] bg-[#1E51FF]"></div>
                <!-- Graphic Element -->
                <div class="absolute -right-10 -bottom-10 w-1/2 h-1/2 bg-[#1E51FF]/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <span class="material-symbols-outlined text-4xl text-white mb-8">key</span>
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight mb-4">No Gatekeeping</h3>
                        <p class="text-slate-300 text-base font-medium leading-relaxed">
                            Performance should not have a barrier to entry. We leverage advanced frameworks to offer elite tech at disruptively affordable rates.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Value 3 -->
            <div class="md:col-span-4 group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:border-[#1E51FF]/30 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-[#1E51FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <!-- Graphic Element -->
                <div class="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <span class="material-symbols-outlined text-[15rem] text-white">verified_user</span>
                </div>
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <span class="material-symbols-outlined text-4xl text-[#1E51FF] mb-8">verified_user</span>
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight mb-4">Absolute Integrity</h3>
                        <p class="text-slate-400 text-base font-medium leading-relaxed">
                            We are architectural partners, not vendors. Transparent engineering, ruthless honesty, and long-term commitments are our absolute baseline.
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    </section>

    <!-- Final CTA -->
    <section class="relative py-32 px-6 max-w-[95%] mx-auto z-10 w-full">
        <div class="bg-[#111111] border border-white/10 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,81,255,0.1)_0%,transparent_60%)]"></div>
            <div class="relative z-10">
                <h2 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-8">
                    BECOME <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#1E51FF]">UNSTOPPABLE.</span>
                </h2>
                <div class="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                    <a href="get-started.html" class="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold tracking-wide hover:scale-105 hover:bg-gray-200 transition-all text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Launch Your Firm <span class="material-symbols-outlined">rocket_launch</span>
                    </a>
                    <a href="our-work.html" class="inline-flex items-center gap-3 bg-transparent border border-white/20 text-white px-10 py-5 rounded-full font-bold tracking-wide hover:bg-white/5 transition-all text-lg">
                        View Showcases
                    </a>
                </div>
            </div>
        </div>
    </section>

"""

new_content = header + "\n" + new_main + "\n\n" + footer_block

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("about.html completely rewritten.")
