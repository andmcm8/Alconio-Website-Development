from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import time

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--window-size=1440,1080")

# Setup driver (assuming selenium can find chrome)
driver = webdriver.Chrome(options=chrome_options)

file_path = f"file://{os.path.abspath('dashboard_performance.html')}"
driver.get(file_path)

time.sleep(2) # Wait for animation renders

out_file = f"/Users/andresmcmahon/.gemini/antigravity/brain/f218c95f-9262-4d7f-8524-7ffec3215612/perf_redesign_{int(time.time())}.png"
driver.save_screenshot(out_file)
print(f"Screenshot saved to {out_file}")

driver.quit()
