import { requireOptionalNativeModule } from 'expo'

interface ApplePayModule {
  canMakePayments(): boolean
  pay(request: {
    merchantIdentifier: string
    merchantName: string
    label: string
    amount: string
  }): Promise<boolean>
}

// register it in the Apple Developer account, with the Apple Pay entitlement, to pay on a phone
const MERCHANT_IDENTIFIER = 'merchant.com.bastienrobert.ticketing'

const ApplePay = requireOptionalNativeModule<ApplePayModule>('ApplePay')

export const applePay = {
  /** Whether this build embeds the module and the phone supports Apple Pay. */
  canMakePayments() {
    return ApplePay?.canMakePayments() ?? false
  },

  /** Show the Apple Pay sheet for one item; `true` once paid (mocked), `false` when closed before. */
  async pay(label: string, amount: string) {
    if (!ApplePay) return false

    return ApplePay.pay({
      merchantIdentifier: MERCHANT_IDENTIFIER,
      merchantName: 'Ticketing',
      label,
      amount,
    })
  },
}
