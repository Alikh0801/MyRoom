import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE: Record<string, string> = {
  az: "Azərbaycanda gündəlik istirahət və icarə elanları",
  ru: "Объявления посуточной аренды и отдыха в Азербайджане",
};

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = TAGLINE[locale] ?? TAGLINE.az;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.92 }}>
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
