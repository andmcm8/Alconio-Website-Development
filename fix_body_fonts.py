import os
import re

target_files = [
    "index.html",
    "about.html",
    "services.html",
    "pricing.html",
    "our-work.html",
    "contact.html",
    "schedule.html",
    "booking-success.html"
]

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

for file in target_files:
    filepath = os.path.join(curr_dir, file)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The goal is to make sure font-display is in the body class.
    # And maybe standardize the text color.
    match = re.search(r'<body class="([^"]*)"', content)
    if match:
        classes = match.group(1).split()
        if "font-display" not in classes:
            classes.append("font-display")
        
        # Optionally make sure all text colors are identical to the pricing page
        # pricing page has: bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white selection:bg-primary/30
        new_class = " ".join(classes)
        new_content = content.replace(f'<body class="{match.group(1)}"', f'<body class="{new_class}"')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated body class in {file}")
