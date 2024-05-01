const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('loginUsername')).toBeVisible()
    await expect(page.getByTestId('loginPassword')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('loginUsername').fill('mluukkai')
      await page.getByTestId('loginPassword').fill('salainen')

      await page.getByRole('button', { name: 'login '}).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('loginUsername').fill('jorma')
      await page.getByTestId('loginPassword').fill('uotila')

      await page.getByRole('button', { name: 'login '}).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('loginUsername').fill('mluukkai')
      await page.getByTestId('loginPassword').fill('salainen')
      await page.getByRole('button', { name: 'login '}).click()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('blogFormTitle').fill('a-new-title')
      await page.getByTestId('blogFormAuthor').fill('a-new-author')
      await page.getByTestId('blogFormUrl').fill('a-new-url')
      await page.getByRole('button', { name: 'create' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByTestId('blogShow').getByText('a-new-title a-new-author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('liked a-new-title by a-new-author')).toBeVisible()
    })

    test('a user can delete their blog', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', (dialog) => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('liked a-new-title by a-new-author')).not.toBeVisible()
    })
  })
})