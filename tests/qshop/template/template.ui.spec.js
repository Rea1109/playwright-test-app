import { test, expect } from '@playwright/test'
import { setUpTemplatePage } from '../../helper'

const templateName = `템플릿-${new Date().toLocaleTimeString()}`
let page

test.beforeAll(async ({ browser, request }) => {
  page = await browser.newPage()
  await setUpTemplatePage(page)
})

test.describe('배송 템플릿 테스트', () => {
  /** 배송 템플릿 목록 */
  test('배송 템플릿 목록', async () => {
    await expect(page.getByText('배송 템플릿 목록')).toBeVisible()
    await expect(page.getByRole('tab', { name: '배송 템플릿' })).toBeVisible()
  })

  /** 배송 템플릿 등록 */
  test('배송 템플릿 등록', async () => {
    await page.getByRole('button', { name: '템플릿 등록' }).click()
    await expect(page.getByRole('heading', { name: '기본 템플릿' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '템플릿 명 *' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '결제방식' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '묶음배송' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '배송방법(필수)' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '배송방법(선택)' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '기본 택배사' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '배송비 부과방식' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '배송비용' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '지역별 배송비' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '별도 설치비' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '출고지 *' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '반품지 *' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '배송안내 *' })).toBeVisible()
    await page.getByRole('button', { name: '등록', exact: true }).click()
    await expect(page.getByText('필수값 입니다').first()).toBeVisible()
    await page.getByPlaceholder('템플릿 명을 입력해주세요').click()
    await page.getByPlaceholder('템플릿 명을 입력해주세요').fill(templateName)
    await page.getByRole('button', { name: '등록', exact: true }).click()
    await expect(page.getByText('필수값 입니다')).toBeVisible()
    await page.getByPlaceholder('배송안내 기본 메시지를 입력해주세요').click()
    await page
      .getByPlaceholder('배송안내 기본 메시지를 입력해주세요')
      .fill('이것은 테스트 메시지입니다.')
    page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`)
      expect(dialog.message()).toBe('배송템플릿이 등록되었습니다.')
      await dialog.dismiss().catch(() => {})
    })
    await page.getByRole('button', { name: '등록', exact: true }).click()
    await expect(page.getByText(templateName)).toBeVisible()
  })

  /** 배송 템플릿 삭제 */
  test('배송 템플릿 삭제', async () => {
    page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`)
      expect(dialog.message()).toBe('템플릿을 삭제하시겠습니까?')
      await dialog.accept()
    })
    await page.locator('//*[@id="__next"]/div/main/div[2]/div/div[2]/div[1]/table/tbody/tr[1]/td[10]').click()
    await page.getByRole('menuitem', { name: '삭제하기' }).click()

    await page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`)
      expect(dialog.message()).toBe('템플릿이 삭제 되었습니다.')
      await dialog.accept()
    })

    await page.pause()
  })
})
