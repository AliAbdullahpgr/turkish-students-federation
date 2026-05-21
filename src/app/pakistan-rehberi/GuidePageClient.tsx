"use client";

import { MapPin, BookOpen, GraduationCap, Heart, Landmark, Phone } from "lucide-react";
import type { GuideSectionTree } from "@/db/queries/guide-sections";


function SectionIcon({ title }: { title: string }) {
  const lower = title.toLowerCase();
  if (lower.includes("vize") || lower.includes("pasaport") || lower.includes("işlem") || lower.includes("ehliyet") || lower.includes("konaklama")) return <BookOpen className="w-5 h-5 text-turkish-red" />;
  if (lower.includes("üniversite") || lower.includes("eğitim") || lower.includes("kurs")) return <GraduationCap className="w-5 h-5 text-turkish-red" />;
  if (lower.includes("sağlık") || lower.includes("hastane")) return <Heart className="w-5 h-5 text-turkish-red" />;
  if (lower.includes("turistik") || lower.includes("mekân") || lower.includes("cami") || lower.includes("kale") || lower.includes("türbe") || lower.includes("museum") || lower.includes("park") || lower.includes("garden") || lower.includes("beach") || lower.includes("pazar") || lower.includes("meydan")) return <Landmark className="w-5 h-5 text-turkish-red" />;
  if (lower.includes("iletişim") || lower.includes("numara") || lower.includes("ulaşım") || lower.includes("döviz")) return <Phone className="w-5 h-5 text-turkish-red" />;
  return <MapPin className="w-5 h-5 text-turkish-red" />;
}

function GuideSectionComponent({ section, depth = 0 }: { section: GuideSectionTree; depth?: number }) {
  const hasContent = section.content && section.content.trim().length > 0;
  const hasChildren = section.children && section.children.length > 0;

  if (!hasContent && !hasChildren) return null;

  const headingClasses: Record<number, string> = {
    1: "text-3xl font-bold text-text-primary mt-12 mb-6",
    2: "text-2xl font-bold text-text-primary mt-10 mb-4",
    3: "text-xl font-bold text-text-primary mt-8 mb-3",
    4: "text-lg font-bold text-text-primary mt-6 mb-2",
  };

  return (
    <div id={section.id} className="scroll-mt-28">
      <h3 className={headingClasses[section.level] || headingClasses[4]}>
        {section.level <= 2 && (
          <span className="inline-flex items-center gap-2">
            <SectionIcon title={section.title} />
            {section.title}
          </span>
        )}
        {section.level > 2 && section.title}
      </h3>

      {hasContent && (
        <div className="text-body text-text-secondary leading-relaxed whitespace-pre-line mb-6">
          {section.content}
        </div>
      )}

      {hasChildren && (
        <div>
          {section.children!.map((child) => (
            <GuideSectionComponent key={child.id} section={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function TableOfContents({ sections }: { sections: GuideSectionTree[] }) {
  function renderTocItems(items: GuideSectionTree[], depth = 0) {
    return items.map((item) => (
      <div key={item.id} className={depth > 0 ? "ml-4" : ""}>
        <a
          href={`#${item.id}`}
          className="block py-1 text-sm text-text-secondary hover:text-accent transition-colors"
        >
          {item.title}
        </a>
        {item.children && renderTocItems(item.children, depth + 1)}
      </div>
    ));
  }

  return (
    <div className="bg-surface rounded-[16px] p-6 sticky top-32">
      <h3 className="text-lg font-bold text-text-primary mb-4">İçindekiler</h3>
      <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
        {renderTocItems(sections)}
      </nav>
    </div>
  );
}

interface GuidePageClientProps {
  guideTree: GuideSectionTree[];
  guideDescription: string;
}

export default function GuidePageClient({ guideTree, guideDescription }: GuidePageClientProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[16px]">
              <div className="mb-8 pb-8 border-b border-gray-100">
                <span className="inline-block px-3 py-1 bg-turkish-red/10 text-turkish-red text-xs font-bold uppercase rounded-full mb-4">
                  Rehber
                </span>
                <h1 className="text-[clamp(28px,4vw,42px)] font-bold text-text-primary leading-tight">
                  Pakistan <span className="text-turkish-red">Öğrenci Rehberi</span>
                </h1>
                <p className="text-body text-text-secondary mt-4 max-w-[700px]">
                  {guideDescription}
                </p>
              </div>

              <div className="mb-10 p-6 bg-surface rounded-[12px]">
                <h2 className="text-lg font-bold text-text-primary mb-4">Proje Ekibi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text-secondary">
                  <div>
                    <span className="font-semibold text-text-primary">Ekip:</span> Halid Kaya, Muhammet Akpunar, Nurullah Bakırhan, Mürsel Salih Kör
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Editör:</span> Muhammet Akpunar
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Tasarım:</span> Mürsel Salih Kör
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Yayın Yeri:</span> İslamabad, 2026
                  </div>
                </div>
              </div>

              {guideTree.map((section) => (
                <GuideSectionComponent key={section.id} section={section} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents sections={guideTree} />
          </div>
        </div>
      </div>
    </section>
  );
}
