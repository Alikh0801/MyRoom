import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin/auth";
import { getPublicUrl, uploadFile } from "@/lib/storage/s3";
import { createClient } from "@/lib/supabase/server";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isAdminUser(user.id))) {
    return NextResponse.json({ error: "İcazə yoxdur" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fayl göndərilmədi" }, { status: 400 });
  }

  if (!ACCEPTED.includes(file.type)) {
    return NextResponse.json(
      { error: "Yalnız JPEG, PNG və ya WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Şəkil 8 MB-dan böyükdür" }, { status: 400 });
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const storagePath = `blog/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await uploadFile(storagePath, buffer, file.type);
  } catch (error) {
    console.error("blog cover upload:", error);
    return NextResponse.json({ error: "Yükləmə alınmadı" }, { status: 500 });
  }

  return NextResponse.json({ url: getPublicUrl(storagePath), storagePath });
}
