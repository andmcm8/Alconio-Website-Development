import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

TARGET_FILES = [
    ("index.html", None),
    ("about.html", "about.html"),
    ("services.html", "services.html"),
    ("pricing.html", "pricing.html"),
    ("our-work.html", "our-work.html"),
    ("contact.html", None),
    ("schedule.html", None),
    ("booking-success.html", None),
]

def make_header(active_href=None):
    def link(href, label):
        if href == active_href:
            return f'<a class="text-sm font-medium text-white transition-colors" href="{href}">{label}</a>'
        else:
            return f'<a class="text-sm font-medium text-slate-400 transition-colors hover:text-white" href="{href}">{label}</a>'

    return f"""<nav class="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
<div class="flex items-center gap-2">
<a href="index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
<span class="text-xl font-bold tracking-tight text-white font-display">ALCONIO</span>
</a>
</div>
<div class="hidden items-center gap-8 md:flex">
{link("services.html", "Services")}
{link("our-work.html", "Our Work")}
{link("about.html", "About Us")}
{link("pricing.html", "Pricing")}
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

# Regex patterns that match any header/nav block we may have injected
HEADER_PATTERN = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL)
NAV_STICKY_PATTERN = re.compile(r'<nav class="sticky[^>]*>.*?</nav>', re.DOTALL)
# Also scrub any leftover comment lines
COMMENT_PATTERN = re.compile(r'<!-- (?:Sticky Header|Standardized Header|Sticky Navigation) -->\s*\n?')

for (filename, active_href) in TARGET_FILES:
    filepath = os.path.join(curr_dir, filename)
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {filename}")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove all existing header/nav injections
    content = HEADER_PATTERN.sub('', content)
    content = NAV_STICKY_PATTERN.sub('', content)
    content = COMMENT_PATTERN.sub('', content)

    # 2. Remove font-sans from body tag so it doesn't override font-display
    content = re.sub(r'\bfont-sans\b', '', content)

    # 3. Inject new header right after <body ...>
    body_open = re.search(r'(<body[^>]*>)', content)
    if not body_open:
        print(f"WARNING: No <body> tag found in {filename}")
        continue

    header_html = make_header(active_href)
    insert_pos = body_open.end()
    content = content[:insert_pos] + '\n' + header_html + '\n' + content[insert_pos:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed: {filename}")

print("Done.")
