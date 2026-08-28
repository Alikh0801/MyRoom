/**
 * Onlayn ödəniş şlüzü hazırda bankın test mühitində sınaqdan keçirilir.
 * Aktivləşdirmək üçün mühit dəyişəni: NEXT_PUBLIC_PAYMENTS_ENABLED=true
 *
 * Dəyişən təyin edilməyibsə ödəniş BAĞLIDIR (təhlükəsiz default) —
 * istifadəçi bank səhifəsinə yönləndirilmir, əvəzinə "test mərhələsindədir"
 * səhifəsi göstərilir.
 */
export const PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

/** Ödəniş bağlı olanda istifadəçinin yönləndirildiyi səhifə. */
export const PAYMENTS_TEST_MODE_PATH = "/payments/test-mode";
