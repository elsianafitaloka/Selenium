const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Test Cart', function () {
    this.timeout(60000); 
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get("https://www.saucedemo.com/");

        // Login steps
        const usernameInput = await driver.findElement(By.id('user-name'));
        const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
        const loginButton = await driver.findElement(By.id('login-button'));

        await usernameInput.sendKeys('standard_user');
        await passwordInput.sendKeys('secret_sauce');
        await loginButton.click();

        //wait for the page
        await driver.wait(until.elementLocated(By.css('.inventory_list')), 30000); 
        console.log('Inventory list found');
    });

    it('Add item to cart and proceed to checkout', async function () {
 
        //find the add to cart
        const addToCartButton = await driver.findElement(By.css('.btn_inventory'));
        await addToCartButton.click();
        console.log('Item added to cart');

        //proceed to the cart
        const cartIcon = await driver.findElement(By.css('.shopping_cart_link'));
        await cartIcon.click();
        console.log('Navigating to the cart page');

        //verify on the cart page
        const cartPageTitle = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(cartPageTitle.trim(), 'Your Cart', 'Expected to be on the cart page');

        //proceed to checkout
        const checkoutButton = await driver.findElement(By.css('.checkout_button'));
        await checkoutButton.click();
        console.log('Proceeded to checkout');
        
        //verify the checkout page
        const checkoutPageTitle = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(checkoutPageTitle.trim(), 'Checkout: Your Information', 'Expected to be on the checkout page');
    });

    after(async function () {
        await driver.quit();
    });
});

