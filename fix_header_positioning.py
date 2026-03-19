import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"
TARGET_FILES = [
    "index.html",
    "about.html",
    "services.html",
    "pricing.html",
    "our-work.html",
    "contact.html",
    "schedule.html",
    "booking-success.html"
]

NEW_HEADER = """<header class="fixed top-0 left-0 right-0 w-full z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
<div class="flex items-center gap-2">
<a href="index.html" class="flex items-center gap-3">
<span class="text-3xl font-bold tracking-tighter text-white">ALCONIO</span>
</a>
</div>
<div class="hidden items-center gap-8 md:flex">
<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="services.html">Services</a>
<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="our-work.html">Our Work</a>
<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="about.html">About Us</a>
<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="pricing.html">Pricing</a>
</div>
<div class="flex items-center gap-4">
<a href="dashboard_overview.html">
    <button class="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/20 border border-white/10 hover:border-white/30">
        Client Dashboard
    </button>
</a>
<a href="contact.html">
    <button class="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(14,0,163,0.4)]">
        Get Started
    </button>
</a>
<button class="md:hidden text-white" aria-label="Open menu">
    <span class="material-symbols-outlined">menu</span>
</button>
</div>
</div>
</header>"""

for file in TARGET_FILES:
    filepath = os.path.join(curr_dir, file)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We might have injected a <nav class="sticky... or <header class="fixed...
    # So we want to replace either
    pattern_nav = re.compile(r'<nav class="sticky[^>]*>.*?</nav>', re.DOTALL)
    pattern_header = re.compile(r'<header class="fixed[^>]*>.*?</header>', re.DOTALL)
    
    # Wait, some pages might still have something else if previous scripts failed
    # But last step we ran `apply_original_pricing_header.py` which put in `<nav class="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">`
    # Let's just blindly replace the nav or header that's at the top. 
    
    if pattern_nav.search(content):
        new_content = pattern_nav.sub(NEW_HEADER, content, count=1)
    elif pattern_header.search(content):
        new_content = pattern_header.sub(NEW_HEADER, content, count=1)
    else:
        print(f"Could not find Nav/Header in {file}")
        continue
        
    # Set active states
    if file == "services.html":
        new_content = new_content.replace('<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="services.html">Services</a>', '<a class="text-sm font-medium text-white transition-colors" href="services.html">Services</a>')
    elif file == "pricing.html":
        new_content = new_content.replace('<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="pricing.html">Pricing</a>', '<a class="text-sm font-medium text-white transition-colors" href="pricing.html">Pricing</a>')
    elif file == "about.html":
        new_content = new_content.replace('<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="about.html">About Us</a>', '<a class="text-sm font-medium text-white transition-colors" href="about.html">About Us</a>')
    elif file == "our-work.html":
        new_content = new_content.replace('<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="our-work.html">Our Work</a>', '<a class="text-sm font-medium text-white transition-colors" href="our-work.html">Our Work</a>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {file} to use fixed header instead of sticky")
