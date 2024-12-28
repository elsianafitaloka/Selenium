const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/LoginPage');
const assert = require('assert');

describe('TestCase 2', function (){

    this.timeout(40000);
    let driver;

    //Run setiap mulai test
    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();

    });

     beforeEach(async function() {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate();
        await loginPage.login('haha', 'hihi');

    });

    //Assertion atau validasi
    it('Error message appears for invalid credentials', async function() {
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(errorMessage, 'Epic sadface : username and password', 'Expected error message does not match');
    })

  
    after(async function() {
        await driver.quit();
    });

    
});