import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

# Read dashboard_settings.html as the template
with open(os.path.join(curr_dir, "dashboard_settings.html"), 'r', encoding='utf-8') as f:
    template = f.read()

# Extract everything before <main> and after </main>
before_main = template.split('<main')[0]
after_main = '</main>\n' + template.split('</main>')[1]

# We need to fix the aside's active item for each page
def set_active_page(html, active_href):
    # Remove any existing active-nav-item classes and set the correct one
    # First, remove all active-nav-item classes
    html = html.replace(' active-nav-item', '')
    # Remove the active icon styling
    html = re.sub(r'text-electric-blue neon-text-blue text-2xl', 'group-hover:text-electric-blue transition-colors text-2xl', html)
    # Now re-add for the target href - but this is tricky since the hrefs might match.
    # Let's do it from the <a> tags
    return html

def make_page(title, page_title, active_sidebar, main_content):
    page = template
    # Update title
    page = re.sub(r'<title>.*?</title>', f'<title>Alconio Dashboard - {title}</title>', page)
    # Update header title
    page = re.sub(r'<h2 class="text-xl font-bold text-white tracking-wide"[^>]*>.*?</h2>',
                  f'<h2 class="text-xl font-bold text-white tracking-wide" style="text-shadow: 0 0 20px rgba(255,255,255,0.2);">{page_title}</h2>', page)
    # Replace main content
    old_main = re.search(r'<main.*?</main>', page, re.DOTALL)
    if old_main:
        page = page[:old_main.start()] + f'<main class="flex-1 overflow-y-auto h-full p-4 md:p-6 scroll-smooth">\n{main_content}\n</main>' + page[old_main.end():]
    return page

# --- PROFILE PAGE ---
profile_content = """
<div class="max-w-[900px] mx-auto flex flex-col gap-8 pb-12">
    <!-- Profile Header Card -->
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-start gap-8 relative z-10">
            <div class="relative group">
                <div class="w-28 h-28 rounded-full overflow-hidden ring-2 ring-electric-blue/30 shadow-[0_0_30px_rgba(0,82,255,0.2)] flex-shrink-0">
                    <img alt="Profile avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-n-gT0hmTLr68Q785q7si3dFoLMf7H3GynEF6Z2J24-oBY6nDcs61FaN_0-30RLylxw003MUNZjpmJEexdEOJj6EEIbz0kZyi3H7h8vYFqMgF4VyTUf3tatWeOJc4rj5wEdq1c8r291KAyy2Koyp1ed59PBohstiFLTdn9RH0JY9xz4enWsYbeYg0rREdlR6xdaOfvqCBbaSbgP_7p5ElqBZWky_f-ZvrE4SNxQiwFsigcG5W4EJdfdSofsdUwfj2bTUS2j4nyW6y"/>
                </div>
                <button class="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-electric-blue hover:bg-electric-blue-light flex items-center justify-center shadow-[0_0_15px_rgba(0,82,255,0.5)] transition-all border border-white/20">
                    <span class="material-symbols-outlined text-white text-sm">photo_camera</span>
                </button>
            </div>
            <div class="flex-1">
                <h2 class="text-2xl font-bold text-white mb-1">Administrator</h2>
                <p class="text-sm text-slate-400 mb-1">@admin</p>
                <div class="flex items-center gap-3 mt-2">
                    <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-electric-blue/20 text-electric-blue rounded border border-electric-blue/30">Administrator</span>
                    <span class="flex items-center gap-1.5 text-xs text-emerald-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                        Online
                    </span>
                </div>
                <p class="text-xs text-slate-500 mt-3">Senior administrator managing client dashboard configurations and security protocols.</p>
            </div>
        </div>
    </div>

    <!-- Personal Information -->
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">badge</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Personal Information</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Display Name</label>
                <input class="sharp-input w-full p-3 text-sm focus:ring-0" type="text" value="Administrator"/>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                <input class="sharp-input w-full p-3 text-sm focus:ring-0" type="text" value="@admin"/>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                <input class="sharp-input w-full p-3 text-sm focus:ring-0" type="email" value="admin@alconio.com"/>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
                <input class="sharp-input w-full p-3 text-sm focus:ring-0" type="tel" value="+1 (555) 000-8822"/>
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio</label>
                <textarea class="sharp-input w-full p-3 text-sm focus:ring-0 resize-none" rows="3">Senior administrator managing client dashboard configurations and security protocols.</textarea>
            </div>
        </div>
        <div class="flex justify-end gap-3 mt-6 relative z-10">
            <button class="px-5 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded transition-all border border-transparent hover:border-white/10">Cancel</button>
            <button class="px-6 py-2.5 bg-electric-blue hover:bg-electric-blue-light text-white text-sm font-bold rounded shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">save</span>
                Save Changes
            </button>
        </div>
    </div>

    <!-- Connected Accounts -->
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">link</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Connected Accounts</h3>
        </div>
        <div class="space-y-4 relative z-10">
            <div class="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center"><span class="text-[#5865F2] font-bold text-sm">G</span></div>
                    <div>
                        <p class="text-sm font-medium text-white">Google</p>
                        <p class="text-xs text-slate-500">ethan@alconio.com</p>
                    </div>
                </div>
                <span class="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Connected</span>
            </div>
            <div class="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><span class="text-white font-bold text-sm">GH</span></div>
                    <div>
                        <p class="text-sm font-medium text-white">GitHub</p>
                        <p class="text-xs text-slate-500">Not connected</p>
                    </div>
                </div>
                <button class="text-xs text-electric-blue font-bold bg-electric-blue/10 px-3 py-1 rounded-full border border-electric-blue/20 hover:bg-electric-blue/20 transition-all">Connect</button>
            </div>
        </div>
    </div>
</div>
"""

