import glob
import re

html_files = glob.glob('*.html')

new_footer = """<!-- ═══════════════════════════════════════════════════════════════
         SUPER PROFESSIONAL FOOTER
         ═══════════════════════════════════════════════════════════════ -->
    <footer class="bg-[#02010A] pt-24 pb-12 px-6 border-t border-white/5 relative z-10 overflow-hidden font-display">
        <!-- Subtle Glow Background -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto w-[95%]">
            <!-- Main Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 relative z-10 mt-6">
                
                <!-- Brand Pillar -->
                <div class="col-span-1">
                    <div class="flex items-center gap-3 mb-8">
                        <img src="logo.png" alt="Alconio Logo" class="h-8 w-auto" />
                        <h2 class="text-xl font-black tracking-tight text-white font-display">ALCONIO</h2>
                    </div>
                    <p class="text-slate-500 text-sm leading-relaxed mb-8 font-light">
                        Architecting digital excellence. We engineer high-performance web environments and autonomous AI protocols.
                    </p>
                    
                    <!-- Social Links -->
                    <div class="flex gap-4">
                        <!-- Twitter/X -->
                        <a href="https://twitter.com/alconio" target="_blank" class="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group shadow-lg">
                            <svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 256 209" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                <path d="M256 25.45c-9.42 4.177-19.542 7-30.166 8.27 10.845-6.5 19.172-16.793 23.093-29.057a105.183 105.183 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52 0 4.117.465 8.125 1.36 11.97-43.65-2.191-82.35-23.1-108.255-54.876-4.52 7.757-7.11 16.78-7.11 26.404 0 18.222 9.273 34.297 23.365 43.716a52.312 52.312 0 0 1-23.79-6.57c-.003.22-.003.44-.003.661 0 25.447 18.104 46.675 42.13 51.5a52.592 52.592 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475-17.975 14.086-40.622 22.483-65.228 22.483-4.24 0-8.42-.249-12.529-.734 23.243 14.902 50.85 23.597 80.51 23.597 96.607 0 149.434-80.031 149.434-149.435 0-2.278-.05-4.543-.152-6.795A106.748 106.748 0 0 0 256 25.45" fill="currentColor"/>
                            </svg>
                        </a>
                        <!-- LinkedIn -->
                        <a href="https://linkedin.com/company/alconio" target="_blank" class="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group shadow-lg">
                            <svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256">
                                <path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="currentColor"/>
                            </svg>
                        </a>
                        <!-- GitHub -->
                        <a href="https://github.com/alconio" target="_blank" class="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group shadow-lg">
                            <svg class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Architecture Links -->
                <div class="col-span-1 md:pl-8">
                    <h4 class="font-bold mb-8 text-white uppercase text-[10px] tracking-widest opacity-80">Our Architecture</h4>
                    <ul class="space-y-4 text-slate-500 text-sm font-medium">
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="services.html">Design Lab</a></li>
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="services.html">Engineering</a></li>
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="services.html">AI Protocol</a></li>
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="pricing.html">System Tiers</a></li>
                    </ul>
                </div>

                <!-- Ecosystem Links -->
                <div class="col-span-1">
                    <h4 class="font-bold mb-8 text-white uppercase text-[10px] tracking-widest opacity-80">Ecosystem</h4>
                    <ul class="space-y-4 text-slate-500 text-sm font-medium">
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="about.html">The Mission</a></li>
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="our-work.html">Project Showcase</a></li>
                        <li><a class="hover:text-white hover:translate-x-1 transition-transform inline-block" href="schedule.html">Schedule Audit</a></li>
                        <li>
                            <a class="hover:text-white hover:translate-x-1 transition-transform inline-flex items-center gap-2" href="dashboard_signin.html">
                                Client Portal 
                                <span class="px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/30 text-[8px] font-bold uppercase tracking-widest">Active</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Connection/Contact -->
                <div class="col-span-1">
                    <h4 class="font-bold mb-8 text-white uppercase text-[10px] tracking-widest opacity-80">Secure Channel</h4>
                    <p class="text-xs text-slate-500 mb-6 leading-relaxed font-light">System inquiries and direct architectural consultations.</p>
                    <a href="mailto:hello@alconio.com" class="text-white font-medium hover:text-primary transition-colors block mb-2">hello@alconio.com</a>
                    <p class="text-slate-400 text-sm mb-6">(475) 215-1350</p>
                    <a href="get-started.html" class="inline-flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-[0.2em] hover:text-white transition-colors group">
                        Initialize Project 
                        <span class="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </a>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-bold text-slate-600 tracking-[0.2em] relative z-10">
                <p class="mb-4 md:mb-0 text-center md:text-left">© 2026 Alconio Core. All systems operational.</p>
                <div class="flex gap-8">
                    <a class="hover:text-white transition-colors" href="#">Privacy Protocol</a>
                    <a class="hover:text-white transition-colors" href="#">Terms of Architecture</a>
                </div>
            </div>
        </div>
    </footer>"""

for file in html_files:
    # Only touch files that already have a footer and aren't dashboard files strictly (dashboard usually has unique shells, but if it has <footer id might replace. Actually dashboard files have <footer>? No, dashboard files usually have sidebars)
    # The grep only found services, pricing, about, our-work, index, booking-success.
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<footer' in content and '</body>' in content:
        # Replace everything from <footer to </footer>
        new_content = re.sub(r'<footer.*?</footer>', new_footer, content, flags=re.DOTALL)
        
        # If it wasn't replaced or something went wrong, let's keep it safe. 
        # Actually some files might have multiple footers? No standard website layout has multiple footers.
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                print(f"Updated footer in {file}")

print("Footer update complete.")
