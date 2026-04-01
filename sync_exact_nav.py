import re
import os

def sync_nav():
    files_to_sync = ['about.html', 'services.html', 'our-work.html', 'pricing.html', 'get-started.html']
    
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            idx_content = f.read()
    except Exception as e:
        print(f"Error reading index.html: {e}")
        return

    # Extract exact nav from index.html
    nav_match = re.search(r'(<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50.*?w-\[85%\].*?</nav>)', idx_content, re.DOTALL)
    if not nav_match:
        print("Could not find the pill nav in index.html")
        return

    exact_nav = nav_match.group(1)

    for file_name in files_to_sync:
        if not os.path.exists(file_name):
            print(f"Skipping {file_name}, does not exist.")
            continue
            
        with open(file_name, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Match existing <nav> block
        existing_nav_match = re.search(r'(<nav\s+.*?class="[^"]*(?:sticky|fixed)[^"]*".*?</nav>)', content, re.DOTALL)
        
        if existing_nav_match:
            # We must handle the active state on the nav links so the user knows what page they are on.
            # actually, the user says "exact same". I'll just swap the href active class if the link matches the file name. Wait, the user said EXACT same. I'll just put the exact string for now to avoid any discrepancy, but it's best practice to add `text-white` to the active one. I will just do EXACT.
            content = content.replace(existing_nav_match.group(1), exact_nav)
            
            with open(file_name, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Synced exact nav to {file_name}")
        else:
            print(f"Could not find existing nav in {file_name}")

if __name__ == '__main__':
    sync_nav()
