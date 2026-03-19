import os
import re

admin_pages = {
    'dashboard_admin_onboarding.html': {'title': 'Onboarding Wizard', 'icon': 'person_add'},
    'dashboard_admin_billing.html': {'title': 'Billing & Revenue', 'icon': 'payments'},
    'dashboard_admin_analytics.html': {'title': 'Global Analytics', 'icon': 'monitoring'},
    'dashboard_admin_performance.html': {'title': 'Systems & Vitals', 'icon': 'speed'},
    'dashboard_admin_activity.html': {'title': 'Global Activity Log', 'icon': 'history'},
    'dashboard_admin_settings.html': {'title': 'Admin Settings', 'icon': 'admin_panel_settings'},
}

base_file = 'dashboard_admin.html'

with open(base_file, 'r', encoding='utf-8') as f:
    base_html = f.read()

# Pattern for the main content area
# From my view_file: <main class="flex-1 overflow-y-auto h-full p-4 md:p-6 scroll-smooth">
main_pattern = re.compile(r'(<main[^>]*?class="[^"]*?p-4 md:p-6 scroll-smooth"[^>]*?>).*?(</main>)', re.DOTALL)

for filename, data in admin_pages.items():
    page_title = data['title']
    page_icon = data['icon']
    
    # 1. Update Title
    html = re.sub(r'<title>.*?</title>', f'<title>Alconio Admin - {page_title}</title>', base_html)
    
    # 2. Update Header Title
    # Looking for: <h2 ...>Admin Control Panel</h2>
    html = re.sub(r'<h2 class="text-xl font-bold text-white tracking-wide"[^>]*?>Admin Control Panel</h2>', 
                  f'<h2 class="text-xl font-bold text-white tracking-wide" style="text-shadow: 0 0 20px rgba(255,255,255,0.2);">{page_title}</h2>', 
                  html)
    
    # 3. Update Main Content
    placeholder = f'''\g<1>
                <div class="max-w-[1600px] mx-auto flex flex-col gap-6">
                    <div class="glass-card p-24 text-center rounded-2xl border border-white/5 bg-white/[0.02] mt-12">
                        <div class="w-20 h-20 rounded-full bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,82,255,0.2)]">
                            <span class="material-symbols-outlined text-electric-blue text-4xl">{page_icon}</span>
                        </div>
                        <h2 class="text-3xl font-bold text-white mb-3 glow-text">{page_title}</h2>
                        <p class="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">This module is currently being optimized for high-performance data processing. Global {page_title.lower()} orchestration will be live shortly.</p>
                        <div class="flex flex-col items-center gap-4">
                            <div class="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Back-end Services Operational
                            </div>
                            <a href="dashboard_admin.html" class="px-8 py-3.5 rounded-xl bg-electric-blue hover:bg-electric-blue-light text-white font-bold tracking-wide transition-all shadow-[0_0_25px_rgba(0,82,255,0.4)] flex items-center gap-3 active:scale-95 group">
                                <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                Return to Clients Hub
                            </a>
                        </div>
                    </div>
                </div>
            \g<2>'''
    
    html = main_pattern.sub(placeholder, html)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Refixed {filename}")

