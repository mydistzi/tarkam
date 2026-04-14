import { useEffect, useMemo, useState } from "react";
import Api from "@/api";
import { PageShell } from "@/galactic/common";
import { ShopGridContent, mapApiProductToProductItem } from "./section";
import type { ProductItem } from "@/galactic/data";

type CatprodWidgetItem = {
  id?: number;
  title: string;
  products_count?: number;
};

const ShopGridPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CatprodWidgetItem[]>([]);
  const [recentItems, setRecentItems] = useState<ProductItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("date");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const fetchProducts = async () => {
    try {
      const params: Record<string, unknown> = {
        page,
        limit: 9,
        orderby: orderBy,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (selectedCategoryId !== undefined) {
        params.catprod_id = selectedCategoryId;
      }

      const response = await Api.get("/products", { params });
      const payload = response.data?.data as {
        data?: unknown[];
        total?: number;
        last_page?: number;
      } | undefined;
      const items = Array.isArray(payload?.data) ? payload.data.map((item) => mapApiProductToProductItem(item as any)) : [];

      setProducts(items);
      setTotalResults(Number(payload?.total ?? 0));
      setTotalPages(Number(payload?.last_page ?? 1));
      setTags(Array.from(new Set(items.flatMap((item) => item.tags))).slice(0, 12));
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Api.get("/catprods");
      const payload = response.data?.data as unknown[] | undefined;

      setCategories(
        Array.isArray(payload)
          ? payload.map((item: any) => ({
              id: item.id,
              title: item.title || item.name || "Kategori",
              products_count: Number(item.products_count ?? 0),
            }))
          : []
      );
    } catch (error) {
      console.error("Failed to load product categories", error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const response = await Api.get("/products/random-items");
      const payload = response.data?.data as unknown[] | undefined;

      setRecentItems(
        Array.isArray(payload) ? payload.map((item) => mapApiProductToProductItem(item as any)) : []
      );
    } catch (error) {
      console.error("Failed to load recent items", error);
    }
  };

  useEffect(() => {
    void fetchCategories();
    void fetchRecentItems();
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [page, orderBy, search, selectedCategoryId]);

  const resultText = useMemo(() => {
    const from = products.length ? (page - 1) * 9 + 1 : 0;
    const to = products.length ? (page - 1) * 9 + products.length : 0;
    return `Menampilkan ${from}-${to} dari ${totalResults} hasil`;
  }, [page, products.length, totalResults]);

  return (
    <PageShell title="Toko">
      <ShopGridContent
        products={products}
        recentItems={recentItems}
        categories={categories}
        tags={tags}
        resultText={resultText}
        currentPage={page}
        totalPages={totalPages}
        selectedCategoryId={selectedCategoryId}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onSort={(value) => {
          setOrderBy(value);
          setPage(1);
        }}
        onCategorySelect={(id) => {
          setSelectedCategoryId(id);
          setPage(1);
        }}
        onPageChange={(value) => {
          setPage(value);
        }}
        searchValue={search}
        orderBy={orderBy}
      />
    </PageShell>
  );
};

export default ShopGridPage;
