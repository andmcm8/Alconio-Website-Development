import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update <aside> width and items alignment (already done mostly, but ensuring consistency)
    if 'aside class="dashboard-sidebar' in content:
        content = re.sub(r'(<aside[^>]*class="[^"]*)\bw-20\b([^"]*)\bitems-center\b', r'\1w-72\2items-stretch', content)
        content = re.sub(r'(<aside[^>]*class="[^"]*)\bw-20\b', r'\1w-72', content)
        content = re.sub(r'(<aside[^>]*class="[^"]*dashboard-sidebar[^"]*)\bitems-center\b', r'\1items-stretch', content)

    # 2. Update <nav> alignment
    if '<nav' in content:
        content = re.sub(r'(<nav[^>]*class="[^"]*)\bitems-center\b', r'\1items-stretch', content)

    # 3. Update nav-link-btn and logout-btn
    content = re.sub(r'(class="[^"]*nav-link-btn[^"]*)\bjustify-center\b', r'\1justify-start', content)
    content = re.sub(r'(class="[^"]*nav-link-btn[^"]*)\bw-12\b', r'\1w-full pl-5', content)
    
    content = re.sub(r'(class="[^"]*logout-btn[^"]*)\bjustify-center\b', r'\1justify-start', content)
    content = re.sub(r'(class="[^"]*logout-btn[^"]*)\bw-12\b', r'\1w-full pl-5', content)

    # 4. Show labels
    content = content.replace('class="md-label hidden', 'class="md-label inline')

    # 5. REMOVE OLD BODY GUARD if exists
    content = re.sub(r'<!-- Anti-Flicker Sidebar Guard -->.*?<\/script>', '', content, flags=re.DOTALL)

    # 6. Inject NEW Anti-Flicker Guard + CSS in <head>
    head_guard = """
    <!-- Anti-Flicker Sidebar Guard -->
    <style id="anti-flicker-style">
        html.sidebar-condensed aside.dashboard-sidebar { width: 5rem !important; transition: none !important; }
        html.sidebar-condensed aside.dashboard-sidebar .md-label { display: none !important; }
        html.sidebar-condensed aside.dashboard-sidebar .logo-text { display: none !important; }
        html.sidebar-condensed .sidebar-divider-line { left: 5rem !important; transition: none !important; }
    </style>
    <script id="anti-flicker-script">
        (function() {
            const expanded = localStorage.getItem('sidebarExpanded') !== 'false';
            if (!expanded) {
                document.documentElement.classList.add('sidebar-condensed');
            }
        })();
    </script>
"""
    if '</head>' in content and 'Anti-Flicker Sidebar Guard' not in content:
        content = content.replace('</head>', head_guard + '</head>')

    with open(filepath, 'w') as f:
        f.write(content)

# Process all dashboard and docs HTML files
for filename in os.listdir('.'):
    if filename.endswith('.html') and (filename.startswith('dashboard_') or filename.startswith('docs_')):
        print(f"Fixing {filename}...")
        fix_file(filename)

print("Done!")
