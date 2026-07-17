import { By, until } from 'selenium-webdriver';

import {
  buildDriver,
  click,
  createTask,
  fill,
  login,
  logout,
  register,
  uniqueAccount,
  waitFor,
  waitForText,
} from './helpers.mjs';

const driver = await buildDriver();
const owner = uniqueAccount('E2E Share Owner');
const recipient = uniqueAccount('E2E Share Recipient');
const taskTitle = `Shared task ${Date.now()}`;

async function share(permission) {
  const taskSelect = await waitFor(driver, By.css("select[name='share_task']"));
  await taskSelect.sendKeys(taskTitle);
  await fill(driver, By.css("input[name='recipient_email']"), recipient.email);
  const permissionSelect = await waitFor(driver, By.css("select[name='permission']"));
  await permissionSelect.sendKeys(permission === 'editor' ? 'Editor' : 'Viewer');
  await click(driver, By.xpath("//form[.//h3[normalize-space(.)='Compartilhar']]//button[@type='submit']"));
  await waitForText(driver, 'Convite enviado');
}

async function acceptInvitation() {
  await waitForText(driver, 'Convites e compartilhamentos');
  await click(driver, By.xpath("//button[normalize-space(.)='Aceitar']"));
  await waitForText(driver, taskTitle);
}

async function removeSharing() {
  await click(driver, By.css(`button[aria-label='Remover compartilhamento ${taskTitle}']`));
  const alert = await driver.wait(until.alertIsPresent(), 5000);
  await alert.accept();
  await waitForText(driver, 'Compartilhamento removido');
}

try {
  await register(driver, owner);
  await createTask(driver, taskTitle);
  await logout(driver);

  await register(driver, recipient);
  await logout(driver);

  await login(driver, owner);
  await share('viewer');
  await logout(driver);

  await login(driver, recipient);
  await acceptInvitation();
  const viewerEditButtons = await driver.findElements(By.css(`button[aria-label='Editar tarefa ${taskTitle}']`));
  const viewerDeleteButtons = await driver.findElements(By.css(`button[aria-label='Excluir tarefa ${taskTitle}']`));
  if (viewerEditButtons.length !== 0 || viewerDeleteButtons.length !== 0) {
    throw new Error('Viewer received write actions.');
  }
  await waitForText(driver, 'Somente leitura');
  await logout(driver);

  await login(driver, owner);
  await removeSharing();
  await share('editor');
  await logout(driver);

  await login(driver, recipient);
  await acceptInvitation();
  await waitFor(driver, By.css(`button[aria-label='Editar tarefa ${taskTitle}']`));
  const editorDeleteButtons = await driver.findElements(By.css(`button[aria-label='Excluir tarefa ${taskTitle}']`));
  if (editorDeleteButtons.length !== 0) {
    throw new Error('Editor received an owner-only delete action.');
  }

  await click(driver, By.css(`button[aria-label='Editar tarefa ${taskTitle}']`));
  const categorySelect = await waitFor(driver, By.css("form select[name='category']"));
  if (await categorySelect.isEnabled()) {
    throw new Error('Editor can change the owner category.');
  }
  const updatedTitle = `${taskTitle} by editor`;
  await fill(driver, By.css("input[name='title']"), updatedTitle);
  await click(driver, By.xpath("//form[.//input[@name='title']]//button[@type='submit']"));
  await waitForText(driver, updatedTitle);
} finally {
  await driver.quit();
}
