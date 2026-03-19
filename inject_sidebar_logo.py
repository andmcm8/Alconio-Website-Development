import glob
import re

files = glob.glob('dashboard_*.html')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # The HTML looks like this roughly:
    # <h1 class="logo-text text-2xl font-bold tracking-tight text-white neon-text-blue transition-all duration-300"
    #     style="letter-spacing: -0.02em;">A</h1>

    # We want to inject:
    # <img src="logo.png" alt="Logo" class="sidebar-logo-img hidden w-8 h-8 object-contain transition-all duration-300 opacity-0 relative z-10">
    # right after the closing </h1>
    
    if 'sidebar-logo-img' not in content:
        # We need to find the `</h1>` that comes right after `class="logo-text...`
        # Regex to match the full <h1...logo-text...>...</h1> tag
        pattern = re.compile(r'(<h1[^>]*class="[^"]*logo-text[^"]*"[^>]*>.*?</h1>)', re.DOTALL)
        
        replacement = r'\1\n                    <img src="logo.png" alt="Logo" class="sidebar-logo-img hidden w-8 h-8 object-contain transition-all duration-300 opacity-0 relative z-10">'
        
        new_content = pattern.sub(replacement, content)
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")
        else:
            print(f"Skipped {file} (pattern not found)")
    else:
        print(f"Skipped {file} (already processed)")
