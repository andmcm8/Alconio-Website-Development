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

NEW_HEADER = """<nav class="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
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
</nav>"""

for file in TARGET_FILES:
    filepath = os.path.join(curr_dir, file)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    pattern_header = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL)
    pattern_nav = re.compile(r'<nav class="sticky[^>]*>.*?</nav>', re.DOTALL)
    
    if pattern_header.search(content):
        new_content = pattern_header.sub(NEW_HEADER, content, count=1)
    elif pattern_nav.search(content):
        new_content = pattern_nav.sub(NEW_HEADER, content, count=1)
    else:
        print(f"Could not find recognizable header in {file}")
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
    
    print(f"Updated {file}")
