import re

# 1. Read the source nav from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

# Grab the <nav> block
nav_match = re.search(r'(<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50.*?w-\[85%\].*?</nav>)', idx_content, re.DOTALL)
if not nav_match:
    print("Could not find the pill nav in index.html")
    exit(1)

pill_nav = nav_match.group(1)

# USER REQUEST: "make text bigger. especially client dashboard and get started... header just a tiniest bit taller"
# Also #1E51FF as the accent.
# Currently the text size is text-[13px] on links, let's bump to text-[15px]
pill_nav = pill_nav.replace('text-[13px]', 'text-[15px]')
# Make it taller (increase py-2 to py-3 on the inner container, or maybe py-3 on buttons)
pill_nav = pill_nav.replace('py-2', 'py-3')
# Bump the button paddings exactly
pill_nav = pill_nav.replace('px-5 py-3', 'px-6 py-3.5')
pill_nav = pill_nav.replace('px-6 py-3', 'px-7 py-3.5')
# Ensure accent color is #1E51FF on Get Started
pill_nav = pill_nav.replace('bg-primary', 'bg-[#1E51FF]')
pill_nav = pill_nav.replace('hover:shadow-[0_0_20px_rgba(14,0,163,0.4)]', 'hover:shadow-[0_0_20px_rgba(30,81,255,0.4)]')

# Now inject it into about.html and services.html
for file_name in ['about.html', 'services.html']:
    with open(file_name, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We find the existing <nav ...> ... </nav> block
    # Note: about.html uses sticky top-0
    existing_nav_match = re.search(r'(<nav\s+.*?class="[^"]*(?:sticky|fixed)[^"]*".*?</nav>)', content, re.DOTALL)
    
    if existing_nav_match:
        # Before replacing, let's handle the active state. In index.html, Home might not have an active state explicitly defined differently, but let's just make the current page have 'text-white' while others are 'text-slate-400'.
        
        custom_nav = pill_nav
        if file_name == 'about.html':
            custom_nav = custom_nav.replace('href="about.html"', 'href="about.html" class="text-[15px] font-medium text-white transition-colors"')
        elif file_name == 'services.html':
            custom_nav = custom_nav.replace('href="services.html"', 'href="services.html" class="text-[15px] font-medium text-white transition-colors"')
        
        # We need to make sure we don't accidentally class the whole string. We can just replace the existing body's <nav>
        content = content.replace(existing_nav_match.group(1), custom_nav)
        
        with open(file_name, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated nav in {file_name}")
    else:
        print(f"Could not find existing nav in {file_name}")

