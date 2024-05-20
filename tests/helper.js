export const login = async page => {
  await page.goto('/admin/login')

  await page.getByPlaceholder('이메일 주소를 입력해주세요').click()
  await page.getByPlaceholder('이메일 주소를 입력해주세요').fill('rea1109@squares.ai')
  await page.getByPlaceholder('비밀번호를 입력해주세요').click()
  await page.getByPlaceholder('비밀번호를 입력해주세요').fill('Rkskek123!')
  await page.getByRole('button', { name: '로그인' }).click()
}

export const setUpTemplatePage = async page => {
  await login(page)
  await page.getByRole('button', { name: '상품', exact: true }).click()
  await page.getByRole('button', { name: '템플릿 관리' }).click()
}
