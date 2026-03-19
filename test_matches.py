import re
with open('dashboard_overview.html', 'r') as f:
    content = f.read()

matches = list(re.finditer(r'data-metric="chartTotal"', content))
print(f"Total matches for chartTotal: {len(matches)}")
for m in matches:
    print(f"Match at {m.start()}")
    preceding = content[max(0, m.start()-100):m.start()]
    print(f"Preceding: {repr(preceding)}")
