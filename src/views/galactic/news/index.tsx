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
      const params: Record<string, unknown> = {
        page,
        limit: 9,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (!tag && category) {
        params.category = category;
      }

      const response = await Api.get(
        tag ? `/blogs/tag/${encodeURIComponent(tag)}` : "/blogs",
        { params }
      );

      const payload = response.data?.data as {
        data?: unknown[];
        total?: number;
        last_page?: number;
      } | unknown[] | undefined;

      const posts = Array.isArray(payload)
        ? payload.map((item) => mapApiBlogToNewsItem(item as ApiBlogItem))
        : Array.isArray(payload?.data)
          ? payload.data.map((item) => mapApiBlogToNewsItem(item as ApiBlogItem))
          : [];

      setPosts(posts);
      setTotalPages(
        Array.isArray(payload)
          ? 1
          : Number(payload?.last_page ?? 1),
      );

      const uniqueTags = new Map<string, NewsTagWidgetItem>();
      posts.flatMap((item) => item.tags).forEach((tagValue) => {
        const tagItem = createNewsTagItem(tagValue);
        if (tagItem.slug && !uniqueTags.has(tagItem.slug)) {
          uniqueTags.set(tagItem.slug, tagItem);
        }
      });

      setTags(Array.from(uniqueTags.values()).slice(0, 8));
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
