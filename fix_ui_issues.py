#!/usr/bin/env python3
"""
Fix 4 UI issues across all pages:
1. Remove ">" from buttons (fix broken <a href="..." <button> tags)
2. Fix service card heights on homepage (remove staggered translate-y)
3. Replace icon logo with alconio-logo.png image in header and footer
4. Fix "Book a Time" link on contact page -> schedule.html
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

# Old icon-based logo block (header)
OLD_HEADER_LOGO = '''<div class="size-8 bg-primary rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-white text-xl">deployed_code</span>
</div>'''

# New image-based logo block (header)
NEW_HEADER_LOGO = '''<img src="alconio-logo.png" alt="Alconio Logo" class="h-8 w-auto" />'''

# Old icon-based logo block (footer)
OLD_FOOTER_LOGO = '''<div class="size-6 bg-primary rounded flex items-center justify-center">
<span class="material-symbols-outlined text-white text-xs">deployed_code</span>
</div>'''

# New image-based logo block (footer)
NEW_FOOTER_LOGO = '''<img src="alconio-logo.png" alt="Alconio Logo" class="h-6 w-auto" />'''


def fix_broken_buttons(html):
    """Fix broken <a href="..." <button> tags that cause ">" to appear."""
    # Pattern: <a href="something" <button class="...">  =>  <a href="something" class="...">
    # The issue is: <a href="url" <button class="classes">>Text</button></a>
    # Fix to: <a href="url" class="classes">Text</a>
    
    pattern = r'<a\s+href="([^"]+)"\s+<button\s+class="([^"]+)">>(.*?)</button></a>'
    replacement = r'<a href="\1" class="\2">\3</a>'
    html = re.sub(pattern, replacement, html)
    return html


def fix_service_cards(html):
    """Remove staggered translate-y from service cards so they appear at same height."""
    # Card 1: md:translate-y-0 (already 0, keep)
    # Card 2: md:translate-y-8 -> remove
    html = html.replace('md:translate-y-8 transition-all hover:-translate-y-2',
                        'transition-all hover:-translate-y-2')
    # Card 3: md:translate-y-16 -> remove
    html = html.replace('md:translate-y-16 transition-all hover:-translate-y-2',
                        'transition-all hover:-translate-y-2')
    return html


def fix_logo(html):
    """Replace icon-based logo with image-based logo in header and footer."""
    html = html.replace(OLD_HEADER_LOGO, NEW_HEADER_LOGO)
    html = html.replace(OLD_FOOTER_LOGO, NEW_FOOTER_LOGO)
    return html


def fix_book_link(html):
    """Fix 'Book a Time' link on contact page to point to schedule.html."""
    html = html.replace(
        'class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" href="#">',
        'class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" href="schedule.html">'
    )
    return html


def main():
    for filename in FILES:
        if not os.path.exists(filename):
            print(f"⚠️  {filename} not found, skipping")
            continue
        
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # Apply all fixes
        html = fix_broken_buttons(html)
        html = fix_service_cards(html)
        html = fix_logo(html)
        
        if filename == 'contact.html':
            html = fix_book_link(html)
        
        if html != original:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html)
            
            changes = []
            if fix_broken_buttons(original) != original:
                changes.append("buttons")
            if fix_service_cards(original) != original:
                changes.append("cards")
            if fix_logo(original) != original:
                changes.append("logo")
            if filename == 'contact.html' and fix_book_link(original) != original:
                changes.append("book-link")
            
            print(f"✅ {filename} fixed ({', '.join(changes)})")
        else:
            print(f"⏭️  {filename} - no changes needed")
    
    print("\n✅ Done! All UI fixes applied.")


if __name__ == "__main__":
    main()
