#!/usr/bin/env python3
"""
Process Stitch raw HTML pages:
1. Replace each page's <header>...</header> (or <nav> for pricing) with a standardized nav
2. Copy to project root with correct filenames
3. Add inter-page links
"""
import re
import os

SRC_DIR = "stitch_raw"
DST_DIR = "."

# Mapping: source filename -> destination filename
FILE_MAP = {
    "homepage.html": "index.html",
    "services.html": "services.html",
    "portfolio.html": "our-work.html",
    "about.html": "about.html",
    "pricing.html": "pricing.html",
    "contact.html": "contact.html",
    "schedule.html": "schedule.html",
    "booking-success.html": "booking-success.html",
}

# Which page is "active" for each destination
ACTIVE_NAV = {
    "index.html": None,
    "services.html": "Services",
    "our-work.html": "Our Work",
    "about.html": "About Us",
    "pricing.html": "Pricing",
    "contact.html": None,
    "schedule.html": None,
    "booking-success.html": None,
}

def make_nav_link(label, href, is_active):
    if is_active:
        return f'<a class="text-sm font-medium text-primary" href="{href}">{label}</a>'
    else:
        return f'<a class="text-sm font-medium hover:text-primary transition-colors" href="{href}">{label}</a>'

def build_standard_header(active_page):
    """Build the standardized header HTML."""
    nav_items = [
        ("Services", "services.html"),
        ("Our Work", "our-work.html"),
        ("About Us", "about.html"),
        ("Pricing", "pricing.html"),
    ]
    
    nav_links = "\n".join([
        make_nav_link(label, href, label == active_page)
        for label, href in nav_items
    ])
    
    return f'''<!-- Standardized Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
<div class="max-w-7xl mx-auto flex items-center justify-between">
<div class="flex items-center gap-3">
<a href="index.html" class="flex items-center gap-3">
<div class="size-8 bg-primary rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-white text-xl">deployed_code</span>
</div>
<span class="text-xl font-bold tracking-tighter text-white">ALCONIO</span>
</a>
</div>
<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400" aria-label="Main navigation">
{nav_links}
</nav>
<div class="flex items-center gap-4">
<a href="contact.html" class="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
Get Started
</a>
<!-- Mobile menu button -->
<button class="md:hidden text-white" aria-label="Open menu">
<span class="material-symbols-outlined">menu</span>
</button>
</div>
</div>
</header>'''

def build_standard_footer():
    """Build the standardized footer HTML."""
    return '''<!-- Standardized Footer -->
<footer class="bg-background-dark py-20 px-6 border-t border-white/5">
<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
<div class="col-span-1 md:col-span-1">
<div class="flex items-center gap-3 mb-6">
<a href="index.html" class="flex items-center gap-3">
<div class="size-6 bg-primary rounded flex items-center justify-center">
<span class="material-symbols-outlined text-white text-xs">deployed_code</span>
</div>
<h2 class="text-lg font-bold tracking-tighter">ALCONIO</h2>
</a>
</div>
<p class="text-gray-500 text-sm leading-relaxed mb-6">Building next-generation digital experiences through intelligence and automation.</p>
<div class="flex items-center gap-4">
<a class="text-gray-500 hover:text-white transition-colors" href="#" aria-label="Email"><span class="material-symbols-outlined">alternate_email</span></a>
<a class="text-gray-500 hover:text-white transition-colors" href="#" aria-label="Website"><span class="material-symbols-outlined">public</span></a>
<a class="text-gray-500 hover:text-white transition-colors" href="#" aria-label="Community"><span class="material-symbols-outlined">groups</span></a>
</div>
</div>
<div>
<h4 class="font-bold mb-6 text-white">Services</h4>
<ul class="space-y-4 text-gray-500 text-sm">
<li><a class="hover:text-primary transition-colors" href="services.html">Web Development</a></li>
<li><a class="hover:text-primary transition-colors" href="services.html">AI &amp; Automation</a></li>
<li><a class="hover:text-primary transition-colors" href="services.html">Cloud Architecture</a></li>
<li><a class="hover:text-primary transition-colors" href="services.html">Tech Consulting</a></li>
</ul>
</div>
<div>
<h4 class="font-bold mb-6 text-white">Company</h4>
<ul class="space-y-4 text-gray-500 text-sm">
<li><a class="hover:text-primary transition-colors" href="about.html">About Us</a></li>
<li><a class="hover:text-primary transition-colors" href="our-work.html">Our Work</a></li>
<li><a class="hover:text-primary transition-colors" href="pricing.html">Pricing</a></li>
<li><a class="hover:text-primary transition-colors" href="contact.html">Contact</a></li>
</ul>
</div>
<div>
<h4 class="font-bold mb-6 text-white">Newsletter</h4>
<p class="text-sm text-gray-500 mb-4">Get the latest insights on tech and AI.</p>
<form class="flex gap-2">
<input class="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-full" placeholder="Email address" type="email" aria-label="Email address"/>
<button class="bg-primary p-2 rounded-lg hover:bg-primary/80 transition-colors" aria-label="Subscribe">
<span class="material-symbols-outlined text-sm">send</span>
</button>
</form>
</div>
</div>
<div class="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between text-gray-600 text-xs gap-4">
<p>&copy; 2025 ALCONIO. All rights reserved.</p>
<div class="flex gap-6">
<a class="hover:text-white transition-colors" href="#">Privacy Policy</a>
<a class="hover:text-white transition-colors" href="#">Terms of Service</a>
</div>
</div>
</footer>'''


