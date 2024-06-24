import { test, expect } from '@playwright/test'

interface Task {
  name: string
  is_done: boolean
}

const task: Task = {
  name: 'Ler um livro de TypeScript',
  is_done: false
}

test('deve poder cadastrar uma nova tarefa', async ({ page }) => {
  await page.request.delete(`http://localhost:3333/helper/tasks/${task.name}`)
  await page.goto('/')

  const inputTaskName = page.locator('input[class*="InputNewTask"]')
  await inputTaskName.fill(task.name)

  await page.getByRole('button', { name: 'Create' }).click()

  const target = page.locator(`css=.task-item p >> text=${task.name}`)
  await expect(target).toBeVisible()
})

test('não deve poder cadastrar uma mesma tarefa duas vezes', async ({ page }) => {
  await page.request.delete(`http://localhost:3333/helper/tasks/${task.name}`)
  await page.request.post('http://localhost:3333/tasks', {data: task})

  await page.goto('/')

  const inputTaskName = page.locator('input[class*="InputNewTask"]')

  // await inputTaskName.fill(task.name)
  // await page.getByRole('button', { name: 'Create' }).click()

  await inputTaskName.fill(task.name)
  await page.getByRole('button', { name: 'Create' }).click()

  const target = page.getByLabel('Oops')
  await expect(target).toBeVisible()
})