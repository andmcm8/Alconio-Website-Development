import re

with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract header (everything before <main)
header_match = re.search(r'([\s\S]*?)<main[^>]*>', content)
header = header_match.group(1) if header_match else ""

# Ensure GSAP ScrollTrigger is in the head if not already
if "ScrollTrigger.min.js" not in header:
    # It might not be there at all! Let's insert it before </head>
    header = header.replace('</head>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>\n</head>')

# Extract footer
footer_match = re.search(r'(<footer class="bg-\[#02010A\][\s\S]*?</footer>)', content)
footer_block = footer_match.group(1) if footer_match else ""

if not footer_block:
    print("Warning: could not extract footer block. Please check regex if footer vanishes.")
    # fallback to just not injecting it and we can patch later
    footer_block = "<!-- FOOTER MISSING, MUST PATCH -->"

closing_tags = "\n    </main>\n</body>\n</html>"

new_main = """<main class="w-full relative bg-[#000000] text-white overflow-hidden">
    
    <!-- 1. CINEMATIC HERO -->
    <section class="hero-section relative h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        <!-- Abstract cinematic glow -->
        <div class="absolute inset-0 z-0">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1E54FF]/10 rounded-full blur-[150px] mix-blend-screen opacity-0" id="hero-glow"></div>
            <!-- Grain overlay (optional subtle texture) -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>
        
        <div class="relative z-10 text-center w-full flex flex-col items-center justify-center">
            <div class="hero-badge inline-flex items-center gap-4 mb-8 opacity-0 translate-y-8">
                <div class="h-[1px] w-12 bg-[#1E54FF]"></div>
                <span class="text-[#1E54FF] font-bold tracking-[0.4em] uppercase text-xs font-body">Architecture over assembly</span>
                <div class="h-[1px] w-12 bg-[#1E54FF]"></div>
            </div>
            
            <h1 class="hero-title text-[5rem] sm:text-[8xl] md:text-[10rem] lg:text-[14rem] font-bold tracking-tighter leading-[0.8] font-display text-white opacity-0 translate-y-20 mix-blend-screen mix-blend-plus-lighter drop-shadow-2xl">
                WE ENGINEER <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#1E54FF]/50 italic">DOMINANCE.</span>
            </h1>
        </div>
        
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-4 hero-scroll opacity-0">
            <span class="text-[10px] uppercase font-bold tracking-[0.3em] font-body">Scroll to Initialize</span>
            <div class="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
    </section>

    <!-- 2. SCROLL PINNED MISSION STATEMENT -->
    <!-- The wrapper is 300vh tall to allow for a long scroll scrub -->
    <section class="mission-wrapper relative w-full h-[300vh] bg-black z-20 border-t border-white/5">
        <!-- The pinned container -->
        <div class="mission-pin h-screen w-full flex items-center justify-center px-6 sticky top-0 overflow-hidden">
            <!-- Background element reacting to scroll -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,84,255,0.08)_0%,transparent_70%)] opacity-0" id="mission-bg"></div>
            
            <div class="max-w-6xl mx-auto text-center relative z-10">
                <h2 class="mission-text text-3xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight leading-tight text-white/10">
                    The digital landscape has a massive, predatory gap.
                    <br/><br/>
                    <span class="text-white">We watched small businesses get boxed out by overpriced, slow-moving agencies pushing fragile templates.</span>
                    <br/><br/>
                    We built Alconio to destroy that barrier.
                </h2>
            </div>
        </div>
    </section>

    <!-- 3. TRUE GLASSMORPHIC BENTO GRID (VALUES) -->
    <section class="relative py-40 px-6 max-w-screen-2xl mx-auto z-20 w-full overflow-visible">
        <div class="mb-24 text-center max-w-4xl mx-auto gsap-stagger-group">
            <h2 class="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8 gsap-stagger-item">The <span class="italic text-[#1E54FF]">Framework.</span></h2>
            <p class="text-slate-400 font-body text-xl lg:text-3xl font-light gsap-stagger-item">The uncompromising architectural principles that dictate every absolute line of code we deploy.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(380px,auto)] gap-6 lg:gap-8 gsap-stagger-group">
            
            <!-- Bento 1: Precision (Massive Anchor) -->
            <div class="gsap-stagger-item md:col-span-8 bg-white/[0.015] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-20 relative overflow-hidden group hover:bg-[#1E54FF]/5 transition-colors duration-700 shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]">
                <!-- Massive Background Number -->
                <div class="absolute -right-10 -bottom-20 text-[20rem] font-display font-black text-white/[0.02] leading-none pointer-events-none group-hover:text-[#1E54FF]/10 transition-colors duration-1000">01</div>
                
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <span class="material-symbols-outlined text-[#1E54FF] text-5xl mb-12">my_location</span>
                    <div>
                        <h3 class="text-4xl md:text-6xl font-display font-bold mb-6">Precision</h3>
                        <p class="font-body text-slate-400 text-xl lg:text-2xl font-light leading-relaxed max-w-2xl">
                            We architect flawless, sub-second systems tailored identically to your operational exactness. We do not do "close enough".
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bento 2: Transparency (Vertical Lock) -->
            <div class="gsap-stagger-item md:col-span-4 bg-[#1E54FF]/5 backdrop-blur-2xl border border-[#1E54FF]/20 rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-16 relative overflow-hidden group hover:bg-[#1E54FF]/10 transition-colors duration-700 shadow-[0_0_40px_rgba(30,84,255,0.1)]">
                <div class="absolute -right-10 -bottom-10 text-[15rem] font-display font-black text-[#1E54FF]/10 leading-none pointer-events-none">02</div>
                
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <span class="material-symbols-outlined text-white text-5xl mb-12">data_object</span>
                    <div>
                        <h3 class="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Transparency</h3>
                        <p class="font-body text-white/70 text-lg font-light leading-relaxed">
                            Zero hidden fees and total engineering honesty; we are your absolute technical partners.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bento 3: Innovation (Square) -->
            <div class="gsap-stagger-item md:col-span-5 bg-white/[0.015] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-16 relative overflow-hidden group hover:border-[#1E54FF]/50 transition-colors duration-700">
                <div class="absolute -left-10 -bottom-10 text-[15rem] font-display font-black text-white/[0.02] leading-none pointer-events-none group-hover:text-[#1E54FF]/10 transition-colors duration-1000">03</div>
                
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <span class="material-symbols-outlined text-[#1E54FF] text-5xl mb-12">lightbulb</span>
                    <div>
                        <h3 class="text-3xl md:text-4xl font-display font-bold mb-6">Innovation</h3>
                        <p class="font-body text-slate-400 text-lg font-light leading-relaxed">
                            Aggressively pushing boundaries by integrating cutting-edge LLMs and modern headless frameworks.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bento 4: Results (Wide Anchor) -->
            <div class="gsap-stagger-item md:col-span-7 bg-[#050505] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-20 relative overflow-hidden group hover:border-white/20 transition-colors duration-700">
                <!-- Inner glow ring -->
                <div class="absolute inset-0 border-[2px] border-[#1E54FF]/0 rounded-[2.5rem] md:rounded-[4rem] m-[-2px] group-hover:border-[#1E54FF]/30 transition-colors duration-1000"></div>
                
                <div class="absolute -right-10 -bottom-20 text-[20rem] font-display font-black text-white/[0.02] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors duration-1000">04</div>
                
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <span class="material-symbols-outlined text-white text-5xl mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">query_stats</span>
                    <div>
                        <h3 class="text-4xl md:text-6xl font-display font-bold mb-6">Results</h3>
                        <p class="font-body text-slate-400 text-xl lg:text-2xl font-light leading-relaxed max-w-xl">
                            Aesthetic means absolutely nothing without conversion; we build strictly to multiply your bottom line.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- 4. CONTRAST MATRIX (50/50 SPLIT SCREEN) -->
    <!-- Breaking out of containers to touch screen edges -->
    <section class="relative w-full z-20 min-h-[90vh] flex flex-col lg:flex-row mt-32 border-y border-white/10">
        
        <!-- Left Side: Traditional Agencies (Desaturated & Dead) -->
        <div class="w-full lg:w-1/2 bg-[#050505] p-16 md:p-24 lg:p-32 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden group">
            <!-- Subtle noise overlay -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay"></div>
            
            <div class="relative z-10 max-w-xl">
                <h2 class="text-4xl lg:text-5xl font-display font-bold text-white/30 mb-16 tracking-tight">The Old Standard</h2>
                
                <div class="space-y-12">
                    <div class="opacity-40">
                        <h4 class="text-xl font-display font-bold text-white mb-2 uppercase tracking-wide">Bloated Pricing</h4>
                        <p class="font-body font-light text-white/80 leading-relaxed">Massive $20k+ retainers passing pointless agency overhead directly to your bottom line.</p>
                    </div>
                    <div class="opacity-40">
                        <h4 class="text-xl font-display font-bold text-white mb-2 uppercase tracking-wide">Sluggish Execution</h4>
                        <p class="font-body font-light text-white/80 leading-relaxed">Endless meetings dictating 6-month timelines for software that should deploy in weeks.</p>
                    </div>
                    <div class="opacity-40">
                        <h4 class="text-xl font-display font-bold text-white mb-2 uppercase tracking-wide">Outdated Tech</h4>
                        <p class="font-body font-light text-white/80 leading-relaxed">Fragile drag-and-drop templates and spaghetti code that inevitably crumbles at scale.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: The Alconio Protocol (Glowing & Alive) -->
        <div class="w-full lg:w-1/2 bg-[#1E54FF] p-16 md:p-24 lg:p-32 flex flex-col justify-center relative overflow-hidden group">
            <!-- Intense radial glow in center -->
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-50"></div>
            
            <div class="relative z-10 max-w-xl text-white">
                <h2 class="text-4xl lg:text-5xl font-display font-black mb-16 tracking-tight text-white drop-shadow-lg">The Architecture</h2>
                
                <div class="space-y-12">
                    <div class="transform transition-transform duration-500 hover:translate-x-4">
                        <h4 class="text-2xl font-display font-black mb-2 uppercase tracking-wide">Lean & Transparent</h4>
                        <p class="font-body font-medium text-white/90 leading-relaxed text-lg">AI-assisted workflows dramatically lower structural overhead. You get fixed, transparent quotes.</p>
                    </div>
                    <div class="transform transition-transform duration-500 hover:translate-x-4">
                        <h4 class="text-2xl font-display font-black mb-2 uppercase tracking-wide">Hyper-Speed Delivery</h4>
                        <p class="font-body font-medium text-white/90 leading-relaxed text-lg">We execute in weeks, not months. Code deployments are rapid, iterative, and immediately actionable.</p>
                    </div>
                    <div class="transform transition-transform duration-500 hover:translate-x-4">
                        <h4 class="text-2xl font-display font-black mb-2 uppercase tracking-wide">Elite Enterprise Stack</h4>
                        <p class="font-body font-medium text-white/90 leading-relaxed text-lg">Next.js, React, Custom LLMs. We leverage the exact mathematical technologies utilized by unicorns.</p>
                    </div>
                </div>
            </div>
        </div>
        
    </section>

    <!-- CUSTOM GSAP ENGINE FOR ABOUT PAGE -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.warn("GSAP fully loaded check failed, skipping animations.");
                return;
            }
            
            gsap.registerPlugin(ScrollTrigger);

            // 1. HERO ANIMATION (Plays immediately)
            const heroTl = gsap.timeline();
            heroTl.to("#hero-glow", { opacity: 1, duration: 2, ease: "power2.out" }, 0.2)
                  .to(".hero-badge", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5)
                  .to(".hero-title", { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }, 0.7)
                  .to(".hero-scroll", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 1.5);

            // 2. MISSION SCROLL PIN
            const missionText = document.querySelector('.mission-text');
            if(missionText) {
                // We split the text visually by coloring it, but easiest cinematic trick:
                // Scrub the opacity and scale of the element while pinned.
                const missionTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".mission-wrapper",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                        pin: ".mission-pin",
                        // markers: false // Set to true to debug
                    }
                });
                
                // Dim the background
                missionTl.to("#mission-bg", { opacity: 1, duration: 1 }, 0)
                // The text fades in, scales slightly
                .fromTo(missionText, { opacity: 0.1, scale: 0.95 }, { opacity: 1, scale: 1, duration: 3 }, 0)
                // Hold for a moment
                .to(missionText, { opacity: 1, duration: 2 })
                // Fade out before leaving
                .to(missionText, { opacity: 0, scale: 1.05, duration: 2 });
            }

            // 3. STAGGER GRID ENTRANCES
            const staggerGroups = gsap.utils.toArray('.gsap-stagger-group');
            staggerGroups.forEach(group => {
                const items = group.querySelectorAll('.gsap-stagger-item');
                if(items.length > 0) {
                    gsap.fromTo(items, 
                        { y: 100, opacity: 0 },
                        {
                            scrollTrigger: {
                                trigger: group,
                                start: "top 85%"
                            },
                            y: 0,
                            opacity: 1,
                            duration: 1.2,
                            stagger: 0.15,
                            ease: "expo.out"
                        }
                    );
                }
            });
        });
    </script>

"""

new_content = header + "\n" + new_main + "\n\n" + footer_block + closing_tags

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("about.html rewritten with ultra-premium cinematic logic and true bento grids.")
