import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update <aside> width and items alignment
    # From: class="... w-20 ... items-center ..."
    # To:   class="... w-72 ... items-stretch ..."
    if 'aside class="dashboard-sidebar' in content:
        content = re.sub(r'(<aside[^>]*class="[^"]*)\bw-20\b([^"]*)\bitems-center\b', r'\1w-72\2items-stretch', content)
        # Handle cases where they might be in different order or missing one
        content = re.sub(r'(<aside[^>]*class="[^"]*)\bw-20\b', r'\1w-72', content)
        content = re.sub(r'(<aside[^>]*class="[^"]*dashboard-sidebar[^"]*)\bitems-center\b', r'\1items-stretch', content)

    # 2. Update <nav> alignment
    if '<nav' in content:
        # Avoid matching other navs if any, but usually it's the sidebar nav
        content = re.sub(r'(<nav[^>]*class="[^"]*)\bitems-center\b', r'\1items-stretch', content)

    # 3. Update nav-link-btn and logout-btn
    # From: justify-center w-12 h-12
    # To:   justify-start w-full h-12 pl-5
    content = re.sub(r'(class="[^"]*nav-link-btn[^"]*)\bjustify-center\b', r'\1justify-start', content)
    content = re.sub(r'(class="[^"]*nav-link-btn[^"]*)\bw-12\b', r'\1w-full pl-5', content)
    
    content = re.sub(r'(class="[^"]*logout-btn[^"]*)\bjustify-center\b', r'\1justify-start', content)
    content = re.sub(r'(class="[^"]*logout-btn[^"]*)\bw-12\b', r'\1w-full pl-5', content)

    # 4. Show labels
    # From: <span class="md-label hidden ...">
    # To:   <span class="md-label inline ...">
    content = content.replace('class="md-label hidden', 'class="md-label inline')

    # 5. Inject Anti-Flicker Guard at the start of <body>
    guard_script = """
    <!-- Anti-Flicker Sidebar Guard -->
    <script>
        (function() {
            const expanded = localStorage.getItem('sidebarExpanded') !== 'false';
            if (!expanded) {
                document.documentElement.classList.add('sidebar-condensed');
            }
        })();
    </script>
"""
    if '<body>' in content and 'Anti-Flicker Sidebar Guard' not in content:
        content = content.replace('<body>', '<body>' + guard_script)
    elif '<body' in content and 'Anti-Flicker Sidebar Guard' not in content:
        # Handle <body> with classes/attributes
        content = re.sub(r'(<body[^>]*>)', r'\1' + guard_script, content)

    with open(filepath, 'w') as f:
        f.write(content)

# Process all dashboard and docs HTML files
for filename in os.listdir('.'):
    if filename.endswith('.html') and (filename.startswith('dashboard_') or filename.startswith('docs_')):
        print(f"Fixing {filename}...")
        fix_file(filename)

print("Done!")
