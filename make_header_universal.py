import os
import re

TARGET_FILES = [
    "index.html",
    "about.html",
    "services.html",
    "our-work.html",
    "contact.html",
    "schedule.html",
    "booking-success.html"
]

def make_header_universal():
    curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"
    idx_path = os.path.join(curr_dir, "pricing.html")

    # Read the source pricing.html
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx_content = f.read()

    # Extract the header from pricing.html
    header_pattern = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL)
    match = header_pattern.search(idx_content)
    
    if not match:
        print("Could not find <header> in pricing.html")
        return
        
    universal_header = match.group(0)

    # Process all other files
    for filename in TARGET_FILES:
        filepath = os.path.join(curr_dir, filename)
        if not os.path.exists(filepath):
            print(f"File not found: {filename}")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace the existing header
        new_content, num_subs = header_pattern.subn(universal_header, content, count=1)
        
        if num_subs > 0:
            # We want to make sure the relative links in the newly injected header still work.
            # For these files (which are at the same directory level as index.html), the links in universal_header are already correct.
            # No path adjustments needed!
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated header in {filename}")
        else:
            print(f"No <header> tag found to replace in {filename}")

if __name__ == "__main__":
    make_header_universal()
