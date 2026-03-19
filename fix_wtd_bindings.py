import os
import re

files = [f for f in os.listdir('.') if f.startswith('dashboard_') and f.endswith('.html')]

wtd_metrics = {
    "Total\s+Visitors": "totalVisitors",
    "Total\s+Users": "totalVisitors"
}

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()
    
    original_content = content
    
    def repl(match):
        start = match.start()
        preceding = content[max(0, start - 500):start]
        # print(f"Checking match at {start} in {filename}")
        
        if "Visitors & Traffic Trends" in preceding:
            # print("  Found chart header, skipping.")
            return match.group(0)
        
        for label in wtd_metrics:
            if re.search(label, preceding, re.IGNORECASE | re.DOTALL):
                # print(f"  Matched {label}, replacing.")
                return match.group(1) + wtd_metrics[label] + match.group(2)
        return match.group(0)

    content = re.sub(r'(data-metric=")chartTotal(")', repl, content)
    content = re.sub(r'(data-trend=")chartTotal(")', repl, content)
    content = re.sub(r'(data-trend-icon=")chartTotal(")', repl, content)

    if content != original_content:
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        pass
        # print(f"No changes in {filename}")

