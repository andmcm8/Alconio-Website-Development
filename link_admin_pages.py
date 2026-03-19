import os
import re

# Dictionary mapping identifying keyword to filename
admin_files = {
    'grid_view': 'dashboard_admin.html',
    'person_add': 'dashboard_admin_onboarding.html',
    'payments': 'dashboard_admin_billing.html',
    'monitoring': 'dashboard_admin_analytics.html',
    'speed': 'dashboard_admin_performance.html',
    'history': 'dashboard_admin_activity.html',
    'admin_panel_settings': 'dashboard_admin_settings.html'
}

for icon_key, current_file in admin_files.items():
    if not os.path.exists(current_file):
        continue
        
    with open(current_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Step 1: Inject the correct href links into the <a> tags using their inner icons as identifiers.
    # We find an <a> tag that contains the specific icon string, and we replace its href="#" or href="..." with the actual filename.
    
    for target_icon, target_file in admin_files.items():
        # Regex to find an anchor tag that has the target_icon inside its span
        # e.g.: <a href="#" ...><span class="material-symbols-outlined...">target_icon</span>...</a>
        
        pattern = re.compile(
            r'(<a[^>]*?href=")([^"]*)("[^>]*?nav-link-btn[^>]*?>\s*<span[^>]*class="material-symbols-outlined[^>]*>\s*' + re.escape(target_icon) + r'\s*</span>)',
            re.DOTALL
        )
        
        html = pattern.sub(r'\g<1>' + target_file + r'\g<3>', html)

    # Step 2: Set the active state correctly for the current file
    # First, strip active state from ALL nav-link-btns
    html = re.sub(
        r'(<a[^>]*nav-link-btn[^>]*?)active-nav-item([^>]*>)',
        r'\1\2',
        html
    )
    
    # We must also ensure they all have hover:bg-white/5 hover:text-white text-slate-400 as default
    # This is tricky with regex, simpler is to do a global replacement of the active styles
    html = html.replace('bg-gradient-to-br from-electric-blue/20 to-electric-blue/5 border border-electric-blue/30 text-electric-blue shadow-[0_0_15px_rgba(0,82,255,0.2)]', 'hover:bg-white/5 hover:text-white text-slate-400 border border-transparent')
    html = html.replace('text-electric-blue', 'text-slate-400')  # General safety reset for nav icons

    # Now specifically target the <a> tag for THIS file and make it active
    pattern_active = re.compile(
        r'(<a[^>]*?href="' + re.escape(current_file) + r'"[^>]*?nav-link-btn[^>]*?)(hover:bg-white/5 hover:text-white text-slate-400 border border-transparent)([^>]*?>)',
        re.DOTALL
    )
    active_classes = 'active-nav-item bg-gradient-to-br from-electric-blue/20 to-electric-blue/5 border border-electric-blue/30 text-electric-blue shadow-[0_0_15px_rgba(0,82,255,0.2)]'
    
    html = pattern_active.sub(r'\1' + active_classes + r'\3', html)
    
    # ensure icon itself is highlighted inside the active
    pattern_active_icon = re.compile(
        r'(<a[^>]*?active-nav-item[^>]*?>\s*<span[^>]*class="material-symbols-outlined[^>]*?)(text-slate-400)([^>]*>\s*' + re.escape(icon_key) + r'\s*</span>)',
        re.DOTALL
    )
    html = pattern_active_icon.sub(r'\1text-electric-blue\3', html)

    with open(current_file, 'w', encoding='utf-8') as f:
        f.write(html)
        
print("Sidebar linking applied.")
