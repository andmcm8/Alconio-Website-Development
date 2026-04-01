import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Tiniest bit taller outer container
    content = content.replace(
        '<div class="mx-auto flex items-center justify-between px-3 py-1.5">',
        '<div class="mx-auto flex items-center justify-between px-3 py-2">'
    )

    # Nav links text bigger
    content = content.replace(
        'class="text-xs font-medium text-slate-400 transition-colors hover:text-white"',
        'class="text-[13px] font-medium text-slate-400 transition-colors hover:text-white"'
    )
    content = content.replace(
        'class="text-xs font-medium text-white transition-colors"',
        'class="text-[13px] font-medium text-white transition-colors"'
    )

    # Logo text bigger
    content = content.replace(
        '<span class="text-lg font-bold tracking-tight text-white font-display">ALCONIO</span>',
        '<span class="text-xl font-bold tracking-tight text-white font-display">ALCONIO</span>'
    )
    
    # Client Dashboard button
    content = content.replace(
        'class="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-white/20 border border-white/10 hover:border-white/30"',
        'class="rounded-full bg-white/10 px-5 py-2 text-[13px] font-bold text-white transition-all hover:bg-white/20 border border-white/10 hover:border-white/30"'
    )
    
    # Get Started button
    content = content.replace(
        'class="rounded-full bg-primary px-5 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(14,0,163,0.4)]"',
        'class="rounded-full bg-primary px-6 py-2 text-[13px] font-bold text-white transition-all hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(14,0,163,0.4)]"'
    )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Header text sizing reverted to be larger!")
