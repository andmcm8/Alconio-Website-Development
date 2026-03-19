import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

TARGET_FILES = [
    "dashboard_overview.html",
    "dashboard_analytics.html",
    "dashboard_performance.html",
    "dashboard_activity_log.html",
    "dashboard_resources.html",
    "dashboard_settings.html",
    "dashboard_sidebar.html"
]

# 1. Update the HTML files to use static vertical padding `p-4` instead of `p-2`
for filename in TARGET_FILES:
    filepath = os.path.join(curr_dir, filename)
    if not os.path.exists(filepath):
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The footer area class is currently likely containing `p-2 px-2` or `p-2 px-0`
    # We want it to be uniformly `p-4 mb-4`
    # Let's cleanly replace any p-2, px-2 etc with p-4
    footer_pattern = re.compile(r'(class="sidebar-footer-area.*?)\s+p-2\s+px-2(.*?)"')
    if footer_pattern.search(content):
        content = footer_pattern.sub(r'\1 p-4 \2"', content)
    else:
        # Try finding any p-2
        footer_pattern2 = re.compile(r'(class="sidebar-footer-area.*?)\s+p-2(.*?)"')
        content = footer_pattern2.sub(r'\1 p-4 \2"', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed padding in HTML: {filename}")

# 2. Update dashboard_ui.js to STOP swapping footer & button vertical paddings
js_path = os.path.join(curr_dir, "dashboard_ui.js")
if os.path.exists(js_path):
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Remove the footerArea classlist toggling entirely
    # Specifically:
    # if (footerArea) { ... } block inside both expanded and condensed state blocks
    js_content = re.sub(r'if\s*\(footerArea\)\s*\{[^}]*\}', '', js_content)

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Fixed dashboard_ui.js footer logic completely.")

print("Done locking vertical alignment.")
