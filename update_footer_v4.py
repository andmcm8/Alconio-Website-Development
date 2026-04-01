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
                        <button class="flex items-center gap-4 bg-transparent border border-white/20 hover:border-[#1E51FF] transition-colors rounded-full px-6 py-3 text-white text-sm relative group" onclick="navigator.clipboard.writeText('hello@alconio.com');">
                            hello@alconio.com 
                            <span class="material-symbols-outlined text-[16px] text-white/50 group-hover:text-white">content_copy</span>
                        </button>
                        <button class="flex items-center gap-4 bg-transparent border border-white/20 hover:border-[#1E51FF] transition-colors rounded-full px-6 py-3 text-white text-sm relative group" onclick="navigator.clipboard.writeText('4752151350');">
                            (475) 215-1350 
                            <span class="material-symbols-outlined text-[16px] text-white/50 group-hover:text-white">content_copy</span>
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
                    <a href="https://www.instagram.com/alconiowebservices/" target="_blank" class="hover:text-[#1E51FF] transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 264.583 264.583"><path d="M132.345 33.973c-26.716 0-30.07.117-40.563.594-10.472.48-17.62 2.136-23.876 4.567-6.47 2.51-11.958 5.87-17.426 11.335-5.472 5.464-8.834 10.948-11.354 17.412-2.44 6.252-4.1 13.397-4.57 23.858-.47 10.486-.593 13.838-.593 40.535 0 26.697.119 30.037.594 40.522.482 10.465 2.14 17.609 4.57 23.859 2.515 6.465 5.876 11.95 11.346 17.414 5.466 5.468 10.955 8.834 17.42 11.345 6.26 2.431 13.41 4.088 23.881 4.567 10.493.477 13.844.594 40.559.594 26.719 0 30.061-.117 40.555-.594 10.472-.48 17.63-2.136 23.888-4.567 6.468-2.51 11.948-5.877 17.414-11.345 5.472-5.464 8.834-10.949 11.354-17.412 2.419-6.252 4.079-13.398 4.57-23.858.472-10.486.595-13.828.595-40.525s-.123-30.047-.594-40.533c-.492-10.465-2.152-17.608-4.57-23.858-2.521-6.466-5.883-11.95-11.355-17.414-5.472-5.468-10.944-8.827-17.42-11.335-6.271-2.431-13.424-4.088-23.897-4.567-10.493-.477-13.834-.594-40.558-.594zm-8.825 17.715c2.62-.004 5.542 0 8.825 0 26.266 0 29.38.094 39.752.565 9.591.438 14.797 2.04 18.264 3.385 4.591 1.782 7.864 3.912 11.305 7.352 3.443 3.44 5.575 6.717 7.362 11.305 1.346 3.46 2.951 8.663 3.388 18.247.47 10.363.573 13.475.573 39.71 0 26.233-.102 29.346-.573 39.709-.44 9.584-2.042 14.786-3.388 18.247-1.783 4.587-3.919 7.854-7.362 11.292-3.443 3.441-6.712 5.57-11.305 7.352-3.463 1.352-8.673 2.95-18.264 3.388-10.37.47-13.486.573-39.752.573-26.268 0-29.38-.102-39.751-.573-9.592-.443-14.797-2.044-18.267-3.39-4.59-1.781-7.87-3.911-11.313-7.352-3.443-3.44-5.574-6.709-7.362-11.298-1.346-3.461-2.95-8.663-3.387-18.247-.472-10.363-.566-13.476-.566-39.726s.094-29.347.566-39.71c.438-9.584 2.04-14.786 3.387-18.25 1.783-4.588 3.919-7.865 7.362-11.305 3.443-3.441 6.722-5.57 11.313-7.357 3.468-1.351 8.675-2.949 18.267-3.389 9.075-.41 12.592-.532 30.926-.553zm61.337 16.322c-6.518 0-11.805 5.277-11.805 11.792 0 6.512 5.287 11.796 11.805 11.796 6.517 0 11.804-5.284 11.804-11.796 0-6.513-5.287-11.796-11.805-11.796zm-52.512 13.782c-27.9 0-50.519 22.603-50.519 50.482 0 27.879 22.62 50.471 50.52 50.471s50.51-22.592 50.51-50.471c0-27.879-22.613-50.482-50.513-50.482zm0 17.715c18.11 0 32.792 14.67 32.792 32.767 0 18.096-14.683 32.767-32.792 32.767-18.11 0-32.791-14.671-32.791-32.767 0-18.098 14.68-32.767 32.791-32.767z"/><path d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)"/></svg></a>
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
                print(f"Updated footer v4 in {file}")

print("V4 script complete.")
