import os
import re

# Dictionary mapping identifying icon to filename
admin_files = [
    ('group', 'dashboard_admin.html'),
    ('person_add', 'dashboard_admin_onboarding.html'),
    ('payments', 'dashboard_admin_billing.html'),
    ('monitoring', 'dashboard_admin_analytics.html'),
    ('speed', 'dashboard_admin_performance.html'),
    ('history', 'dashboard_admin_activity.html'),
    ('admin_panel_settings', 'dashboard_admin_settings.html')
]

all_files = [f[1] for f in admin_files]

for current_file in all_files:
    if not os.path.exists(current_file):
        continue
        
    with open(current_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update all links
    for icon_key, target_file in admin_files:
        # Find the anchor that contains the specific material icon span
        # <a ...><span ...>icon_key</span>...</a>
        # This regex is more robust: it looks for an <a> tag that contains the icon_key inside a material-symbols span
        pattern = re.compile(
            r'<a([^>]*?)href="[^"]*?"([^>]*?>\s*<span[^>]*?>\s*' + re.escape(icon_key) + r'\s*</span>)',
            re.DOTALL
        )
        html = pattern.sub(f'<a\\1href="{target_file}"\\2', html)

    # 2. Reset active states
    html = re.sub(r'active-nav-item', '', html)
    # Reset specific background/border/shadow classes that might have been added by previous runs
    html = re.sub(r'bg-gradient-to-br from-electric-blue/20 to-electric-blue/5 border border-electric-blue/30 text-electric-blue shadow-\[0_0_15px_rgba\(0,82,255,0.2\)\]', '', html)
    
    # Ensure background/text defaults for non-active
    # We want to replace the class lists or ensure they have the hover state
    # But first, let's find the specific <a> tag for the CURRENT file and make it active
    
    # Identify the correct icon for the current file
    current_icon = [f[0] for f in admin_files if f[1] == current_file][0]
    
    # Find the tag with current_file href
    active_pattern = re.compile(
        r'(<a[^>]*?href="' + re.escape(current_file) + r'"[^>]*?>)',
        re.DOTALL
    )
    
    active_styles = 'active-nav-item bg-gradient-to-br from-electric-blue/20 to-electric-blue/5 border border-electric-blue/30 text-electric-blue shadow-[0_0_15px_rgba(0,82,255,0.2)]'
    
    # Insert the active styles into the class attribute
    def add_active_class(match):
        tag = match.group(1)
        if 'class="' in tag:
            # Add to existing class attribute
            return tag.replace('class="', f'class="{active_styles} ')
        else:
            # Add class attribute
            return tag.replace('<a', f'<a class="{active_styles}"')
            
    html = active_pattern.sub(add_active_class, html)
    
    # Highlight the icon too
    icon_highlight_pattern = re.compile(
        r'(<a[^>]*?active-nav-item[^>]*?>\s*<span[^>]*class="material-symbols-outlined)([^"]*)("[^>]*>\s*' + re.escape(current_icon) + r'\s*</span>)',
        re.DOTALL
    )
    html = icon_highlight_pattern.sub(r'\1\2 neon-text-blue text-electric-blue\3', html)

    with open(current_file, 'w', encoding='utf-8') as f:
        f.write(html)
        
print("Sidebar links fixed.")
