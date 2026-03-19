import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

# Read dashboard_settings.html as the template
with open(os.path.join(curr_dir, "dashboard_settings.html"), 'r', encoding='utf-8') as f:
    template = f.read()

def make_page(title, page_title, main_content):
    page = template
    page = re.sub(r'<title>.*?</title>', f'<title>Alconio Dashboard - {title}</title>', page)
    page = re.sub(r'<h2 class="text-xl font-bold text-white tracking-wide"[^>]*>.*?</h2>',
                  f'<h2 class="text-xl font-bold text-white tracking-wide" style="text-shadow: 0 0 20px rgba(255,255,255,0.2);">{page_title}</h2>', page)
    old_main = re.search(r'<main.*?</main>', page, re.DOTALL)
    if old_main:
        page = page[:old_main.start()] + f'<main class="flex-1 overflow-y-auto h-full p-4 md:p-6 scroll-smooth">\n{main_content}\n</main>' + page[old_main.end():]
    # Remove active nav items since these aren't in normal sidebar nav
    page = page.replace(' active-nav-item', '')
    page = page.replace('text-electric-blue neon-text-blue text-2xl nav-icon', 'group-hover:text-electric-blue transition-colors text-2xl nav-icon')
    return page

# --- HELP & SUPPORT PAGE ---
help_content = """
<div class="max-w-[900px] mx-auto flex flex-col gap-8 pb-12">
    <div class="mt-2">
        <h2 class="text-xl font-bold text-white">Help & Support</h2>
        <p class="text-sm text-slate-400 mt-1">Find answers to common questions or reach out to our support team.</p>
    </div>

    <!-- Search -->
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="relative z-10">
            <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input class="sharp-input w-full p-4 pl-12 text-sm focus:ring-0" type="text" placeholder="Search for help articles, guides, and FAQs..."/>
            </div>
        </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10 text-center">
                <div class="w-14 h-14 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-electric-blue text-2xl">rocket_launch</span>
                </div>
                <h3 class="text-sm font-bold text-white mb-2 group-hover:text-electric-blue transition-colors">Getting Started</h3>
                <p class="text-xs text-slate-500">Learn the basics of setting up and navigating your dashboard.</p>
            </div>
        </div>
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10 text-center">
                <div class="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-violet-400 text-2xl">integration_instructions</span>
                </div>
                <h3 class="text-sm font-bold text-white mb-2 group-hover:text-electric-blue transition-colors">API Reference</h3>
                <p class="text-xs text-slate-500">Explore endpoints, authentication, and integration patterns.</p>
            </div>
        </div>
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10 text-center">
                <div class="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-amber-400 text-2xl">school</span>
                </div>
                <h3 class="text-sm font-bold text-white mb-2 group-hover:text-electric-blue transition-colors">Video Tutorials</h3>
                <p class="text-xs text-slate-500">Watch step-by-step guides for advanced features.</p>
            </div>
        </div>
    </div>

    <!-- FAQ -->
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">quiz</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Frequently Asked Questions</h3>
        </div>
        <div class="space-y-4 relative z-10">
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-white">How do I add a new team member?</h4>
                    <span class="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                </div>
                <p class="text-xs text-slate-400 mt-2">Navigate to Team Members from the profile dropdown, then click "Invite Member" to add new team members by email.</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-white">How do I connect third-party integrations?</h4>
                    <span class="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                </div>
                <p class="text-xs text-slate-400 mt-2">Go to Integrations from the profile dropdown and click "Connect" on any available service to begin the OAuth authorization flow.</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-white">How do I change my subscription plan?</h4>
                    <span class="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                </div>
                <p class="text-xs text-slate-400 mt-2">Visit the Billing & Plans page from the profile dropdown to view available plans and upgrade or downgrade your subscription.</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-white">Can I export my dashboard data?</h4>
                    <span class="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                </div>
                <p class="text-xs text-slate-400 mt-2">Yes! Navigate to Analytics or Performance, then use the export button in the top right corner to download CSV or PDF reports.</p>
            </div>
        </div>
    </div>

    <!-- Contact Support -->
    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">support_agent</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Contact Support</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div class="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-electric-blue/20 transition-all text-center cursor-pointer">
                <span class="material-symbols-outlined text-electric-blue text-3xl mb-3 block">chat</span>
                <h4 class="text-sm font-bold text-white mb-1">Live Chat</h4>
                <p class="text-xs text-slate-500">Chat with our support team in real-time. Available 24/7.</p>
                <button class="mt-4 px-4 py-2 bg-electric-blue/10 text-electric-blue text-xs font-bold rounded-lg border border-electric-blue/20 hover:bg-electric-blue/20 transition-all">Start Chat</button>
            </div>
            <div class="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-electric-blue/20 transition-all text-center cursor-pointer">
                <span class="material-symbols-outlined text-electric-blue text-3xl mb-3 block">mail</span>
                <h4 class="text-sm font-bold text-white mb-1">Email Support</h4>
                <p class="text-xs text-slate-500">Send us an email and we'll respond within 24 hours.</p>
                <button class="mt-4 px-4 py-2 bg-white/5 text-slate-300 text-xs font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-all">support@alconio.com</button>
            </div>
        </div>
    </div>
</div>
"""

