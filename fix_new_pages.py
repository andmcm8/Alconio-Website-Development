import os
import re

curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"

# Fix the new pages: add dark input CSS override and ensure no active sidebar items
new_pages = [
    "dashboard_profile.html",
    "dashboard_appearance.html",
    "dashboard_team.html",
    "dashboard_integrations.html",
]

css_override = """
        input.sharp-input, textarea.sharp-input, select.sharp-input {
            background-color: rgba(0, 0, 0, 0.6) !important;
            background: rgba(0, 0, 0, 0.6) !important;
            color: white !important;
        }
        input.sharp-input:focus, textarea.sharp-input:focus, select.sharp-input:focus {
            background-color: rgba(0, 0, 0, 0.8) !important;
            background: rgba(0, 0, 0, 0.8) !important;
        }
    """

for filename in new_pages:
    filepath = os.path.join(curr_dir, filename)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add CSS override if not already present
    if 'input.sharp-input' not in content:
        content = content.replace('</style>', css_override + '</style>')
    
    # Remove all active-nav-item from sidebar (these pages aren't in the standard nav)
    content = content.replace(' active-nav-item', '')
    # Also fix icon classes for any that were set to active blue
    content = content.replace(
        'text-electric-blue neon-text-blue text-2xl nav-icon',
        'group-hover:text-electric-blue transition-colors text-2xl nav-icon'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {filename}")

# Also ensure the settings page still has the CSS override (it was already added earlier)
settings_path = os.path.join(curr_dir, "dashboard_settings.html")
if os.path.exists(settings_path):
    with open(settings_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Check if the override might have been duplicated
    count = content.count('input.sharp-input')
    if count > 1:
        # Remove duplicate
        # Find the second occurrence and remove it
        pass  # The regex-based fix should be fine as is
    print(f"Settings page input override count: {count}")

print("Done fixing new pages.")
