import os
import re
import shutil

# Target HTML pages
admin_pages = {
    'dashboard_admin_onboarding.html': {'id': 'nav-admin-onboarding', 'title': 'Onboarding Wizard', 'icon': 'person_add'},
    'dashboard_admin_billing.html': {'id': 'nav-admin-billing', 'title': 'Billing & Revenue', 'icon': 'payments'},
    'dashboard_admin_analytics.html': {'id': 'nav-admin-analytics', 'title': 'Global Analytics', 'icon': 'monitoring'},
    'dashboard_admin_performance.html': {'id': 'nav-admin-performance', 'title': 'Systems & Vitals', 'icon': 'speed'},
    'dashboard_admin_activity.html': {'id': 'nav-admin-activity', 'title': 'Global Activity Log', 'icon': 'history'},
    'dashboard_admin_settings.html': {'id': 'nav-admin-settings', 'title': 'Admin Settings', 'icon': 'admin_panel_settings'},
}

# Source template (the main admin dashboard we just built)
base_file = 'dashboard_admin.html'

if not os.path.exists(base_file):
    print(f"Error: {base_file} not found.")
    exit(1)

with open(base_file, 'r', encoding='utf-8') as f:
    base_html = f.read()

# Shared Sidebar Navigation logic (updating active states later)
# First, let's update dashboard_admin.html itself to link to these pages correctly, if not already

all_admin_files = ['dashboard_admin.html'] + list(admin_pages.keys())

for filename in admin_pages:
    page_data = admin_pages[filename]
    page_title = page_data['title']
    page_icon = page_data['icon']
    
    # 1. Update the document title
    new_html = re.sub(
        r'<title>Alconio Dashboard - Admin Control Panel</title>',
        f'<title>Alconio Admin - {page_title}</title>',
        base_html
    )

    # 2. Update the main header title
    new_html = re.sub(
        r'<h1 class="text-3xl font-bold text-white tracking-tight mb-1 glow-text">Admin Control Panel</h1>',
        f'<h1 class="text-3xl font-bold text-white tracking-tight mb-1 glow-text">{page_title}</h1>',
        new_html
    )

    # 3. Replace the entire content area with a placeholder block
    # Find the main container `<main class="p-8">` down to `</main>`
    main_content_pattern = re.compile(r'<main class="p-8">.*?</main>', re.DOTALL)
    
    placeholder_content = f'''
            <!-- Scrollable Content Area -->
            <main class="p-8">
                <!-- Header -->
                <div class="flex justify-between items-end mb-8 relative z-10">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="px-2 py-1 rounded bg-electric-blue/10 text-electric-blue text-[10px] font-bold tracking-wider border border-electric-blue/20">ALCONIO HQ</span>
                            <span class="text-xs text-slate-500 font-medium">Administration</span>
                        </div>
                        <h1 class="text-3xl font-bold text-white tracking-tight mb-1 glow-text">{page_title}</h1>
                        <p class="text-slate-400 text-sm">Manage global {page_title.lower()} settings and data.</p>
                    </div>
                </div>
                
                <div class="glass-card p-12 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div class="w-16 h-16 rounded-full bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,82,255,0.15)]">
                        <span class="material-symbols-outlined text-electric-blue text-3xl">{page_icon}</span>
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-2">{page_title} Section</h2>
                    <p class="text-slate-400 max-w-lg mx-auto mb-8">This section of the admin panel is currently under construction. Please check back later for updates to the {page_title.lower()} view.</p>
                    <button class="px-6 py-3 rounded-lg bg-electric-blue hover:bg-electric-blue/90 text-white font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(0,82,255,0.3)]">
                        Return to Clients Hub
                    </button>
                </div>
            </main>
    '''
    
    new_html = main_content_pattern.sub(placeholder_content, new_html)

    # Save the new placeholder page
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Created {filename}")

print("Done creating boilerplate pages. Now applying sidebar linking.")
