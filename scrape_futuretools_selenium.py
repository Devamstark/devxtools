from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

# Step 1: Set up Chrome options
print("🚀 Starting Chrome browser...")
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--user-agent=Mozilla/5.0 (compatible; DevXTools/1.0)")

# Use webdriver-manager to auto-download & manage ChromeDriver
from webdriver_manager.chrome import ChromeDriverManager

service = Service(ChromeDriverManager().install())

driver = webdriver.Chrome(service=service, options=options)

try:
    # Step 2: Navigate to FutureTools.io
    url = "https://www.futuretools.io"
    print(f"🌐 Visiting {url}")
    driver.get(url)

    # Wait for page to load
    print("⏳ Waiting for page to load...")
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )

    # Wait for the __NEXT_DATA__ script to be injected
    print("🔍 Looking for __NEXT_DATA__ script...")
    script_tag = WebDriverWait(driver, 15).until(
        lambda d: d.find_element(By.XPATH, "//script[@id='__NEXT_DATA__']")
    )

    # Extract JSON
    raw_data = script_tag.get_attribute("textContent")
    data = json.loads(raw_data)

    # Extract tools
    tools_data = data['props']['pageProps']['tools']

    # Load existing tools
    try:
        with open('tools.json', 'r') as f:
            existing_tools = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_tools = []

    existing_names = {tool['name'].strip().lower() for tool in existing_tools if 'name' in tool}

    new_tools = []
    print(f"📦 Found {len(tools_data)} tools. Processing...")

    for tool in tools_data:  # ✅ Fixed: was tools_
        name = tool.get('name', '').strip()
        if not name or name.lower() in existing_names:
            continue

        website_url = tool.get('url', '')
        description = tool.get('description', 'No description')
        category = tool.get('category', 'Other')
        tags = [tag['name'] for tag in tool.get('tags', [])]

        devx_tool = {
            "name": name,
            "url": website_url,
            "githubUrl": "",
            "description": description[:200] + "..." if len(description) > 200 else description,
            "tags": ["AI"] + [category] + tags,
            "hasApi": any(word in f"{description} {' '.join(tags)}".lower() for word in ['api', 'integration']),
            "useCases": [category],
            "stars": 0
        }

        new_tools.append(devx_tool)
        existing_names.add(name.lower())

    # Merge and save
    updated_tools = existing_tools + new_tools
    with open('tools.json', 'w', encoding='utf-8') as f:
        json.dump(updated_tools, f, indent=2, ensure_ascii=False)

    print(f"✅ Successfully added {len(new_tools)} tools from FutureTools.io!")
    print(f"📁 Total tools: {len(updated_tools)}")

except Exception as e:
    print(f"❌ Error: {e}")
finally:
    driver.quit()