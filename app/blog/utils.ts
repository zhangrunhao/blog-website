import fs from "fs";
import path from "path";

const UNCATEGORIZED_SLUG = "uncategorized";
const NO_DATE_SLUG = "no-date";

type Metadata = {
  title: string;
  createdAt?: string;
  summary: string;
  image?: string;
  categories?: string[];
};

type NormalizedMetadata = {
  title: string;
  createdAt: string;
  summary: string;
  image?: string;
  categories: string[];
};

export type BlogPost = {
  metadata: NormalizedMetadata;
  slug: string;
  content: string;
};

export type CategoryItem = {
  slug: string;
  name: string;
  count: number;
};

function stripQuotes(value: string) {
  return value.replace(/^['"](.*)['"]$/, "$1");
}

function parseStringArray(value: string) {
  let trimmed = value.trim();
  if (!trimmed) {
    return [];
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    let inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return inner
      .split(",")
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }
  return [stripQuotes(trimmed)];
}

function parseFrontmatterValue(key: string, value: string) {
  if (key === "categories") {
    return parseStringArray(value);
  }
  return stripQuotes(value);
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match ? match[1] : "";
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    if (!line.trim()) {
      return;
    }
    let [key, ...valueArr] = line.split(": ");
    if (!key || valueArr.length === 0) {
      return;
    }
    let value = valueArr.join(": ").trim();
    metadata[key.trim() as keyof Metadata] = parseFrontmatterValue(
      key.trim(),
      value
    ) as never;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

function isEnglishSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function uniq(values: string[]) {
  return Array.from(new Set(values));
}

function normalizeCategories(rawCategories?: string[]) {
  let list = Array.isArray(rawCategories) ? rawCategories : [];
  let normalized = list
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  let valid: string[] = [];
  let hasInvalid = false;

  normalized.forEach((value) => {
    if (isEnglishSlug(value)) {
      valid.push(value);
    } else {
      hasInvalid = true;
    }
  });

  return {
    categories: uniq(valid),
    hasInvalid,
  };
}

function addCategory(categories: string[], slug: string) {
  if (!categories.includes(slug)) {
    categories.push(slug);
  }
  return categories;
}

function getLatestDateString() {
  return new Date().toISOString().split("T")[0];
}

function normalizeMetadata(metadata: Metadata): NormalizedMetadata {
  let { categories, hasInvalid } = normalizeCategories(metadata.categories);

  if (categories.length === 0 || hasInvalid) {
    addCategory(categories, UNCATEGORIZED_SLUG);
  }

  let createdAt = metadata.createdAt?.trim();
  let hasMissingDate = !createdAt;

  if (createdAt && Number.isNaN(Date.parse(createdAt))) {
    createdAt = undefined;
    hasMissingDate = true;
  }

  if (!createdAt) {
    createdAt = getLatestDateString();
  }

  if (hasMissingDate) {
    addCategory(categories, NO_DATE_SLUG);
  }

  return {
    title: metadata.title,
    createdAt,
    summary: metadata.summary,
    image: metadata.image,
    categories,
  };
}

export function getCategoryDisplayName(slug: string) {
  if (slug === UNCATEGORIZED_SLUG) {
    return "未分类";
  }
  if (slug === NO_DATE_SLUG) {
    return "没有日期";
  }
  return slug;
}

export function getBlogPosts(): BlogPost[] {
  return getMDXData(path.join(process.cwd(), "app", "blog", "posts")).map(
    (post) => ({
      ...post,
      metadata: normalizeMetadata(post.metadata),
    })
  );
}

export function getAllCategories(posts: BlogPost[] = getBlogPosts()) {
  let counts = new Map<string, number>();

  posts.forEach((post) => {
    post.metadata.categories.forEach((slug) => {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([slug, count]) => ({
      slug,
      name: getCategoryDisplayName(slug),
      count,
    }))
    .sort((a, b) => {
      let priority = (slug: string) => {
        if (slug === UNCATEGORIZED_SLUG) {
          return 2;
        }
        if (slug === NO_DATE_SLUG) {
          return 3;
        }
        return 1;
      };
      let aPriority = priority(a.slug);
      let bPriority = priority(b.slug);
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return a.slug.localeCompare(b.slug);
    });
}

export function getPostsByCategory(slug: string) {
  return getBlogPosts().filter((post) =>
    post.metadata.categories.includes(slug)
  );
}

export function formatDate(date: string) {
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
