import { test, expect, request } from '@playwright/test'

const API_URL = 'https://rea1994.dev.qshop.ai/admin/api'
const templateName = `템플릿-api-${new Date().toLocaleTimeString()}`
let token
let templateId

test.beforeAll(async ({ request }) => {
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

test.describe('배송 템플릿 API 테스트', () => {
  /** 배송 템플릿 목록 */
  test('배송 템플릿 목록', async () => {
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    const res = await apiContext.get(`${API_URL}/product-delivery-templates?page=1&count=10`)
    expect(res.status()).toBe(200)
    const result = JSON.parse(await res.text())
    console.log(result)
  })

  /** 배송 템플릿 등록 */
  test('배송 템플릿 등록', async () => {
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
    templateId = result.id
  })

  /** 배송 템플릿 삭제 */
  test('배송 템플릿 삭제', async () => {
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    const res = await apiContext.delete(`${API_URL}/product-delivery-templates?ids=${templateId}`)
    const result = JSON.parse(await res.text())
    console.log(result)
  })
})
