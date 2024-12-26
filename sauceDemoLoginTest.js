import { Builder, By, Key, until } from "selenium-webdriver";
import assert from "assert";

async function sauceDemoLoginTest() {
    // Membuat koneksi dengan Browser Driver
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // Buka URL di browser
        await driver.get("https://www.saucedemo.com");

        //masukan username and password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.xpath("//input[@id='password']")).sendKeys('secret_sauce');
        
        //click button login
        await driver.findElement(By.xpath("//input[@id='login-button']")).click();
        
        //memastikan k=didalam dashboard dan emncari judul 'SwagLabs'
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, "Title does not include 'Swag Labs'");
        
        //memastikan di dashboard dengan mencari 'burger button'
        let menuButton = await driver.findElement(By.xpath("//button[@id='react-burger-menu-btn']"));
        assert.strictEqual(await menuButton.isDisplayed(), true, "Menu Button is not visible");
       
        // Simulate adding an item to the cart (example)
        let addItemButton = await driver.findElement(By.xpath("//button[@id='add-to-cart']"));
        await addItemButton.click();

        //verify success open menu chart
        let menuChart = await driver.findElement(By.xpath("//button[@id='checkout']"));
        assert.strictEqual(await menuChart.isDisplayed(), true, "Menu Chart is not Open");

        //add item to chart
        let chartList = await driver.findElement(By.xpath("//div[@class='cart_list']/div[3]/div[@class='cart_quantity']"));
        assert.strictEqual(await chartList.includes(), true, "Chart list is Empty" );

        //verify item successfully on chart -> add to chart button isnt available, replaced to the remove button
        let removeChart = await driver.findElement(By.xpath("//button[@id='remove-sauce-labs-backpack']"));
        assert.strictEqual(await removeChart.isDisplayed(), true, "Add to Chart button is displayed")

        //wait for the cart to update with the new number of items
        await driver.wait(until.elementLocated(By.xpath("//div[@id='shopping_cart_container']/a[.='2']")), 5000);

        //verify the cart button displays the correct number of items
        let numberChartItem = await driver.findElement(By.xpath("//div[@id='shopping_cart_container']/a[.='2']"));
        assert.strictEqual(await numberChartItem.isDisplayed(), true, "Cart is not showing the correct number of items");

        console.log("Test passed: The cart shows the correct number of items.");
    } catch (error) {
        console.error("Test failedgit:", error);
    } finally {

        await driver.quit();
    }
}

// Jalankan fungsi pengujian
sauceDemoLoginTest();
//div[@class='login_wrapper-inner']