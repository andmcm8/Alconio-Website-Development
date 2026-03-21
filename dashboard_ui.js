/**
 * Reusable Role-Based Auth Guard
 * Checks if user is signed in and has the required role.
 * Redirects to appropriate dashboard if role mismatch occurs.
 */
window.requireRole = function(expectedRole) {
    if (typeof Clerk !== 'undefined' && Clerk.loaded) {
        if (!Clerk.isSignedIn) {
            window.location.replace('dashboard_signin.html');
            return;
        }
        
        const userRole = Clerk.user?.publicMetadata?.role;
        
        // Strict Check: No role = unauthorized
        if (!userRole) {
            console.error(`[AUTH] No role assigned in publicMetadata. Redirecting to sign-in.`);
            window.location.replace('dashboard_signin.html?error=no_role');
            return;
        }

        if (userRole !== expectedRole) {
            console.warn(`[AUTH] Role mismatch: Expected ${expectedRole}, got ${userRole}. Redirecting to ${userRole} home.`);
            // Recursive Redirection: Send them to their actual role's landing page
            const target = userRole === 'admin' ? 'dashboard_admin.html' : 'dashboard_overview.html';
            window.location.replace(target);
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    // --- Immediate UI Bindings (Run before any awaits) ---
    // Make Logo and ALCONIO text navigate to overview page instantly
    document.addEventListener('click', (e) => {
        const logoTarget = e.target.closest('.logo-text, .sidebar-logo-img');
        if (logoTarget) {
            e.preventDefault();
            // --- RBAC: Logo Navigation ---
            const userRole = window.Clerk?.user?.publicMetadata?.role || 'client';
            const isSuperAdmin = userRole === 'admin';
            window.location.href = isSuperAdmin ? 'dashboard_admin.html' : 'dashboard_overview.html';
        }

        // Global link fixer for data-nav attributes (if any)
        const navTarget = e.target.closest('[data-nav-target]');
        if (navTarget) {
            e.preventDefault();
            window.location.href = navTarget.getAttribute('data-nav-target');
        }

        // Fix all "Back to ..." links to ensure they go to the right place
        const backLink = e.target.closest('a');
        if (backLink && backLink.textContent.trim().toLowerCase().includes('back to')) {
            const text = backLink.textContent.toLowerCase();
            if (text.includes('hub') || text.includes('clients') || text.includes('dashboard')) {
                e.preventDefault();
                const userRole = window.Clerk?.user?.publicMetadata?.role || 'client';
                const isSuperAdmin = userRole === 'admin';
                window.location.href = isSuperAdmin ? 'dashboard_admin.html' : 'dashboard_overview.html';
            }
        }
    });

    // Initialize specific page logics
    initSettingsNav();

    // Add pointer cursors right away
    document.querySelectorAll('.logo-text, .sidebar-logo-img').forEach(el => {
        el.classList.add('cursor-pointer');
    });

    // --- 0. Clerk Auth Guard ---
    // (Auth check executes without hiding body to prevent black flashes)

    // Helper: wait for Clerk global to be available (loaded via async script tag)
    async function waitForClerk(timeout = 10000) {
        if (typeof Clerk !== 'undefined') return true;
        return new Promise((resolve) => {
            const start = Date.now();
            const interval = setInterval(() => {
                if (typeof Clerk !== 'undefined') {
                    clearInterval(interval);
                    resolve(true);
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    resolve(false);
                }
            }, 100);
        });
    }

    try {
        const clerkAvailable = await waitForClerk();
        if (clerkAvailable) {
            try {
                await Clerk.load();

                // --- Dynamic Website Display ---
                const syncWebsiteDisplay = (user) => {
                    const displays = document.querySelectorAll('.client-website-display');
                    if (!displays.length) return;
                    
                    const siteUrl = user?.publicMetadata?.websiteurl || user?.unsafeMetadata?.websiteurl || (localStorage.getItem('alconio_mock_session') === 'true' ? 'YourWebsite.com' : 'ClientSite.com');
                    
                    displays.forEach(display => {
                        // Clear text nodes but keep the dot span
                        Array.from(display.childNodes).forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node.remove();
                            }
                        });
                        // Append the new text
                        display.appendChild(document.createTextNode(' ' + siteUrl));
                    });
                };

                if (Clerk.user) syncWebsiteDisplay(Clerk.user);
                Clerk.addListener(({ user }) => { if (user) syncWebsiteDisplay(user); });

                // --- Bug 2: Cross-Tab Session Sync ---
                Clerk.addListener(({ session }) => {
                    if (!session && !localStorage.getItem('alconio_mock_session')) {
                        console.info("[AUTH] Session lost. Redirecting to sign-in.");
                        window.location.href = 'dashboard_signin.html';
                    }
                });

                if (!Clerk.isSignedIn) {
                    // Check for bypass
                    if (localStorage.getItem('alconio_mock_session') === 'true') {
                        console.info("[AUTH] Proceeding with Developer Bypass Session");
                    } else {
                        window.location.href = 'dashboard_signin.html';
                        return;
                    }
                }
            } catch (err) {
                console.warn('[AUTH] Clerk load failure:', err);
                // Allow escape valve if on localhost and bypass is set
                if (localStorage.getItem('alconio_mock_session') === 'true') {
                    console.info("[AUTH] Clerk failed but bypass is active. Proceeding.");
                } else {
                    window.location.href = 'dashboard_signin.html?error=auth_unavailable';
                    return;
                }
            }

            // --- RBAC: Route Protection ---
            const path = window.location.pathname;
            const userRole = Clerk.user?.publicMetadata?.role;
            const userId = Clerk.user?.id;
            const isSuperAdmin = userRole === 'admin';
            const isAdminPage = path.includes('dashboard_admin') || path.includes('dashboard_onboarding');

            // Persist User ID for instant-loader cache lookups
            if (userId) {
                localStorage.setItem('__clerk_user_id', userId);
            }

            if (isAdminPage && !isSuperAdmin) {
                console.warn("[AUTH] Non-admin attempted to access admin page. Redirecting to user dashboard.");
                window.location.href = 'dashboard_overview.html';
                return;
            }

            // Hide Admin tools for non-admins on common pages
            if (!isSuperAdmin) {
                document.querySelectorAll('.admin-only').forEach(el => el.remove());
            }
        }
    } catch (e) {
        console.warn('Clerk auth check failed:', e);
    }

    // Auth passed — content remains visible


    // --- 1. Sidebar Toggle & Dynamic Tooltips ---
    const sidebar = document.querySelector('aside.dashboard-sidebar');
    const toggleBtn = document.querySelector('.side-bar-toggle');
    const headerInner = document.querySelector('.header-inner');
    const headerArea = document.querySelector('.sidebar-header-area');
    const logoText = document.querySelector('.logo-text');
    const logoImg = document.querySelector('.sidebar-logo-img');
    const navLinks = document.querySelectorAll('.nav-link-btn');
    const dividerLine = document.querySelector('.sidebar-divider-line');
    const logoutBtn = document.querySelector('.logout-btn');
    const sidebarNav = document.querySelector('aside.dashboard-sidebar nav');

    if (sidebar && toggleBtn && logoText) {

        // Read sidebar state from localStorage, default to expanded (true)
        const storedState = localStorage.getItem('sidebarExpanded');
        let isExpanded = storedState === null ? true : storedState === 'true';

        // Create a single global tooltip element attached to body
        const globalTooltip = document.createElement('div');
        globalTooltip.className = "fixed bg-black/90 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white opacity-0 transition-opacity whitespace-nowrap border border-white/20 shadow-[0_0_15px_rgba(0,82,255,0.3)] pointer-events-none";
        globalTooltip.style.cssText = 'left:-999px;z-index:99999;';
        document.body.appendChild(globalTooltip);

        const attachTooltip = (el) => {
            el.addEventListener('mouseenter', () => {
                if (isExpanded) return;
                const rect = el.getBoundingClientRect();
                const text = el.getAttribute('data-tooltip');
                if (text) {
                    globalTooltip.textContent = text;
                    globalTooltip.style.top = (rect.top + (rect.height / 2) - 14) + 'px';
                    globalTooltip.style.left = (rect.right + 12) + 'px';
                    globalTooltip.style.opacity = '1';
                }
            });
            el.addEventListener('mouseleave', () => {
                globalTooltip.style.opacity = '0';
            });
        };

        navLinks.forEach(attachTooltip);
        if (logoutBtn) attachTooltip(logoutBtn);

        /**
         * Highlight the active navigation link based on the current URL
         */
        const highlightActiveLink = () => {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'dashboard_overview.html';
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active-nav-item', 'text-white');
                    link.classList.remove('text-slate-400', 'hover:bg-white/5');
                    const icon = link.querySelector('.material-symbols-outlined');
                    if (icon) icon.classList.add('text-electric-blue');
                } else {
                    link.classList.remove('active-nav-item', 'text-white');
                    link.classList.add('text-slate-400', 'hover:bg-white/5');
                    const icon = link.querySelector('.material-symbols-outlined');
                    if (icon) icon.classList.remove('text-electric-blue');
                }
            });
        };

        highlightActiveLink();

        // Function to apply sidebar state (used on load and toggle)
        function applySidebarState(animate = false) {
            globalTooltip.style.opacity = '0';

            if (isExpanded) {
                // --- EXPANDED STATE ---
                sidebar.classList.remove('w-20', 'items-center');
                sidebar.classList.add('w-72');

                if (logoText) {
                    logoText.classList.remove('hidden', 'opacity-0');
                    logoText.classList.add('opacity-100');
                    logoText.textContent = "ALCONIO";
                    // Clear Structure C ad-hoc styles
                    logoText.style.position = '';
                    logoText.style.left = '';
                    logoText.style.top = '';
                    logoText.style.transform = '';
                    logoText.style.fontSize = '';
                    logoText.style.letterSpacing = '';
                }

                if (logoImg) {
                    // Clear Structure C ad-hoc styles
                    logoImg.style.width = '';
                    logoImg.style.height = '';
                    logoImg.style.left = '';
                    logoImg.style.top = '';
                    logoImg.style.transform = '';
                    logoImg.style.position = '';
                }

                const toggleIcon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                if (toggleIcon) {
                    toggleIcon.textContent = 'keyboard_tab_rtl';
                    toggleIcon.style.fontSize = '20px';
                }
                
                if (toggleBtn) {
                    toggleBtn.classList.remove('absolute', 'right-[2px]', 'translate-x-[2px]');
                    toggleBtn.classList.add('relative');
                    // Clear Structure C ad-hoc styles
                    toggleBtn.style.width = '';
                    toggleBtn.style.height = '';
                    toggleBtn.style.right = '';
                    toggleBtn.style.top = '';
                    toggleBtn.style.transform = '';
                    toggleBtn.style.position = '';
                }

                if (headerArea) {
                    headerArea.classList.remove('px-0', 'justify-end', 'pr-4');
                    headerArea.classList.add('px-6', 'justify-between');
                    headerArea.style.padding = '';
                }
                if (headerInner) {
                    headerInner.classList.remove('justify-center', 'justify-end');
                    headerInner.classList.add('justify-between');
                }
                if (sidebarNav) {
                    sidebarNav.classList.remove('items-center');
                    sidebarNav.classList.add('items-stretch');
                }

                if (dividerLine) dividerLine.style.left = '18.5rem';

                navLinks.forEach(link => {
                    link.classList.remove('w-12', 'h-12', 'justify-center');
                    link.classList.add('w-full', 'h-12', 'justify-start', 'pl-5');
                    const label = link.querySelector('.md-label');
                    if (label) {
                        label.classList.remove('hidden');
                        label.classList.add('inline');
                    }
                });

                if (logoutBtn) {
                    logoutBtn.classList.remove('w-12', 'justify-start', 'pl-5');
                    logoutBtn.classList.add('w-full', 'justify-center');
                    const label = logoutBtn.querySelector('.md-label');
                    if (label) {
                        label.classList.remove('hidden');
                        label.classList.add('inline');
                    }
                }

            } else {
                // --- CONDENSED STATE ---
                sidebar.classList.remove('w-72');
                sidebar.classList.add('w-20', 'items-center');

                if (logoText) {
                    logoText.classList.remove('opacity-100');
                    logoText.classList.add('hidden', 'opacity-0');
                    // Clear Structure C ad-hoc styles
                    logoText.style.position = '';
                    logoText.style.left = '';
                }

                if (logoImg) {
                    // Clear Structure C ad-hoc styles
                    logoImg.style.position = '';
                    logoImg.style.left = '';
                    logoImg.style.top = '';
                    logoImg.style.transform = '';
                }

                const toggleIcon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;
                if (toggleIcon) {
                    toggleIcon.textContent = 'start';
                    toggleIcon.style.fontSize = '12px';
                }
                
                if (toggleBtn) {
                    toggleBtn.classList.remove('relative');
                    toggleBtn.classList.add('absolute', 'right-[2px]', 'translate-x-[2px]');
                    // Clear Structure C ad-hoc styles
                    toggleBtn.style.position = '';
                    toggleBtn.style.right = '';
                    toggleBtn.style.top = '';
                    toggleBtn.style.transform = '';
                    toggleBtn.style.width = '';
                    toggleBtn.style.height = '';
                }

                if (headerArea) {
                    headerArea.classList.remove('px-6', 'justify-between');
                    headerArea.classList.add('px-0', 'justify-end', 'pr-4');
                    headerArea.style.padding = '0';
                }
                if (headerInner) {
                    headerInner.classList.remove('justify-between');
                    headerInner.classList.add('justify-center');
                }
                if (sidebarNav) {
                    sidebarNav.classList.remove('items-stretch');
                    sidebarNav.classList.add('items-center');
                }

                if (dividerLine) dividerLine.style.left = '5rem';

                navLinks.forEach(link => {
                    link.classList.remove('w-full', 'justify-start', 'pl-5');
                    link.classList.add('w-12', 'h-12', 'justify-center');
                    const label = link.querySelector('.md-label');
                    if (label) {
                        label.classList.remove('inline');
                        label.classList.add('hidden');
                    }
                });

                if (logoutBtn) {
                    logoutBtn.classList.remove('w-full', 'pl-5');
                    logoutBtn.classList.add('w-12', 'justify-center');
                    const label = logoutBtn.querySelector('.md-label');
                    if (label) {
                        label.classList.remove('inline');
                        label.classList.add('hidden');
                    }
                }
            }
        }

        // Disable transitions during initial state to prevent sidebar animation on page load
        const transitionEls = [sidebar, headerArea, headerInner, sidebarNav, dividerLine, toggleBtn, logoText].filter(Boolean);
        navLinks.forEach(l => transitionEls.push(l));
        transitionEls.forEach(el => el.style.transition = 'none');

        // Apply initial state on page load (no animation)
        applySidebarState();

        // Force reflow so the browser paints the correct state before re-enabling transitions
        void sidebar.offsetHeight;

        // Re-enable transitions for future toggles
        transitionEls.forEach(el => el.style.transition = '');
        
        // Remove the temporary class now that JS has control
        setTimeout(() => {
            document.documentElement.classList.remove('sidebar-condensed');
        }, 100);

        // Toggle button click handler
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            localStorage.setItem('sidebarExpanded', isExpanded);
            applySidebarState(true);
        });

        // Logout button click handler (uses Clerk sign-out)
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                logoutBtn.style.pointerEvents = 'none';
                logoutBtn.style.opacity = '0.5';
                localStorage.removeItem('sidebarExpanded');
                localStorage.removeItem('alconio_admin_mode');
                localStorage.removeItem('__clerk_user_id');
                try {
                    if (typeof Clerk !== 'undefined' && Clerk.loaded && Clerk.isSignedIn) {
                        await Clerk.signOut();
                    }
                } catch (err) {
                    console.warn('Clerk signOut error:', err);
                }
                window.location.replace('dashboard_signin.html');
            });
        }
    }

    // --- 2. Notifications Panel ---
    const notifBtn = Array.from(document.querySelectorAll('button')).find(b => {
        const span = b.querySelector('span.material-symbols-outlined');
        return span && span.textContent.trim() === 'notifications';
    });

    if (notifBtn) {
        const notifDropdown = document.createElement('div');
        notifDropdown.className = "absolute top-0 left-full ml-4 w-80 border border-white/10 rounded-2xl overflow-hidden transition-all transform origin-left scale-95 opacity-0 pointer-events-none";
        notifDropdown.style.cssText = 'z-index:99999; background:#050508; box-shadow: 0 20px 60px rgba(0,0,0,0.95), 0 0 30px rgba(0,82,255,0.15); border: 1px solid rgba(0,82,255,0.2);';
        const isAdminPage = window.location.pathname.includes('dashboard_admin');
        const notifLink = isAdminPage ? 'dashboard_admin_notifications.html' : 'dashboard_notifications.html';

        notifDropdown.innerHTML = `
            <div class="p-4 border-b border-white/5 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-electric-blue text-lg">notifications</span>
                    <span class="text-sm font-bold text-white tracking-wide">Notifications</span>
                </div>
                <button id="mark-notifs-read" class="text-[10px] text-electric-blue font-bold tracking-wider hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">MARK ALL READ</button>
            </div>
            <div class="max-h-80 overflow-y-auto notif-list">
                <div class="p-8 text-center text-slate-500 italic text-xs">No notifications</div>
            </div>
            <div class="p-3 border-t border-white/5 text-center">
                <a href="${notifLink}" class="text-xs text-electric-blue hover:text-white transition-colors font-semibold tracking-wide block w-full">View All Notifications</a>
            </div>
        `;

        notifBtn.style.position = 'relative';
        notifBtn.appendChild(notifDropdown);

        async function updateGlobalNotifications() {
            try {
                if (typeof Clerk === 'undefined' || !Clerk.loaded || !Clerk.isSignedIn) return;
                const token = await Clerk.session.getToken();
                
                // 1. Unread count
                const countRes = await fetch('/api/notifications/unread-count', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const { count } = await countRes.json();
                
                let badge = notifBtn.querySelector('.noti-badge');
                if (count > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'noti-badge absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full font-bold border border-black z-10';
                        notifBtn.appendChild(badge);
                    }
                    badge.textContent = count;
                } else if (badge) {
                    badge.remove();
                }

                // 2. Notification List
                const listRes = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const notifications = await listRes.json();
                const listContainer = notifDropdown.querySelector('.notif-list');
                
                if (notifications.length > 0) {
                    listContainer.innerHTML = notifications.map(n => `
                        <div class="p-4 border-b border-white/5 hover:bg-white/5 transition-all relative notif-item ${n.is_read ? 'opacity-60' : 'border-l-2 border-electric-blue bg-electric-blue/5'}" data-id="${n.id}">
                            <p class="text-[11px] ${n.is_read ? 'text-slate-400' : 'text-white'} leading-relaxed">${n.message}</p>
                            <p class="text-[9px] text-slate-500 mt-2">${new Date(n.created_at).toLocaleString()}</p>
                            ${!n.is_read ? '<span class="unread-dot absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_8px_#0052FF]"></span>' : ''}
                        </div>
                    `).join('');
                } else {
                    listContainer.innerHTML = '<div class="p-8 text-center text-slate-500 italic text-xs">No notifications</div>';
                }
            } catch (err) {
                console.warn("[NOTIF] Global fetch failed:", err);
            }
        }

        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = notifDropdown.classList.contains('opacity-0');
            if (window.profileDropdown && !window.profileDropdown.classList.contains('opacity-0')) {
                window.profileDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            }
            if (isHidden) {
                updateGlobalNotifications();
                notifDropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
            } else {
                notifDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            }
        });

        // Initial fetch and poll
        updateGlobalNotifications();
        setInterval(updateGlobalNotifications, 60000); // Once a minute generic check

        // Mark as Read Logic
        const markReadBtn = notifDropdown.querySelector('#mark-notifs-read');
        const mainBadge = notifBtn.querySelector('.bg-electric-blue.rounded-full.absolute'); // The dot on the bell icon

        markReadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            try {
                const token = await Clerk.session.getToken();
                const unreadRows = notifDropdown.querySelectorAll('.notif-item:not(.opacity-60)');
                for (const row of unreadRows) {
                    const id = row.getAttribute('data-id');
                    await fetch(`/api/notifications/${id}/read`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                updateGlobalNotifications();
            } catch (err) {
                console.warn("[NOTIF] Mark all read failed:", err);
            }

            // UI Feedback
            markReadBtn.textContent = 'DONE';
            setTimeout(() => markReadBtn.textContent = 'MARK ALL READ', 2000);
        });

        window.notifDropdown = notifDropdown;
    }

    // --- 3. Premium Profile Dropdown & Header Sync ---
    const profileContainer = document.querySelector('.housed-profile-container');

    if (profileContainer) {
        profileContainer.style.position = 'relative';

        const profileDropdown = document.createElement('div');
        profileDropdown.className = "absolute top-14 right-0 w-72 border border-white/10 rounded-2xl overflow-hidden transition-all transform origin-top-right scale-95 opacity-0 pointer-events-none";
        profileDropdown.style.cssText = 'z-index:99999; background:#050508; box-shadow: 0 20px 60px rgba(0,0,0,0.95), 0 0 30px rgba(0,82,255,0.15); border: 1px solid rgba(0,82,255,0.2);';

        const userRole = Clerk.user?.publicMetadata?.role || 'client';
        const isAdmin = userRole === 'admin';
        
        if (isAdmin) {
            // --- ADMIN EXCLUSIVE DROPDOWN ---
            profileDropdown.innerHTML = `
                <div class="p-5 border-b border-white/5" style="background: linear-gradient(to right, rgba(0,82,255,0.08), transparent);">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-slate-900 overflow-hidden ring-2 ring-electric-blue/30 shadow-lg flex-shrink-0">
                            <img alt="Admin avatar" class="w-full h-full object-cover sync-avatar" src="https://ui-avatars.com/api/?name=Admin&background=0052FF&color=fff"/>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-white truncate sync-name text-left">Admin</p>
                            <p class="text-xs text-slate-400 truncate sync-username text-left">@admin</p>
                            <div class="flex items-center gap-1.5 mt-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                                <span class="text-[10px] text-emerald-400 font-semibold tracking-wide">System Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col py-1">
                    <a href="dashboard_admin_profile.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">admin_panel_settings</span>
                        <span>Admin Profile</span>
                    </a>
                    <a href="dashboard_admin_settings.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">settings</span>
                        <span>Global Settings</span>
                    </a>
                    <a href="dashboard_admin_activity.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">history</span>
                        <span>System Activity</span>
                    </a>
                    <a href="dashboard_admin_billing.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">payments</span>
                        <span>Subscription Management</span>
                    </a>
                </div>
                <div class="h-[1px] bg-white/5 mx-3"></div>
                <div class="p-2">
                    <a href="#" class="px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-3 transition-all rounded-lg group" onclick="window.handleLogout(event)">
                        <span class="material-symbols-outlined text-[18px] text-rose-500/70 group-hover:text-rose-400 transition-colors">logout</span>
                        <span class="font-medium">Admin Sign Out</span>
                    </a>
                </div>
            `;
        } else {
            // --- CLIENT EXCLUSIVE DROPDOWN ---
            profileDropdown.innerHTML = `
                <div class="p-5 border-b border-white/5" style="background: linear-gradient(to right, rgba(0,82,255,0.08), transparent);">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-slate-900 overflow-hidden ring-2 ring-electric-blue/30 shadow-lg flex-shrink-0">
                            <img alt="User avatar" class="w-full h-full object-cover sync-avatar" src="https://ui-avatars.com/api/?name=User&background=0052FF&color=fff"/>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-white truncate sync-name text-left">Loading...</p>
                            <p class="text-xs text-slate-400 truncate sync-username text-left">@user</p>
                            <div class="flex items-center gap-1.5 mt-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                                <span class="text-[10px] text-emerald-400 font-semibold tracking-wide">Client Account</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col py-1">
                    <a href="dashboard_profile.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">person</span>
                        <span>My Profile</span>
                    </a>
                    <a href="dashboard_settings.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">manage_accounts</span>
                        <span>Account Settings</span>
                    </a>
                    <a href="dashboard_appearance.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">palette</span>
                        <span>Appearance</span>
                    </a>
                </div>
                <div class="h-[1px] bg-white/5 mx-3"></div>
                <div class="flex flex-col py-1">
                    <a href="dashboard_activity_log.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">history</span>
                        <span>Recent Activity</span>
                    </a>
                    <a href="dashboard_billing.html" class="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all group">
                        <span class="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-electric-blue transition-colors">credit_card</span>
                        <span>Billing & Payments</span>
                    </a>
                </div>
                <div class="h-[1px] bg-white/5 mx-3"></div>
                <div class="p-2">
                    <a href="#" class="px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-3 transition-all rounded-lg group" onclick="window.handleLogout(event)">
                        <span class="material-symbols-outlined text-[18px] text-rose-500/70 group-hover:text-rose-400 transition-colors">logout</span>
                        <span class="font-medium">Sign Out</span>
                    </a>
                </div>
            `;
        }

        window.profileDropdown = profileDropdown;

        // --- GLOBAL SYNC FUNCTION (Allows dynamic updating without reload) ---
        window.syncGlobalProfileUI = (overrideName = null, overrideUsername = null) => {
            if (typeof Clerk === 'undefined' || !Clerk.loaded || !Clerk.user) return;
            const u = Clerk.user;
            const userRole = u.publicMetadata?.role || 'client';
            const isAdmin = userRole === 'admin';

            // Extract core data
            let primaryEmail = u.primaryEmailAddress?.emailAddress || 'guest@alconio.com';
            
            // Admin Identity Fallback: If name/username is missing, use email
            const firstName = u.firstName;
            const lastName = u.lastName;
            const username = u.username || u.unsafeMetadata?.username;

            let baseName = `${firstName || ''} ${lastName || ''}`.trim();
            if (!baseName && isAdmin) baseName = primaryEmail; // Admin Fallback
            else if (!baseName) baseName = 'User';

            let baseShortName = firstName ? `${firstName} ${lastName ? lastName.charAt(0) + '.' : ''}`.trim() : baseName;

            let baseUsername = '';
            if (username) baseUsername = `@${username}`;
            else if (isAdmin) baseUsername = `@${primaryEmail.split('@')[0]}`; // Admin Fallback
            else baseUsername = '@guest';

            // Apply Live Overrides
            const displayName = overrideName !== null ? overrideName || 'User' : baseName;
            const displayShortName = overrideName !== null ? overrideName || 'User' : baseShortName;

            let displayUsername = overrideUsername !== null ? overrideUsername : baseUsername;
            if (displayUsername && !displayUsername.startsWith('@')) displayUsername = '@' + displayUsername;

            const imgUrl = u.imageUrl || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=0052FF&color=fff');

            // 1. Update the static header housing
            const headerUserEl = profileContainer.querySelector('p.text-xs.font-bold.text-white');
            const headerAvatarEl = profileContainer.querySelector('img[alt="User avatar"]');

            if (headerUserEl) headerUserEl.textContent = displayUsername || displayShortName;
            if (headerAvatarEl) headerAvatarEl.src = imgUrl;

            // 2. Update the dropdown card
            const dropNameEl = profileDropdown.querySelector('.sync-name');
            const dropUserEl = profileDropdown.querySelector('.sync-username');
            const dropAvatarEl = profileDropdown.querySelector('.sync-avatar');

            if (dropNameEl) dropNameEl.textContent = displayName;
            if (dropUserEl) dropUserEl.textContent = displayUsername;
            if (dropAvatarEl) dropAvatarEl.src = imgUrl;

            // 3. Update Website URL display
            const websiteUrl = u.publicMetadata?.websiteUrl || 'ClientSite.com';
            const websiteDisplayEls = document.querySelectorAll('.client-website-display');
            websiteDisplayEls.forEach(el => {
                // Find the text node or the element itself if it contains the URL
                // Based on our HTML, the URL is the second child node (after the status dot)
                if (el.childNodes.length > 2) {
                    el.childNodes[2].textContent = ' ' + websiteUrl.replace(/^https?:\/\//, '');
                } else if (el.innerText.includes('ClientSite.com')) {
                    el.innerHTML = el.innerHTML.replace('ClientSite.com', websiteUrl.replace(/^https?:\/\//, ''));
                }
            });
        };

        // Global handleLogout function for unified use
        window.handleLogout = async (e) => {
            if (e) e.preventDefault();
            console.info("[AUTH] Sign-out triggered.");
            localStorage.removeItem('sidebarExpanded');
            localStorage.removeItem('__clerk_user_id');
            try {
                if (typeof Clerk !== 'undefined' && Clerk.loaded) {
                    await Clerk.signOut();
                }
            } catch(e) { console.warn(e); }
            window.location.replace('dashboard_signin.html');
        };

        // Fire the sync instantly since Clerk is loaded
        window.syncGlobalProfileUI();

        // Stop clicks inside dropdown from closing it
        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Append dropdown to body instead of profileContainer to avoid clipping
        document.body.appendChild(profileDropdown);
        window.profileDropdown = profileDropdown;

        // Find the clickable profile trigger (the div with avatar + name + caret)
        const clickableTrigger = profileContainer.querySelector('.cursor-pointer');

        function positionProfileDropdown() {
            const rect = profileContainer.getBoundingClientRect();
            profileDropdown.style.position = 'fixed';
            profileDropdown.style.top = (rect.bottom + 8) + 'px';
            profileDropdown.style.right = (window.innerWidth - rect.right) + 'px';
            profileDropdown.style.left = 'auto';
        }

        function toggleProfileDropdown(e) {
            e.preventDefault();
            e.stopPropagation();

            const isHidden = profileDropdown.classList.contains('opacity-0');

            // Close notification dropdown if open
            if (window.notifDropdown && !window.notifDropdown.classList.contains('opacity-0')) {
                window.notifDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            }

            if (isHidden) {
                positionProfileDropdown();
                profileDropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                const caret = clickableTrigger ? clickableTrigger.querySelector('span.material-symbols-outlined') : null;
                if (caret) caret.style.transform = 'rotate(180deg)';
            } else {
                profileDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                const caret = clickableTrigger ? clickableTrigger.querySelector('span.material-symbols-outlined') : null;
                if (caret) caret.style.transform = 'rotate(0deg)';
            }
        }

        if (clickableTrigger) {
            clickableTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleProfileDropdown(e);
            });
        }
        
        // Also make the name/role area clickable if they are not part of clickableTrigger
        // But in our current HTML they are children of clickableTrigger.
        // So we don't need an extra listener on profileContainer.
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Don't close if clicking inside the profile dropdown
        if (window.profileDropdown && window.profileDropdown.contains(e.target)) return;
        // Don't close if clicking inside the notification dropdown
        if (window.notifDropdown && window.notifDropdown.contains(e.target)) return;

        if (window.profileDropdown && !window.profileDropdown.classList.contains('opacity-0')) {
            window.profileDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            const caret = document.querySelector('.housed-profile-container .cursor-pointer span.material-symbols-outlined');
            if (caret) caret.style.transform = 'rotate(0deg)';
        }
        if (window.notifDropdown && !window.notifDropdown.classList.contains('opacity-0')) {
            window.notifDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        }
    });

    // --- Global Toast System ---
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(toastContainer);

    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        const icon = type === 'success' ? 'check_circle' : (type === 'error' ? 'cancel' : 'info');
        const color = type === 'success' ? 'text-emerald-400' : (type === 'error' ? 'text-red-400' : 'text-blue-400');
        const border = type === 'success' ? 'border-emerald-500/20' : (type === 'error' ? 'border-red-500/20' : 'border-blue-500/20');
        
        toast.className = `glass-card flex items-center gap-3 px-6 py-4 rounded-2xl border ${border} shadow-2xl translate-x-12 opacity-0 pointer-events-auto transition-all duration-300`;
        toast.innerHTML = `
            <span class="material-symbols-outlined ${color}">${icon}</span>
            <span class="text-sm font-bold text-white tracking-wide">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-12', 'opacity-0');
        });
        
        // Remove after 3s
        setTimeout(() => {
            toast.classList.add('translate-x-12', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

});

/**
 * Settings Page Navigation
 */
function initSettingsNav() {
    const navContainer = document.getElementById('settings-nav');
    if (!navContainer || window.isSettingsInitialized) return;
    window.isSettingsInitialized = true;

    const buttons = navContainer.querySelectorAll('.settings-nav-btn');
    const sections = document.querySelectorAll('.settings-pane');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Update buttons
            buttons.forEach(b => {
                b.classList.remove('bg-electric-blue/10', 'text-white', 'border-electric-blue/20');
                b.classList.add('hover:bg-white/5', 'text-slate-400', 'hover:text-white');
            });
            
            btn.classList.add('bg-electric-blue/10', 'text-white', 'border-electric-blue/20');
            btn.classList.remove('hover:bg-white/5', 'text-slate-400', 'hover:text-white');

            // Update sections
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.remove('hidden');
                } else {
                    sec.classList.add('hidden');
                }
            });
        });
    });
}

// Add to common init if needed
document.addEventListener('DOMContentLoaded', initSettingsNav);
window.addEventListener('load', initSettingsNav);