# --- APPEARANCE PAGE ---
appearance_content = """
<div class="max-w-[900px] mx-auto flex flex-col gap-8 pb-12">
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">palette</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Theme</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div class="p-4 rounded-xl bg-black border-2 border-electric-blue cursor-pointer hover:shadow-[0_0_20px_rgba(0,82,255,0.3)] transition-all">
                <div class="h-20 rounded-lg bg-gradient-to-br from-[#0a0a12] to-[#050508] mb-3 flex items-center justify-center border border-white/10">
                    <span class="material-symbols-outlined text-electric-blue text-3xl">dark_mode</span>
                </div>
                <p class="text-sm font-bold text-white text-center">Dark Mode</p>
                <p class="text-[10px] text-electric-blue text-center mt-0.5 font-bold tracking-wider">ACTIVE</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:border-white/20 hover:bg-white/[0.04] transition-all">
                <div class="h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 mb-3 flex items-center justify-center border border-white/10">
                    <span class="material-symbols-outlined text-slate-700 text-3xl">light_mode</span>
                </div>
                <p class="text-sm font-medium text-slate-300 text-center">Light Mode</p>
                <p class="text-[10px] text-slate-500 text-center mt-0.5">Coming Soon</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:border-white/20 hover:bg-white/[0.04] transition-all">
                <div class="h-20 rounded-lg bg-gradient-to-br from-[#0a0a12] to-slate-200 mb-3 flex items-center justify-center border border-white/10">
                    <span class="material-symbols-outlined text-slate-400 text-3xl">contrast</span>
                </div>
                <p class="text-sm font-medium text-slate-300 text-center">System Default</p>
                <p class="text-[10px] text-slate-500 text-center mt-0.5">Follows OS</p>
            </div>
        </div>
    </div>

    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">format_color_fill</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Accent Color</h3>
        </div>
        <div class="flex items-center gap-4 relative z-10">
            <button class="w-10 h-10 rounded-full bg-[#0052FF] ring-2 ring-white/30 shadow-[0_0_15px_rgba(0,82,255,0.5)] transition-all"></button>
            <button class="w-10 h-10 rounded-full bg-violet-600 ring-1 ring-white/10 hover:ring-white/30 transition-all"></button>
            <button class="w-10 h-10 rounded-full bg-emerald-600 ring-1 ring-white/10 hover:ring-white/30 transition-all"></button>
            <button class="w-10 h-10 rounded-full bg-rose-600 ring-1 ring-white/10 hover:ring-white/30 transition-all"></button>
            <button class="w-10 h-10 rounded-full bg-amber-600 ring-1 ring-white/10 hover:ring-white/30 transition-all"></button>
            <button class="w-10 h-10 rounded-full bg-cyan-600 ring-1 ring-white/10 hover:ring-white/30 transition-all"></button>
        </div>
    </div>

    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">view_compact</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Layout Density</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div class="p-4 rounded-xl bg-white/[0.02] border-2 border-electric-blue cursor-pointer transition-all">
                <p class="text-sm font-bold text-white">Comfortable</p>
                <p class="text-xs text-slate-500 mt-1">More spacing between elements for a relaxed view.</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <p class="text-sm font-medium text-slate-300">Compact</p>
                <p class="text-xs text-slate-500 mt-1">Tighter spacing to show more information at once.</p>
            </div>
        </div>
    </div>
</div>
"""

