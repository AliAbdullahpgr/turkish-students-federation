import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import { getDepartmentBySlug } from "@/db/queries/departments";

export const revalidate = 60;

interface DepartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);

  if (!department) return { title: "Not Found - Pakistan Türk Öğrenci Birliği" };

  return {
    title: `${department.name} - Pakistan Türk Öğrenci Birliği`,
    description: department.summary,
  };
}

export default async function DepartmentDetailPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);

  if (!department) notFound();

  const gallery = department.gallery.filter((item) => item.url);

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow bg-white">
        <article className="pb-24 pt-12 lg:pt-16">
          <header className="mx-auto max-w-[680px] px-6">
            <Link href="/departments/" className="text-[13px] font-semibold text-accent no-underline hover:text-primary">
              Birimlerimiz
            </Link>
            <h1 className="mt-3 text-[clamp(32px,5vw,46px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-text-primary">
              {department.name}
            </h1>
            {department.summary && (
              <p className="mt-4 text-[clamp(18px,2.2vw,21px)] leading-[1.5] text-text-secondary">
                {department.summary}
              </p>
            )}
          </header>

          {department.hero && (
            <figure className="mx-auto mt-10 max-w-[1000px] px-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] bg-primary/5">
                <Image
                  src={department.hero}
                  alt={department.name}
                  fill
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          {department.body && (
            <div className="mx-auto mt-10 max-w-[680px] px-6">
              <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-[19px] prose-p:leading-[1.75] prose-p:text-[#242424] prose-a:text-accent prose-li:text-[19px] prose-li:text-[#242424] prose-img:rounded-[16px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{department.body}</ReactMarkdown>
              </div>
            </div>
          )}

          {department.members.length > 0 && (
            <section className="mx-auto mt-16 max-w-[1000px] px-6" aria-labelledby="department-team">
              <h2 id="department-team" className="text-[28px] font-bold text-text-primary">
                Birim ekibi
              </h2>
              <ul className="mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {department.members.map((member, index) => (
                  <li key={`${member.name}-${index}`} className="flex items-center gap-4 border border-border-custom rounded-[16px] p-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-primary/5">
                      {member.photo && (
                        <Image src={member.photo} alt={member.name} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{member.name}</p>
                      {member.role && <p className="text-sm text-text-secondary">{member.role}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="mx-auto mt-16 max-w-[1000px] px-6" aria-labelledby="department-gallery">
              <h2 id="department-gallery" className="text-[28px] font-bold text-text-primary">
                Galeri
              </h2>
              <ul className="mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item, index) => (
                  <li key={`${item.mediaId}-${index}`}>
                    <figure className="m-0">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-primary/5">
                        <Image
                          src={item.url as string}
                          alt={item.caption || department.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 320px"
                          className="object-cover"
                        />
                      </div>
                      {item.caption && (
                        <figcaption className="mt-2 text-sm text-text-secondary">{item.caption}</figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mx-auto mt-14 max-w-[680px] px-6">
            <Link href="/departments/" className="text-sm font-bold text-accent no-underline hover:text-primary">
              ← Tüm birimler
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
