import re

with open("dashboard_performance.html", "r") as f:
    html = f.read()

# Make sure tooltip-custom has proper z-index and opacity handling, 
# and ensure group-hover works efficiently.

tooltip_style = """
        .tooltip-custom {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, transform 0.2s ease;
            transform: translateY(5px) translateX(-5px);
            pointer-events: none;
            z-index: 100;
        }
        .group:hover .tooltip-custom {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) translateX(-5px);
        }
"""

# Replace existing tooltip style if it exists, otherwise append to <style>
if ".tooltip-custom {" in html:
    html = re.sub(r"\.tooltip-custom \{.*?\}\s*\.group:hover \.tooltip-custom \{.*?\}", tooltip_style.strip(), html, flags=re.DOTALL)
else:
    html = html.replace("</style>", tooltip_style + "\n    </style>")

with open("dashboard_performance.html", "w") as f:
    f.write(html)
