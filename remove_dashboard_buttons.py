import os
import re

dashboard_files = [
    "dashboard_overview.html",
    "dashboard_activity_log.html",
    "dashboard_analytics.html",
    "dashboard_performance.html",
    "dashboard_resources.html",
    "dashboard_settings.html"
]

BUTTONS_HTML = """<a href="dashboard_overview.html"><button class="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-white/10 hover:border-white/30 mr-2">Client Dashboard</button></a>
<a href="index.html"><button class="bg-electric-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg mr-4">Get Started</button></a>
"""

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

for file in dashboard_files:
    filepath = os.path.join(curr_dir, file)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try exact replacement first
    if BUTTONS_HTML in content:
        # Check if there is a leading newline we added
        if "\n" + BUTTONS_HTML in content:
            new_content = content.replace("\n" + BUTTONS_HTML, "")
        else:
            new_content = content.replace(BUTTONS_HTML, "")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed exact buttons from {file}")
    else:
        # Fallback to regex in case spacing shifted
        pattern = r'<a href="dashboard_overview\.html">\s*<button[^>]*>Client Dashboard</button>\s*</a>\s*<a href="index\.html">\s*<button[^>]*>Get Started</button>\s*</a>\s*'
        new_content, count = re.subn(pattern, '', content)
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed buttons via regex from {file}")
        else:
            print(f"No buttons found in {file}")
