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

export const siteIdentity = {
  name: "Pakistan Türk Öğrenci Birliği",
  shortName: "PTÖB",
  guideName: "Pakistan Türk Öğrenci Birliği",
  guideHref: "/news-blogs/?type=blog",
  joinHref: "/join-tsf/",
  description: excerpt(whoWeAre?.content, 190),
  guideDescription:
    "Pakistan'da eğitim hayatına başlamayı planlayan Türk öğrenciler için vize, resmi işlemler, üniversiteler, sağlık, konaklama ve şehir yaşamını bir araya getiren kapsamlı rehber.",
};

export const homeMessaging = {
  eyebrow: "Pakistan Türk Öğrenci Birliği",
  titleTop: "Pakistan'da",
  titleBottom: "Öğrenci Hayatı",
  summary:
    "Pakistan'da eğitim alan Türk öğrencileri bilgi, dayanışma ve kültürel bağlarla bir araya getiriyoruz.",
  primaryCta: "Blogları Keşfet",
  secondaryCta: "Bize Katıl",
  aboutIntro: excerpt(whoWeAre?.content, 520),
};
