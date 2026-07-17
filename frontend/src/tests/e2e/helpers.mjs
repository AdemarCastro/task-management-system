import { By, until } from 'selenium-webdriver';
import { Builder } from 'selenium-webdriver';

export const appUrl = process.env.E2E_APP_URL ?? 'http://frontend:5173';
const seleniumUrl = process.env.SELENIUM_REMOTE_URL ?? 'http://selenium:4444/wd/hub';

export function uniqueAccount(prefix) {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    name: prefix,
    email: `${prefix.toLowerCase().replaceAll(' ', '-')}-${suffix}@example.com`,
    password: 'StrongPassword123!',
  };
}

export async function buildDriver() {
  return new Builder().forBrowser('chrome').usingServer(seleniumUrl).build();
}

export async function waitFor(driver, locator, timeout = 15000) {
  return driver.wait(until.elementLocated(locator), timeout);
}

export async function fill(driver, locator, value) {
  const element = await waitFor(driver, locator);
  await element.clear();
  await element.sendKeys(value);
}

export async function click(driver, locator) {
  const element = await waitFor(driver, locator);
  await driver.wait(until.elementIsVisible(element), 15000);
  await element.click();
}

export async function waitForText(driver, text) {
  await driver.wait(async () => (await driver.findElement(By.css('body')).getText()).includes(text), 15000);
}

export async function register(driver, account) {
  await driver.get(appUrl);
  await click(driver, By.xpath("//div[@role='tablist']//button[normalize-space(.)='Criar conta']"));
  await fill(driver, By.css("input[name='name']"), account.name);
  await fill(driver, By.css("input[name='email']"), account.email);
  await fill(driver, By.css("input[name='password']"), account.password);
  await fill(driver, By.css("input[name='password_confirmation']"), account.password);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Tarefas');
}

export async function login(driver, account) {
  await driver.get(appUrl);
  await fill(driver, By.css("input[name='email']"), account.email);
  await fill(driver, By.css("input[name='password']"), account.password);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Tarefas');
}

export async function logout(driver) {
  await click(driver, By.xpath("//button[normalize-space(.)='Sair']"));
  await waitForText(driver, 'Entrar');
}

export async function createCategory(driver, name) {
  await fill(driver, By.css("input[name='category_name']"), name);
  await click(driver, By.xpath("//form[.//input[@name='category_name']]//button[@type='submit']"));
  await waitForText(driver, name);
}

export async function createTask(driver, title) {
  await fill(driver, By.css("input[name='title']"), title);
  await click(driver, By.xpath("//form[.//input[@name='title']]//button[@type='submit']"));
  await waitForText(driver, title);
}

export async function apiRequest(driver, path, options = {}) {
  const token = await driver.executeScript("return localStorage.getItem('access_token')");
  const response = await fetch(`${appUrl}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API ${options.method ?? 'GET'} ${path} failed with ${response.status}: ${await response.text()}`);
  }
  if (response.status === 204) return null;
  return response.json();
}
