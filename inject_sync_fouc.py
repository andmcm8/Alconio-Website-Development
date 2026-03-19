import os
import glob

html_files = glob.glob('dashboard_*.html')
# filter out signin page because it has no sidebar
html_files = [f for f in html_files if f != 'dashboard_signin.html']

sync_script_block = """
        </aside>
        <!-- Sync Sidebar Anti-FOUC Script -->
        <script>
            (function() {
                var sidebar = document.querySelector('aside.dashboard-sidebar');
                if (!sidebar) return;
                var toggleBtn = document.querySelector('.side-bar-toggle');
                var headerInner = document.querySelector('.header-inner');
                var headerArea = document.querySelector('.sidebar-header-area');
                var logoText = document.querySelector('.logo-text');
                var navLinks = document.querySelectorAll('.nav-link-btn');
                var dividerLine = document.querySelector('.sidebar-divider-line');
                var logoutBtn = document.querySelector('.logout-btn');
                var sidebarNav = document.querySelector('aside.dashboard-sidebar nav');
                
                var isExpanded = localStorage.getItem('sidebarExpanded') !== 'false';
                
                var transitionEls = [sidebar, headerArea, headerInner, sidebarNav, dividerLine, toggleBtn, logoText].filter(Boolean);
                navLinks.forEach(function(l) { transitionEls.push(l); });
                transitionEls.forEach(function(el) { el.style.transition = 'none'; });

                if (isExpanded) {
                    sidebar.classList.remove('w-20', 'items-center');
                    sidebar.classList.add('w-72');
                    if(logoText) {
                        logoText.textContent = "ALCONIO";
                        logoText.classList.remove('neon-text-blue');
                        logoText.classList.add('pl-1');
                    }
                    var icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                    if (icon) icon.textContent = 'keyboard_tab_rtl';
                    if(toggleBtn) {
                        toggleBtn.classList.remove('w-6', 'h-6');
                        toggleBtn.classList.add('w-8', 'h-8', 'rounded-lg');
                    }
                    if (headerArea) {
                        headerArea.classList.remove('px-0', 'justify-end', 'pr-4');
                        headerArea.classList.add('px-6', 'justify-between');
                    }
                    if (headerInner) {
                        headerInner.classList.remove('justify-end');
                        headerInner.classList.add('justify-between');
                    }
                    if (sidebarNav) {
                        sidebarNav.classList.remove('items-center');
                        sidebarNav.classList.add('items-stretch');
                        sidebarNav.classList.remove('space-y-1');
                        sidebarNav.classList.add('space-y-1');
                    }
                    if (dividerLine) dividerLine.style.left = '18rem';
                    navLinks.forEach(function(link) {
                        link.classList.remove('w-12', 'h-12', 'justify-center');
                        link.classList.add('w-full', 'h-12', 'justify-start', 'pl-5');
                        var label = link.querySelector('.md-label');
                        if (label) {
                            label.classList.remove('hidden');
                            label.classList.add('inline');
                        }
                    });
                    if (logoutBtn) {
                        logoutBtn.classList.remove('w-12');
                        logoutBtn.classList.add('w-full');
                        var lLabel = logoutBtn.querySelector('.md-label');
                        if (lLabel) {
                            lLabel.classList.remove('hidden');
                            lLabel.classList.add('inline');
                        }
                    }
                } else {
                    // CONDENSED STATE
                    sidebar.classList.remove('w-72');
                    sidebar.classList.add('w-20', 'items-center');
                    if(logoText) {
                        logoText.textContent = "A";
                        logoText.classList.remove('pl-1');
                        logoText.classList.add('neon-text-blue');
                    }
                    var icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                    if (icon) icon.textContent = 'start';
                    if(toggleBtn) {
                        toggleBtn.classList.remove('w-8', 'h-8', 'rounded-lg');
                        toggleBtn.classList.add('w-6', 'h-6');
                    }
                    if (headerArea) {
                        headerArea.classList.remove('px-6', 'justify-between');
                        headerArea.classList.add('px-0', 'justify-end', 'pr-4');
                    }
                    if (headerInner) {
                        headerInner.classList.remove('justify-between');
                        headerInner.classList.add('justify-end');
                    }
                    if (sidebarNav) {
                        sidebarNav.classList.remove('items-stretch');
                        sidebarNav.classList.add('items-center');
                    }
                    if (dividerLine) dividerLine.style.left = '5rem';
                    navLinks.forEach(function(link) {
                        link.classList.remove('w-full', 'justify-start', 'pl-5');
                        link.classList.add('w-12', 'h-12', 'justify-center');
                        var label = link.querySelector('.md-label');
                        if (label) {
                            label.classList.remove('inline');
                            label.classList.add('hidden');
                        }
                    });
                    if (logoutBtn) {
                        logoutBtn.classList.remove('w-full');
                        logoutBtn.classList.add('w-12');
                        var lLabel = logoutBtn.querySelector('.md-label');
                        if (lLabel) {
                            lLabel.classList.remove('inline');
                            lLabel.classList.add('hidden');
                        }
                    }
                }
                
                // We MUST wait for next frame to restore transitions so the DOM updates synchronously first
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        transitionEls.forEach(function(el) { el.style.transition = ''; });
                    });
                });
            })();
        </script>
"""

count_removed = 0
count_injected = 0
for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    modified = False

    # Remove old Anti-FOUC CSS block
    start_str = "<!-- Anti-FOUC Sidebar Script -->"
    end_str = "</style>\n"
    if start_str in content and end_str in content:
        start_idx = content.find(start_str)
        end_idx = content.find(end_str) + len(end_str)
        content = content[:start_idx] + content[end_idx:]
        modified = True
        count_removed += 1

    # Inject Sync script if not already there
    if "<!-- Sync Sidebar Anti-FOUC Script -->" not in content:
        # We replace the exact `</aside>` string
        target = "</aside>"
        if target in content:
            content = content.replace(target, sync_script_block, 1)
            modified = True
            count_injected += 1

    if modified:
        with open(filepath, 'w') as f:
            f.write(content)

print(f"Removed old FOUC from {count_removed} files. Injected Sync FOUC to {count_injected} files.")
