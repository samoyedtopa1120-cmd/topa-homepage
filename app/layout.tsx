import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Topa Ch. 多帕｜薩摩耶 VTuber",
  description: "從雪國來的薩摩耶 VTuber 多帕。唱歌、遊戲，以及養一隻快樂的多帕。",
  openGraph: {
    title: "Topa Ch. 多帕｜薩摩耶 VTuber",
    description: "從雪國來的薩摩耶。狗即狗，不是貓。",
    type: "website",
    locale: "zh_TW",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "多帕 TOPA — Samoyed VTuber" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