# --- TEAM PAGE ---
team_content = """
<div class="max-w-[1200px] mx-auto flex flex-col gap-8 pb-12">
    <div class="flex items-center justify-between mt-2">
        <div>
            <h2 class="text-xl font-bold text-white">Team Members</h2>
            <p class="text-sm text-slate-400 mt-1">Manage your team and their permissions.</p>
        </div>
        <button class="px-5 py-2.5 bg-electric-blue hover:bg-electric-blue-light text-white text-sm font-bold rounded-lg shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">person_add</span>
            Invite Member
        </button>
    </div>

    <div class="glass-panel rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div class="neon-border-top"></div>
        <table class="w-full relative z-10">
            <thead>
                <tr class="border-b border-white/5">
                    <th class="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                    <th class="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th class="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th class="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Active</th>
                    <th class="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue font-bold text-sm">AD</div>
                            <div>
                                <p class="text-sm font-medium text-white">Administrator</p>
                                <p class="text-xs text-slate-500">admin@alconio.com</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4"><span class="text-xs font-bold bg-electric-blue/20 text-electric-blue px-2.5 py-1 rounded border border-electric-blue/30">Owner</span></td>
                    <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs text-emerald-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Online</span></td>
                    <td class="px-6 py-4 text-xs text-slate-400">Now</td>
                    <td class="px-6 py-4 text-right"><span class="text-xs text-slate-500">—</span></td>
                </tr>
                <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm">SC</div>
                            <div>
                                <p class="text-sm font-medium text-white">Sarah Chen</p>
                                <p class="text-xs text-slate-500">sarah@alconio.com</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4"><span class="text-xs font-bold bg-violet-500/20 text-violet-400 px-2.5 py-1 rounded border border-violet-500/30">Editor</span></td>
                    <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs text-emerald-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Online</span></td>
                    <td class="px-6 py-4 text-xs text-slate-400">2 min ago</td>
                    <td class="px-6 py-4 text-right"><button class="text-xs text-slate-400 hover:text-white transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button></td>
                </tr>
                <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">MB</div>
                            <div>
                                <p class="text-sm font-medium text-white">Marcus Brooks</p>
                                <p class="text-xs text-slate-500">marcus@alconio.com</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4"><span class="text-xs font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded border border-amber-500/30">Viewer</span></td>
                    <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>Offline</span></td>
                    <td class="px-6 py-4 text-xs text-slate-400">3 hours ago</td>
                    <td class="px-6 py-4 text-right"><button class="text-xs text-slate-400 hover:text-white transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button></td>
                </tr>
                <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">LK</div>
                            <div>
                                <p class="text-sm font-medium text-white">Lisa Kim</p>
                                <p class="text-xs text-slate-500">lisa@alconio.com</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4"><span class="text-xs font-bold bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded border border-cyan-500/30">Editor</span></td>
                    <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs text-amber-400"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Away</span></td>
                    <td class="px-6 py-4 text-xs text-slate-400">45 min ago</td>
                    <td class="px-6 py-4 text-right"><button class="text-xs text-slate-400 hover:text-white transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button></td>
                </tr>
                <tr class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-sm">JD</div>
                            <div>
                                <p class="text-sm font-medium text-white">James Davis</p>
                                <p class="text-xs text-slate-500">james@alconio.com</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4"><span class="text-xs font-bold bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded border border-rose-500/30">Viewer</span></td>
                    <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>Offline</span></td>
                    <td class="px-6 py-4 text-xs text-slate-400">Yesterday</td>
                    <td class="px-6 py-4 text-right"><button class="text-xs text-slate-400 hover:text-white transition-colors"><span class="material-symbols-outlined text-sm">more_vert</span></button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
"""

