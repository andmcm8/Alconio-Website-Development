import re

with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace fonts in head
content = re.sub(
    r'<link href="https://fonts\.googleapis\.com/css2\?family=Space\+Grotesk[^"]*" rel="stylesheet" />',
    '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400..700;1,400..700&family=Syne:wght@400..800&display=swap" rel="stylesheet">',
    content
)

# Update the tailwind config for fonts
tailwind_config_pattern = r'fontFamily:\s*\{\s*"display":\s*\["Space Grotesk", "sans-serif"\]\s*\}'
tailwind_config_replacement = """fontFamily: {
                        "display": ["Syne", "sans-serif"],
                        "body": ["DM Sans", "sans-serif"]
                    }"""
content = re.sub(tailwind_config_pattern, tailwind_config_replacement, content)

# Change the body font class from font-display to font-body in the <body> tag if it exists
content = re.sub(r'<body class="([^"]*)font-display([^"]*)">', r'<body class="\1font-body\2">', content)

# Update the primary color definition to #1E54FF
content = re.sub(r'"primary":\s*"#1E51FF"', '"primary": "#1E54FF"', content)
content = re.sub(r'"electric-blue":\s*"#1E51FF"', '"electric-blue": "#1E54FF"', content)

# Extract header (everything before <main)
header_match = re.search(r'([\s\S]*?)<main[^>]*>', content)
header = header_match.group(1) if header_match else ""

# Extract footer
footer_match = re.search(r'(<!-- ═══════════════════════════════════════════════════════════════\s*SUPER PROFESSIONAL FOOTER[\s\S]*?</footer>)', content)
footer_block = footer_match.group(1) if footer_match else ""

# Ensure we get the closing tags
closing_tags = "\n    </main>\n</body>\n</html>"

