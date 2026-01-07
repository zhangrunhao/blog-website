import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

type BlogPostsProps = {
  categorySlug?: string;
};

export function BlogPosts({ categorySlug }: BlogPostsProps) {
  let allBlogs = getBlogPosts();
  let visibleBlogs = categorySlug
    ? allBlogs.filter((post) => post.metadata.categories.includes(categorySlug))
    : allBlogs;

  return (
    <div>
      {visibleBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.createdAt) > new Date(b.metadata.createdAt)) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 w-[100px] tabular-nums">
                {formatDate(post.metadata.createdAt)}
              </p>
              <p className="text-neutral-900 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
