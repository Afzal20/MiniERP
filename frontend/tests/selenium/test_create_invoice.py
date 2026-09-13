import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

def test_create_invoice(driver):
    driver.get("http://localhost:3000/create-invoice")
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "h2"))
    )
    time.sleep(1)
    
    # Fill description
    desc_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[placeholder="Description of service or product"]')
    if desc_inputs:
        desc_inputs[0].send_keys("Selenium test item")
        
    qty_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[placeholder="Qty"]')
    if qty_inputs:
        # clear input first using Keys
        qty_inputs[0].send_keys(Keys.CONTROL + "a")
        qty_inputs[0].send_keys(Keys.DELETE)
        qty_inputs[0].send_keys("5")
        
    rate_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[placeholder="Rate"]')
    if rate_inputs:
        rate_inputs[0].send_keys(Keys.CONTROL + "a")
        rate_inputs[0].send_keys(Keys.DELETE)
        rate_inputs[0].send_keys("100")
        
    # click somewhere to remove focus and trigger change
    driver.find_element(By.TAG_NAME, "h2").click()
    time.sleep(1)
    
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Total" in body_text
