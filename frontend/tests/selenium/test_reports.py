import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_reports_page(driver):
    driver.get("http://localhost:3000/reports")
    
    # Wait for cards
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "h2"))
    )
    time.sleep(1) # Let charts render
    
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Reports" in body_text
