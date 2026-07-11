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
  searchParams: Promise<{ q?: string; month?: string; type?: string }>;
}

export default async function NewsBlogsPage({ searchParams }: NewsBlogsPageProps) {
  const { q = "", month = "", type = "blog" } = await searchParams;
  const allPosts = q || month ? await searchBlogPosts(q, month) : await getAllBlogPosts();
  const posts = allPosts.filter((post) =>
    type === "news"
      ? post.category?.toLocaleLowerCase("tr") === "news"
      : post.category?.toLocaleLowerCase("tr") !== "news"
  );

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <NewsBlogsPageClient posts={posts} searchQuery={q} filterMonth={month} type={type} />
      </main>
      <Footer />
    </>
  );
}
