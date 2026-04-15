/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Api from "@/api";
import { PageShell } from "@/galactic/common";
import {
  buildNewsCategoryPath,
  buildNewsDetailPath,
  buildNewsTagPath,
  galacticRoutes,
  type NewsCategoryWidgetItem,
  type NewsTagWidgetItem,
  type PostItem,
} from "@/galactic/data";
import { NewsContent } from "./section";

type ApiBlogItem = {
  id: number;
  title?: string;
  slug?: string;
  content?: string;
  image?: string;
  created_at?: string;
  user?: { id?: number; name?: string };
  category?: { title?: string; slug?: string };
  tags?: Array<{ id?: number; title?: string; name?: string }>;
};

type ApiNewsCategoryItem = {
  id?: number;
  title?: string;
  name?: string;
  slug?: string;
  blogs_count?: number | string;
  blog_count?: number | string;
};

const formatDateLabel = (value?: string) =>
  value ? new Date(value).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "";

const slugifyTag = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createNewsTagItem = (value: string): NewsTagWidgetItem => {
  const label = String(value || "").trim();
  const slug = slugifyTag(label);
  return {
    label,
    slug,
    path: buildNewsTagPath(slug),
  };
};

const stripHtml = (value?: string) =>
  (value || "").replace(/<[^>]+>/g, "");

const splitContent = (value?: string) =>
  (value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const matchesSearchTerm = (post: PostItem, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return true;
  }

  return [
    post.title,
    post.category,
    post.author,
    post.excerpt,
    ...post.content,
    ...post.tags,
  ].some((value) => value.toLowerCase().includes(normalizedKeyword));
};

const matchesCategory = (post: PostItem, categorySlug: string) =>
  !categorySlug.trim() || slugifyTag(post.category) === categorySlug.trim().toLowerCase();

const matchesTag = (post: PostItem, tagSlug: string) =>
  !tagSlug.trim() || post.tags.some((item) => slugifyTag(item) === tagSlug.trim().toLowerCase());

const mapApiBlogToNewsItem = (blog: ApiBlogItem): PostItem => {
  const category = blog.category?.title || "Berita";
  const tags = Array.isArray(blog.tags)
    ? blog.tags.map((item) => item?.title || item?.name || "").filter(Boolean)
    : [category];

  return {
    id: blog.id,
    title: blog.title || `News ${blog.id}`,
    category,
    image: blog.image || "",
    date: formatDateLabel(blog.created_at),
    author: blog.user?.name || "Tarkam",
    excerpt: `${stripHtml(blog.content).slice(0, 160)}...`,
    content: splitContent(blog.content),
    tags,
    path: buildNewsDetailPath(blog.slug || blog.id),
    categoryPath: buildNewsCategoryPath(blog.category?.slug || slugifyTag(category)),
  };
};

const NewsPage = () => {
  const navigate = useNavigate();
  const { categorySlug = "", tagSlug = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")?.trim() || "1") || 1);
  const search = searchParams.get("search") ?? "";
  const category = categorySlug.trim().toLowerCase();
  const tag = tagSlug.trim().toLowerCase();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [categories, setCategories] = useState<NewsCategoryWidgetItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [tags, setTags] = useState<NewsTagWidgetItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const updateSearchParams = (params: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    setSearchParams(nextParams);
  };

  const navigateWithSearch = (pathname: string) => {
    const nextParams = new URLSearchParams();
    const normalizedSearch = search.trim();

    if (normalizedSearch) {
      nextParams.set("search", normalizedSearch);
    }

    navigate({
      pathname,
      search: nextParams.toString() ? `?${nextParams.toString()}` : "",
    });
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await Api.get("/blogs", { params: { all: true } });
      const payload = response.data?.data as {
        data?: unknown[];
        total?: number;
        last_page?: number;
      } | unknown[] | undefined;

      const allItems = Array.isArray(payload)
        ? payload.map((item) => mapApiBlogToNewsItem(item as ApiBlogItem))
        : Array.isArray(payload?.data)
          ? payload.data.map((item) => mapApiBlogToNewsItem(item as ApiBlogItem))
        : [];

      const filteredByCategory = allItems.filter((item) =>
        matchesSearchTerm(item, search) && matchesCategory(item, category),
      );
      const filteredItems = filteredByCategory.filter((item) => matchesTag(item, tag));
      const nextTotalPages = Math.max(1, Math.ceil(filteredItems.length / 9));
      const currentPage = Math.min(page, nextTotalPages);
      const startIndex = (currentPage - 1) * 9;
      const items = filteredItems.slice(startIndex, startIndex + 9);

      setPosts(items);
      setTotalPages(nextTotalPages);
      const uniqueTags = new Map<string, NewsTagWidgetItem>();
      filteredByCategory.flatMap((item) => item.tags).forEach((tag) => {
        const tagItem = createNewsTagItem(tag);
        if (tagItem.slug && !uniqueTags.has(tagItem.slug)) {
          uniqueTags.set(tagItem.slug, tagItem);
        }
      });

      const extractedTags = Array.from(uniqueTags.values()).slice(0, 8);
      const fallbackTags = extractedTags.length
        ? extractedTags
        : Array.from(
            new Map(
              items
                .map((item) => createNewsTagItem(item.category))
                .filter((tagItem) => tagItem.slug)
                .map((tagItem) => [tagItem.slug, tagItem] as const),
            ).values(),
          ).slice(0, 8);
      setTags(fallbackTags);
    } catch (error) {
      console.error("Failed to load blog posts", error);
    }
  }, [category, page, search, tag]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await Api.get("/categories");
      const payload = response.data?.data as ApiNewsCategoryItem[] | undefined;

      setCategories(
        Array.isArray(payload)
          ? payload.map((item: ApiNewsCategoryItem) => ({
              id: item.id,
              title: item.title || item.name || "Kategori",
              slug: item.slug || slugifyTag(item.title || item.name || "Kategori"),
              count: Number(item.blogs_count ?? item.blog_count ?? 0),
              path: buildNewsCategoryPath(item.slug || slugifyTag(item.title || item.name || "Kategori")),
            }))
          : []
      );
    } catch (error) {
      console.error("Failed to load blog categories", error);
    }
  }, []);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const response = await Api.get("/blogs/random-items");
      const payload = response.data?.data as unknown[] | undefined;

      setRecentPosts(
        Array.isArray(payload)
          ? payload.map((item) => mapApiBlogToNewsItem(item as ApiBlogItem))
          : []
      );
    } catch (error) {
      console.error("Failed to load recent posts", error);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
    void fetchRecentPosts();
  }, [fetchCategories, fetchRecentPosts]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  return (
    <PageShell title="News">
      <NewsContent
        posts={posts}
        categories={categories}
        recentPosts={recentPosts}
        tags={tags}
        currentPage={Math.min(page, totalPages)}
        totalPages={totalPages}
        selectedCategory={category || undefined}
        selectedTag={tag || undefined}
        searchValue={search}
        onSearch={(value) => {
          updateSearchParams({ search: value.trim() || undefined, page: "1" });
        }}
        onCategorySelect={(value) => {
          navigateWithSearch(value?.trim() ? buildNewsCategoryPath(value.trim()) : galacticRoutes.news);
        }}
        onTagSelect={(value) => {
          navigateWithSearch(value?.trim() ? buildNewsTagPath(value.trim()) : galacticRoutes.news);
        }}
        onPageChange={(value) => {
          updateSearchParams({ page: String(value) });
        }}
      />
    </PageShell>
  );
};

export default NewsPage;
