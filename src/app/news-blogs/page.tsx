import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import { getAllBlogPosts, searchBlogPosts } from "@/db/queries/blog-posts";
import NewsBlogsPageClient from "./NewsBlogsPageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Haberler & Blog - Turkish Student Federation",
};

interface NewsBlogsPageProps {
  searchParams: Promise<{ q?: string; month?: string }>;
}

export default async function NewsBlogsPage({ searchParams }: NewsBlogsPageProps) {
  const { q = "", month = "" } = await searchParams;
  const posts = q || month ? await searchBlogPosts(q, month) : await getAllBlogPosts();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <NewsBlogsPageClient posts={posts} searchQuery={q} filterMonth={month} />
      </main>
      <Footer />
    </>
  );
}
