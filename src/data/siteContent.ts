import { pakistanGuideData } from "@/data/pakistanGuide";

const findGuideSection = (id: string) =>
  pakistanGuideData.find((section) => section.id === id);

const stripWhitespace = (content = "") => content.replace(/\s+/g, " ").trim();

const excerpt = (content: string | undefined, maxLength: number) => {
  const normalized = stripWhitespace(content);
  if (normalized.length <= maxLength) return normalized;

  const trimmed = normalized.slice(0, maxLength);
  const lastSentence = Math.max(
    trimmed.lastIndexOf("."),
    trimmed.lastIndexOf("!"),
    trimmed.lastIndexOf("?")
  );

  return `${trimmed.slice(0, lastSentence > 120 ? lastSentence + 1 : maxLength).trim()}...`;
};

const whoWeAre = findGuideSection("biz-kimiz");
const visa = findGuideSection("vize-ve-pasaport");
const universities = findGuideSection("universiteler");
const health = findGuideSection("saglik");
const places = findGuideSection("turistik-ve-tarihi-mekanlar");

export const siteIdentity = {
  name: "Pakistan Türk Öğrenci Birliği",
  shortName: "PTÖB",
  guideName: "Pakistan Öğrenci Rehberi",
  guideHref: "/pakistan-rehberi/",
  joinHref: "/join-tsf/",
  description: excerpt(whoWeAre?.content, 190),
  guideDescription:
    "Pakistan'da eğitim hayatına başlamayı planlayan Türk öğrenciler için vize, resmi işlemler, üniversiteler, sağlık, konaklama ve şehir yaşamını bir araya getiren kapsamlı rehber.",
};

export const guideSourceSections = [
  {
    title: "Kimlik ve Topluluk",
    href: "/pakistan-rehberi/#biz-kimiz",
    summary: excerpt(whoWeAre?.content, 170),
  },
  {
    title: "Vize ve Pasaport",
    href: "/pakistan-rehberi/#vize-ve-pasaport",
    summary: excerpt(visa?.content, 150),
  },
  {
    title: "Resmi İşlemler",
    href: "/pakistan-rehberi/#ogrenci-resmi-islemleri",
    summary: "Elçilik adres beyanı, denklik, üniversite kayıt süreçleri ve öğrencilerin Pakistan'a geldikten sonra tamamlaması gereken resmi adımlar.",
  },
  {
    title: "Üniversiteler ve Eğitim",
    href: "/pakistan-rehberi/#universiteler",
    summary: universities
      ? "Pakistan'daki üniversite seçenekleri, kayıt hazırlığı ve yükseköğretim hayatına dair rehber başlıkları."
      : "Pakistan'daki eğitim hayatına hazırlık, kurumlar, başvuru süreçleri ve öğrenci deneyimi için rehber başlıkları.",
  },
  {
    title: "Sağlık ve Günlük Hayat",
    href: "/pakistan-rehberi/#saglik",
    summary: health
      ? excerpt(health.content, 150)
      : "Sağlık hizmetleri, güvenli başlangıç ve öğrencilerin günlük hayatını kolaylaştıran pratik bilgiler.",
  },
  {
    title: "Şehirler ve Kültür",
    href: "/pakistan-rehberi/#turistik-ve-tarihi-mekanlar",
    summary: places
      ? "İslamabad, Lahor, Karaçi, Peşaver ve diğer şehirlerdeki tarihi, kültürel ve sosyal yaşam noktaları."
      : "Pakistan'ı tanımaya yardımcı olan tarih, kültür, şehirler ve sosyal hayat başlıkları.",
  },
];

export const homeMessaging = {
  eyebrow: "Pakistan Öğrenci Rehberi",
  titleTop: "Pakistan'da",
  titleBottom: "Öğrenci Hayatı",
  summary:
    "Bu site, Pakistan Öğrenci Rehberi'nin dijital yüzüdür: Türk öğrencilerin güvenli, bilinçli ve huzurlu bir başlangıç yapması için gerekli bilgileri tek yerde toplar.",
  primaryCta: "Rehberi Aç",
  secondaryCta: "Bize Katıl",
  aboutIntro: excerpt(whoWeAre?.content, 520),
};
