# Legacy <img src="https://img.shields.io/badge/Grade-F+-red" alt="Grade F+" />

This variant demonstrates a dangerous legacy implementation of the Meta Pixel. While it successfully fires all standard e-commerce events and attempts to use Advanced Matching, it critically fails by sending personally identifiable information (PII) in plaintext without the required SHA-256 hashing. This represents a serious privacy and compliance violation according to Meta's terms of service. This variant is a clear example of an old implementation that has not been updated to meet current data protection standards and should be used as a case study for what to avoid.

### Quick Facts

| Fact          | Details                                                                                    |
|---------------|--------------------------------------------------------------------------------------------|
| Pixel ID      | `1684145446350033`                                                                         |
| CAPI Method   | None                                                                                       |
| Grade         | F+                                                                                         |
| Live Site     | [https://mishaberman.github.io/demo-ecommerce-legacy/](https://mishaberman.github.io/demo-ecommerce-legacy/) |
| GitHub Repo   | [https://github.com/mishaberman/demo-ecommerce-legacy](https://github.com/mishaberman/demo-ecommerce-legacy)     |

### What's Implemented

- [x] Meta Pixel base code is present on all pages.
- [x] Standard event tracking is implemented for all key e-commerce actions.
- [x] Advanced Matching is partially implemented, sending email and first name.

### What's Missing or Broken

- [ ] **CRITICAL: PII sent in plaintext.** Email (`em`) and first name (`fn`) are sent to Meta without being hashed. This is a major violation of Meta's data privacy requirements.
- [ ] Incomplete Advanced Matching parameters (missing phone number and last name).
- [ ] No Conversions API (CAPI) implementation for server-side event tracking.
- [ ] No `fbp` (browser ID) or `fbc` (click ID) parameters are generated or sent with events.
- [ ] No event deduplication logic, which would be necessary if CAPI were implemented.
- [ ] No Data Processing Options (DPO) are configured for CCPA/GDPR compliance.
- [ ] The implementation uses deprecated coding patterns.

### Event Coverage

This table shows which events are firing from the browser (Pixel) and server (CAPI).

| Event                | Pixel | CAPI |
|----------------------|:-----:|:----:|
| ViewContent          |   ✅   |  ❌  |
| AddToCart            |   ✅   |  ❌  |
| InitiateCheckout     |   ✅   |  ❌  |
| Purchase             |   ✅   |  ❌  |
| Lead                 |   ✅   |  ❌  |
| Search               |   ✅   |  ❌  |
| CompleteRegistration |   ✅   |  ❌  |

### Parameter Completeness

This table details which user and product parameters are sent with each event.

| Event                | `content_type` | `content_ids` | `value` | `currency` | `content_name` | `num_items` |
|----------------------|:--------------:|:-------------:|:-------:|:----------:|:--------------:|:-----------:|
| ViewContent          |       ✅        |       ✅       |    ✅    |     ✅      |       ✅        |      ❌      |
| AddToCart            |       ✅        |       ✅       |    ✅    |     ✅      |       ✅        |      ✅      |
| InitiateCheckout     |       ✅        |       ✅       |    ✅    |     ✅      |       ✅        |      ✅      |
| Purchase             |       ✅        |       ✅       |    ✅    |     ✅      |       ✅        |      ✅      |
| Lead                 |       ❌        |       ❌       |    ✅    |     ✅      |       ✅        |      ❌      |
| Search               |       ❌        |       ❌       |    ❌    |     ❌      |       ❌        |      ❌      |
| CompleteRegistration |       ❌        |       ❌       |    ✅    |     ✅      |       ❌        |      ❌      |

### Architecture

The tracking for this variant is implemented entirely on the client-side using JavaScript. The Meta Pixel base code is loaded on every page, and `fbq('track', ...)` calls are triggered by user actions like viewing a product, adding an item to the cart, or completing a purchase. 

The most significant architectural flaw is in the handling of Advanced Matching data. The code directly passes user-provided PII (email and first name) into the `fbq('init', ...)` call without performing the required SHA-256 hashing. This sends sensitive user information to Meta in a non-compliant, insecure manner.

### How to Use This Variant

1.  **Explore the Live Site:** Visit the [live site](https://mishaberman.github.io/demo-ecommerce-legacy/) and use the Meta Pixel Helper browser extension to observe the events firing.
2.  **Trigger Events:**
    *   View a product page to trigger `ViewContent`.
    *   Click "Add to Cart" to trigger `AddToCart`.
    *   Go to the checkout page to trigger `InitiateCheckout`.
    *   Submit the checkout form to trigger a `Purchase`.
    *   Submit the newsletter form to trigger a `Lead`.
3.  **Inspect Payloads:** Use your browser's developer tools to inspect the network requests being sent to Facebook. You will see the `em` and `fn` parameters being sent with their plaintext values, confirming the hashing violation.
4.  **Review the Code:** Examine the source code in the [GitHub repository](https://github.com/mishaberman/demo-ecommerce-legacy) to see how the Pixel is initialized and how events are tracked. Pay close attention to the lack of any hashing function.
