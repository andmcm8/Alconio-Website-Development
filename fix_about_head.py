import re

with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific Space Grotesk font block with the new fonts.
new_font_link = '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400..700;1,400..700&family=Syne:wght@400..800&display=swap" rel="stylesheet">'

# Using re.sub with DOTALL to match the multiline import
content = re.sub(
    r'<link\s+href="https://fonts\.googleapis\.com/css2\?family=Space\+Grotesk[^>]*>',
    new_font_link,
    content,
    flags=re.DOTALL
)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Head fixed.")
