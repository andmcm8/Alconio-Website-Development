import glob
import re

files = glob.glob('dashboard_*.html')

new_script = """        <script>
                (function () {
                    var sidebar = document.querySelector('aside.dashboard-sidebar');
                    if (!sidebar) return;
                    var toggleBtn = document.querySelector('.side-bar-toggle');
                    var headerInner = document.querySelector('.header-inner');
                    var headerArea = document.querySelector('.sidebar-header-area');
                    var logoText = document.querySelector('.logo-text');
                    var logoImg = document.querySelector('.sidebar-logo-img');
                    var navLinks = document.querySelectorAll('.nav-link-btn');
                    var dividerLine = document.querySelector('.sidebar-divider-line');
                    var logoutBtn = document.querySelector('.logout-btn');
                    var sidebarNav = document.querySelector('aside.dashboard-sidebar nav');

                    var isExpanded = localStorage.getItem('sidebarExpanded') !== 'false';

                    // Kill ALL transitions instantly
                    var transitionEls = [sidebar, headerArea, headerInner, sidebarNav, dividerLine, toggleBtn, logoText, logoImg].filter(Boolean);
                    navLinks.forEach(function (l) { transitionEls.push(l); });
                    if (logoutBtn) transitionEls.push(logoutBtn);
                    transitionEls.forEach(function (el) { el.style.transition = 'none'; });

                    if (isExpanded) {
                        sidebar.classList.remove('w-20', 'items-center');
                        sidebar.classList.add('w-72');

                        if (logoText) {
                            logoText.classList.remove('hidden', 'opacity-0');
                            logoText.classList.add('opacity-100');
                            logoText.textContent = "ALCONIO";
                            logoText.classList.remove('neon-text-blue', 'pl-1');
                            logoText.classList.add('pl-12');
                        }

                        if (logoImg) {
                            logoImg.classList.remove('left-1/2', '-translate-x-1/2');
                            logoImg.classList.add('left-4');
                        }

                        var icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                        if (icon) icon.textContent = 'keyboard_tab_rtl';
                        if (toggleBtn) {
                            toggleBtn.classList.remove('w-6', 'h-6', 'absolute', 'right-[2px]', 'translate-x-[2px]');
                            toggleBtn.classList.add('w-8', 'h-8', 'rounded-lg', 'relative');
                        }

                        if (headerArea) {
                            headerArea.classList.remove('px-0', 'justify-end', 'pr-4');
                            headerArea.classList.add('px-6', 'justify-between');
                        }
                        if (headerInner) {
                            headerInner.classList.remove('justify-center', 'justify-end');
                            headerInner.classList.add('justify-between');
                        }
                        if (sidebarNav) {
                            sidebarNav.classList.remove('items-center');
                            sidebarNav.classList.add('items-stretch');
                            sidebarNav.classList.remove('space-y-1');
                            sidebarNav.classList.add('space-y-1');
                        }
                        if (dividerLine) dividerLine.style.left = '18rem';

                        navLinks.forEach(function (link) {
                            link.classList.remove('w-12', 'h-12', 'justify-center');
                            link.classList.add('w-full', 'h-12', 'justify-start', 'pl-5');
                            var label = link.querySelector('.md-label');
                            if (label) { label.classList.remove('hidden'); label.classList.add('inline'); }
                        });

                        if (logoutBtn) {
                            logoutBtn.classList.remove('w-12');
                            logoutBtn.classList.add('w-full');
                            var lLabel = logoutBtn.querySelector('.md-label');
                            if (lLabel) { lLabel.classList.remove('hidden'); lLabel.classList.add('inline'); }
                        }
                    } else {
                        // Collapsed state
                        sidebar.classList.remove('w-72');
                        sidebar.classList.add('w-20', 'items-center');

                        if (logoText) {
                            logoText.classList.remove('opacity-100', 'pl-12');
                            logoText.classList.add('hidden', 'opacity-0', 'neon-text-blue', 'pl-1');
                            logoText.textContent = "A";
                        }

                        if (logoImg) {
                            logoImg.classList.remove('left-4');
                            logoImg.classList.add('left-1/2', '-translate-x-1/2');
                        }

                        var icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                        if (icon) icon.textContent = 'start';
                        if (toggleBtn) {
                            toggleBtn.classList.remove('w-8', 'h-8', 'rounded-lg', 'relative');
                            toggleBtn.classList.add('w-6', 'h-6', 'absolute', 'right-[2px]', 'translate-x-[2px]');
                        }

                        if (headerArea) {
                            headerArea.classList.remove('px-6', 'justify-between');
                            headerArea.classList.add('px-0', 'justify-end', 'pr-4');
                        }
                        if (headerInner) {
                            headerInner.classList.remove('justify-between', 'justify-end');
                            headerInner.classList.add('justify-center');
                        }
                        if (sidebarNav) {
                            sidebarNav.classList.remove('items-stretch');
                            sidebarNav.classList.add('items-center');
                        }
                        if (dividerLine) dividerLine.style.left = '5rem';

                        navLinks.forEach(function (link) {
                            link.classList.remove('w-full', 'justify-start', 'pl-5');
                            link.classList.add('w-12', 'h-12', 'justify-center');
                            var label = link.querySelector('.md-label');
                            if (label) { label.classList.remove('inline'); label.classList.add('hidden'); }
                        });

                        if (logoutBtn) {
                            logoutBtn.classList.remove('w-full');
                            logoutBtn.classList.add('w-12');
                            var lLabel = logoutBtn.querySelector('.md-label');
                            if (lLabel) { lLabel.classList.remove('inline'); lLabel.classList.add('hidden'); }
                        }
                    }

                    // Re-enable transitions
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            transitionEls.forEach(function (el) { el.style.transition = ''; });
                        });
                    });
                })();
        </script>"""

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Use regex to find the script block that immediately follows </aside> and has the "Sync Sidebar Anti-FOUC Script" comment
    # Made function spacing flexible \(function\s*\(\)
    pattern = re.compile(r'<!-- Sync Sidebar Anti-FOUC Script -->\s*<script>[\s\S]*?\(function\s*\(\)\s*\{[\s\S]*?var sidebar = document\.querySelector\(\'aside\.dashboard-sidebar\'\);[\s\S]*?\}\)\(\);\s*</script>')
    
    if pattern.search(content):
        new_content = pattern.sub(f'<!-- Sync Sidebar Anti-FOUC Script -->\n{new_script}', content)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"Failed to find target in {file}")
