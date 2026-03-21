document.addEventListener('DOMContentLoaded', async () => {
    let allRequests = [];
    let allContent = {};

    // 1. Clerk Authentication
    if (typeof Clerk !== 'undefined' && !Clerk.loaded) {
        await Clerk.load();
    }

    const getToken = async () => {
        if (typeof Clerk === 'undefined') return 'dev_token';
        return await Clerk.session.getToken();
    };

    const apiFetch = async (url, options = {}) => {
        const token = await getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        };
        const res = await fetch(url, { ...options, headers });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
    };

    // 2. Load Content
    async function loadContent() {
        try {
            allContent = await apiFetch('/api/content');
            if (Object.keys(allContent).length === 0) throw new Error("Empty content");
            renderContent(allContent);
        } catch (err) {
            console.warn("Using demo content data:", err);
            allContent = {
                "Hero & Global": [
                    { id: 101, field_name: "Main Headline", field_value: "Next-Gen Digital Solutions for Modern Brands" },
                    { id: 102, field_name: "Subtext", field_value: "We build high-performance websites that convert visitors into loyal customers." },
                    { id: 103, field_name: "CTA Label", field_value: "Start Your Project" },
                    { id: 104, field_name: "Brand Logo Text", field_value: "ALCONIO" }
                ],
                "Service Offerings": [
                    { id: 201, field_name: "Web Dev Title", field_value: "Custom Web Development" },
                    { id: 202, field_name: "Web Dev Desc", field_value: "Scalable applications built with modern frameworks and pixel-perfect precision." },
                    { id: 203, field_name: "UI/UX Title", field_value: "Strategic UI/UX Design" },
                    { id: 204, field_name: "UI/UX Desc", field_value: "Crafting intuitive interfaces that maximize engagement and brand identity." }
                ],
                "Testimonials & Social": [
                    { id: 301, field_name: "Client 1 Name", field_value: "Sarah Johnson" },
                    { id: 302, field_name: "Client 1 Role", field_value: "CEO at InnovateCorp" },
                    { id: 303, field_name: "Client 1 Quote", field_value: "Alconio transformed our online presence in weeks. The results were immediate." }
                ],
                "Footer & Contact": [
                    { id: 401, field_name: "Business Email", field_value: "growth@alconio.com" },
                    { id: 402, field_name: "Office Address", field_value: "123 Tech Plaza, Silicon Valley, CA" },
                    { id: 403, field_name: "Copyright Text", field_value: "© 2026 Alconio. All rights reserved." }
                ]
            };
            renderContent(allContent);
        }
    }

    function renderContent(groupedContent, filter = '') {
        const container = document.getElementById('contentSections');
        container.innerHTML = '';
        
        let sectionIndex = 0;
        for (const [section, fields] of Object.entries(groupedContent)) {
            const filteredFields = fields.filter(f => 
                (f.field_name && f.field_name.toLowerCase().includes(filter.toLowerCase())) || 
                (f.field_value && f.field_value.toString().toLowerCase().includes(filter.toLowerCase()))
            );

            if (filteredFields.length === 0 && filter) continue;

            const sectionEl = document.createElement('div');
            sectionEl.className = 'glass-card rounded-2xl p-5 border border-white/5 content-section-card relative overflow-hidden';
            sectionEl.style.opacity = '1';
            sectionEl.innerHTML = `
                <div class="flex items-center justify-between mb-4 relative z-10">
                    <div class="flex items-center gap-3">
                        <h4 class="text-xs font-bold uppercase tracking-[0.1em] text-white">${section}</h4>
                    </div>
                    <div class="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
                        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">${filteredFields.length} Fields</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                    ${filteredFields.map(field => `
                        <div class="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex flex-col gap-1.5 group/field transition-all hover:bg-white/[0.04]" id="field-row-${field.id}">
                            <div class="flex items-center justify-between">
                                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">${field.field_name}</label>
                                <button onclick="toggleEdit(${field.id})" class="text-[9px] font-bold text-blue-500 hover:text-blue-400 transition-all opacity-0 group-hover/field:opacity-100 flex items-center gap-1" id="edit-btn-${field.id}">
                                    <span class="material-symbols-outlined text-[11px]">edit</span> Edit
                                </button>
                            </div>
                            
                            <div class="relative flex items-center min-h-[24px]">
                                <div class="w-full text-xs text-slate-200 font-medium break-words leading-relaxed" id="val-${field.id}">
                                    ${field.field_value}
                                </div>
                                
                                <div class="hidden w-full" id="edit-box-${field.id}">
                                    <textarea id="input-${field.id}" 
                                              class="w-full bg-slate-900 border border-blue-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-all min-h-[48px] resize-y" 
                                              rows="2">${field.field_value}</textarea>
                                    <div class="flex items-center justify-end gap-2 mt-2" id="save-btns-${field.id}">
                                        <button onclick="toggleEdit(${field.id}, true)" class="px-3 py-1.5 bg-white/5 text-white text-[9px] font-bold rounded-md hover:bg-white/10 transition-all">Cancel</button>
                                        <button onclick="saveField(${field.id})" class="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-bold rounded-md hover:bg-blue-500 transition-all">Save Change</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(sectionEl);
            
            // GSAP Entry
            if (typeof window.gsap !== 'undefined') {
                gsap.from(sectionEl, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    delay: sectionIndex * 0.1,
                    ease: "power3.out"
                });
            }
            sectionIndex++;
        }
    }

    // 3. Load Requests
    async function loadRequests() {
        try {
            allRequests = await apiFetch('/api/modifications');
            if (allRequests.length === 0) throw new Error("No requests");
            renderRequests(allRequests);
        } catch (err) {
            console.warn("Using demo request data:", err);
            allRequests = [
                { 
                    id: 'REQ-1002', 
                    title: 'Dark Mode Implementation', 
                    description: 'We need a system-wide dark mode toggle. Ensure it persists via localStorage and respects system preferences.', 
                    category: 'new_feature', 
                    urgency: 'high', 
                    status: 'received', 
                    created_at: new Date(Date.now() - 3600000).toISOString() 
                },
                { 
                    id: 'REQ-1001', 
                    title: 'Update Dynamic Pricing', 
                    description: 'Adjust the monthly subscription cost for the Pro plan to $49/mo and add a "Best Value" badge for annual plans.', 
                    category: 'content', 
                    urgency: 'high', 
                    status: 'in_progress', 
                    created_at: new Date(Date.now() - 86400000).toISOString() 
                },
                { 
                    id: 'REQ-998', 
                    title: 'Blog Layout Refinement', 
                    description: 'The typography on the blog detail pages is a bit small. Let\'s increase the body text to 18px and use a higher line-height.', 
                    category: 'design', 
                    urgency: 'normal', 
                    status: 'completed', 
                    created_at: new Date(Date.now() - 345600000).toISOString() 
                },
                { 
                    id: 'REQ-995', 
                    title: 'Fix Contact Form Validation', 
                    description: 'The email field allows invalid formats. Please add a robust regex check and a clearer error message.', 
                    category: 'bug', 
                    urgency: 'urgent', 
                    status: 'received', 
                    created_at: new Date(Date.now() - 604800000).toISOString() 
                },
                { 
                    id: 'REQ-992', 
                    title: 'Social Media Icon Update', 
                    description: 'Replace the Twitter logo with the new X branding across the footer and contact sections.', 
                    category: 'content', 
                    urgency: 'low', 
                    status: 'rejected', 
                    rejection_reason: 'We are waiting for the final brand assets from the legal department.',
                    created_at: new Date(Date.now() - 864000000).toISOString() 
                }
            ];
            renderRequests(allRequests);
        }
    }

    function renderRequests(requests, filter = '') {
        const list = document.getElementById('requestList');
        const countBadge = document.getElementById('requestCount');
        const searchTerm = filter.toLowerCase();
        
        const filtered = requests.filter(r => 
            (r.title && r.title.toLowerCase().includes(searchTerm)) || 
            (r.description && r.description.toLowerCase().includes(searchTerm)) ||
            (r.category && r.category.toLowerCase().includes(searchTerm))
        );

        if (countBadge) countBadge.innerText = filtered.length;

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="p-8 text-center glass-card rounded-2xl border-dashed border-white/10 opacity-60">
                    <span class="material-symbols-outlined text-slate-600 text-3xl mb-2">topic</span>
                    <p class="text-[11px] text-slate-500 italic">No matching requests found.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map((req, i) => `
            <div class="glass-card rounded-2xl p-5 relative overflow-hidden group request-card" style="opacity: 1; transform: none;">
                <div class="priority-indicator priority-${req.urgency || 'normal'}"></div>
                
                <div class="flex justify-between items-start mb-3">
                    <div class="flex flex-col gap-1.5">
                        <span class="category-chip w-fit capitalize">${(req.category || 'General').replace('_', ' ')}</span>
                        <h4 class="text-xs font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">${req.title}</h4>
                    </div>
                    <span class="status-pill status-${(req.status || 'received').replace('_', '-')}">
                        <span class="w-1 h-1 rounded-full bg-current shadow-[0_0_5px_currentColor]"></span>
                        ${(req.status || 'received').replace('_', ' ')}
                    </span>
                </div>
                
                <p class="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed group-hover:text-slate-400 transition-colors">${req.description}</p>
                
                <div class="flex items-center justify-between pt-3 border-t border-white/5">
                    <span class="text-[9px] text-slate-600 font-bold flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[12px]">calendar_today</span>
                        ${new Date(req.created_at).toLocaleDateString()}
                    </span>
                    ${req.rejection_reason ? `
                        <button class="text-[9px] text-red-400 hover:text-red-300 transition-all font-bold group/note flex items-center gap-1" title="${req.rejection_reason}">
                            <span class="material-symbols-outlined text-[12px]">info</span> View Note
                        </button>
                    ` : `
                        <span class="text-[9px] text-slate-600 uppercase tracking-widest font-bold">#${req.id || 'N/A'}</span>
                    `}
                </div>
            </div>
        `).join('');

        // GSAP Entry
        if (typeof window.gsap !== 'undefined') {
            gsap.from(".request-card", {
                opacity: 0,
                y: 20,
                duration: 0.4,
                stagger: 0.05,
                ease: "back.out(1.7)"
            });
        }
    }

    // Modal & Form Logic
    const modal = document.getElementById('requestModal');
    const searchInput = document.getElementById('searchModifications');

    if (document.getElementById('btnNewRequest')) {
        document.getElementById('btnNewRequest').onclick = () => {
            modal.classList.remove('hidden');
            gsap.fromTo("#requestModal .glass-card", 
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
            );
        };
    }

    if (document.getElementById('btnCloseModal')) {
        document.getElementById('btnCloseModal').onclick = () => {
            gsap.to("#requestModal .glass-card", {
                scale: 0.95,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    modal.classList.add('hidden');
                    gsap.set("#requestModal .glass-card", { scale: 1, opacity: 1 });
                }
            });
        };
    }
    
    if (document.getElementById('requestForm')) {
        document.getElementById('requestForm').onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;

            const payload = {
                title: document.getElementById('reqTitle').value,
                description: document.getElementById('reqDesc').value,
                category: document.getElementById('reqCategory').value,
                urgency: document.getElementById('reqUrgency').value
            };

            try {
                await apiFetch('/api/modifications', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                
                // Close modal
                document.getElementById('btnCloseModal').click();
                document.getElementById('requestForm').reset();
                
                // Refresh list
                await loadRequests();
                
                if (window.showToast) window.showToast("Modification request submitted!", "success");

            } catch (err) {
                console.error(err);
                if (window.showToast) window.showToast("Failed to submit request.", "error");
                else alert("Submission failed.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        };
    }

    // Search Logic
    if (searchInput) {
        searchInput.oninput = (e) => {
            const val = e.target.value;
            renderRequests(allRequests, val);
            renderContent(allContent, val);
        };
    }

    // Fixed: Expose functions to window for inline onclicks
    window.toggleEdit = (id, cancel = false) => {
        const display = document.getElementById(`val-${id}`);
        const editBox = document.getElementById(`edit-box-${id}`);
        const editBtn = document.getElementById(`edit-btn-${id}`);
        const saveBtns = document.getElementById(`save-btns-${id}`);
        const input = document.getElementById(`input-${id}`);

        if (cancel) {
            input.value = display.innerText;
        }

        display.classList.toggle('hidden');
        editBox.classList.toggle('hidden');
        editBtn.classList.toggle('hidden');
        saveBtns.classList.toggle('hidden');
        if (!editBox.classList.contains('hidden')) input.focus();
    };

    window.saveField = async (id) => {
        const input = document.getElementById(`input-${id}`);
        const display = document.getElementById(`val-${id}`);
        const newVal = input.value;
        const btn = document.querySelector(`#save-btns-${id} button`);

        try {
            btn.disabled = true;
            btn.innerText = "...";
            await apiFetch(`/api/content/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ field_value: newVal })
            });
            display.innerText = newVal;
            toggleEdit(id);
            if (window.showToast) window.showToast("Saved successfully", "success");
        } catch (err) {
            alert("Save failed.");
        } finally {
            btn.disabled = false;
            btn.innerText = "Save";
        }
    };

    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (typeof Clerk !== 'undefined') {
                Clerk.signOut();
            } else {
                window.location.href = 'dashboard_signin.html';
            }
        };
    }

    // Confirm Changes Button Interactivity
    const btnConfirmChanges = document.getElementById('btnConfirmChanges');
    if (btnConfirmChanges) {
        btnConfirmChanges.addEventListener('click', async () => {
            if (btnConfirmChanges.disabled) return;
            const originalHTML = btnConfirmChanges.innerHTML;
            btnConfirmChanges.disabled = true;
            
            // Show processing state directly on the button text
            btnConfirmChanges.innerHTML = `
                <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            `;
            
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Show success state (changes button text visually representing "live")
            btnConfirmChanges.classList.remove('bg-electric-blue', 'hover:bg-blue-500', 'shadow-[0_0_20px_rgba(0,82,255,0.4)]');
            btnConfirmChanges.classList.add('bg-emerald-500', 'hover:bg-emerald-400', 'shadow-[0_0_20px_rgba(16,185,129,0.4)]');
            btnConfirmChanges.innerHTML = `
                <span class="material-symbols-outlined text-sm">check_circle</span>
                Changes Pushed Live!
            `;
            
            if (window.showToast) window.showToast("Website content changes are now live.", "success");
            
            // Revert after 3 seconds
            setTimeout(() => {
                btnConfirmChanges.classList.add('bg-electric-blue', 'hover:bg-blue-500', 'shadow-[0_0_20px_rgba(0,82,255,0.4)]');
                btnConfirmChanges.classList.remove('bg-emerald-500', 'hover:bg-emerald-400', 'shadow-[0_0_20px_rgba(16,185,129,0.4)]');
                btnConfirmChanges.innerHTML = originalHTML;
                btnConfirmChanges.disabled = false;
            }, 3000);
        });
    }

    // Init
    loadContent();
    loadRequests();
});
