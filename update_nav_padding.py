import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace(
        '<div class="mx-auto flex items-center justify-between px-6 py-1.5">',
        '<div class="mx-auto flex items-center justify-between px-3 py-1.5">'
    )

    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Nav padding updated!")
