const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;

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

describe('TestCase 2 [Login] #Negative', function () {
    this.timeout(40000);
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
        if (!baseUrl || !browser) {
            throw new Error('BASE_URL or BROWSER is not defined. Check your .env file.');
        }
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();
    });

    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login('haha', 'hihi'); //Invalid credentials
    });

    it('Error message appears for invalid credentials', async function () {
        try {
            const loginPage = new LoginPage(driver);
            const errorMessage = await loginPage.getErrorMessage();
            assert.strictEqual(
                errorMessage.trim(),
                'Epic sadface: Username and password do not match any user in this service',
                'Expected error message does not match'
            );
        } catch (err) {
            console.log('Assertion failed. Taking a screenshot.');
            await takeScreenshot(driver, 'failed_login_attempt.png');
            throw err;
        }
    });

    after(async function () {
        await driver.quit();
    });
});