# --- INTEGRATIONS PAGE ---
integrations_content = """
<div class="max-w-[1200px] mx-auto flex flex-col gap-8 pb-12">
    <div class="mt-2">
        <h2 class="text-xl font-bold text-white">Integrations</h2>
        <p class="text-sm text-slate-400 mt-1">Connect third-party tools and services to supercharge your workflow.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all group">
            <div class="neon-border-top"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-[#4A154B]/30 flex items-center justify-center border border-[#4A154B]/30"><span class="text-2xl font-bold text-[#E01E5A]">S</span></div>
                <div>
                    <p class="text-sm font-bold text-white">Slack</p>
                    <p class="text-[10px] text-slate-500">Messaging</p>
                </div>
            </div>
            <p class="text-xs text-slate-400 mb-4 relative z-10">Get real-time dashboard notifications directly in your Slack channels.</p>
            <div class="flex items-center justify-between relative z-10">
                <span class="text-xs text-emerald-400 font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Connected</span>
                <button class="text-xs text-slate-400 hover:text-white transition-colors">Configure</button>
            </div>
        </div>

        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all group">
            <div class="neon-border-top"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><span class="text-2xl font-bold text-white">GH</span></div>
                <div>
                    <p class="text-sm font-bold text-white">GitHub</p>
                    <p class="text-[10px] text-slate-500">Version Control</p>
                </div>
            </div>
            <p class="text-xs text-slate-400 mb-4 relative z-10">Sync deployments and track commits linked to your projects.</p>
            <div class="flex items-center justify-between relative z-10">
                <span class="text-xs text-emerald-400 font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Connected</span>
                <button class="text-xs text-slate-400 hover:text-white transition-colors">Configure</button>
            </div>
        </div>

        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-white/20 transition-all group">
            <div class="neon-border-top"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-[#4285F4]/20 flex items-center justify-center border border-[#4285F4]/20"><span class="text-2xl font-bold text-[#4285F4]">G</span></div>
                <div>
                    <p class="text-sm font-bold text-white">Google Analytics</p>
                    <p class="text-[10px] text-slate-500">Analytics</p>
                </div>
            </div>
            <p class="text-xs text-slate-400 mb-4 relative z-10">Import Google Analytics data directly into your dashboard.</p>
            <div class="flex items-center justify-between relative z-10">
                <span class="text-xs text-slate-500 font-medium">Not connected</span>
                <button class="text-xs text-electric-blue font-bold hover:text-white transition-colors">Connect</button>
            </div>
        </div>

        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-white/20 transition-all group">
            <div class="neon-border-top"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-[#FF6C37]/20 flex items-center justify-center border border-[#FF6C37]/20"><span class="text-2xl font-bold text-[#FF6C37]">P</span></div>
                <div>
                    <p class="text-sm font-bold text-white">Postman</p>
                    <p class="text-[10px] text-slate-500">API Testing</p>
                </div>
            </div>
            <p class="text-xs text-slate-400 mb-4 relative z-10">Monitor API health and run automated tests on your endpoints.</p>
            <div class="flex items-center justify-between relative z-10">
                <span class="text-xs text-slate-500 font-medium">Not connected</span>
                <button class="text-xs text-electric-blue font-bold hover:text-white transition-colors">Connect</button>
            </div>
        </div>

        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-white/20 transition-all group">
            <div class="neon-border-top"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-[#00D4AA]/20 flex items-center justify-center border border-[#00D4AA]/20"><span class="text-2xl font-bold text-[#00D4AA]">N</span></div>
                <div>
                    <p class="text-sm font-bold text-white">Netlify</p>
                    <p class="text-[10px] text-slate-500">Hosting</p>
                </div>
            </div>
            <p class="text-xs text-slate-400 mb-4 relative z-10">Auto-deploy and manage your production hosting from the dashboard.</p>
            <div class="flex items-center justify-between relative z-10">
                <span class="text-xs text-slate-500 font-medium">Not connected</span>
                <button class="text-xs text-electric-blue font-bold hover:text-white transition-colors">Connect</button>
            </div>
        </div>

        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-white/20 transition-all group">
            <div class="neon-border-top"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-[#7B68EE]/20 flex items-center justify-center border border-[#7B68EE]/20"><span class="text-2xl font-bold text-[#7B68EE]">F</span></div>
                <div>
                    <p class="text-sm font-bold text-white">Figma</p>
                    <p class="text-[10px] text-slate-500">Design</p>
                </div>
            </div>
            <p class="text-xs text-slate-400 mb-4 relative z-10">Import design files and sync mockups directly into your resources.</p>
            <div class="flex items-center justify-between relative z-10">
                <span class="text-xs text-slate-500 font-medium">Not connected</span>
                <button class="text-xs text-electric-blue font-bold hover:text-white transition-colors">Connect</button>
            </div>
        </div>
    </div>
</div>
"""

pages = [
    ("dashboard_profile.html", "My Profile", "Profile", None, profile_content),
    ("dashboard_appearance.html", "Appearance", "Appearance", None, appearance_content),
    ("dashboard_team.html", "Team Members", "Team", None, team_content),
    ("dashboard_integrations.html", "Integrations", "Integrations", None, integrations_content),
]

for (filename, title, page_title, _, content) in pages:
    page = make_page(title, page_title, None, content)
    filepath = os.path.join(curr_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(page)
    print(f"Created: {filename}")

print("Done creating all new dashboard pages.")
