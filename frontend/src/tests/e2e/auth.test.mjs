import { By } from 'selenium-webdriver';

import {
  appUrl,
  buildDriver,
  click,
  fill,
  login,
  logout,
  register,
  uniqueAccount,
  waitFor,
  waitForText,
} from './helpers.mjs';

const driver = await buildDriver();
const account = uniqueAccount('E2E Auth');

try {
  await register(driver, account);
  await logout(driver);
  await login(driver, account);
  await logout(driver);

  await click(driver, By.xpath("//button[normalize-space(.)='Esqueci minha senha']"));
  await fill(driver, By.css("input[name='email']"), account.email);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Link local gerado');

  const resetHref = await (await waitFor(driver, By.css('.auth-message a'))).getAttribute('href');
  const token = new URL(resetHref).searchParams.get('reset_token');
  const newPassword = 'NewStrongPassword123!';
  await driver.get(`${appUrl}/?reset_token=${encodeURIComponent(token)}`);
  await waitForText(driver, 'Definir nova senha');
  await fill(driver, By.css("input[name='password']"), newPassword);
  await fill(driver, By.css("input[name='password_confirmation']"), newPassword);
  await click(driver, By.xpath("//form[contains(@class, 'auth-form')]//button[@type='submit']"));
  await waitForText(driver, 'Tarefas');

  await logout(driver);
  await login(driver, { ...account, password: newPassword });
} finally {
  await driver.quit();
}
