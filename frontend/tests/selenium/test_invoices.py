import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_invoices_page(driver):
    driver.get("http://localhost:3000/invoices")
    
    # Wait for table
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )
    time.sleep(1) # Let table populate
    
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Invoices" in body_text
    
    # Try clicking a tab if it exists
    tabs = driver.find_elements(By.CSS_SELECTOR, '[role="tab"]')
    for tab in tabs:
        if "Paid" in tab.text:
            tab.click()
            time.sleep(1)
            break
