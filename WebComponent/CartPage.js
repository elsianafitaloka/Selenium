const { By } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.cartItemSelector = '.cart_item'; // Selector for cart items
        this.checkoutButton = By.id('checkout'); // Checkout button
    }

    // Wait for cart page to load
    async waitForCartPage() {
        await this.driver.wait(until.elementLocated(By.css(this.cartItemSelector)), 10000);
    }

    // Verify that the item is in the cart
    async verifyItemInCart() {
        const cartItems = await this.driver.findElements(By.css(this.cartItemSelector));
        return cartItems.length > 0; // If there's at least 1 item, it's true
    }

    // Click the checkout button
    async proceedToCheckout() {
        await this.driver.findElement(this.checkoutButton).click();
    }
}

module.exports = CartPage;


