import { test, expect } from '@playwright/test'

test.describe.parallel('API tests', () => {
  const baseURL = 'https://rea1994.dev.qshop.ai/admin/api'

  test('Qshop Login', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth/sign-in`, {
      data: {
        account: 'rea1109@squares.ai',
        password: 'Rkskek123!',
        staySignedIn: false,
      },
    })
    const result = JSON.parse(await response.text())
    console.log(result)
  })
})
