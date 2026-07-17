import { By, until } from 'selenium-webdriver';
import { Builder } from 'selenium-webdriver';

const appUrl = process.env.E2E_APP_URL ?? 'http://frontend:5173';
const seleniumUrl = process.env.SELENIUM_REMOTE_URL ?? 'http://selenium:4444/wd/hub';
const suffix = Date.now();
const owner = {
  name: 'E2E Owner',
  email: `e2e-owner-${suffix}@example.com`,
  password: 'OwnerStrongPassword123!',
};
const recipient = {
  name: 'E2E Recipient',
  email: `e2e-recipient-${suffix}@example.com`,
  password: 'RecipientStrongPassword123!',
};
const categoryName = `E2E Category ${suffix}`;
const taskTitle = `E2E Task ${suffix}`;

async function waitFor(driver, locator) {
  return driver.wait(until.elementLocated(locator), 15000);
}

async function fill(driver, locator, value) {
  const element = await waitFor(driver, locator);
  await element.clear();
  await element.sendKeys(value);
}

async function click(driver, locator) {
  const element = await waitFor(driver, locator);
  await driver.wait(until.elementIsVisible(element), 15000);
  await element.click();
}

async function waitForText(driver, text) {
  await driver.wait(async () => (await driver.findElement(By.css('body')).getText()).includes(text), 15000);
}

async function register(driver, account) {
  await driver.get(appUrl);
  await click(driver, By.xpath("//div[@role='tablist']//button[normalize-space(.)='Criar conta']"));
  await fill(driver, By.css("input[name='name']"), account.name);
  await fill(driver, By.css("input[name='email']"), account.email);
  await fill(driver, By.css("input[name='password']"), account.password);
  await fill(driver, By.css("input[name='password_confirmation']"), account.password);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Tarefas');
}

async function login(driver, account) {
  await fill(driver, By.css("input[name='email']"), account.email);
  await fill(driver, By.css("input[name='password']"), account.password);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Tarefas');
}

async function logout(driver) {
  await click(driver, By.xpath("//button[normalize-space(.)='Sair']"));
  await waitForText(driver, 'Entrar');
}

async function createCategory(driver) {
  const form = "//form[.//input[@name='category_name']]";
  await fill(driver, By.css("input[name='category_name']"), categoryName);
  await click(driver, By.xpath(`${form}//button[@type='submit']`));
  await waitForText(driver, categoryName);
}

async function createTask(driver) {
  const form = "//form[.//input[@name='title']]";
  await fill(driver, By.css("input[name='title']"), taskTitle);
  await click(driver, By.xpath(`${form}//button[@type='submit']`));
  await waitForText(driver, taskTitle);
}

async function recoverPassword(driver, account) {
  await logout(driver);
  await click(driver, By.xpath("//button[normalize-space(.)='Esqueci minha senha']"));
  await fill(driver, By.css("input[name='email']"), account.email);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Link local gerado');

  const resetHref = await (await waitFor(driver, By.css('.auth-message a'))).getAttribute('href');
  const token = new URL(resetHref).searchParams.get('reset_token');
  await driver.get(`${appUrl}/?reset_token=${encodeURIComponent(token)}`);
  await waitForText(driver, 'Definir nova senha');
  const newPassword = 'ResetStrongPassword123!';
  await fill(driver, By.css("input[name='password']"), newPassword);
  await fill(driver, By.css("input[name='password_confirmation']"), newPassword);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Tarefas');
  return { ...account, password: newPassword };
}

async function shareTask(driver, account) {
  const form = "//form[.//h3[normalize-space(.)='Compartilhar']]";
  const taskSelect = await waitFor(driver, By.css("select[name='share_task']"));
  await taskSelect.sendKeys(taskTitle);
  await fill(driver, By.css("input[name='recipient_email']"), account.email);
  await click(driver, By.xpath(`${form}//button[@type='submit']`));
  await waitForText(driver, 'Convite enviado');
}

const driver = await new Builder().forBrowser('chrome').usingServer(seleniumUrl).build();

try {
  await register(driver, owner);
  await createCategory(driver);
  await createTask(driver);

  const search = await waitFor(driver, By.css("input[aria-label='Buscar tarefa']"));
  await search.sendKeys(taskTitle);
  await waitForText(driver, taskTitle);
  await click(driver, By.css(`button[aria-label='Concluir tarefa ${taskTitle}']`));
  await waitFor(driver, By.css(`button[aria-label='Reabrir tarefa ${taskTitle}']`));
  await click(driver, By.css(`button[aria-label='Reabrir tarefa ${taskTitle}']`));
  await waitFor(driver, By.css(`button[aria-label='Concluir tarefa ${taskTitle}']`));

  const recoveredOwner = await recoverPassword(driver, owner);
  await logout(driver);
  await register(driver, recipient);
  await logout(driver);
  await login(driver, recoveredOwner);

  await shareTask(driver, recipient);
  await logout(driver);

  await login(driver, recipient);
  await waitForText(driver, 'Convites');
  await click(driver, By.xpath("//button[normalize-space(.)='Aceitar']"));
  await waitForText(driver, taskTitle);

  const deleteButtons = await driver.findElements(
    By.css(`button[aria-label='Excluir tarefa ${taskTitle}']`),
  );
  if (deleteButtons.length !== 0) {
    throw new Error('A shared user received an owner-only delete action.');
  }
} finally {
  await driver.quit();
}
