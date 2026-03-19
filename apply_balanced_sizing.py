#!/usr/bin/env python3
"""
Fix font sizes and layout width - FINAL BALANCED VERSION.
- Moderate font size increases (+1 level)
- Full-width layout (remove max-w constraints)
- Proportional padding/spacing increases
"""
import re
import os

FILES = [
    "index.html",
    "services.html",
    "our-work.html",
    "about.html",
    "pricing.html",
    "contact.html",
    "schedule.html",
    "booking-success.html",
]

# Moderate font size increases (+1 level)
FONT_REPLACEMENTS = {
    r'\btext-xs\b': 'text-sm',
    r'\btext-sm\b': 'text-base',
    r'\btext-base\b': 'text-lg',
    r'\btext-lg\b': 'text-xl',
    r'\btext-xl\b': 'text-2xl',
    r'\btext-2xl\b': 'text-3xl',
    r'\btext-3xl\b': 'text-4xl',
    r'\btext-4xl\b': 'text-5xl',
    r'\btext-5xl\b': 'text-6xl',
    r'\btext-6xl\b': 'text-7xl',
    r'\btext-7xl\b': 'text-8xl',
    r'\btext-8xl\b': 'text-9xl',
    r'\btext-9xl\b': 'text-9xl',
}

def fix_sizing(html):
    """Apply sizing fixes to HTML content."""
    
    # 1. Remove max-width constraints - change to full width
    html = re.sub(r'\bmax-w-\d+xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-\dxl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-md\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-lg\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-2xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-3xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-4xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-5xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-6xl\b', 'max-w-full', html)
    html = re.sub(r'\bmax-w-7xl\b', 'max-w-full', html)
    
    # 2. Increase all font sizes moderately (+1 level)
    for old_size, new_size in FONT_REPLACEMENTS.items():
        html = re.sub(old_size, new_size, html)
    
    # 3. Adjust padding/spacing proportionally
    html = re.sub(r'\bpx-6\b', 'px-12', html)
    html = re.sub(r'\bpx-4\b', 'px-8', html)
    html = re.sub(r'\bpy-4\b', 'py-6', html)
    html =re.sub(r'\bpy-2\b', 'py-3', html)
    
    # Increase gaps
    html = re.sub(r'\bgap-2\b', 'gap-4', html)
    html = re.sub(r'\bgap-3\b', 'gap-5', html)
    html = re.sub(r'\bgap-4\b', 'gap-6', html)
    html = re.sub(r'\bgap-6\b', 'gap-8', html)
    html = re.sub(r'\bgap-8\b', 'gap-12', html)
    
    # Increase spacing
    html = re.sub(r'\bspace-y-3\b', 'space-y-5', html)
    html = re.sub(r'\bspace-y-4\b', 'space-y-6', html)
    html = re.sub(r'\bspace-y-6\b', 'space-y-8', html)
    
    # Increase margin bottom
    html = re.sub(r'\bmb-2\b', 'mb-4', html)
    html = re.sub(r'\bmb-4\b', 'mb-6', html)
    html = re.sub(r'\bmb-6\b', 'mb-8', html)
    html = re.sub(r'\bmb-8\b', 'mb-12', html)
    
    return html


def main():
    for filename in FILES:
        filepath = filename
        if not os.path.exists(filepath):
            print(f"⚠️  {filename} not found, skipping")
            continue
        
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original_length = len(html)
        html = fix_sizing(html)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✅ {filename} updated (diff: {len(html) - original_length:+d} chars)")
    
    print(f"\n✅ Done! {len(FILES)} files updated with balanced sizing.")


if __name__ == "__main__":
    main()
