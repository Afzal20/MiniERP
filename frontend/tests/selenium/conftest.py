import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os

@pytest.fixture(scope="session")
def driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1280,1024")
    
    drv = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    drv.implicitly_wait(10)

    yield drv
    drv.quit()

@pytest.fixture(autouse=True)
def capture_screenshot(request, driver):
    yield
    os.makedirs("tests/selenium/screenshots", exist_ok=True)
    screenshot_name = f"tests/selenium/screenshots/{request.node.name}.png"
    driver.save_screenshot(screenshot_name)
