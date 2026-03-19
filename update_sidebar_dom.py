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

def make_sidebar(active_href=None):
    def linkItem(href, icon, label):
        is_active = (href == active_href)
        # Instead of `justify-center`, we use `justify-start pl-5`. 
        # In expanded it stays exactly the same padding.
        base_classes = "nav-link-btn flex items-center justify-start pl-5 h-12 rounded-lg group transition-all duration-300 relative w-full"
        if is_active:
            classes = f"{base_classes} active-nav-item"
            icon_classes = "text-electric-blue neon-text-blue text-2xl nav-icon flex-shrink-0"
        else:
            classes = f"{base_classes} hover:bg-white/5 hover:text-white text-slate-400"
            icon_classes = "group-hover:text-electric-blue transition-colors text-2xl nav-icon flex-shrink-0"
            
        return f"""<a class="{classes}" href="{href}" data-tooltip="{label}">
<span class="material-symbols-outlined {icon_classes}">{icon}</span>
<span class="md-label hidden text-sm font-medium tracking-wide transition-opacity duration-300 ml-4">{label}</span>
</a>"""

    return f"""<aside class="dashboard-sidebar relative z-50 w-20 h-full glass-panel flex flex-col border-r-0 hidden md:flex shrink-0 transition-all duration-300">
<div class="sidebar-header-area px-0 w-full flex justify-end pr-4 shrink-0 transition-all duration-300">
<div class="header-inner flex items-center justify-end w-full h-full gap-4 transition-all duration-300">
<h1 class="logo-text text-2xl font-bold tracking-tight text-white neon-text-blue transition-all duration-300" style="letter-spacing: -0.02em;">A</h1>
<button class="side-bar-toggle w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group">
<span class="toggle-icon material-symbols-outlined text-sm group-hover:text-electric-blue transition-colors">start</span>
</button>
</div>
</div>
<nav class="flex-1 px-2 space-y-4 relative z-10 pt-6 w-full flex flex-col items-start overflow-x-hidden sidebar-scroll-hide transition-all duration-300">
{linkItem("dashboard_overview.html", "dashboard", "Overview")}
{linkItem("dashboard_analytics.html", "pie_chart", "Analytics")}
{linkItem("dashboard_performance.html", "trending_up", "Performance")}
{linkItem("dashboard_activity_log.html", "schedule", "Activity Log")}
{linkItem("dashboard_resources.html", "folder_open", "Resources")}
{linkItem("dashboard_settings.html", "settings", "Settings")}
</nav>
<div class="sidebar-footer-area p-2 px-2 relative z-10 border-t border-white/5 w-full flex justify-center mb-4 transition-all duration-300">
<button class="logout-btn w-12 h-12 flex items-center justify-center bg-gradient-to-r from-electric-blue to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-[0_0_25px_rgba(0,82,255,0.4)] border border-white/10 transition-all transform active:scale-95 group relative overflow-hidden" data-tooltip="Logout">
<div class="flex items-center justify-center w-full h-full">
<span class="material-symbols-outlined text-lg group-hover:animate-pulse flex-shrink-0">logout</span>
<span class="md-label hidden font-bold text-sm tracking-wide ml-3 transition-opacity">Logout</span>
</div>
</button>
</div>
</aside>"""

for (filename, active_href) in TARGET_FILES:
    filepath = os.path.join(curr_dir, filename)
    if not os.path.exists(filepath):
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip the entire <aside> block safely
    aside_pattern = re.compile(r'<aside[^>]*class="[^"]*dashboard-sidebar[^"]*"[^>]*>.*?</aside>', re.DOTALL)
    if not aside_pattern.search(content):
        # Fallback to older class just in case it didn't update previously
        aside_pattern = re.compile(r'<aside[^>]*>.*?</aside>', re.DOTALL)
        
    if aside_pattern.search(content):
        new_aside = make_sidebar(active_href)
        content = aside_pattern.sub(new_aside, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed DOM in: {filename}")

print("Done generating updated DOMs.")
