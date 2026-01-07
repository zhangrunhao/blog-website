import Link from "next/link";
import { getAllCategories } from "app/blog/utils";

type BlogCategoriesProps = {
  activeSlug?: string;
};

export function BlogCategories({ activeSlug }: BlogCategoriesProps) {
  let categories = getAllCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center text-sm text-neutral-600">
      {categories.map((category, index) => {
        let isActive = activeSlug === category.slug;
        return (
          <span key={category.slug} className="flex items-center">
            <Link
              href={`/blog/category/${category.slug}`}
              className={`transition-colors ${
                isActive ? "text-neutral-900 font-medium" : "hover:text-neutral-800"
              }`}
            >
              {category.name}
            </Link>
            {index < categories.length - 1 ? (
              <span className="mx-2 text-neutral-400">/</span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
