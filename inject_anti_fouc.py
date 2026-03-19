import os
import glob

html_files = glob.glob('dashboard_*.html')
# filter out signin page because it has no sidebar
html_files = [f for f in html_files if f != 'dashboard_signin.html']

anti_fouc_block = """
    <!-- Anti-FOUC Sidebar Script -->
    <script>
        (function() {
            var expanded = localStorage.getItem('sidebarExpanded') !== 'false';
            document.documentElement.classList.add(expanded ? 'sidebar-is-expanded' : 'sidebar-is-collapsed');
        })();
    </script>
    <style>
        /* Anti-FOUC CSS */
        html.sidebar-is-expanded .dashboard-sidebar { width: 18rem !important; align-items: stretch !important; transition: none !important; }
        html.sidebar-is-expanded .logo-text { padding-left: 0.25rem !important; color: white !important; text-shadow: none !important; transition: none !important;}
        html.sidebar-is-expanded .side-bar-toggle { width: 2rem !important; height: 2rem !important; border-radius: 0.5rem !important; transition: none !important;}
        html.sidebar-is-expanded .sidebar-header-area { padding-left: 1.5rem !important; padding-right: 1.5rem !important; justify-content: space-between !important; transition: none !important;}
        html.sidebar-is-expanded .header-inner { justify-content: space-between !important; transition: none !important;}
        html.sidebar-is-expanded aside.dashboard-sidebar nav { align-items: stretch !important; transition: none !important;}
        html.sidebar-is-expanded .nav-link-btn { width: 100% !important; justify-content: flex-start !important; padding-left: 1.25rem !important; transition: none !important;}
        html.sidebar-is-expanded .nav-link-btn .md-label { display: inline !important; opacity: 1 !important; transition: none !important;}
        html.sidebar-is-expanded .logout-btn { width: 100% !important; transition: none !important;}
        html.sidebar-is-expanded .logout-btn .md-label { display: inline !important; opacity: 1 !important; transition: none !important;}
        html.sidebar-is-expanded .sidebar-divider-line { left: 18rem !important; transition: none !important;}
        
        html.sidebar-is-collapsed .dashboard-sidebar { width: 5rem !important; align-items: center !important; transition: none !important;}
        html.sidebar-is-collapsed .nav-link-btn .md-label { display: none !important; transition: none !important;}
        html.sidebar-is-collapsed .logo-text { padding-left: 0 !important; color: #0052FF !important; transition: none !important;}
        html.sidebar-is-collapsed .sidebar-header-area { padding-left: 0 !important; padding-right: 1rem !important; justify-content: flex-end !important; transition: none !important;}
        html.sidebar-is-collapsed .header-inner { justify-content: flex-end !important; transition: none !important;}
        html.sidebar-is-collapsed aside.dashboard-sidebar nav { align-items: center !important; transition: none !important;}
        html.sidebar-is-collapsed .nav-link-btn { width: 3rem !important; justify-content: center !important; padding-left: 0 !important; transition: none !important;}
        html.sidebar-is-collapsed .logout-btn { width: 3rem !important; transition: none !important;}
        html.sidebar-is-collapsed .logout-btn .md-label { display: none !important; transition: none !important;}
        html.sidebar-is-collapsed .sidebar-divider-line { left: 5rem !important; transition: none !important;}
    </style>
"""

count = 0
for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # check if already injected
    if "Anti-FOUC Sidebar Script" in content:
        continue

    # insert right before closing </head>
    idx = content.find('</head>')
    if (idx != -1):
        # insert
        new_content = content[:idx] + anti_fouc_block + content[idx:]
        with open(filepath, 'w') as f:
            f.write(new_content)
        count += 1

print(f"Injected anti-FOUC block into {count} files.")
