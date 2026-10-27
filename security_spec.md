# Security Specification — Al-Danish Online Islamic & Arabic Academy

## 1. Master Data Invariants
1. **Default Deny:** All unlisted paths (`/{document=**}`) deny all reads and writes unconditionally.
2. **Verified Admin Identity:** Administrative mutations (`site_config`, `courses`, `store_items`, `publications`, `media_ads`, `certificates`, and order status approvals) require `request.auth != null`, `request.auth.token.email_verified == true`, and either the bootstrapped director email (`kaleemhafiz47@gmail.com`) or a document in `/admins/$(request.auth.uid)`. Furthermore, `updatedBy` on admin-managed catalog entities must equal `request.auth.uid`.
3. **Zero Passwords in Cloud Config:** `/site_config/main` explicitly forbids `adminPassword` in `settings` (`!('adminPassword' in data.settings)`).
4. **Split-Collection PII Isolation & Atomic Order Submission:** Student contact PII (`whatsapp`, `email`, `countryCity`, `notes`) lives exclusively in `/orders_private/{orderId}` (readable ONLY by verified admins). Public status lookups by exact registration number use `/order_status/{orderId}` (PII-free, `allow get` only, `allow list: if false`). Both documents must be created and deleted atomically via `existsAfter()`.
5. **Query-Enforced Public Catalogs & Zero List Lookups:** Every `allow list` rule evaluates `resource.data` (`isVisible == true` or `isPublic == true` or primary admin status filter) and contains zero `get()` or `exists()` calls.
6. **Strict Schema, Bounded Sizes & Server Timestamps:** Every string and array enforces `.size()` limits, IDs match `^[a-zA-Z0-9_\-]+$`, updates enforce `affectedKeys().hasOnly(...)` + immutable IDs/creation timestamps, and `createdAtServer`/`updatedAt`/`updatedAtServer` must equal `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return `PERMISSION_DENIED`)
1. **Email Spoof Attack:** Authenticated user with `email == 'kaleemhafiz47@gmail.com'` but `email_verified == false` attempting to update `/site_config/main`.
2. **Shadow Field Injection on Course:** Verified admin creating `/courses/course-1` with extra ghost field `"isSuperFeatured": true`.
3. **Password Leak in SiteConfig:** Verified admin writing `/site_config/main` where `settings.adminPassword` is present.
4. **PII Scraping (`list` on `orders_private`):** Unauthenticated or non-admin signed-in user querying `collection(db, 'orders_private')`.
5. **PII Direct Read (`get` on `orders_private`):** Signed-in non-admin calling `getDoc(doc(db, 'orders_private', 'ENR-2026-1001'))`.
6. **Order Status Enumeration (`list` on `order_status`):** Unauthenticated client calling `getDocs(collection(db, 'order_status'))`.
7. **Orphaned Order Submission (Atomicity Bypass):** Unauthenticated student creating `/orders_private/ENR-2026-9999` WITHOUT atomically creating `/order_status/ENR-2026-9999` in the same batch.
8. **Self-Approved Admission (State Shortcutting):** Unauthenticated student creating `/orders_private/ENR-2026-9999` with `paymentStatus: "Approved"`.
9. **Forged Client Timestamp:** Student creating `/orders_private/ENR-2026-9999` with a hardcoded past/future `createdAtServer` instead of `serverTimestamp()` (`request.time`).
10. **ID Poisoning Attack:** Creating `/orders_private/bad$id!with/slashes` or a 500-character ID.
11. **Value Poisoning on Update:** Verified admin updating `/orders_private/ENR-2026-1001` `paymentStatus` to `99999` (number) or `"HackedStatus"` instead of enum `['Pending', 'Approved', 'Declined']`.
12. **Hidden Course Scraping (`list` without `isVisible == true`):** Unauthenticated client executing `getDocs(collection(db, 'courses'))` without `where('isVisible', '==', true)` when hidden courses exist.
