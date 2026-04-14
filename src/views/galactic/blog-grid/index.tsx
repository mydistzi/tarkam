import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Api from "@/api";
import { PageShell } from "@/galactic/common";
import { BlogGridContent } from "./section";
import type { PostItem } from "@/galactic/data";

type CategoryWidgetItem = {
  id?: number;
  title: string;
  slug?: string;
  count?: number;
  path?: string;
};

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

const formatDateLabel = (value?: string) =>
  value ? new Date(value).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "";

const stripHtml = (value?: string) =>
  (value || "").replace(/<[^>]+>/g, "");

const splitContent = (value?: string) =>
  (value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const mapApiBlogToPostItem = (blog: ApiBlogItem): PostItem => {
  const category = blog.category?.title || "Berita";
  const tags = Array.isArray(blog.tags)
    ? blog.tags.map((item) => item?.title || item?.name || "").filter(Boolean)
    : [category];

  return {
    id: blog.id,
    title: blog.title || `Blog ${blog.id}`,
    category,
    image: blog.image || "",
    date: formatDateLabel(blog.created_at),
    author: blog.user?.name || "Tarkam",
    excerpt: `${stripHtml(blog.content).slice(0, 160)}...`,
    content: splitContent(blog.content),
    tags,
    path: blog.slug ? `/blog-details/${blog.slug}` : `/blog-details/${blog.id}`,
    categoryPath: blog.category?.slug
      ? `/blog-grid?category=${encodeURIComponent(blog.category.slug)}`
      : `/blog-grid?category=${encodeURIComponent(category)}`,
  };
};

const BlogGridPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const search = searchParams.get("search") ?? "";

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [categories, setCategories] = useState<CategoryWidgetItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
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

  const fetchPosts = async () => {
    try {
      const params: Record<string, unknown> = {
        page,
        limit: 9,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category.trim()) {
        params.category = category.trim();
      }

      if (tag.trim()) {
        params.tag = tag.trim();
      }

      const response = await Api.get("/blogs", { params });
      const payload = response.data?.data as {
        data?: unknown[];
        total?: number;
        last_page?: number;
      } | undefined;

      const items = Array.isArray(payload?.data)
        ? payload.data.map((item) => mapApiBlogToPostItem(item as ApiBlogItem))
        : [];

      setPosts(items);
      setTotalPages(Number(payload?.last_page ?? 1));
      const extractedTags = Array.from(new Set(items.flatMap((item) => item.tags))).slice(0, 8);
      const fallbackTags = extractedTags.length
        ? extractedTags
        : Array.from(new Set(items.map((item) => item.category))).slice(0, 8);
      setTags(fallbackTags);
    } catch (error) {
      console.error("Failed to load blog posts", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Api.get("/categories");
      const payload = response.data?.data as unknown[] | undefined;

      setCategories(
        Array.isArray(payload)
          ? payload.map((item: any) => ({
              id: item.id,
              title: item.title || item.name || "Kategori",
              slug: item.slug,
              count: Number(item.blogs_count ?? item.blog_count ?? 0),
              path: item.slug ? `/blog-grid?category=${encodeURIComponent(item.slug)}` : undefined,
            }))
          : []
      );
    } catch (error) {
      console.error("Failed to load blog categories", error);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await Api.get("/blogs/random-items");
      const payload = response.data?.data as unknown[] | undefined;

      setRecentPosts(
        Array.isArray(payload)
          ? payload.map((item) => mapApiBlogToPostItem(item as ApiBlogItem))
          : []
      );
    } catch (error) {
      console.error("Failed to load recent posts", error);
    }
  };

  useEffect(() => {
    void fetchCategories();
    void fetchRecentPosts();
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [page, category, tag, search]);

  return (
    <PageShell title="Grid Berita">
      <BlogGridContent
        posts={posts}
        categories={categories}
        recentPosts={recentPosts}
        tags={tags}
        currentPage={page}
        totalPages={totalPages}
        searchValue={search}
        onSearch={(value) => {
          updateSearchParams({ search: value.trim() || undefined, page: "1" });
        }}
        onPageChange={(value) => {
          updateSearchParams({ page: String(value) });
        }}
      />
    </PageShell>
  );
};

export default BlogGridPage;
