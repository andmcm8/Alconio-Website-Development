import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

TARGET_FILES = [
    ("dashboard_overview.html", "dashboard_overview.html"),
    ("dashboard_analytics.html", "dashboard_analytics.html"),
    ("dashboard_performance.html", "dashboard_performance.html"),
    ("dashboard_activity_log.html", "dashboard_activity_log.html"),
    ("dashboard_resources.html", "dashboard_resources.html"),
    ("dashboard_settings.html", "dashboard_settings.html"),
    ("dashboard_sidebar.html", "dashboard_sidebar.html")
]

# The key insight: In condensed mode (w-20), the link elements have `w-full` which makes them
# span the full 80px width. But the icons are left-padded with `pl-5` (20px).
# This means the box extends beyond the icon on the right side.
# To center the box around the icon in condensed mode, we need to:
#   - In condensed: use w-12 h-12 justify-center (no pl-5) so the box wraps tightly around the icon
#   - In expanded: use w-full justify-start pl-5 so the text shows up properly
# BUT the user said "do not move the icons, move the boxes". And switching from pl-5 to justify-center
# WILL move the icon slightly. So instead, we should keep the icon at the same position and just
# make the CLICKABLE AREA (the <a> tag) a square centered around the icon.
#
# Actually the simplest fix: In condensed mode, the nav items should NOT be w-full. They should be
# w-12 h-12 centered. And when expanded, they go to w-full. The JS already does w-12 <-> w-full.
# The problem is that in the DEFAULT HTML, they are w-full (because the script sets them that way).
# We need to change the default to NOT have w-full, and instead center them.
# 
# Wait, looking at the current HTML: the links have class "w-full" and "justify-start pl-5".
# In condensed mode, this means the 80px-wide sidebar has links that are 80px wide but with
# left padding of 20px, so the icon sits at x=20... but the box stretches to x=80.
# The FIX in condensed mode: remove w-full, set w-12, remove pl-5, set justify-center.
# In expanded mode: add w-full, set pl-5, set justify-start.
# The JS needs to swap between these. But the user says "don't move the icons". 
# Actually, the icons WILL stay at the same visual position if we just center them in w-12 boxes
# because w-12 = 48px centered in w-20 = 80px means icon is at ~40px center. With pl-5 (20px) 
# + icon width ~24px, icon center is at ~32px. These differ.
# 
# Better approach: Use a FIXED left margin. Set ml-4 (16px) on the link in condensed mode,
# w-12, h-12, justify-center. This places the icon center at 16 + 24 = 40px which is the center of w-20.
# Actually simplest: just use items-center on the nav and remove pl-5, use justify-center on the link.
# The nav has items-start. Change to items-center so the w-12 blocks are centered in the 80px sidebar.

def make_sidebar(active_href=None):
    def linkItem(href, icon, label):
        is_active = (href == active_href)
        # Default state is CONDENSED: w-12 h-12 justify-center (no padding)
        base_classes = "nav-link-btn flex items-center justify-center w-12 h-12 rounded-lg group transition-all duration-300 relative"
        if is_active:
            classes = f"{base_classes} active-nav-item"
            icon_classes = "text-electric-blue neon-text-blue text-2xl nav-icon flex-shrink-0"
        else:
            classes = f"{base_classes} hover:bg-white/5 hover:text-white text-slate-400"
            icon_classes = "group-hover:text-electric-blue transition-colors text-2xl nav-icon flex-shrink-0"
            
        return f"""<a class="{classes}" href="{href}" data-tooltip="{label}">
<span class="material-symbols-outlined {icon_classes}">{icon}</span>
<span class="md-label hidden text-sm font-medium tracking-wide transition-opacity duration-300 ml-4 whitespace-nowrap">{label}</span>
</a>"""

    return f"""<aside class="dashboard-sidebar relative z-50 w-20 h-full glass-panel flex flex-col border-r-0 hidden md:flex shrink-0 items-center transition-all duration-300">
<div class="sidebar-header-area px-0 w-full flex justify-end pr-4 shrink-0 transition-all duration-300">
<div class="header-inner flex items-center justify-end w-full h-full gap-4 transition-all duration-300">
<h1 class="logo-text text-2xl font-bold tracking-tight text-white neon-text-blue transition-all duration-300" style="letter-spacing: -0.02em;">A</h1>
<button class="side-bar-toggle w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group">
<span class="toggle-icon material-symbols-outlined text-sm group-hover:text-electric-blue transition-colors">start</span>
</button>
</div>
</div>
<nav class="flex-1 px-2 space-y-1 relative z-10 pt-6 w-full flex flex-col items-center overflow-x-hidden sidebar-scroll-hide transition-all duration-300">
{linkItem("dashboard_overview.html", "dashboard", "Overview")}
{linkItem("dashboard_analytics.html", "pie_chart", "Analytics")}
{linkItem("dashboard_performance.html", "trending_up", "Performance")}
{linkItem("dashboard_activity_log.html", "schedule", "Activity Log")}
{linkItem("dashboard_resources.html", "folder_open", "Resources")}
{linkItem("dashboard_settings.html", "settings", "Settings")}
</nav>
<div class="sidebar-footer-area p-4 relative z-10 border-t border-white/5 w-full flex justify-center mb-4 transition-all duration-300">
<button class="logout-btn w-12 h-12 flex items-center justify-center bg-gradient-to-r from-electric-blue to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-[0_0_25px_rgba(0,82,255,0.4)] border border-white/10 transition-all transform active:scale-95 group relative" data-tooltip="Logout">
<span class="material-symbols-outlined text-lg group-hover:animate-pulse flex-shrink-0">logout</span>
<span class="md-label hidden font-bold text-sm tracking-wide ml-3 transition-opacity whitespace-nowrap">Logout</span>
</button>
</div>
</aside>"""

for (filename, active_href) in TARGET_FILES:
    filepath = os.path.join(curr_dir, filename)
    if not os.path.exists(filepath):
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip the entire <aside> block
    aside_pattern = re.compile(r'<aside[^>]*>.*?</aside>', re.DOTALL)
    if aside_pattern.search(content):
        new_aside = make_sidebar(active_href)
        content = aside_pattern.sub(new_aside, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed sidebar DOM in: {filename}")

# Fix the settings page input backgrounds
settings_path = os.path.join(curr_dir, "dashboard_settings.html")
if os.path.exists(settings_path):
    with open(settings_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The .sharp-input class currently has `background: rgba(0, 0, 0, 0.4)` which should be dark.
    # But the Tailwind forms plugin might be overriding it with white backgrounds.
    # Let's add !important and also add inline styles to force dark backgrounds on inputs.
    # Actually, the issue is likely the Tailwind forms plugin resetting input backgrounds to white.
    # We need to override it in the <style> block.
    
    # Add a CSS override right before </style>
    override_css = """
        input.sharp-input, textarea.sharp-input, select.sharp-input {
            background-color: rgba(0, 0, 0, 0.6) !important;
            background: rgba(0, 0, 0, 0.6) !important;
            color: white !important;
        }
        input.sharp-input:focus, textarea.sharp-input:focus, select.sharp-input:focus {
            background-color: rgba(0, 0, 0, 0.8) !important;
            background: rgba(0, 0, 0, 0.8) !important;
        }
    """
    content = content.replace('</style>', override_css + '</style>')
    
    with open(settings_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed settings page input backgrounds.")

print("Done.")
