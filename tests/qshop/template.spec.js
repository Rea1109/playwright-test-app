import { test, expect, request } from '@playwright/test'
import { setUpTemplatePage } from '../helper'

const API_URL = 'https://rea1994.dev.qshop.ai/admin/api'

let page
let token

test.beforeAll(async ({ browser, request }) => {
  page = await browser.newPage()
  await setUpTemplatePage(page)

  const res = await request.post(`${API_URL}/auth/sign-in`, {
    data: {
      account: 'rea1109@squares.ai',
      password: 'Rkskek123!',
      staySignedIn: false,
    },
  })
  expect(res.status()).toBe(201)

  const result = JSON.parse(await res.text())
  token = result.token
})

test.describe('배송 템플릿 테스트', () => {
  /** 배송 템플릿 목록 */
  test('배송 템플릿 목록', async () => {
    /** API test */
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    const res = await apiContext.get(`${API_URL}/product-delivery-templates?page=1&count=10`)
    expect(res.status()).toBe(200)
    const result = JSON.parse(await res.text())
    console.log(result)

    /** UI test */
    await expect(page.getByText('배송 템플릿 목록')).toBeVisible()
    await expect(page.getByRole('tab', { name: '배송 템플릿' })).toBeVisible()
  })

  /** 배송 템플릿 등록 */
  test('배송 템플릿 등록', async () => {
    const templateName = `템플릿-${new Date().toLocaleTimeString()}`

    /** API test */
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    const res = await apiContext.post(`${API_URL}/product-delivery-templates`, {
      data: {
        paymentType: 'prepaid',
        isDefault: false,
        name: `${templateName}-api`,
        deliveryType: 'delivery',
        usePickup: false,
        useQuick: false,
        useBundle: true,
        hasInstallationCost: false,
        deliveryCompanyId: 2,
        returnDeliveryPrice: 3000,
        exchangeDeliveryPrice: 6000,
        priceType: 'free',
        conditionTypeInfo: {
          price: 0,
          minPriceForFree: 0,
        },
        fixedTypeInfo: {
          price: 0,
        },
        quantityTypeInfo: {
          quantityPerBundle: 1,
          pricePerBundle: 0,
        },
        sectionTypeInfo: {
          section1quantity: 1,
          section1price: 0,
          section2quantity: 1,
          section2price: 0,
          section3quantity: 1,
          section3price: 0,
          price: 0,
          sectionType: '2',
          section1quantityMax: 0,
          section2quantityMax: 0,
        },
        areaPriceInfo: {
          areaType: '1',
          area2Price: 1000,
          area3Price: 2000,
        },
        shippingAddressId: 272,
        returnAddressId: 272,
        information: '이것은 테스트 메시지 입니다.',
      },
    })
    expect(res.status()).toBe(201)
    const result = JSON.parse(await res.text())
    console.log(result)

    /** UI test */
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
})
