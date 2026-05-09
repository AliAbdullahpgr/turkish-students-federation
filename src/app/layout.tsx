import type { Metadata } from "next";
import { Poppins, Inter, Lora, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-turkish",
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nastaliq",
});

export const metadata: Metadata = {
  title: "Ana Sayfa - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği, Pakistan'da eğitim gören Türk öğrencilere destek olan bir kardeşlik ve rehberlik topluluğudur.",
  openGraph: {
    title: "Pakistan Türk Öğrenci Birliği",
    description:
      "Pakistan Türk Öğrenci Birliği, Pakistan'da eğitim gören Türk öğrencilere destek olan bir kardeşlik ve rehberlik topluluğudur.",
    url: "https://tsfturkey.org",
    siteName: "Pakistan Türk Öğrenci Birliği",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${poppins.variable} ${inter.variable} ${lora.variable} ${notoNastaliqUrdu.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
