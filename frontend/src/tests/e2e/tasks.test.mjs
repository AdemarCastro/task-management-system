import { By, until } from 'selenium-webdriver';

import {
  apiRequest,
  buildDriver,
  click,
  createCategory,
  createTask,
  fill,
  register,
  uniqueAccount,
  waitFor,
  waitForText,
} from './helpers.mjs';

const driver = await buildDriver();
const account = uniqueAccount('E2E Tasks');
const categoryName = `Category ${Date.now()}`;
const updatedCategoryName = `${categoryName} Updated`;
const taskTitle = `Task ${Date.now()}`;
const updatedTaskTitle = `${taskTitle} Updated`;

try {
  await register(driver, account);
  await createCategory(driver, categoryName);

  await click(driver, By.css(`button[aria-label='Editar categoria ${categoryName}']`));
  await fill(driver, By.css("input[name='category_name']"), updatedCategoryName);
  await click(driver, By.xpath("//form[.//input[@name='category_name']]//button[@type='submit']"));
  await waitForText(driver, updatedCategoryName);

  await createTask(driver, taskTitle);
  await click(driver, By.css(`button[aria-label='Editar tarefa ${taskTitle}']`));
  await fill(driver, By.css("input[name='title']"), updatedTaskTitle);
  const categorySelect = await waitFor(driver, By.css("form select[name='category']"));
  await categorySelect.sendKeys(updatedCategoryName);
  const prioritySelect = await waitFor(driver, By.css("form select[name='priority']"));
  await prioritySelect.sendKeys('Alta');
  await click(driver, By.xpath("//form[.//input[@name='title']]//button[@type='submit']"));
  await waitForText(driver, updatedTaskTitle);

  for (let index = 1; index <= 21; index += 1) {
    await apiRequest(driver, '/tasks/', {
      method: 'POST',
      body: JSON.stringify({
        title: `Pagination task ${String(index).padStart(2, '0')}`,
        priority: index % 2 === 0 ? 'high' : 'low',
      }),
    });
  }

  const search = await waitFor(driver, By.css("input[aria-label='Buscar tarefa']"));
  await search.sendKeys('Pagination task 21');
  await waitForText(driver, 'Pagination task 21');
  await search.clear();
  await driver.wait(async () => (await driver.findElement(By.css('.workspace-header')).getText()).includes('22 registros'), 15000);

  await click(driver, By.xpath("//div[contains(@class, 'pagination')]//button[normalize-space(.)='Proxima']"));
  await waitForText(driver, '2 / 2');
  await click(driver, By.xpath("//div[contains(@class, 'pagination')]//button[normalize-space(.)='Anterior']"));
  await waitForText(driver, '1 / 2');

  const filterPriority = await waitFor(driver, By.css(".filter-bar select[aria-label='Prioridade']"));
  await filterPriority.sendKeys('Alta');
  await driver.wait(async () => (await driver.findElement(By.css('.workspace-header')).getText()).includes('registros'), 15000);
  await filterPriority.sendKeys('Todas as prioridades');

  await search.sendKeys(updatedTaskTitle);
  await waitForText(driver, updatedTaskTitle);
  await click(driver, By.css(`button[aria-label='Concluir tarefa ${updatedTaskTitle}']`));
  await waitFor(driver, By.css(`button[aria-label='Reabrir tarefa ${updatedTaskTitle}']`));
  await click(driver, By.css(`button[aria-label='Reabrir tarefa ${updatedTaskTitle}']`));
  await waitFor(driver, By.css(`button[aria-label='Concluir tarefa ${updatedTaskTitle}']`));

  await click(driver, By.css(`button[aria-label='Excluir tarefa ${updatedTaskTitle}']`));
  const taskAlert = await driver.wait(until.alertIsPresent(), 5000);
  await taskAlert.accept();
  await driver.wait(async () => !(await driver.findElement(By.css('body')).getText()).includes(updatedTaskTitle), 15000);

  await search.clear();
  await click(driver, By.css(`button[aria-label='Excluir categoria ${updatedCategoryName}']`));
  const categoryAlert = await driver.wait(until.alertIsPresent(), 5000);
  await categoryAlert.accept();
  await driver.wait(async () => !(await driver.findElement(By.css('body')).getText()).includes(updatedCategoryName), 15000);
} finally {
  await driver.quit();
}
