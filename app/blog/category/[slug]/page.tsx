import { notFound } from "next/navigation";
import { BlogCategories } from "app/components/categories";
import { BlogPosts } from "app/components/posts";
import {
  getAllCategories,
  getCategoryDisplayName,
  getPostsByCategory,
} from "app/blog/utils";

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  let { slug } = await params;
  let categories = getAllCategories();
  let category = categories.find((item) => item.slug === slug);

  if (!category) {
    return;
  }

  let name = getCategoryDisplayName(slug);
  return {
    title: `${name} | Blog`,
    description: `查看 ${name} 分类的文章`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  let { slug } = await params;
  let categories = getAllCategories();
  let category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  let posts = getPostsByCategory(slug);

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-6 tracking-tighter">
        {category.name}
      </h1>
      <div className="mb-6">
        <BlogCategories activeSlug={slug} />
      </div>
      {posts.length > 0 ? (
        <BlogPosts categorySlug={slug} />
      ) : (
        <p className="text-sm text-neutral-600">暂无文章。</p>
      )}
    </section>
  );
}
