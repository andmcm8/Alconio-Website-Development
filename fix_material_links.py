import glob

files = glob.glob('*.html')

valid_link = '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # We will replace any material symbols link with the valid robust one
    import re
    
    new_content = re.sub(
        r'<link\s+href="https://fonts\.googleapis\.com/css2\?family=Material\+Symbols\+Outlined[^"]*"\s*(rel="stylesheet")?\s*/?>',
        valid_link,
        content
    )
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed material icon link in {file}")

print("Material icon fix complete.")