# --- BUG REPORT PAGE ---
bugreport_content = """
<div class="max-w-[800px] mx-auto flex flex-col gap-8 pb-12">
    <div class="mt-2">
        <h2 class="text-xl font-bold text-white">Report a Bug</h2>
        <p class="text-sm text-slate-400 mt-1">Help us improve by reporting any issues you encounter.</p>
    </div>

    <div class="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="flex items-center gap-3 mb-8 relative z-10 border-b border-white/5 pb-4">
            <span class="material-symbols-outlined text-electric-blue text-2xl">bug_report</span>
            <h3 class="text-lg font-bold text-white tracking-wide">Bug Report Form</h3>
        </div>
        <div class="space-y-6 relative z-10">
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bug Title</label>
                <input class="sharp-input w-full p-3 text-sm focus:ring-0" type="text" placeholder="Brief description of the issue..."/>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <div class="relative">
                    <select class="sharp-input w-full p-3 text-sm appearance-none focus:ring-0 cursor-pointer" style="background-color: rgba(0,0,0,0.6);">
                        <option>UI / Visual Issue</option>
                        <option>Functionality Bug</option>
                        <option>Performance Issue</option>
                        <option>Data Accuracy</option>
                        <option>Security Concern</option>
                        <option>Other</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-3 text-slate-500 pointer-events-none text-sm">expand_more</span>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity</label>
                <div class="flex gap-3">
                    <button class="px-4 py-2 rounded-lg text-xs font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400 hover:bg-slate-500/20 transition-all">Low</button>
                    <button class="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all">Medium</button>
                    <button class="px-4 py-2 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all">High</button>
                    <button class="px-4 py-2 rounded-lg text-xs font-bold bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-all">Critical</button>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Steps to Reproduce</label>
                <textarea class="sharp-input w-full p-3 text-sm focus:ring-0 resize-none" rows="4" placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."></textarea>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Behavior</label>
                <textarea class="sharp-input w-full p-3 text-sm focus:ring-0 resize-none" rows="2" placeholder="What should have happened?"></textarea>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actual Behavior</label>
                <textarea class="sharp-input w-full p-3 text-sm focus:ring-0 resize-none" rows="2" placeholder="What actually happened?"></textarea>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attachments</label>
                <div class="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-electric-blue/30 transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-slate-500 text-3xl mb-2 block">cloud_upload</span>
                    <p class="text-xs text-slate-400">Drag and drop files or <span class="text-electric-blue font-bold">browse</span></p>
                    <p class="text-[10px] text-slate-500 mt-1">PNG, JPG, or GIF up to 10MB</p>
                </div>
            </div>
            <div class="flex justify-end gap-3 pt-2">
                <a href="dashboard_overview.html" class="px-5 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded transition-all border border-transparent hover:border-white/10">Cancel</a>
                <button class="px-6 py-2.5 bg-electric-blue hover:bg-electric-blue-light text-white text-sm font-bold rounded shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">send</span>
                    Submit Report
                </button>
            </div>
        </div>
    </div>
</div>
"""

# --- DOCUMENTATION PAGE ---
docs_content = """
<div class="max-w-[1200px] mx-auto flex flex-col gap-8 pb-12">
    <div class="mt-2">
        <h2 class="text-xl font-bold text-white">Documentation</h2>
        <p class="text-sm text-slate-400 mt-1">Comprehensive guides and references for the Alconio platform.</p>
    </div>

    <!-- Search -->
    <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div class="neon-border-top"></div>
        <div class="relative z-10">
            <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input class="sharp-input w-full p-4 pl-12 text-sm focus:ring-0" type="text" placeholder="Search documentation..."/>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Getting Started -->
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-electric-blue">rocket_launch</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">Getting Started</h3>
                </div>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Quick Start Guide</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Dashboard Overview</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Account Setup</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>First Steps</li>
                </ul>
                <p class="text-[10px] text-slate-500 mt-4">4 articles</p>
            </div>
        </div>

        <!-- Analytics -->
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-violet-400">pie_chart</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">Analytics & Reporting</h3>
                </div>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Understanding Metrics</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Custom Reports</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Data Export</li>
                </ul>
                <p class="text-[10px] text-slate-500 mt-4">3 articles</p>
            </div>
        </div>

        <!-- Team Management -->
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-emerald-400">groups</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">Team Management</h3>
                </div>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Inviting Members</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Roles & Permissions</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Activity Monitoring</li>
                </ul>
                <p class="text-[10px] text-slate-500 mt-4">3 articles</p>
            </div>
        </div>

        <!-- Integrations -->
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-amber-400">extension</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">Integrations</h3>
                </div>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Slack Integration</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>GitHub Sync</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Webhooks</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>API Keys</li>
                </ul>
                <p class="text-[10px] text-slate-500 mt-4">4 articles</p>
            </div>
        </div>

        <!-- Security -->
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-rose-400">security</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">Security</h3>
                </div>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Two-Factor Auth</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Password Policies</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Session Management</li>
                </ul>
                <p class="text-[10px] text-slate-500 mt-4">3 articles</p>
            </div>
        </div>

        <!-- Billing -->
        <div class="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative hover:border-electric-blue/30 transition-all cursor-pointer group">
            <div class="neon-border-top"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-cyan-400">credit_card</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">Billing & Plans</h3>
                </div>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Plan Comparison</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Invoice History</li>
                    <li class="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><span class="material-symbols-outlined text-[14px] text-slate-600">article</span>Payment Methods</li>
                </ul>
                <p class="text-[10px] text-slate-500 mt-4">3 articles</p>
            </div>
        </div>
    </div>
</div>
"""

pages = [
    ("dashboard_help.html", "Help & Support", "Help & Support", help_content),
    ("dashboard_bugreport.html", "Report a Bug", "Report a Bug", bugreport_content),
    ("dashboard_docs.html", "Documentation", "Documentation", docs_content),
]

for (filename, title, page_title, content) in pages:
    page = make_page(title, page_title, content)
    filepath = os.path.join(curr_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(page)
    print(f"Created: {filename}")

print("All 3 new pages created successfully.")
