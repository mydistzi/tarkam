import { useEffect, useState } from "react";
import Api from "@/api";
import {
  Header,
  About,
  Platform,
  Leaderboards,
  Blogs,
  Sponsor,
  Galleries,
  Contact
} from "@/views/home";
import { Navbar } from "@/views/component";
import SEO from "@/components/SEO";

interface MenuItem {
  id: number;
  name: string;
  title: string;
  url: string;
}

interface MetaData {
  site_name?: string;
  site_url?: string;
  tagline?: string;
  author_name?: string;
  author_url?: string;
  full_name?: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  whatsapp_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  discord_url?: string;
  about_description?: string;
  about_image?: string;
  about_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  logo_path?: string;
}

interface Slide {
  title?: string;
  subtitle?: string;
  image?: string;
  imgAlt?: string;
}

interface SponsorData {
  image?: string;
  logo?: string;
  image_url?: string;
  imageUrl?: string;
  alt?: string;
  alt_text?: string;
  altText?: string;
  name?: string;
  title?: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  image?: string;
  image_alt?: string;
}

interface PlatformData {
  id?: number;
  name: string;
  image: string;
  icon: string;
}

interface Category {
    id: number;
    name: string;
}

interface LeaderboardItem {
    id: number;
    category_id: number;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    image_alt?: string;
    url?: string;
}

interface BlogData {
  id?: number;
  title: string;
  content: string;
  image: string;
  image_alt?: string;
  category_id?: number;
  user_id?: number;
  category_name?: string;
  categories?: { name?: string };
  "categories->name"?: string;
  users?: { name?: string };
  created_at: string;
  author?: string;
  "users->name"?: string;
  category?: { id: number; name: string }; // Expanded relationship
}

interface MappedBlogData {
  id?: number;
  slug?: string;
  title: string;
  content: string;
  image: string;
  image_alt?: string;
  imageAlt?: string;
  category?: { name?: string };
  created_at: string;
  createdAt?: string;
  author: string;
}

interface ApiEnvelope<T> {
  data?: T;
}

interface ApiResponse<T> {
  data?: ApiEnvelope<T>;
}

const slugify = (value: string) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');


function App() {

  const [meta, setMeta] = useState<MetaData | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [galleries, setGalleries] = useState<GalleryImage[]>([]);
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [blogs, setBlogs] = useState<MappedBlogData[]>([]);
  const [leaderboardCategories, setLeaderboardCategories] = useState<Category[]>([]);
  const [leaderboards, setLeaderboards] = useState<LeaderboardItem[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menusRes, metaRes, headersRes, platformsRes, categoriesRes, blogsRes, galleriesRes, sponsorsRes, leaderboardsRes] = await Promise.all([
          Api.get("/menus"),
          Api.get("/web-setting"),
          Api.get("/headers"),
          Api.get("/platforms"),
          Api.get("/categories"),
          Api.get("/blogs?_expand=category"),
          Api.get("/galleries"),
          Api.get("/sponsors"),
          Api.get("/leaderboards")
        ]);
        
        if (menusRes?.data?.data) setMenus(menusRes.data.data);
        if (metaRes.data?.data) setMeta(metaRes.data.data);
        if (headersRes?.data?.data) setSlides(headersRes.data.data);
        if (platformsRes?.data?.data) {
          setPlatforms(platformsRes.data.data);
        }
        if (categoriesRes?.data?.data) {
          const allCategories = categoriesRes.data.data as Category[];
          // The leaderboard section should show categories that are meant for leaderboards.
          // Some deployments might use different category IDs, so we match by name instead.
          const leaderboardCats = allCategories.filter((category) =>
            typeof category.name === "string" && category.name.toLowerCase().includes("leaderboard")
          );
          setLeaderboardCategories(leaderboardCats);
        }
        if (sponsorsRes?.data?.data) {
          // Map sponsor data and normalize field names
          const normalizedSponsors = sponsorsRes.data.data.map((sponsor: SponsorData) => ({
            image: sponsor.image || sponsor.logo || sponsor.image_url || sponsor.imageUrl || "",
            alt: sponsor.alt || sponsor.alt_text || sponsor.altText || sponsor.name || sponsor.title || "Sponsor"
          }));
          setSponsors(normalizedSponsors);
        }
        if (blogsRes?.data?.data) {
          // Build a category lookup map using all categories
          const categories = (categoriesRes as ApiResponse<Category[]>)?.data?.data ?? [];
          const categoryMap = categories.reduce((map: Record<string | number, string>, category) => {
            if (category?.id != null) {
              map[category.id] = category.name;
            }
            return map;
          }, {});

          const defaultAuthorName = metaRes?.data?.data?.author_name || "Unknown Author";

          // Map blog data and normalize field names
          const normalizedBlogs = (blogsRes.data.data as BlogData[]).map((blog) => {
            // Get category name from expanded relationship or fallback to mapping
            const categoryName = blog.category?.name || 
              blog.category_name || 
              blog["categories->name"] ||
              (blog.categories && blog.categories.name) ||
              (blog.category_id != null ? categoryMap[blog.category_id] : undefined) ||
              "Uncategorized";
            
            // Resolve author name using meta settings or any returned relationship value
            const authorName =
              blog.author ||
              blog["users->name"] ||
              (blog.users && blog.users.name) ||
              defaultAuthorName;
            
            // Format the date to Indonesian format
            const date = new Date(blog.created_at || new Date());
            const formattedDate = new Intl.DateTimeFormat('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(date);
            
            return {
              id: blog.id,
              slug: blog.title ? `${slugify(blog.title)}${blog.id ? `-${blog.id}` : ''}` : `${blog.id}`,
              title: blog.title,
              content: blog.content,
              image: blog.image,
              image_alt: blog.image_alt || "Blog Image",
              category: { name: categoryName },
              created_at: formattedDate,
              author: authorName
            };
          });
          setBlogs(normalizedBlogs);
        }

        if (galleriesRes?.data?.data) {
          // Map gallery data and normalize field names
          const normalizedGalleries = galleriesRes.data.data.map((gallery: GalleryImage) => ({
            src: gallery.src || gallery.image || "",
            alt: gallery.alt || gallery.image_alt || "Gallery Image"
          }));
          setGalleries(normalizedGalleries);
        }

        if (leaderboardsRes?.data?.data) {
          setLeaderboards(leaderboardsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="agileheader" id="agileitshome">
      <SEO
        title={meta?.meta_title ? meta.meta_title : undefined}
        description={meta?.meta_description ? meta.meta_description : "Discover the ultimate gaming platform. Connect with players, explore games, and elevate your gaming experience."}
        image={meta?.about_image ? meta.about_image : blogs[0]?.image ? blogs[0].image : "/logo.png"}
        keywords={meta?.meta_keywords ? meta.meta_keywords.split(",") : ["gaming", "platform", "games", "players", "community", "tarkam"]}
        author={meta?.author_name}
      />
      <Navbar brandName={meta?.first_name ? meta.first_name : "Tarkam"} navItems={menus} />
        <Header sliders={slides} />
        {meta?.about_description && <About description={meta.about_description} imageSrc={meta?.about_image || "/about.jpg"} altText={meta?.about_image_alt || "about tarkam"} />}
        <Platform platforms={platforms} />
        <Leaderboards categories={leaderboardCategories} leaderboards={leaderboards} />
        <Blogs blogs={blogs} />
        <Galleries galleries={galleries} />
        <Sponsor sponsors={sponsors} />
        <Contact></Contact>
    </div>
  )
}

export default App;
