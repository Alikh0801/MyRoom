/**
 * Kapital Bank (Birbank) e-commerce ödəniş şlüzü — rəsmi sənədləşmə:
 * https://pg.kapitalbank.az/docs
 *
 * Autentifikasiya: BasicAuth (tacir istifadəçi adı/şifrəsi, base64).
 * Axın (Order_SMS — sadə alış): sifariş yarat -> hppUrl-ə yönləndir ->
 * bank callback-lə geri qaytarır -> status-u GET /order/{ID} ilə təsdiqlə
 * (callback-dəki STATUS müvəqqəti ola bilər, sənədə görə).
 */

function getConfig() {
  const baseUrl = process.env.KAPITAL_PG_BASE_URL;
  const username = process.env.KAPITAL_PG_USERNAME;
  const password = process.env.KAPITAL_PG_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error(
      "Kapital Bank ödəniş konfiqurasiyası tapılmadı (KAPITAL_PG_BASE_URL/USERNAME/PASSWORD)."
    );
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), username, password };
}

function authHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export interface CreateOrderResult {
  id: number;
  hppUrl: string;
  password: string;
  status: string;
}

export async function createKapitalOrder(params: {
  amount: string;
  currency: string;
  description: string;
  language: string;
  hppRedirectUrl: string;
}): Promise<CreateOrderResult> {
  const { baseUrl, username, password } = getConfig();

  const res = await fetch(`${baseUrl}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(username, password),
    },
    body: JSON.stringify({
      order: {
        typeRid: "Order_SMS",
        amount: params.amount,
        currency: params.currency,
        language: params.language,
        title: "MyRoomAZ",
        description: params.description,
        hppRedirectUrl: params.hppRedirectUrl,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Kapital Bank sifariş yaratma xətası (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.order as CreateOrderResult;
}

export type KapitalOrderStatus =
  | "Preparing"
  | "FullyPaid"
  | "Declined"
  | "Cancelled"
  | string;

export async function getKapitalOrderStatus(
  orderId: string
): Promise<{ status: KapitalOrderStatus; amount: number; currency: string }> {
  const { baseUrl, username, password } = getConfig();

  const res = await fetch(`${baseUrl}/order/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: { Authorization: authHeader(username, password) },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Kapital Bank status sorğusu xətası (${res.status}): ${body}`);
  }

  const data = await res.json();
  return {
    status: data.order?.status,
    amount: Number(data.order?.amount),
    currency: data.order?.currency,
  };
}
