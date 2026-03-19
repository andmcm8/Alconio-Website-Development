import glob
import re

files = glob.glob('dashboard_*.html')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # The sidebar <aside> tends to look like:
    # <aside class="dashboard-sidebar relative z-50 w-20 h-full glass-panel flex flex-col border-r-0 hidden md:flex shrink-0 items-center transition-all duration-300">
    # We will just inject !border-l-transparent into the class list.
    
    # First, let's ensure we don't duplicate it if run twice
    if '!border-l-transparent' not in content:
        # Regex to find the <aside class="... dashboard-sidebar ..."> pattern
        new_content = re.sub(
            r'(<aside[^>]*class="[^"]*dashboard-sidebar[^"]*)(")',
            r'\1 !border-l-transparent border-l-0\2',
            content
        )
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")
        else:
            print(f"Skipped {file} (pattern not found)")
    else:
        print(f"Skipped {file} (already processed)")
