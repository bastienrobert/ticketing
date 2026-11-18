import ExpoModulesCore
import PassKit

struct PaymentRequest: Record {
  @Field var merchantIdentifier: String = ""
  @Field var merchantName: String = ""
  @Field var label: String = ""
  // a decimal string such as "25.00": a Double could round the cents
  @Field var amount: String = ""
}

final class PaymentInProgressException: Exception, @unchecked Sendable {
  override var reason: String { "A payment is already in progress" }
}

final class PaymentUnavailableException: Exception, @unchecked Sendable {
  override var reason: String { "Apple Pay could not present its sheet" }
}

public final class ApplePayModule: Module {
  // the controller keeps only a weak reference to its delegate
  private var payment: Payment?

  public func definition() -> ModuleDefinition {
    Name("ApplePay")

    Function("canMakePayments") {
      PKPaymentAuthorizationController.canMakePayments()
    }

    // resolves `true` once the payment is authorized, `false` when the sheet is closed before
    AsyncFunction("pay") { (request: PaymentRequest, promise: Promise) in
      guard payment == nil else { throw PaymentInProgressException() }

      let payment = Payment(request: request) { authorized in
        self.payment = nil
        promise.resolve(authorized)
      }
      self.payment = payment

      payment.present { presented in
        if presented { return }
        self.payment = nil
        promise.reject(PaymentUnavailableException())
      }
    }
    .runOnQueue(.main)
  }
}

private final class Payment: NSObject, PKPaymentAuthorizationControllerDelegate {
  private let controller: PKPaymentAuthorizationController
  private let onFinish: (Bool) -> Void
  private var authorized = false

  init(request: PaymentRequest, onFinish: @escaping (Bool) -> Void) {
    let amount = NSDecimalNumber(string: request.amount)
    let paymentRequest = PKPaymentRequest()
    paymentRequest.merchantIdentifier = request.merchantIdentifier
    paymentRequest.merchantCapabilities = .threeDSecure
    paymentRequest.countryCode = "FR"
    paymentRequest.currencyCode = "EUR"
    paymentRequest.supportedNetworks = [.cartesBancaires, .visa, .masterCard, .amex]
    paymentRequest.paymentSummaryItems = [
      PKPaymentSummaryItem(label: request.label, amount: amount),
      // the last item is the total, labelled with whoever gets paid
      PKPaymentSummaryItem(label: request.merchantName, amount: amount),
    ]

    controller = PKPaymentAuthorizationController(paymentRequest: paymentRequest)
    self.onFinish = onFinish
    super.init()
    controller.delegate = self
  }

  func present(completion: @escaping (Bool) -> Void) {
    controller.present(completion: completion)
  }

  func paymentAuthorizationController(
    _ controller: PKPaymentAuthorizationController,
    didAuthorizePayment payment: PKPayment,
    handler completion: @escaping (PKPaymentAuthorizationResult) -> Void
  ) {
    // ponytail: mocked, nothing is charged; a real app sends payment.token to its server
    // and completes with the server's answer
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      self.authorized = true
      completion(PKPaymentAuthorizationResult(status: .success, errors: nil))
    }
  }

  func paymentAuthorizationControllerDidFinish(_ controller: PKPaymentAuthorizationController) {
    controller.dismiss {
      self.onFinish(self.authorized)
    }
  }
}
