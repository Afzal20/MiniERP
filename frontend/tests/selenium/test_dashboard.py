import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_dashboard_overview(driver):
    driver.get("http://localhost:3000/dashboard")
    
    # Wait for dashboard to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "h2"))
    )
    time.sleep(1) # Extra wait to ensure charts render for screenshot
    
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Dashboard" in body_text
