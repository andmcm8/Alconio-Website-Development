import glob
import re

files = glob.glob('dashboard_*.html')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # The current injected logo looks like this:
    # <img src="logo.png" alt="Logo" class="sidebar-logo-img hidden w-8 h-8 object-contain transition-all duration-300 opacity-0 relative z-10">
    # We want to change w-8 h-8 to w-12 h-12 (which is 48px, significantly larger than 32px)
    
    new_content = content.replace(
        'class="sidebar-logo-img hidden w-8 h-8 object-contain',
        'class="sidebar-logo-img hidden w-12 h-12 object-contain'
    )
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"Skipped {file} (pattern not found or already updated)")
