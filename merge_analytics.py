import re

# Read the raw downloaded file containing the new analytics content
with open('imported_analytics_raw.html', 'r', encoding='utf-8') as f:
    raw_html = f.read()

# Extract the main content area. Using regex to grab everything between <main...> and </main>
# We also grab its outer <main> tag to get its classes, then we'll extract the innerHTML
main_match = re.search(r'(<main[^>]*>)(.*?)</main>', raw_html, re.DOTALL)

if not main_match:
    print("Could not find <main> tag in imported_analytics_raw.html")
    exit(1)

main_opening_tag = main_match.group(1)
main_inner_html = main_match.group(2)

print("Successfully extracted <main> content from imported HTML.")

# Now read the target dashboard file
with open('dashboard_analytics.html', 'r', encoding='utf-8') as f:
    target_html = f.read()

# Replace the <main>...</main> in the target file with the NEW <main>...</main>
# But we need to make sure the target <main> has the right classes.
# In dashboard_analytics.html, the main tag should look like:
# <main class="flex-1 overflow-y-auto h-full p-4 md:p-6 scroll-smooth">

# Let's see what the target's current main tag is:
target_main_match = re.search(r'<main[^>]*>', target_html)
if not target_main_match:
    print("Could not find <main> tag in target dashboard_analytics.html")
    exit(1)

target_main_tag = target_main_match.group(0)

# Build the new content. We use the existing target <main> tag to keep the layout shell identical,
# but we paste the NEW innerHTML inside.
new_main_content = f"{target_main_tag}{main_inner_html}</main>"

# Replace it in the file
new_target_html = re.sub(r'<main[^>]*>.*?</main>', new_main_content, target_html, flags=re.DOTALL)

with open('dashboard_analytics.html', 'w', encoding='utf-8') as f:
    f.write(new_target_html)

print("Successfully merged into dashboard_analytics.html")
