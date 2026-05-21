import { Metadata } from "next";
export const revalidate = 60;

import NewsBlogsPageClient from "./NewsBlogsPageClient";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import { getAllBlogPosts } from "@/db/queries/blog-posts";

export const metadata: Metadata = {
  title: "Haberler & Blog - Turkish Student Federation",
};

export default async function NewsBlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <NewsBlogsPageClient posts={posts} />
      </main>
      <Footer />
    </>
  );
}
