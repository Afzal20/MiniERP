import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_auth_login(driver):
    driver.get("http://localhost:3000/auth/login")
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "email"))
    )
    
    driver.find_element(By.ID, "email").clear()
    driver.find_element(By.ID, "email").send_keys("demo@bizpilot.app")
    
    driver.find_element(By.ID, "password").clear()
    driver.find_element(By.ID, "password").send_keys("demo1234")
    
    driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
    # Wait for redirect to dashboard
    WebDriverWait(driver, 10).until(
        EC.url_contains("/dashboard")
    )
    assert "dashboard" in driver.current_url
