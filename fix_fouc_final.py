"""
Final comprehensive fix:
1. Remove ALL old Anti-FOUC blocks (both the CSS in <head> and the sync script after </aside>)
2. Inject a single, correct sync script after </aside> that handles BOTH expanded and collapsed states
"""
import glob, re

html_files = glob.glob('dashboard_*.html')
html_files = [f for f in html_files if f != 'dashboard_signin.html']

NEW_SYNC_SCRIPT = """
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

                // Kill ALL transitions instantly
                var transitionEls = [sidebar, headerArea, headerInner, sidebarNav, dividerLine, toggleBtn, logoText].filter(Boolean);
                navLinks.forEach(function(l) { transitionEls.push(l); });
                if (logoutBtn) transitionEls.push(logoutBtn);
                transitionEls.forEach(function(el) { el.style.transition = 'none'; });

                if (isExpanded) {
                    sidebar.classList.remove('w-20', 'items-center');
                    sidebar.classList.add('w-72');
                    if (logoText) {
                        logoText.textContent = "ALCONIO";
                        logoText.classList.remove('neon-text-blue');
                        logoText.classList.add('pl-1');
                    }
                    var icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                    if (icon) icon.textContent = 'keyboard_tab_rtl';
                    if (toggleBtn) {
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
                    }
                    if (dividerLine) dividerLine.style.left = '18rem';
                    navLinks.forEach(function(link) {
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
                    // Collapsed state — ensure HTML default is enforced
                    sidebar.classList.remove('w-72');
                    sidebar.classList.add('w-20', 'items-center');
                    if (logoText) {
                        logoText.textContent = "A";
                        logoText.classList.remove('pl-1');
                        logoText.classList.add('neon-text-blue');
                    }
                    var icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                    if (icon) icon.textContent = 'start';
                    if (toggleBtn) {
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
                        if (label) { label.classList.remove('inline'); label.classList.add('hidden'); }
                    });
                    if (logoutBtn) {
                        logoutBtn.classList.remove('w-full');
                        logoutBtn.classList.add('w-12');
                        var lLabel = logoutBtn.querySelector('.md-label');
                        if (lLabel) { lLabel.classList.remove('inline'); lLabel.classList.add('hidden'); }
                    }
                }

                // Re-enable transitions after 2 animation frames (guarantees paint happened)
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        transitionEls.forEach(function(el) { el.style.transition = ''; });
                    });
                });
            })();
        </script>"""

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove the old <head> Anti-FOUC CSS block (<!-- Anti-FOUC Sidebar Script --> ... </style>)
    pattern_head = r'\n\s*<!-- Anti-FOUC Sidebar Script -->.*?</style>'
    content = re.sub(pattern_head, '', content, flags=re.DOTALL)

    # 2. Remove any old Sync Sidebar Anti-FOUC Script block
    pattern_sync = r'\n\s*<!-- Sync Sidebar Anti-FOUC Script -->.*?</script>'
    content = re.sub(pattern_sync, '', content, flags=re.DOTALL)

    # 3. Also remove duplicate Clerk SDK script tags (keep only the first one)
    clerk_pattern = r'(<!-- Clerk JS SDK -->\s*<script\s+async\s+crossorigin="anonymous"\s+data-clerk-publishable-key="[^"]+"\s+src="[^"]+"\s+type="text/javascript">\s*</script>)'
    matches = list(re.finditer(clerk_pattern, content))
    if len(matches) > 1:
        # Remove all but the first
        for m in reversed(matches[1:]):
            content = content[:m.start()] + content[m.end():]
        # Clean up extra whitespace
        content = re.sub(r'\n{3,}', '\n\n', content)

    # 4. Inject the new sync script right after </aside>
    content = content.replace('</aside>', '</aside>' + NEW_SYNC_SCRIPT, 1)

    with open(filepath, 'w') as f:
        f.write(content)

print(f"Fixed {len(html_files)} dashboard HTML files.")
