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
  title: "Home - Turkish Student Federation",
  description:
    "Turkish Student Federation is a fast-growing student organization in Turkey, rooted in the Ideology of Turkey and driven by a mission to connect youth with their identity and purpose.",
  openGraph: {
    title: "Turkish Student Federation",
    description:
      "Turkish Student Federation is a fast-growing student organization in Turkey, rooted in the Ideology of Turkey and driven by a mission to connect youth with their identity and purpose.",
    url: "https://tsfturkey.org",
    siteName: "Turkish Student Federation",
    locale: "en_US",
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
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${lora.variable} ${notoNastaliqUrdu.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
