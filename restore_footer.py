with open('index.html', 'r', encoding='utf-8') as f:
    index_lines = f.readlines()

# The footer is exactly on lines 1894 to 1969. (0-indexed: 1893 to 1969)
footer_block = "".join(index_lines[1893:1969])

with open('about.html', 'r', encoding='utf-8') as f:
    about_content = f.read()

# Replace the closing wrapper with the footer added in.
# It currently ends with \n    </main>\n</body>\n</html>
import re
new_about_content = re.sub(
    r'(\s*</main>\s*</body>\s*</html>)',
    '\n\n' + footer_block + r'\1',
    about_content
)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(new_about_content)

print("Footer restored correctly from index.html.")
