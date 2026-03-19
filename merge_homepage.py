import os

def merge_homepage():
    curr_dir = "/Users/andresmcmahon/Documents/Alconio Website"
    idx_path = os.path.join(curr_dir, "index.html")
    new_home_path = os.path.join(curr_dir, "stitch_raw_new/homepage.html")
    
    with open(idx_path, 'r', encoding='utf-8') as f:
        old_content = f.read()

    with open(new_home_path, 'r', encoding='utf-8') as f:
        new_content = f.read()

    # Extract header from old_content
    header_start_tag = '<header class="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-2">'
    header_start_idx = old_content.find(header_start_tag)
    
    if header_start_idx == -1:
        print("Could not find the start of the old header")
        return
        
    header_end_tag = '</header>'
    # Find the matching closing header tag
    header_end_idx = old_content.find(header_end_tag, header_start_idx) + len(header_end_tag)
    
    old_header = old_content[header_start_idx:header_end_idx]

    # Find the header in the new content
    new_header_start_tag = '<header class="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4">'
    new_header_start_idx = new_content.find(new_header_start_tag)
    if new_header_start_idx == -1:
         print("Could not find the start of the new header")
         return
         
    new_header_end_idx = new_content.find(header_end_tag, new_header_start_idx) + len(header_end_tag)

    if new_header_end_idx == -1:
         print("Could not find the end of the new header")
         return
         
    merged_content = new_content[:new_header_start_idx] + old_header + new_content[new_header_end_idx:]

    with open(idx_path, 'w', encoding='utf-8') as f:
        f.write(merged_content)
        
    print("Successfully merged homepage!")

if __name__ == "__main__":
    merge_homepage()
