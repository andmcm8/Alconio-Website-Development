import os
import shutil

dashboard_files = [
    "dashboard_overview.html",
    "dashboard_activity_log.html",
    "dashboard_analytics.html",
    "dashboard_performance.html",
    "dashboard_resources.html",
    "dashboard_settings.html",
    "dashboard_sidebar.html",
    "new_report.html"
]

def setup_dashboard():
    curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"
    source_dir = os.path.join(curr_dir, "stitch_raw_new")
    
    # 1. Copy files
    for file in dashboard_files:
        src = os.path.join(source_dir, file)
        dst = os.path.join(curr_dir, file)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {file}")
        else:
            print(f"Warning: {file} not found in {source_dir}")

    # 2. Setup Links in all copied dashboard files
    # Mapping of span text -> target html file
    link_mapping = {
        "Overview": "dashboard_overview.html",
        "Analytics": "dashboard_analytics.html",
        "Performance": "dashboard_performance.html",
        "Activity Log": "dashboard_activity_log.html",
        "Resources": "dashboard_resources.html",
        "Settings": "dashboard_settings.html"
    }

    for file in dashboard_files:
        file_path = os.path.join(curr_dir, file)
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # A very basic find-and-replace tailored to the sidebar structure
        for link_text, target_html in link_mapping.items():
            # The structure is typically:
            # <a class="... href="#">
            # ...
            # <span class="text-sm font-medium">Overview</span>
            
            # Find the span with the text
            span_str = f'<span class="text-sm font-medium">{link_text}</span>'
            
            # Simple approach: find all <a href="#"> that wrap this span
            # Strategy: look for span_str, then search backwards for href="#"
            
            start_search = 0
            while True:
                span_idx = content.find(span_str, start_search)
                if span_idx == -1:
                    break
                    
                # Search backwards for href="#"
                href_idx = content.rfind('href="#"', start_search, span_idx)
                
                if href_idx != -1:
                    # Replace href="#" with href="target_html"
                    # We need to be careful to only replace that specific one
                    content = content[:href_idx] + f'href="{target_html}"' + content[href_idx + 8:]
                    print(f"Replaced link for '{link_text}' in {file}")
                    
                start_search = span_idx + len(span_str)

        # Also add a link back to the homepage on the logo
        logo_str = '<span class="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ALCONIO</span>'
        logo_idx = content.find(logo_str)
        if logo_idx != -1:
             href_idx = content.rfind('href="#"', 0, logo_idx)
             if href_idx != -1:
                  content = content[:href_idx] + 'href="index.html"' + content[href_idx + 8:]
                  print(f"Replaced logo link in {file}")
                  
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    setup_dashboard()
