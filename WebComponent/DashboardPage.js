const { By } = require('selenium-webdriver');

class DashboardPage {
    constructor(driver) {
        this.driver = driver;
    }

    async isOnDashboard() {
        const titleElement = await this.driver.findElement(By.className('title'));
        const titleText = await titleElement.getText();
        return titleText.trim(); 
    }
}

module.exports = DashboardPage;

