import glob
import re

html_files = glob.glob('*.html')

new_footer = """<!-- ═══════════════════════════════════════════════════════════════
         TYPOGRAPHY FOOTER
         ═══════════════════════════════════════════════════════════════ -->
    <footer class="bg-[#02010A] pt-24 pb-12 px-6 font-display border-t border-white/5 relative z-10">
        <div class="max-w-7xl mx-auto w-[95%]">
            
            <!-- Top Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
                
                <!-- Left Column (Contact & Vision) - takes up 5 cols -->
                <div class="lg:col-span-5">
                    <h5 class="text-[#1E51FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Contact Us</h5>
                    <h2 class="text-white text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-8">
                        Let's Build Your<br/>Digital Future. With Us.
                    </h2>
                    <a href="get-started.html" class="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-transform hover:scale-105 hover:bg-gray-200 mb-14">
                        Initialize Project <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>

                    <h5 class="text-[#1E51FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Or Email Us At</h5>
                    <button class="flex items-center gap-4 bg-transparent border border-white/20 hover:border-[#1E51FF] transition-colors rounded-full px-6 py-3 text-white text-sm relative group" onclick="navigator.clipboard.writeText('hello@alconio.com');">
                        hello@alconio.com 
                        <span class="material-symbols-outlined text-[16px] text-white/50 group-hover:text-white">content_copy</span>
                    </button>
                </div>

                <!-- Spacer -->
                <div class="hidden lg:block lg:col-span-3"></div>

                <!-- Middle Column (Quick Links) - takes up 2 cols -->
                <div class="lg:col-span-2">
                    <h5 class="text-[#1E51FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Quick Links</h5>
                    <ul class="flex flex-col gap-4 text-white/70 text-sm font-medium">
                        <li><a href="index.html" class="hover:text-white transition-colors">Home</a></li>
                        <li><a href="services.html" class="hover:text-white transition-colors">Services</a></li>
                        <li><a href="our-work.html" class="hover:text-white transition-colors">Our Work</a></li>
                        <li><a href="about.html" class="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="pricing.html" class="hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="dashboard_signin.html" class="hover:text-white transition-colors flex items-center gap-2">Client Dashboard <span class="size-1.5 rounded-full bg-[#1E51FF] animate-pulse"></span></a></li>
                        <li><a href="get-started.html" class="hover:text-white transition-colors">Get Started</a></li>
                    </ul>
                </div>

                <!-- Right Column (Information) - takes up 2 cols -->
                <div class="lg:col-span-2">
                    <h5 class="text-[#1E51FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Information</h5>
                    <ul class="flex flex-col gap-4 text-white/70 text-sm font-medium">
                        <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Cookies Settings</a></li>
                    </ul>
                </div>
            </div>

            <!-- Divider Line -->
            <div class="w-full h-px bg-white/10 mb-8"></div>

            <!-- Bottom Section -->
            <div class="flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-[0.2em]">
                <p class="text-[#1E51FF]/80 mb-6 md:mb-0">© 2026 Alconio Core. All rights reserved.</p>
                <div class="flex gap-5 text-white">
                    <!-- Facebook/Meta placeholder icon -->
                    <a href="#" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
                    <!-- Twitter/X -->
                    <a href="#" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg></a>
                    <!-- Instagram -->
                    <a href="#" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.69-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.85 3.92 2.31 7.15 2.23c1.27-.06 1.64-.07 4.85-.07m0-2.16C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.63 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.63 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.63-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm5.8-9.35a1.44 1.44 0 1 0-2.88 0 1.44 1.44 0 0 0 2.88 0z"/></svg></a>
                    <!-- LinkedIn -->
                    <a href="#" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                </div>
            </div>
        </div>
    </footer>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<!-- ═══════════════════════════════════════════════════════════════\n         TYPOGRAPHY FOOTER' in content:
        # We can just replace using regex
        new_content = re.sub(r'<!-- ═══════════════════════════════════════════════════════════════\s*TYPOGRAPHY FOOTER.*?</footer>', new_footer, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                print(f"Updated links in {file}")

print("V3 link updates complete.")