new_main = """<main class="w-full relative min-h-screen pb-0 bg-[#000000] text-white">
    <!-- 1. HERO SECTION -->
    <section class="relative min-h-[70vh] flex flex-col justify-center px-6 max-w-7xl mx-auto z-10 w-full pt-32 pb-16 gsap-fade-up">
        
        <div class="inline-flex items-center gap-4 mb-6">
            <div class="h-[2px] w-8 bg-[#1E54FF]"></div>
            <span class="text-[#1E54FF] font-bold tracking-[0.2em] uppercase text-xs font-body">Who We Are</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-12 font-display">
            WE ENGINEER <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#1E54FF]">DOMINANCE.</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-300 max-w-2xl font-body font-light leading-relaxed border-l-2 border-[#1E54FF] pl-6">
            Architecting raw digital performance. We are the structural backbone for businesses that refuse to compromise on speed, scale, or intelligence.
        </p>
    </section>

    <!-- 2. OUR STORY / MISSION & THE TWO FOUNDERS -->
    <section class="relative py-32 px-6 bg-[#030303] border-t border-white/5 z-10 w-full gsap-stagger">
        <div class="max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-12 gap-16 items-start">
                
                <div class="lg:col-span-4 sticky top-32">
                    <h2 class="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">The <span class="text-[#1E54FF]">Mission.</span></h2>
                    <p class="text-slate-400 font-body text-lg leading-relaxed">
                        A leaner, smarter alternative to the bloated agency model.
                    </p>
                </div>

                <div class="lg:col-span-8 space-y-12 font-body text-xl text-slate-300 leading-relaxed font-light">
                    <div class="gsap-item bg-black border border-white/10 p-10 md:p-14 rounded-3xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-[#1E54FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div class="relative z-10">
                            <span class="material-symbols-outlined text-[#1E54FF] text-4xl mb-6 block">visibility</span>
                            <p class="mb-6">
                                The digital landscape has a massive, predatory gap. We watched countless small and mid-sized businesses get entirely boxed out of high-performance tech by overpriced, slow-moving agencies pushing outdated templates and endless retainer fees.
                            </p>
                            <p>
                                The choice was binary: pay $50,000+ for enterprise-grade infrastructure, or settle for a fragile drag-and-drop site that damages your brand. We refused to accept that.
                            </p>
                        </div>
                    </div>

                    <div class="gsap-item bg-[#1E54FF]/5 border border-[#1E54FF]/20 p-10 md:p-14 rounded-3xl relative overflow-hidden">
                        <div class="absolute -right-20 -top-20 w-64 h-64 bg-[#1E54FF]/20 blur-[100px] rounded-full"></div>
                        <div class="relative z-10">
                            <span class="material-symbols-outlined text-[#1E54FF] text-4xl mb-6 block">bolt</span>
                            <p class="mb-6 font-medium text-white">
                                Alconio was built by two founders specifically to destroy that barrier.
                            </p>
                            <p>
                                By aggressively leveraging AI and mastering modern headless web technologies, we stripped out the agency bloat. We engineered a hyper-efficient pipeline that delivers elite, proprietary software and autonomous workflows directly to SMBs—making enterprise power radically accessible.
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>

    <!-- 3. OUR VALUES (4 CARDS) -->
    <section class="relative py-32 px-6 max-w-7xl mx-auto z-10 w-full">
        <div class="mb-20 text-center max-w-3xl mx-auto gsap-fade-up">
            <h2 class="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">Core <span class="text-[#1E54FF]">Values</span></h2>
            <p class="text-slate-400 font-body text-lg">The angular, uncompromising principles that dictate every line of code we write.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger">
            
            <!-- Value 1: Precision -->
            <div class="gsap-item bg-[#050505] border border-white/5 rounded-2xl p-8 hover:border-[#1E54FF] transition-colors duration-300 group">
                <div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:bg-[#1E54FF]/20 transition-colors">
                    <span class="material-symbols-outlined text-[#1E54FF]">my_location</span>
                </div>
                <h3 class="text-2xl font-display font-bold mb-4">Precision</h3>
                <p class="font-body text-slate-400 text-sm leading-relaxed">
                    We architect flawless, sub-second systems tailored identically to your operational exactness.
                </p>
            </div>

            <!-- Value 2: Transparency -->
            <div class="gsap-item bg-[#050505] border border-white/5 rounded-2xl p-8 hover:border-[#1E54FF] transition-colors duration-300 group">
                <div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:bg-[#1E54FF]/20 transition-colors">
                    <span class="material-symbols-outlined text-[#1E54FF]">data_object</span>
                </div>
                <h3 class="text-2xl font-display font-bold mb-4">Transparency</h3>
                <p class="font-body text-slate-400 text-sm leading-relaxed">
                    Zero hidden fees and total engineering honesty; we are your absolute technical partners.
                </p>
            </div>

            <!-- Value 3: Innovation -->
            <div class="gsap-item bg-[#050505] border border-white/5 rounded-2xl p-8 hover:border-[#1E54FF] transition-colors duration-300 group">
                <div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:bg-[#1E54FF]/20 transition-colors">
                    <span class="material-symbols-outlined text-[#1E54FF]">lightbulb</span>
                </div>
                <h3 class="text-2xl font-display font-bold mb-4">Innovation</h3>
                <p class="font-body text-slate-400 text-sm leading-relaxed">
                    Aggressively pushing boundaries by integrating cutting-edge LLMs and headless frameworks.
                </p>
            </div>

            <!-- Value 4: Results -->
            <div class="gsap-item bg-[#050505] border border-white/5 rounded-2xl p-8 hover:border-[#1E54FF] transition-colors duration-300 group">
                <div class="h-12 w-12 rounded-full bg-[#1E54FF] shadow-[0_0_15px_rgba(30,84,255,0.4)] flex items-center justify-center mb-8">
                    <span class="material-symbols-outlined text-white">query_stats</span>
                </div>
                <h3 class="text-2xl font-display font-bold mb-4 text-[#1E54FF]">Results</h3>
                <p class="font-body text-slate-400 text-sm leading-relaxed">
                    Aesthetic means nothing without conversion; we build exclusively to multiply your bottom line.
                </p>
            </div>
            
        </div>
    </section>

    <!-- 4. WHY CHOOSE US (CONTRAST MATRIX) -->
    <section class="relative py-32 px-6 bg-[#020202] border-y border-white/10 z-10 w-full overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(30,84,255,0.05)_0%,transparent_50%)]"></div>
        <div class="max-w-7xl mx-auto relative z-10">
            
            <div class="text-center mb-20 gsap-fade-up">
                <h2 class="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">The <span class="text-[#1E54FF]">Contrast.</span></h2>
                <p class="font-body text-slate-400 text-lg">Why traditional solutions are obsolete.</p>
            </div>

            <div class="grid lg:grid-cols-2 gap-0 border border-white/10 rounded-3xl overflow-hidden gsap-fade-up">
                
                <!-- The Old Way -->
                <div class="bg-black p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/10">
                    <h3 class="text-2xl font-display font-bold text-slate-500 mb-10 flex items-center gap-4">
                        <span class="material-symbols-outlined text-3xl">domain_disabled</span> Traditional Agencies
                    </h3>
                    <ul class="space-y-8 font-body text-slate-400">
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-red-500/70 mt-1">close</span>
                            <div>
                                <strong class="block text-white mb-1">Bloated Pricing</strong>
                                High overhead costs passed directly to you via massive $20k+ retainers.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-red-500/70 mt-1">close</span>
                            <div>
                                <strong class="block text-white mb-1">Sluggish Execution</strong>
                                3 to 6-month turnaround times dragged down by endless meetings and middle-management.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-red-500/70 mt-1">close</span>
                            <div>
                                <strong class="block text-white mb-1">Outdated Tech</strong>
                                Fragile WordPress templates and spaghetti code that breaks upon scaling.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-red-500/70 mt-1">close</span>
                            <div>
                                <strong class="block text-white mb-1">Miscommunication</strong>
                                You talk to account managers who do not understand software architecture.
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- The Alconio Way -->
                <div class="bg-[#1E54FF]/5 p-10 md:p-16 relative">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-[#1E54FF] shadow-[0_0_20px_rgba(30,84,255,0.6)]"></div>
                    <h3 class="text-2xl font-display font-bold text-white mb-10 flex items-center gap-4">
                        <span class="material-symbols-outlined text-[#1E54FF] text-3xl">token</span> The Alconio Protocol
                    </h3>
                    <ul class="space-y-8 font-body text-slate-300">
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-[#1E54FF] mt-1">check_circle</span>
                            <div>
                                <strong class="block text-white mb-1">Fair & Lean Pricing</strong>
                                We run AI-assisted workflows, dramatically lowering overhead and delivering fixed, transparent quotes.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-[#1E54FF] mt-1">check_circle</span>
                            <div>
                                <strong class="block text-white mb-1">Hyper-Speed Delivery</strong>
                                We build in weeks, not months. Code deployment is rapid, iterative, and immediately actionable.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-[#1E54FF] mt-1">check_circle</span>
                            <div>
                                <strong class="block text-white mb-1">Elite Stack</strong>
                                Next.js, React, Custom LLMs. We leverage the exact same technologies used by unicorns.
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="material-symbols-outlined text-[#1E54FF] mt-1">check_circle</span>
                            <div>
                                <strong class="block text-white mb-1">Direct Engineering Access</strong>
                                You communicate directly with the founders writing your exact infrastructure. Zero fluff.
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </section>

    <!-- GSAP Initialization Script -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger);

            // Simple Fade Up
            gsap.utils.toArray('.gsap-fade-up').forEach(elem => {
                gsap.fromTo(elem, 
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: elem,
                            start: "top 85%",
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out"
                    }
                );
            });

            // Stagger Arrays
            gsap.utils.toArray('.gsap-stagger').forEach(container => {
                const items = container.querySelectorAll('.gsap-item');
                gsap.fromTo(items,
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: container,
                            start: "top 80%",
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out"
                    }
                );
            });
        });
    </script>

"""

new_content = header + "\n" + new_main + "\n\n" + footer_block + closing_tags

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("about.html completely redesigned per requirements.")
