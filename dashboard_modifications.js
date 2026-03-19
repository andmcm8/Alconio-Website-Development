document.addEventListener('DOMContentLoaded', async () => {
    // 1. Clerk Authentication
    if (typeof Clerk !== 'undefined' && !Clerk.loaded) {
        await Clerk.load();
    }

    const getToken = async () => {
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
            const groupedContent = await apiFetch('/api/content');
            const container = document.getElementById('contentSections');
            container.innerHTML = '';

            for (const [section, fields] of Object.entries(groupedContent)) {
                const sectionEl = document.createElement('div');
                sectionEl.className = 'glass-card rounded-2xl p-6 border border-white/5';
                sectionEl.innerHTML = `
                    <h4 class="text-xs font-bold uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        ${section}
                    </h4>
                    <div class="space-y-6">
                        ${fields.map(field => `
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all" id="field-row-${field.id}">
                                <div class="flex-1">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">${field.field_name}</label>
                                    <div class="field-display-value text-white font-medium" id="val-${field.id}">${field.field_value}</div>
                                    <div class="field-edit-input hidden" id="edit-box-${field.id}">
                                        <input type="${field.field_type === 'number' || field.field_type === 'price' ? 'number' : 'text'}" 
                                               id="input-${field.id}" 
                                               class="w-full bg-black border border-blue-500/50 rounded-lg px-3 py-2 text-white outline-none" 
                                               value="${field.field_value}">
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 shrink-0">
                                    <button onclick="toggleEdit(${field.id})" class="edit-btn px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all underline underline-offset-4" id="edit-btn-${field.id}">Edit</button>
                                    <div class="hidden gap-2" id="save-btns-${field.id}">
                                        <button onclick="saveField(${field.id})" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-all">Save</button>
                                        <button onclick="toggleEdit(${field.id}, true)" class="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-all">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.appendChild(sectionEl);
            }
        } catch (err) {
            console.error("Failed to load content:", err);
        }
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

        try {
            await apiFetch(`/api/content/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ field_value: newVal })
            });
            display.innerText = newVal;
            toggleEdit(id);
            // Optional: Success toast
        } catch (err) {
            alert("Save failed. Please try again.");
        }
    };

    // 3. Load Requests
    async function loadRequests() {
        try {
            const requests = await apiFetch('/api/modifications');
            const list = document.getElementById('requestList');
            list.innerHTML = requests.map(req => `
                <tr class="group hover:bg-white/5 transition-colors">
                    <td class="px-6 py-5">
                        <div class="text-sm font-bold text-white">${req.title}</div>
                        <div class="text-[10px] text-slate-500 mt-1 max-w-xs truncate">${req.description}</div>
                    </td>
                    <td class="px-6 py-5">
                        <span class="badge badge-${req.status}">${req.status.replace('_', ' ')}</span>
                    </td>
                    <td class="px-6 py-5">
                        <div class="text-xs text-slate-400">${new Date(req.created_at).toLocaleDateString()}</div>
                    </td>
                    <td class="px-6 py-5">
                        <div class="text-[10px] text-slate-500 italic">${req.rejection_reason || '—'}</div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="4" class="px-6 py-10 text-center text-slate-500 italic">No requests submitted yet.</td></tr>';
        } catch (err) {
            console.error("Failed to load requests:", err);
        }
    }

    // Modal & Form
    const modal = document.getElementById('requestModal');
    if (document.getElementById('btnNewRequest')) {
        document.getElementById('btnNewRequest').onclick = () => modal.classList.remove('hidden');
    }
    if (document.getElementById('btnCloseModal')) {
        document.getElementById('btnCloseModal').onclick = () => modal.classList.add('hidden');
    }
    
    if (document.getElementById('requestForm')) {
        document.getElementById('requestForm').onsubmit = async (e) => {
            e.preventDefault();
            const title = document.getElementById('reqTitle').value;
            const description = document.getElementById('reqDesc').value;

            try {
                await apiFetch('/api/modifications', {
                    method: 'POST',
                    body: JSON.stringify({ title, description })
                });
                modal.classList.add('hidden');
                document.getElementById('requestForm').reset();
                loadRequests();
            } catch (err) {
                alert("Submission failed.");
            }
        };
    }

    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            console.log("[MODIFICATIONS] Logout triggered");
            if (typeof window.handleLogout === 'function') {
                window.handleLogout(e);
            } else if (typeof Clerk !== 'undefined') {
                Clerk.signOut();
            } else {
                window.location.href = 'dashboard_signin.html';
            }
        };
    }

    // Init
    loadContent();
    loadRequests();
});
