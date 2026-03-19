#!/usr/bin/env python3
"""
Fix font sizes and layout width issues - MODERATE VERSION.
More conservative font size increases to prevent overlapping.
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

# More moderate font size increases
FONT_REPLACEMENTS = {
    # Small text stays small but readable
    r'\btext-xs\b': 'text-sm',      # xs -> sm (was base)
    r'\btext-sm\b': 'text-base',    # sm -> base (was lg)
    r'\btext-base\b': 'text-lg',    # base -> lg (was xl)
    r'\btext-lg\b': 'text-xl',      # lg -> xl (was 2xl)
    r'\btext-xl\b': 'text-2xl',     # xl -> 2xl (was 3xl)
    r'\btext-2xl\b': 'text-3xl',    # 2xl -> 3xl (was 4xl)
    r'\btext-3xl\b': 'text-4xl',    # 3xl -> 4xl (was 5xl)
    r'\btext-4xl\b': 'text-5xl',    # 4xl -> 5xl (was 6xl)
    r'\btext-5xl\b': 'text-6xl',    # 5xl -> 6xl (was 7xl)
    r'\btext-6xl\b': 'text-7xl',    # 6xl -> 7xl (was 8xl)
    r'\btext-7xl\b': 'text-8xl',    # 7xl -> 8xl (was 9xl)
    r'\btext-8xl\b': 'text-9xl',    # 8xl -> 9xl
    r'\btext-9xl\b': 'text-9xl',    # 9xl -> 9xl (already max)
}

def fix_sizing(html):
    """Apply sizing fixes to HTML content."""
    
    # 1. Max-width constraints already fixed - content is full-width
    # No changes needed here as previous script already handled this
    
    # 2. Increase all font sizes moderately
    for old_size, new_size in FONT_REPLACEMENTS.items():
        html = re.sub(old_size, new_size, html)
    
    # 3. Keep padding adjustments from before (already applied)
    # No need to re-apply as they're already in the HTML
    
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
    
    print(f"\n✅ Done! Rebalanced {len(FILES)} files.")


if __name__ == "__main__":
    main()
