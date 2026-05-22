import { BookOpen, GraduationCap, Heart, Landmark, MapPin, Phone } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { GuideSectionTree } from "@/db/queries/guide-sections";

function SectionIcon({ title }: { title: string }) {
  const lower = title.toLowerCase();
  if (
    lower.includes("vize") ||
    lower.includes("pasaport") ||
    lower.includes("islem") ||
    lower.includes("ehliyet") ||
    lower.includes("konaklama")
  ) {
    return <BookOpen className="h-5 w-5 text-turkish-red" />;
  }
  if (lower.includes("universite") || lower.includes("egitim") || lower.includes("kurs")) {
    return <GraduationCap className="h-5 w-5 text-turkish-red" />;
  }
  if (lower.includes("saglik") || lower.includes("hastane")) {
    return <Heart className="h-5 w-5 text-turkish-red" />;
  }
  if (
    lower.includes("turistik") ||
    lower.includes("mekan") ||
    lower.includes("cami") ||
    lower.includes("kale") ||
    lower.includes("turbe") ||
    lower.includes("museum") ||
    lower.includes("park") ||
    lower.includes("garden") ||
    lower.includes("beach") ||
    lower.includes("pazar") ||
    lower.includes("meydan")
  ) {
    return <Landmark className="h-5 w-5 text-turkish-red" />;
  }
  if (lower.includes("iletisim") || lower.includes("numara") || lower.includes("ulasim") || lower.includes("doviz")) {
    return <Phone className="h-5 w-5 text-turkish-red" />;
  }
  return <MapPin className="h-5 w-5 text-turkish-red" />;
}

function GuideSectionComponent({ section }: { section: GuideSectionTree }) {
  const hasContent = Boolean(section.content?.trim());
  const hasChildren = Boolean(section.children?.length);

  if (!hasContent && !hasChildren) return null;

  const headingClasses: Record<number, string> = {
    1: "mt-12 mb-6 text-3xl font-bold text-text-primary",
    2: "mt-10 mb-4 text-2xl font-bold text-text-primary",
    3: "mt-8 mb-3 text-xl font-bold text-text-primary",
    4: "mt-6 mb-2 text-lg font-bold text-text-primary",
  };

  return (
    <div id={section.id} className="scroll-mt-28">
      <h3 className={headingClasses[section.level] || headingClasses[4]}>
        {section.level <= 2 ? (
          <span className="inline-flex items-center gap-2">
            <SectionIcon title={section.title} />
            {section.title}
          </span>
        ) : (
          section.title
        )}
      </h3>

      {hasContent ? (
        <div className="prose prose-slate mb-6 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
        </div>
      ) : null}

      {hasChildren ? (
        <div>
          {section.children!.map((child) => (
            <GuideSectionComponent key={child.id} section={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TableOfContents({ sections }: { sections: GuideSectionTree[] }) {
  function renderTocItems(items: GuideSectionTree[], depth = 0) {
    return items.map((item) => (
      <div key={item.id} className={depth > 0 ? "ml-4" : ""}>
        <a
          href={`#${item.id}`}
          className="block py-1 text-sm text-text-secondary transition-colors hover:text-accent"
        >
          {item.title}
        </a>
        {item.children ? renderTocItems(item.children, depth + 1) : null}
      </div>
    ));
  }

  return (
    <div className="sticky top-32 rounded-[16px] bg-surface p-6">
      <h3 className="mb-4 text-lg font-bold text-text-primary">Icindekiler</h3>
      <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-2">{renderTocItems(sections)}</nav>
    </div>
  );
}

interface GuidePageClientProps {
  guideTree: GuideSectionTree[];
  guideDescription: string;
}

export default function GuidePageClient({ guideTree, guideDescription }: GuidePageClientProps) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="rounded-[16px] bg-white">
              <div className="mb-8 border-b border-gray-100 pb-8">
                <span className="mb-4 inline-block rounded-full bg-turkish-red/10 px-3 py-1 text-xs font-bold uppercase text-turkish-red">
                  Rehber
                </span>
                <h1 className="text-[clamp(28px,4vw,42px)] font-bold leading-tight text-text-primary">
                  Pakistan <span className="text-turkish-red">Ogrenci Rehberi</span>
                </h1>
                <div className="prose prose-slate mt-4 max-w-[700px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideDescription}</ReactMarkdown>
                </div>
              </div>

              <div className="mb-10 rounded-[12px] bg-surface p-6">
                <h2 className="mb-4 text-lg font-bold text-text-primary">Proje Ekibi</h2>
                <div className="grid grid-cols-1 gap-4 text-sm text-text-secondary sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-text-primary">Ekip:</span> Halid Kaya, Muhammet Akpunar,
                    Nurullah Bakirhan, Mursel Salih Kor
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Editor:</span> Muhammet Akpunar
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Tasarim:</span> Mursel Salih Kor
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Yayin Yeri:</span> Islamabad, 2026
                  </div>
                </div>
              </div>

              {guideTree.map((section) => (
                <GuideSectionComponent key={section.id} section={section} />
              ))}
            </div>
          </div>

          <div className="hidden lg:col-span-1 lg:block">
            <TableOfContents sections={guideTree} />
          </div>
        </div>
      </div>
    </section>
  );
}
