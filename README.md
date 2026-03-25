_# demo-ecommerce-legacy

## Overview
This variant demonstrates a legacy implementation of the Meta Pixel, using deprecated APIs and practices. This is part of a collection of demo e-commerce sites that showcase different levels of Meta Pixel and Conversions API (CAPI) implementation quality. Each variant is deployed on GitHub Pages.

**Live Site:** https://mishaberman.github.io/demo-ecommerce-legacy/
**Quality Grade:** F-

## Meta Pixel Setup

### Base Pixel Code
- **Pixel ID:** 1684145446350033
- **Location:** Loaded in the `<head>` tag of `index.html`.
- **Noscript Fallback:** Included, but it uses a deprecated `img.gif` endpoint.

### Advanced Matching
- **Method:** Uses the deprecated `setUserProperties` function, which is incorrect.
- **PII Sent:** Raw, unhashed PII is sent via the deprecated API.

## Conversions API (CAPI) Setup

### Method
None. This variant does not implement the Conversions API.

### Implementation Details
Not applicable.

## Events Tracked

| Event Name | Pixel | CAPI | Parameters Sent | event_id |
|---|---|---|---|---|
| ViewContent | Yes | No | Deprecated | No |
| AddToCart | Yes | No | Deprecated | No |
| InitiateCheckout | Yes | No | Deprecated | No |
| Purchase | Yes | No | Deprecated | No |
| Lead | Yes | No | Deprecated | No |
| CompleteRegistration | Yes | No | Deprecated | No |
| Contact | Yes | No | Deprecated | No |

## Event Deduplication
- **event_id Generation**: Not implemented.
- **Deduplication Status**: Not applicable as there is no CAPI implementation.

## Custom Data
- No `custom_data` fields are sent with events.
- No custom events are tracked.

## Known Issues
- **Deprecated APIs**: The entire implementation relies on outdated and deprecated Meta Pixel APIs.
- **Incorrect Advanced Matching**: Uses the deprecated `setUserProperties` function instead of the correct `setUserData` or `init` with user data.
- **Deprecated Noscript Fallback**: The `<noscript>` tag points to a deprecated `img.gif` endpoint.
- **Raw PII**: Personally Identifiable Information (PII) is sent without being hashed.

## Security Considerations
- **PII Hashing**: PII is not hashed before being sent to Meta, which is a significant security and privacy risk.

---
*This variant is part of the [Meta Pixel Quality Variants](https://github.com/mishaberman) collection for testing and educational purposes.*
_
