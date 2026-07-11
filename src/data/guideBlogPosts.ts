import { pakistanGuideData, type GuideSection } from "@/data/pakistanGuide";

const plainText = (value: string) => value.replace(/[#*_>`-]/g, " ").replace(/\s+/g, " ").trim();
const makeExcerpt = (value: string) => {
  const text = plainText(value);
  return text.length > 180 ? `${text.slice(0, 177).trim()}...` : text;
};

export interface GuideBlogPost {
  id: string; title: string; excerpt: string; body: string; slug: string;
  thumbnailMediaId: null; thumbnail: null; category: string; author: string;
  publishedAt: string; isFeatured: boolean; createdAt: string; updatedAt: null;
}

function flattenGuideTopics(sections: GuideSection[]): GuideBlogPost[] {
  return sections.flatMap((section) => {
    const content = section.content?.trim();
    const current = content ? [{
      id: `guide-${section.id}`,
      title: section.title,
      excerpt: makeExcerpt(content),
      body: content,
      slug: `pakistanda-yasam-${section.id}`,
      thumbnailMediaId: null,
      thumbnail: null,
      category: "Öğrenci Yaşamı",
      author: "Pakistan Türk Öğrenci Birliği",
      publishedAt: "2026-01-01",
      isFeatured: false,
      createdAt: "2026-01-01",
      updatedAt: null,
    } satisfies GuideBlogPost] : [];
    return [...current, ...flattenGuideTopics(section.children ?? [])];
  });
}

export const guideBlogPosts = flattenGuideTopics(pakistanGuideData);
