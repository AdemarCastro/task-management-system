import { Builder, By, until } from 'selenium-webdriver';

const appUrl = process.env.E2E_APP_URL ?? 'http://frontend:5173';
const seleniumUrl = process.env.SELENIUM_REMOTE_URL ?? 'http://selenium:4444/wd/hub';

const driver = await new Builder().forBrowser('chrome').usingServer(seleniumUrl).build();

try {
  await driver.get(appUrl);
  await driver.wait(until.elementLocated(By.css('h1')), 10000);
  const title = await driver.findElement(By.css('h1')).getText();
  if (!title.includes('Task Management System')) {
    throw new Error(`Unexpected title: ${title}`);
  }
} finally {
  await driver.quit();
}
