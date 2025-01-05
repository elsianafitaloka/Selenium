const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL; 
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

//mkdir screenshoots
const screenshotDir = './screenshots/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

//Function to take a screenshot
async function takeScreenshot(driver, filename) {
    const image = await driver.takeScreenshot();
    const filePath = path.join(screenshotDir, filename);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Screenshot saved at ${filePath}`);
}

describe('Test Add to Cart [Cart] #Functionality', function () {
    this.timeout(30000); 
    let driver;

    switch (browser.toLowerCase()) {
        case 'safari':
            const safari = require('selenium-webdriver/safari');
            options = new safari.Options();
            options.addArguments('--headless'); 
            break;
        case 'firefox':
            const firefox = require('selenium-webdriver/firefox');
            options = new firefox.Options();
            options.addArguments('--headless'); 
            break;
        case 'chrome':
        default:
            const chrome = require('selenium-webdriver/chrome');
            options = new chrome.Options();
            options.addArguments('--headless');
            break;
    }

    before(async function () {
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();
        await driver.get(baseUrl);

        // Login steps
        const usernameInput = await driver.findElement(By.id('user-name'));
        const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
        const loginButton = await driver.findElement(By.id('login-button'));

        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
        await loginButton.click();

        // Wait for the page to load
        await driver.wait(until.elementLocated(By.css('.inventory_list')), 30000); 
        console.log('Inventory list found');
    });

    it('Add item to cart', async function () {
        try {
            //Add item to cart
            const addToCartButton = await driver.findElement(By.css('.btn_inventory'));
            await addToCartButton.click();
            console.log('Item added to cart');

            //Proceed to the cart
            const cartIcon = await driver.findElement(By.css('.shopping_cart_link'));
            await cartIcon.click();
            console.log('Navigating to the cart page');

            //Verify the cart page
            const cartPageTitle = await driver.findElement(By.className('title')).getText();
            assert.strictEqual(cartPageTitle.trim(), 'Your Cart', 'Expected to be on the cart page');

            //Take a screenshot after adding to cart
            await takeScreenshot(driver, 'add_to_cart_successful.png');
        } catch (err) {
            console.log('Test failed. Taking a screenshot.');
            await takeScreenshot(driver, 'error_screenshot.png');
            throw err; 
        }
    });



    after(async function () {
        await driver.quit();
    });
});

