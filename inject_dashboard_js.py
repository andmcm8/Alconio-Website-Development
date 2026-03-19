import os
import re

target_files = [
    "dashboard_overview.html",
    "dashboard_activity_log.html",
    "dashboard_analytics.html",
    "dashboard_performance.html",
    "dashboard_resources.html",
    "dashboard_settings.html",
    "new_report.html"
]

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

for file in target_files:
    filepath = os.path.join(curr_dir, file)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # check if already injected
    if "dashboard_ui.js" in content:
        print(f"Already injected in {file}")
        continue
        
    # inject just before </body>
    new_content = content.replace("</body>", '<script src="dashboard_ui.js"></script>\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Injected script into {file}")
