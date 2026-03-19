#!/usr/bin/env python3
"""
Simple, clean fix: inject a small CSS block that:
1. Bumps root font-size from 16px → 18px (everything scales up ~12%)
2. Overrides max-w-7xl to be much wider (full viewport)
3. Adds a bit more horizontal padding
"""
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

CSS_BLOCK = """
    <!-- Global sizing overrides -->
    <style>
      html { font-size: 18px; }
      .max-w-7xl { max-width: 100% !important; }
      .max-w-4xl { max-width: 90% !important; }
      .max-w-3xl { max-width: 85% !important; }
      .max-w-2xl { max-width: 80% !important; }
      .px-6 { padding-left: 3rem !important; padding-right: 3rem !important; }
      .px-4 { padding-left: 2rem !important; padding-right: 2rem !important; }
    </style>
"""

def main():
    for filename in FILES:
        if not os.path.exists(filename):
            print(f"⚠️  {filename} not found, skipping")
            continue

        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()

        if 'Global sizing overrides' in html:
            print(f"⏭️  {filename} already patched, skipping")
            continue

        # Insert right before </head>
        html = html.replace('</head>', CSS_BLOCK + '\n</head>')

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"✅ {filename} patched")

    print("\n✅ Done! All pages now have wider layout + slightly bigger fonts.")

if __name__ == "__main__":
    main()
