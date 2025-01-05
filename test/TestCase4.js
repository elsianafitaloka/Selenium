const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL; 
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

//mkdir screenshots
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

describe('Test Cart [Checkout] #Functionality', function () {
    this.timeout(60000); 
    let driver;

    //Verify on various browsers
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

        //Login steps
        const usernameInput = await driver.findElement(By.id('user-name'));
        const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
        const loginButton = await driver.findElement(By.id('login-button'));

        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
        await loginButton.click();

        //Wait for the page to load
        await driver.wait(until.elementLocated(By.css('.inventory_list')), 30000); 
        console.log('Inventory list found');
    });

    it('Add item to cart and proceed to checkout', async function () {
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

            //Proceed to checkout
            const checkoutButton = await driver.findElement(By.css('.checkout_button'));
            await checkoutButton.click();
            console.log('Proceeded to checkout');
            
            //Verify the checkout page
            const checkoutPageTitle = await driver.findElement(By.className('title')).getText();
            assert.strictEqual(checkoutPageTitle.trim(), 'Checkout: Your Information', 'Expected to be on the checkout page');

            //Fill out the checkout form
            const firstNameInput = await driver.findElement(By.id('first-name'));
            const lastNameInput = await driver.findElement(By.id('last-name'));
            const zipCodeInput = await driver.findElement(By.id('postal-code'));
            await firstNameInput.sendKeys('Elsiana');
            await lastNameInput.sendKeys('Diah Fitaloka');
            await zipCodeInput.sendKeys('12345');

            //Submit the checkout form
            const continueButton = await driver.findElement(By.css('.btn_primary.cart_button'));
            await continueButton.click();
            console.log('Proceeding to the review page');

            //Verify the review page
            const reviewPageTitle = await driver.findElement(By.className('title')).getText();
            assert.strictEqual(reviewPageTitle.trim(), 'Checkout: Overview', 'Expected to be on the review page');

            //Complete the order
            const finishButton = await driver.findElement(By.css('.btn_action.cart_button'));
            await finishButton.click();
            console.log('Order completed');

            //Verify the confirmation message
            const confirmationMessage = await driver.findElement(By.css('.complete-header')).getText();
            assert.strictEqual(confirmationMessage.trim().toUpperCase(), 'THANK YOU FOR YOUR ORDER!', 'Expected confirmation message not found');

            //Take a screenshot after order completion
            await takeScreenshot(driver, 'order_confirmation.png');

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