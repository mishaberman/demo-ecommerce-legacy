/**
 * Meta Pixel & Conversions API — "Legacy/Outdated" Variant
 * 
 * CONCEPT: Uses deprecated pixel patterns and wrong parameter names.
 * - Double-loaded fbevents.js (potential conflicts)
 * - Uses deprecated fbq('setUserProperties') instead of advanced matching in init
 * - Standard events sent via trackCustom (won't be recognized for optimization!)
 * - Wrong parameter names: "product_id" instead of "content_ids", "price" instead of "value"
 * - No CAPI at all
 * - No event_id
 * - Legacy img-tag tracking alongside JS pixel
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const PIXEL_ID = '1684145446350033';

// DEPRECATED: Using setUserProperties instead of advanced matching in init
export function setUserData(data: { em?: string; ph?: string; fn?: string; ln?: string }) {
  if (typeof window !== 'undefined' && window.fbq) {
    // DEPRECATED API — setUserProperties is no longer supported
    // Should use fbq('init', PIXEL_ID, { em: ..., fn: ..., ... }) instead
    (window.fbq as any)('setUserProperties', PIXEL_ID, {
      $email: data.em || '',        // Wrong key format — should be 'em'
      $phone_number: data.ph || '', // Wrong key format — should be 'ph'
      $first_name: data.fn || '',   // Wrong key format — should be 'fn'
      $last_name: data.ln || '',    // Wrong key format — should be 'ln'
    });
    console.log('[Meta Pixel] Used DEPRECATED setUserProperties');
  }
}

// ============================================================
// PIXEL EVENTS — Uses wrong param names and trackCustom
// ============================================================

/**
 * Track ViewContent — uses fbq('track') but with WRONG parameter names
 */
export function trackViewContent(productId: string, productName: string, value: number, currency: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      product_id: productId,      // WRONG: Should be content_ids (array)
      product_name: productName,  // WRONG: Should be content_name
      price: value,               // WRONG: Should be "value"
      currency_code: currency,    // WRONG: Should be "currency"
      category: 'Products',       // WRONG: Should be content_category
      // MISSING: content_type
    });
    console.log('[Meta Pixel] ViewContent with WRONG param names');
  }
  // Also fire a legacy img pixel (redundant/conflicting)
  fireLegacyImgPixel('ViewContent', value);
}

/**
 * Track AddToCart — uses trackCustom instead of track (WON'T BE RECOGNIZED!)
 */
export function trackAddToCart(productId: string, productName: string, value: number, currency: string, quantity: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    // CRITICAL: trackCustom means Meta won't recognize this as a standard AddToCart event
    // It won't be available for standard event optimization
    window.fbq('trackCustom', 'AddToCart', {
      product_id: productId,      // WRONG: Should be content_ids (array)
      product_name: productName,  // WRONG: Should be content_name
      price: value,               // WRONG: Should be "value"
      currency: currency,
      quantity: quantity,          // WRONG: Should be "num_items"
    });
    console.log('[Meta Pixel] AddToCart via trackCustom (WRONG — should be track)');
  }
  fireLegacyImgPixel('AddToCart', value);
}

/**
 * Track InitiateCheckout — uses track but wrong params
 */
export function trackInitiateCheckout(value: number, currency: string, numItems: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      price: value,               // WRONG: Should be "value"
      currency_code: currency,    // WRONG: Should be "currency"
      quantity: numItems,          // WRONG: Should be "num_items"
      // MISSING: content_ids, content_type
    });
    console.log('[Meta Pixel] InitiateCheckout with WRONG param names');
  }
}

/**
 * Track Purchase — uses trackCustom (CRITICAL: Won't optimize for conversions!)
 */
export function trackPurchase(value: number, currency: string, contentIds?: string[]) {
  if (typeof window !== 'undefined' && window.fbq) {
    // CRITICAL: trackCustom for Purchase means Meta can't optimize for purchase conversions!
    window.fbq('trackCustom', 'Purchase', {
      price: value,               // WRONG: Should be "value"
      currency: currency,
      product_ids: contentIds,    // WRONG: Should be "content_ids"
      product_type: 'physical',   // WRONG: Should be content_type: 'product'
      quantity: contentIds?.length || 0, // WRONG: Should be "num_items"
    });
    console.log('[Meta Pixel] Purchase via trackCustom (CRITICAL — should be track)');
  }
  fireLegacyImgPixel('Purchase', value);
}

/**
 * Track Lead — uses track (correct method) but minimal params
 */
export function trackLead(formType?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      lead_type: formType || 'general', // WRONG: Should be "content_name"
      // MISSING: value, currency
    });
  }
}

/**
 * Track CompleteRegistration — uses trackCustom (won't be recognized)
 */
export function trackCompleteRegistration(method?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    // trackCustom — won't be recognized as standard event
    window.fbq('trackCustom', 'CompleteRegistration', {
      registration_method: method || 'email', // WRONG: Should be "status"
      // MISSING: value, currency, content_name
    });
    console.log('[Meta Pixel] CompleteRegistration via trackCustom (WRONG)');
  }
}

/**
 * Track Contact — uses track (correct) but no params at all
 */
export function trackContact() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact');
    // No parameters at all
  }
}

// ============================================================
// LEGACY IMG PIXEL — Redundant tracking via image tags
// This creates duplicate events alongside the JS pixel
// ============================================================

function fireLegacyImgPixel(eventName: string, value?: number) {
  const img = new Image(1, 1);
  const params = new URLSearchParams({
    id: PIXEL_ID,
    ev: eventName,
    noscript: '1',
  });
  if (value !== undefined) {
    params.set('cd[value]', value.toString());
    params.set('cd[currency]', 'USD');
  }
  img.src = `https://www.facebook.com/tr?${params.toString()}`;
  img.style.display = 'none';
  document.body.appendChild(img);
  console.log(`[Legacy Pixel] Fired img tag for ${eventName} (REDUNDANT — creates duplicates)`);
}

// ============================================================
// NO CAPI AT ALL
// ============================================================
// No Conversions API implementation — entirely absent
