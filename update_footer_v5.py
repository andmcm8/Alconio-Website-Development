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
                    <h2 class="text-white text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-8">
                        Let's Build Your<br/>Digital Future. With Us.
                    </h2>
                    <a href="get-started.html" class="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-transform hover:scale-105 hover:bg-gray-200 mb-14">
                        Initialize Project <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>

                    <h5 class="text-[#1E51FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Or Contact Us At</h5>
                    <div class="flex flex-col sm:flex-row gap-4 items-start">
                        <button class="flex items-center gap-4 bg-transparent border border-white/20 hover:border-[#1E51FF] transition-colors rounded-full px-6 py-3 text-white text-sm relative group" onclick="navigator.clipboard.writeText('hello@alconio.com'); const icon = this.querySelector('span'); const original = icon.innerText; icon.innerText = 'check'; setTimeout(() => icon.innerText = original, 2000);">
                            hello@alconio.com 
                            <span class="material-symbols-outlined text-[16px] text-white/50 group-hover:text-white transition-all">content_copy</span>
                        </button>
                        <button class="flex items-center gap-4 bg-transparent border border-white/20 hover:border-[#1E51FF] transition-colors rounded-full px-6 py-3 text-white text-sm relative group" onclick="navigator.clipboard.writeText('(475) 215-1350'); const icon = this.querySelector('span'); const original = icon.innerText; icon.innerText = 'check'; setTimeout(() => icon.innerText = original, 2000);">
                            (475) 215-1350 
                            <span class="material-symbols-outlined text-[16px] text-white/50 group-hover:text-white transition-all">content_copy</span>
                        </button>
                    </div>
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
                <div class="flex gap-4 text-white">
                    <!-- Twitter/X -->
                    <a href="https://twitter.com/alconiowebservices" target="_blank" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 256 209"><path d="M256 25.45c-9.42 4.177-19.542 7-30.166 8.27 10.845-6.5 19.172-16.793 23.093-29.057a105.183 105.183 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52 0 4.117.465 8.125 1.36 11.97-43.65-2.191-82.35-23.1-108.255-54.876-4.52 7.757-7.11 16.78-7.11 26.404 0 18.222 9.273 34.297 23.365 43.716a52.312 52.312 0 0 1-23.79-6.57c-.003.22-.003.44-.003.661 0 25.447 18.104 46.675 42.13 51.5a52.592 52.592 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475-17.975 14.086-40.622 22.483-65.228 22.483-4.24 0-8.42-.249-12.529-.734 23.243 14.902 50.85 23.597 80.51 23.597 96.607 0 149.434-80.031 149.434-149.435 0-2.278-.05-4.543-.152-6.795A106.748 106.748 0 0 0 256 25.45"/></svg></a>
                    <!-- Instagram -->
                    <a href="https://www.instagram.com/alconiowebservices/" target="_blank" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.173.055 1.805.249 2.227.415.562.217.96.477 1.382.896.42.42.68.819.897 1.381.166.422.36 1.057.414 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.173-.249 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.42.42-.819.68-1.381.897-.422.166-1.057.36-2.227.414-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.173-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.896-.42-.42-.68-.819-.897-1.381-.166-.422-.36-1.057-.414-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.055-1.173.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.42.819-.68 1.381-.897.422-.166 1.057-.36 2.227-.414 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.277.06-2.148.262-2.913.558-.788.306-1.459.717-2.126 1.384-.666.667-1.079 1.335-1.384 2.126-.296.765-.499 1.636-.558 2.913-.06 1.28-.072 1.687-.072 4.947s.014 3.667.072 4.947c.06 1.277.262 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.667 1.335 1.079 2.126 1.384.765.296 1.636.499 2.913.558 1.28.06 1.687.072 4.947.072s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.717 2.126-1.384.667-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.788-.717-1.459-1.384-2.126-.667-.667-1.335-1.079-2.126-1.384-.765-.296-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/><circle cx="18.406" cy="5.594" r="1.44"/></svg></a>
                    <!-- LinkedIn -->
                    <a href="https://linkedin.com/company/alconiowebservices" target="_blank" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"/></svg></a>
                    <!-- TikTok -->
                    <a href="https://www.tiktok.com/@alconiowebservices" target="_blank" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 352.28 398.67"><path d="M137.17 156.98v-15.56c-5.34-.73-10.76-1.18-16.29-1.18C54.23 140.24 0 194.47 0 261.13c0 40.9 20.43 77.09 51.61 98.97-20.12-21.6-32.46-50.53-32.46-82.31 0-65.7 52.69-119.28 118.03-120.81Z"/><path d="M140.02 333c29.74 0 54-23.66 55.1-53.13l.11-263.2h48.08c-1-5.41-1.55-10.97-1.55-16.67h-65.67l-.11 263.2c-1.1 29.47-25.36 53.13-55.1 53.13-9.24 0-17.95-2.31-25.61-6.34C105.3 323.9 121.6 333 140.02 333ZM333.13 106V91.37c-18.34 0-35.43-5.45-49.76-14.8 12.76 14.65 30.09 25.22 49.76 29.43Z"/><path d="M283.38 76.57c-13.98-16.05-22.47-37-22.47-59.91h-17.59c4.63 25.02 19.48 46.49 40.06 59.91ZM120.88 205.92c-30.44 0-55.21 24.77-55.21 55.21 0 21.2 12.03 39.62 29.6 48.86-6.55-9.08-10.45-20.18-10.45-32.2 0-30.44 24.77-55.21 55.21-55.21 5.68 0 11.13.94 16.29 2.55v-67.05c-5.34-.73-10.76-1.18-16.29-1.18-.96 0-1.9.05-2.85.07v51.49c-5.16-1.61-10.61-2.55-16.29-2.55Z"/><path d="M333.13 106v51.04c-34.05 0-65.61-10.89-91.37-29.38v133.47c0 66.66-54.23 120.88-120.88 120.88-25.76 0-49.64-8.12-69.28-21.91 22.08 23.71 53.54 38.57 88.42 38.57 66.66 0 120.88-54.23 120.88-120.88V144.33c25.76 18.49 57.32 29.38 91.37 29.38v-65.68c-6.57 0-12.97-.71-19.14-2.03Z"/><path d="M241.76 261.13V127.66c25.76 18.49 57.32 29.38 91.37 29.38V106c-19.67-4.21-37-14.77-49.76-29.43-20.58-13.42-35.43-34.88-40.06-59.91h-48.08l-.11 263.2c-1.1 29.47-25.36 53.13-55.1 53.13-18.42 0-34.72-9.1-44.75-23.01-17.57-9.25-29.6-27.67-29.6-48.86 0-30.44 24.77-55.21 55.21-55.21 5.68 0 11.13.94 16.29 2.55v-51.49C71.83 158.5 19.14 212.08 19.14 277.78c0 31.78 12.34 60.71 32.46 82.31C71.23 373.87 95.12 382 120.88 382c66.65 0 120.88-54.23 120.88-120.88Z"/></svg></a>
                </div>
            </div>
        </div>
    </footer>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<!-- ═══════════════════════════════════════════════════════════════\n         TYPOGRAPHY FOOTER' in content:
        new_content = re.sub(r'<!-- ═══════════════════════════════════════════════════════════════\s*TYPOGRAPHY FOOTER.*?</footer>', new_footer, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                print(f"Updated footer with hollow instagram and interactive buttons in {file}")

print("V5 script complete.")
