import re

# Get the Super Professional Footer from get-started.html
with open('get-started.html', 'r', encoding='utf-8') as f:
    gs_content = f.read()

# Extract footer
footer_match = re.search(r'(<!-- ═══════════════════════════════════════════════════════════════\s*SUPER PROFESSIONAL FOOTER[\s\S]*?</footer>)', gs_content)
if not footer_match:
    print("Could not find new footer in get-started.html")
    exit(1)

new_footer = footer_match.group(1)

# Now inject it into about.html
with open('about.html', 'r', encoding='utf-8') as f:
    about_content = f.read()

# Wait, about.html is missing a footer completely right now because my previous regex failed to capture one.
# So I should just append it before </main>

# Let's insert the new footer right before the closing main tag
new_about_content = re.sub(r'(\s*</main>\s*</body>\s*</html>)', r'\n\n' + new_footer + r'\1', about_content)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_about_content)

print("Footer restored successfully.")
