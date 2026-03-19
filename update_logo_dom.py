import glob
import re

files = glob.glob('dashboard_*.html')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add `relative` to `sidebar-header-area` and add `h-16` so the top-1/2 vertical centering works.
    # Currently: <div class="sidebar-header-area px-0 w-full flex justify-end pr-4 shrink-0 transition-all duration-300">
    # We want:   <div class="sidebar-header-area relative h-16 px-0 w-full flex justify-end pr-4 shrink-0 transition-all duration-300">
    if 'sidebar-header-area relative h-16' not in content:
        content = content.replace(
            'class="sidebar-header-area px-0 w-full',
            'class="sidebar-header-area relative h-16 px-0 w-full'
        )
        content = content.replace(
            'class="sidebar-header-area px-6 w-full', # Just in case
            'class="sidebar-header-area relative h-16 px-6 w-full'
        )

    # 2. Modify `logoImg` classes to be absolute and permanently visible
    # Currently: <img src="logo.png" alt="Logo" class="sidebar-logo-img hidden w-12 h-12 object-contain transition-all duration-300 opacity-0 relative z-10">
    # Desired:   <img src="logo.png" alt="Logo" class="sidebar-logo-img w-12 h-12 object-contain transition-all duration-300 absolute top-1/2 -translate-y-1/2 z-10">
    # Note: it might not have 'hidden' or 'opacity-0' if the user's dashboard_ui.js removed it, but in the DOM it's hardcoded with those.
    content = re.sub(
        r'<img src="logo\.png" alt="Logo" class="sidebar-logo-img[^"]*">',
        r'<img src="logo.png" alt="Logo" class="sidebar-logo-img w-12 h-12 object-contain transition-all duration-300 absolute top-1/2 -translate-y-1/2 z-10">',
        content
    )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {file}")
