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

def update_dashboard_headers():
    curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"
    
    # We want to find: <div class="flex items-center gap-4">
    # which wraps the right side of the header.
    # And we'll insert the BUTTONS_HTML just inside it.
    
    target_str = '<div class="flex items-center gap-4">'

    for file in dashboard_files:
        filepath = os.path.join(curr_dir, file)
        if not os.path.exists(filepath):
            print(f"File not found: {file}")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Simple string replacement for injection
        if target_str in content and "Client Dashboard" not in content[content.find(target_str):content.find(target_str)+500]:
             # Only insert if we haven't already inserted the buttons
             new_content = content.replace(target_str, target_str + "\n" + BUTTONS_HTML)
             
             with open(filepath, 'w', encoding='utf-8') as f:
                 f.write(new_content)
             print(f"Updated header inside {file}")
        else:
             print(f"Did not update {file} (either missing target string or already updated)")
             
if __name__ == "__main__":
    update_dashboard_headers()
