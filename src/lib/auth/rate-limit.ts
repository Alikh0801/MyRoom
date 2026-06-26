import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type AuthRateLimitAction =
  | "signup"
  | "signin"
  | "verify-otp"
  | "resend-otp";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function getLimiter(action: AuthRateLimitAction, redis: Redis): Ratelimit {
  if (action === "signup") {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "myroom:auth:signup",
    });
  }

  if (action === "verify-otp") {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      prefix: "myroom:auth:verify-otp",
    });
  }

  if (action === "resend-otp") {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "myroom:auth:resend-otp",
    });
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "15 m"),
    prefix: "myroom:auth:signin",
  });
}

export function isRateLimitEnabled(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export async function checkAuthRateLimit(
  action: AuthRateLimitAction,
  identifier: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const redis = getRedis();
  if (!redis) {
    return { ok: true };
  }

  const limiter = getLimiter(action, redis);
  const { success, reset } = await limiter.limit(identifier);

  if (success) {
    return { ok: true };
  }

  const resetDate = new Date(reset);
  const minutesLeft = Math.max(
    1,
    Math.ceil((resetDate.getTime() - Date.now()) / 60000)
  );

  const messages: Record<AuthRateLimitAction, string> = {
    signup: `Çox sayda qeydiyyat cəhdi. ${minutesLeft} dəqiqə sonra yenidən cəhd edin.`,
    signin: `Çox sayda giriş cəhdi. ${minutesLeft} dəqiqə sonra yenidən cəhd edin.`,
    "verify-otp": `Çox sayda təsdiq cəhdi. ${minutesLeft} dəqiqə sonra yenidən cəhd edin.`,
    "resend-otp": `Çox sayda kod göndərmə cəhdi. ${minutesLeft} dəqiqə sonra yenidən cəhd edin.`,
  };

  const message = messages[action];

  return { ok: false, error: message };
}
