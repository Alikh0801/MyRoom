import { handleRecoveryCallback } from "@/lib/auth/recovery-callback";

export async function GET(request: Request) {
  return handleRecoveryCallback(request, ["tr"]);
}
