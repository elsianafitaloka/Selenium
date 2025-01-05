const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config(); //new

//.env
const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL; 
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotDir = './screenshots/';
if(!fs.existsSync(screenshotDir)){
    fs.mkdirSync(screenshotDir, {recursive: true});
}

describe('TestCase 1 [Login] #Regression', function (){

    this.timeout(40000);
    let driver;
    
    switch(browser.toLowerCase()){
        case 'safari':
               const safari = require('selenium-webdriver/safari');
                options = new safari.Options();
                options.addArguments('--headless'); 
        case 'firefox':
               const firefox = require('selenium-webdriver/firefox');
                options = new firefox.Options();
                options.addArguments('--headless'); 
        case 'chrome':
            default:
                const chrome = require('selenium-webdriver/chrome');
                options = new chrome.Options();
                options.addArguments('--headless');
                break;
    }

    // new add setChromeOptions
    //Run setiap mulai test
    before(async function() {
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();

    });

     beforeEach(async function() {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login(username, password);

    });

    //Assertion atau validasi
    it('Login successfully and verify dashboard', async function() {
        const dashboardPage = new DashboardPage(driver);
        const title = await dashboardPage.isOnDashboard();
        assert.strictEqual(title, 'Products', 'Expected dashboard title to be');
    })

  
afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`
        fs.writeFileSync(filepath, screenshot, 'base64');
    });

    after(async function() {
        await driver.quit();
    });

    
});
