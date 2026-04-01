import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # If the file contains the nav
    if '<nav class="fixed top-6 left-1/2 -translate-x-1/2' in content:
        # Smaller nav outer shape
        content = content.replace(
            '<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl',
            '<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-5xl'
        )

        # Smaller outer padding
        content = content.replace(
            '<div class="mx-auto flex items-center justify-between px-8 py-2">',
            '<div class="mx-auto flex items-center justify-between px-6 py-1.5">'
        )

        # Smaller logo
        content = content.replace(
            '<img src="logo.png" alt="Alconio Logo" class="h-8 w-auto" />',
            '<img src="logo.png" alt="Alconio Logo" class="h-6 w-auto" />'
        )

        # Smaller title font
        content = content.replace(
            '<span class="text-xl font-bold tracking-tight text-white font-display">ALCONIO</span>',
            '<span class="text-lg font-bold tracking-tight text-white font-display">ALCONIO</span>'
        )

        # Smaller nav links text
        content = content.replace(
            'class="text-sm font-medium text-slate-400 transition-colors hover:text-white"',
            'class="text-xs font-medium text-slate-400 transition-colors hover:text-white"'
        )
        content = content.replace(
            'class="text-sm font-medium text-white transition-colors"',
            'class="text-xs font-medium text-white transition-colors"'
        )

        # Smaller Client Dashboard button
        content = content.replace(
            'class="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/20 border border-white/10 hover:border-white/30"',
            'class="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-white/20 border border-white/10 hover:border-white/30"'
        )

        # Smaller Get Started button
        content = content.replace(
            'class="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(14,0,163,0.4)]"',
            'class="rounded-full bg-primary px-5 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(14,0,163,0.4)]"'
        )

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Navs updated successfully!")