def replace_header(html, active_page):
    """Replace the existing header/nav with the standardized one."""
    new_header = build_standard_header(active_page)
    
    # Try to replace <header>...</header>
    pattern_header = re.compile(r'<header\b[^>]*>.*?</header>', re.DOTALL)
    if pattern_header.search(html):
        html = pattern_header.sub(new_header, html, count=1)
    else:
        # For pricing page which uses <nav> as top-level
        pattern_nav = re.compile(r'<nav class="sticky[^>]*>.*?</nav>\s*', re.DOTALL)
        if pattern_nav.search(html):
            html = pattern_nav.sub(new_header, html, count=1)
    
    return html


def replace_footer(html):
    """Replace the existing footer with the standardized one."""
    new_footer = build_standard_footer()
    pattern_footer = re.compile(r'<footer\b[^>]*>.*?</footer>', re.DOTALL)
    # Find the last footer (some pages have nested footer elements in blockquotes)
    matches = list(pattern_footer.finditer(html))
    if matches:
        # Replace the last/main footer
        last_match = matches[-1]
        html = html[:last_match.start()] + new_footer + html[last_match.end():]
    return html


def fix_cta_links(html, dest_file):
    """Update CTA buttons to link to appropriate pages."""
    # "Get Started" / "Start Your Project" buttons -> contact.html
    html = re.sub(
        r'(<button[^>]*>)\s*(Get Started|Start Your Project|Start a Project)\s*(</button>)',
        r'<a href="contact.html" \1>\2\3</a>',
        html
    )
    # "View Our Work" buttons -> our-work.html
    html = re.sub(
        r'(<button[^>]*>)\s*View Our Work\s*(</button>)',
        r'<a href="our-work.html" \1>View Our Work\2</a>',
        html
    )
    # "View Pricing" buttons -> pricing.html
    html = re.sub(
        r'(<button[^>]*>)\s*View Pricing\s*(</button>)',
        r'<a href="pricing.html" \1>View Pricing\2</a>',
        html
    )
    # "Book a Strategy Call" -> schedule.html
    html = re.sub(
        r'(<button[^>]*>)\s*Book a Strategy Call\s*(</button>)',
        r'<a href="schedule.html" \1>Book a Strategy Call\2</a>',
        html
    )
    return html


def ensure_tailwind_colors(html):
    """Ensure consistent Tailwind color config across all pages."""
    # Standardize background-dark color to #02010A
    html = html.replace('"background-dark": "#00001a"', '"background-dark": "#02010A"')
    html = html.replace('"background-dark": "#02010a"', '"background-dark": "#02010A"')
    return html


def process_file(src_name, dst_name):
    src_path = os.path.join(SRC_DIR, src_name)
    dst_path = os.path.join(DST_DIR, dst_name)
    
    with open(src_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    active_page = ACTIVE_NAV.get(dst_name)
    
    # 1. Replace header
    html = replace_header(html, active_page)
    
    # 2. Replace footer (skip booking-success as it has a minimal footer that's fine)
    if dst_name != "booking-success.html":
        html = replace_footer(html)
    
    # 3. Fix CTA links
    html = fix_cta_links(html, dst_name)
    
    # 4. Standardize colors
    html = ensure_tailwind_colors(html)
    
    with open(dst_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ {src_name} -> {dst_name}")


def main():
    for src, dst in FILE_MAP.items():
        process_file(src, dst)
    print(f"\nDone! {len(FILE_MAP)} pages processed.")


if __name__ == "__main__":
    main()
