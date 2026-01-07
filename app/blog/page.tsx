import { BlogCategories } from "app/components/categories";
import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">博客</h1>
      <div className="mb-6">
        <BlogCategories />
      </div>
      <BlogPosts />
    </section>
  );
}
