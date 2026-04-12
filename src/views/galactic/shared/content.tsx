import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Api from "@/api";
import {
  brand,
  type FaqItem,
  type GalacticMenuItem,
  type MatchItem,
  type PlayerItem,
  type PostItem,
  type ProductItem,
  type SponsorItem,
  type StreamItem,
} from "@/galactic/data";

type ApiEnvelope<T> = {
  data?: T;
};

type ApiMenuItem = {
  id: number;
  parent_id?: number | null;
  title?: string | null;
  url?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiWebSetting = {
  site_name?: string;
  site_url?: string;
  tagline?: string;
  author_name?: string;
  author_url?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  whatsapp_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  discord_url?: string;
  whatsapp_url?: string;
  about_description?: string;
  about_image_path?: string;
  about_image?: string;
  about_image_alt?: string;
  logo_path?: string;
  logo?: string;
  favicon_path?: string;
  favicon?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  facebook_pixel_id?: string;
  youtube_pixel_id?: string;
  github_pixel_id?: string;
  discord_pixel_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiHeader = {
  id: number;
  title?: string;
  subtitle?: string;
  image?: string;
  image_alt?: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiCategory = {
  id: number;
  title?: string;
  name?: string;
  slug?: string;
  url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiBlog = {
  id: number;
  title?: string;
  slug?: string;
  content?: string;
  image?: string;
  image_alt?: string;
  category_id?: number;
  user_id?: number;
  tags?: Array<{ id?: number; name?: string }>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiPenyawer = {
  id: number;
  name?: string;
  gender?: string;
  amount?: number;
  pesan?: string;
  member_fk?: number | null;
  tarkam_fk?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiProduct = {
  id: number;
  title?: string;
  slug?: string;
  sku?: string;
  subject?: string;
  description?: string;
  additional_info?: string;
  price?: number | string;
  status?: string;
  catprod_id?: number;
  user_id?: number;
  catprod?: { id?: number; title?: string; name?: string; slug?: string; url?: string; status?: string };
  tags?: Array<{ id?: number; name?: string }>;
  thumbnails?: Array<{ id?: number; product_thumbnail_path?: string }>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiCart = {
  id: number;
  quantity?: number;
  unit_price?: number;
  product_id?: number;
  user_id?: number;
  session_id?: string | null;
  status?: string;
  product?: ApiProduct;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiStreaming = {
  id: number;
  title?: string;
  slug?: string;
  url?: string;
  thumbnail?: string;
  embed?: string;
  description?: string;
  user_id?: number;
  tags?: Array<{ id?: number; name?: string }>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiClub = {
  id: number;
  code?: string;
  name?: string;
  logo?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  level?: string;
  points?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiMember = {
  id: number;
  username?: string;
  nickname?: string;
  discord_user_id?: string;
  phone_number?: string;
  tunisia_phone?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  picture_url?: string;
  tier?: string;
  city?: string;
  club_fk?: number | null;
  wins?: number;
  losses?: number;
  t_matches?: number;
  points?: number;
  status?: string;
  alias?: ApiAlias;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiAlias = {
  id: number;
  alias?: string;
  member_fk?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiPlayer = {
  id: number;
  score?: number | string;
  paid?: boolean;
  member_fk?: number | null;
  tarkam_fk?: number | null;
  member?: ApiMember;
  tarkam?: ApiTarkam;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiGroup = {
  id: number;
  name?: string;
  gender?: string;
  team_fk?: number | null;
  tarkam_fk?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

type ApiTeam = {
  id: number;
  name?: string;
  gender?: string;
  member1_fk?: number | null;
  member2_fk?: number | null;
  member3_fk?: number | null;
  group_fk?: number | null;
  tarkam_fk?: number | null;
  group?: ApiGroup;
  tarkam?: ApiTarkam;
  member?: ApiMember;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiTarkam = {
  id: number;
  title?: string;
  week?: string;
  status?: string;
  description?: string;
  transfer_info?: string;
  proof?: string;
  thumbnail?: string;
  image?: string;
  pool_price_m?: number;
  pool_price_f?: number;
  male_date?: string;
  male_time?: string;
  female_date?: string;
  female_time?: string;
  male_slot?: number;
  female_slot?: number;
  male_completed?: number;
  female_completed?: number;
  mvp_m?: string;
  mvp_f?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiContest = {
  id: number;
  team1_fk?: number | null;
  team2_fk?: number | null;
  winner_team_fk?: number | null;
  score?: number | string;
  tarkam_fk?: number | null;
  gender?: string;
  tarkam?: ApiTarkam;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiWinner = {
  id: number;
  nickname?: string;
  prize?: string;
  gender?: string;
  team_fk?: number | null;
  tarkam_fk?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiUsefull = {
  id: number;
  title?: string;
  slug?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type FooterLink = {
  label: string;
  path: string;
  external?: boolean;
};

type SiteMeta = {
  siteName: string;
  siteUrl: string;
  title: string;
  description: string;
  keywords: string[];
  tagline?: string;
  author?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  aboutDescription?: string;
  aboutImage?: string;
  aboutImageAlt?: string;
  logoUrl?: string;
  faviconUrl?: string;
  socialLinks: Array<{ icon: string; label: string; href: string }>;
};

type MatchRecord = {
  id: number;
  item: MatchItem;
  contest?: ApiContest;
  team1?: ApiTeam;
  team2?: ApiTeam;
  tarkam?: ApiTarkam;
  winner?: ApiWinner;
  winnerTeam?: ApiTeam;
};

type TeamRecord = {
  id: number;
  team: ApiTeam;
  name: string;
  logo: string;
  teamPath: string;
  gender: string;
  members: PlayerItem[];
  group?: ApiGroup;
  tarkam?: ApiTarkam;
  description: string;
  wins: number;
  losses: number;
  draws: number;
  matches: number;
  rating: number;
  points: number;
  tarkamLabel: string;
};

type PlayerRecord = {
  id: number;
  player: ApiPlayer;
  member?: ApiMember;
  club?: ApiClub;
  team?: ApiTeam;
  item: PlayerItem;
  alias: string;
  joinLabel: string;
  ageLabel: string;
  timeline: Array<{ label: string; value: string }>;
  wins: number;
  losses: number;
  points: number;
};

type ProductRecord = {
  id: number;
  product: ApiProduct;
  item: ProductItem;
};

type BlogRecord = {
  id: number;
  blog: ApiBlog;
  item: PostItem;
};

type CartRecord = {
  id: number;
  quantity: number;
  product: ProductItem;
};

type GalacticContentValue = {
  loading: boolean;
  meta: SiteMeta;
  menus: GalacticMenuItem[];
  footerLinks: FooterLink[];
  heroes: ApiHeader[];
  matches: MatchItem[];
  matchRecords: MatchRecord[];
  streams: StreamItem[];
  tarkams: ApiTarkam[];
  players: PlayerItem[];
  playerRecords: PlayerRecord[];
  teams: TeamRecord[];
  clubs: ApiClub[];
  products: ProductItem[];
  productRecords: ProductRecord[];
  cartItems: CartRecord[];
  posts: PostItem[];
  blogRecords: BlogRecord[];
  blogCategories: string[];
  sponsors: SponsorItem[];
  penyawers: ApiPenyawer[];
  faqs: FaqItem[];
  usefulLinks: ApiUsefull[];
};

const STATIC_PAGE_ROUTES: Record<string, string> = {
  home: "/",
  "home default": "/",
  "home esports": "/index-2",
  tournament: "/upcoming-matches",
  "upcoming matches": "/upcoming-matches",
  "stream schedule": "/stream-schedule",
  "match details": "/match-details",
  "player details": "/player-details",
  "team details": "/team-details",
  pages: "/about",
  "about us": "/about",
  "our gamers": "/our-gamers",
  sponsors: "/sponsors",
  "help & faq's": "/faq-page",
  "help & faqs": "/faq-page",
  shop: "/shop",
  "shop grid": "/shop",
  "shop details": "/shop-details",
  "add to cart page": "/cart",
  "checkout page": "/checkout",
  blog: "/blog-grid",
  "grid layout": "/blog-grid",
  "classic layout": "/blog-classic",
  "blog details": "/blog-details",
  contact: "/contact",
};

const defaultMeta: SiteMeta = {
  siteName: brand.name,
  siteUrl: "http://127.0.0.1:5173",
  title: brand.title,
  description: brand.description,
  keywords: ["galactic", "tarkam", "gaming", "esports"],
  tagline: "Nikmati Game-nya",
  author: brand.name,
  email: brand.contact.email,
  phone: brand.contact.phone,
  whatsapp: brand.contact.phone,
  address: brand.contact.location,
  logoUrl: brand.logo,
  socialLinks: brand.socialLinks,
};

const defaultContent: GalacticContentValue = {
  loading: true,
  meta: defaultMeta,
  menus: [],
  footerLinks: [],
  heroes: [],
  matches: [],
  matchRecords: [],
  streams: [],
  tarkams: [],
  players: [],
  playerRecords: [],
  teams: [],
  clubs: [],
  products: [],
  productRecords: [],
  cartItems: [],
  posts: [],
  blogRecords: [],
  blogCategories: [],
  sponsors: [],
  penyawers: [],
  faqs: [],
  usefulLinks: [],
};

const GalacticContentContext = createContext<GalacticContentValue>(defaultContent);

const normalizeList = <T,>(payload: ApiEnvelope<T[]> | undefined): T[] =>
  Array.isArray(payload?.data) ? payload.data : [];

const normalizeItem = <T,>(payload: ApiEnvelope<T> | undefined): T | null =>
  payload?.data ?? null;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const splitContent = (value?: string) => {
  const safe = stripHtml(value || "");
  if (!safe) {
    return ["No description available yet."];
  }

  const paragraphs = safe
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  return safe
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatDateLabel = (value?: string) => {
  if (!value) {
    return "TBA";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeMenuPath = (value: string) => {
  const normalized = value.trim();
  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const resolveMenuPath = (item: ApiMenuItem) => {
  const directUrl = item.url?.trim();
  if (directUrl) {
    return normalizeMenuPath(directUrl);
  }

  return STATIC_PAGE_ROUTES[(item.title || "").toLowerCase().trim()] || "";
};

const buildMenuTree = (items: ApiMenuItem[]): GalacticMenuItem[] => {
  const normalized = items.map((item) => {
    const id = Number(item.id);
    const parentId = Number(item.parent_id ?? -1);

    return {
      id,
      parent_id: Number.isInteger(parentId) && parentId > 0 ? parentId : null,
      label: item.title || "Menu",
      path: resolveMenuPath(item),
      children: [] as GalacticMenuItem[],
    };
  });

  const lookup = new Map<number, (typeof normalized)[number]>();
  normalized.forEach((item) => lookup.set(item.id, item));

  const roots: GalacticMenuItem[] = [];

  normalized.forEach((item) => {
    if (item.parent_id !== null && lookup.has(item.parent_id)) {
      lookup.get(item.parent_id)?.children?.push(item);
      return;
    }

    roots.push(item);
  });

  return roots;
};

const extractMemberIds = (team?: ApiTeam) =>
  [team?.member1_fk, team?.member2_fk, team?.member3_fk].filter((value): value is number => Number.isInteger(value));


async function fetchGalacticPayloads() {
  const requests = await Promise.allSettled([
    Api.get("/menus"),
    Api.get("/web-setting"),
    Api.get("/headers"),
    Api.get("/categories"),
    Api.get("/blogs"),
    Api.get("/products"),
    Api.get("/carts"),
    Api.get("/streamings"),
    Api.get("/clubs"),
    Api.get("/members"),
    Api.get("/players"),
    Api.get("/teams"),
    Api.get("/tarkams"),
    Api.get("/contests"),
    Api.get("/winners"),
    Api.get("/usefull"),
    Api.get("/penyawers"),
    Api.get("/aliases"),
    Api.get("/groups"),
  ]);

  const read = <T,>(index: number): T | undefined =>
    requests[index].status === "fulfilled" ? requests[index].value.data : undefined;

  return {
    menus: read<ApiEnvelope<ApiMenuItem[]>>(0),
    webSetting: read<ApiEnvelope<ApiWebSetting>>(1),
    headers: read<ApiEnvelope<ApiHeader[]>>(2),
    categories: read<ApiEnvelope<ApiCategory[]>>(3),
    blogs: read<ApiEnvelope<ApiBlog[]>>(4),
    products: read<ApiEnvelope<ApiProduct[]>>(5),
    carts: read<ApiEnvelope<ApiCart[]>>(6),
    streamings: read<ApiEnvelope<ApiStreaming[]>>(7),
    clubs: read<ApiEnvelope<ApiClub[]>>(8),
    members: read<ApiEnvelope<ApiMember[]>>(9),
    players: read<ApiEnvelope<ApiPlayer[]>>(10),
    teams: read<ApiEnvelope<ApiTeam[]>>(11),
    tarkams: read<ApiEnvelope<ApiTarkam[]>>(12),
    contests: read<ApiEnvelope<ApiContest[]>>(13),
    winners: read<ApiEnvelope<ApiWinner[]>>(14),
    usefulls: read<ApiEnvelope<ApiUsefull[]>>(15),
    penyawers: read<ApiEnvelope<ApiPenyawer[]>>(16),
  };
}

const normalizeFooterPath = (value: string) => {
  const normalized = value.trim();
  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const buildFooterLinks = (_menuTree: GalacticMenuItem[], usefulls: ApiUsefull[]): FooterLink[] => {
  return usefulls
    .filter((item) => item.title && item.url)
    .slice(0, 6)
    .map((item) => {
      const path = normalizeFooterPath(item.url!);
      const external = /^https?:\/\//i.test(item.url!);
      return { label: item.title!, path, external };
    })
    .filter((item) => Boolean(item.path));
};

export function GalacticDataProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<GalacticContentValue>(defaultContent);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const payloads = await fetchGalacticPayloads();
        if (!active) {
          return;
        }

        const menus = normalizeList(payloads.menus);
        const webSetting = normalizeItem(payloads.webSetting);
        const headers = normalizeList(payloads.headers);
        const categories = normalizeList(payloads.categories);
        const blogs = normalizeList(payloads.blogs);
        const products = normalizeList(payloads.products);
        const carts = normalizeList(payloads.carts);
        const streamings = normalizeList(payloads.streamings);
        const clubs = normalizeList(payloads.clubs);
        const members = normalizeList(payloads.members);
        const players = normalizeList(payloads.players);
        const teams = normalizeList(payloads.teams);
        const tarkams = normalizeList(payloads.tarkams);
        const contests = normalizeList(payloads.contests);
        const winners = normalizeList(payloads.winners);
        const usefulls = normalizeList(payloads.usefulls);
        const penyawers = normalizeList(payloads.penyawers);

        const clubMap = new Map(clubs.map((item) => [item.id, item]));
        const memberMap = new Map(members.map((item) => [item.id, item]));
        const teamMap = new Map(teams.map((item) => [item.id, item]));
        const tarkamMap = new Map(tarkams.map((item) => [item.id, item]));
        const categoryMap = new Map(categories.map((item) => [item.id, item.name || "Gaming"]));
        const menuTree = buildMenuTree(menus);

        const meta: SiteMeta = {
          siteName: webSetting?.site_name || webSetting?.first_name || brand.name,
          siteUrl: webSetting?.site_url || defaultMeta.siteUrl,
          title: webSetting?.meta_title || webSetting?.site_name || brand.title,
          description: webSetting?.meta_description || webSetting?.tagline || brand.description,
          keywords: (webSetting?.meta_keywords || "galactic,tarkam,gaming,esports")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          tagline: webSetting?.tagline || defaultMeta.tagline,
          author: webSetting?.author_name || defaultMeta.author,
          email: webSetting?.email || defaultMeta.email,
          phone: webSetting?.phone_number || defaultMeta.phone,
          whatsapp: webSetting?.whatsapp_number || defaultMeta.whatsapp,
          address: webSetting?.address || defaultMeta.address,
          aboutDescription: webSetting?.about_description,
          aboutImage: webSetting?.about_image,
          aboutImageAlt: webSetting?.about_image_alt,
          logoUrl: webSetting?.logo || defaultMeta.logoUrl,
          faviconUrl: webSetting?.favicon,
          socialLinks: [
            { icon: "lab la-facebook-f", label: "Facebook", href: webSetting?.facebook_url || "#" },
            { icon: "lab la-instagram", label: "Instagram", href: webSetting?.instagram_url || "#" },
            { icon: "lab la-discord", label: "Discord", href: webSetting?.discord_url || "#" },
            { icon: "lab la-whatsapp", label: "WhatsApp", href: webSetting?.whatsapp_url || "#" },
          ],
        };

        const playerRecords: PlayerRecord[] = players.map((player) => {
          const member = player.member || (player.member_fk ? memberMap.get(player.member_fk) : undefined);
          const club = member?.club_fk ? clubMap.get(member.club_fk) : undefined;
          const tarkam = player.tarkam || (player.tarkam_fk ? tarkamMap.get(player.tarkam_fk) : undefined);
          const team = teams.find((item) => extractMemberIds(item).includes(member?.id || -1));
          const alias = member?.nickname || member?.username || "Aimless";
          const wins = member?.wins || 0;
          const losses = member?.losses || 0;
          const seasonLabel = tarkam?.title || (tarkam?.week ? `Tarkam Week ${tarkam.week}` : "Tarkam");
          const seasonDate = formatDateLabel(tarkam?.male_date || tarkam?.female_date) || "TBD";
          const timeline = [
            { label: "Musim", value: seasonLabel },
            { label: "Sesi", value: tarkam?.week ? `Week ${tarkam.week}` : "Current Season" },
            { label: "Status", value: tarkam?.status || "Aktif" },
            { label: "Tanggal", value: seasonDate },
          ];
          const item: PlayerItem = {
            id: player.id,
            name: member?.nickname || member?.username || "Unknown Player",
            game: tarkam?.title || (tarkam?.week ? `Tarkam Week ${tarkam.week}` : "Tarkam"),
            image: member?.picture_url?.trim() || "/assets/images/placeholder-player.png",
            speciality: member?.tier || "",
            role: member?.gender ? `${member.gender} Division` : "",
            country: member?.city || "",
            team: team?.name || club?.name || "",
            teamLogo: club?.logo || "",
            about: tarkam?.description || "",
            path: `/player-details/${player.id}`,
            teamPath: team ? `/team-details/${team.id}` : undefined,
          };

          return {
            id: player.id,
            player,
            member,
            club,
            team,
            item,
            alias,
            joinLabel: tarkam?.week ? `Week ${tarkam.week}` : "Current Season",
            ageLabel: "Active Member",
            timeline,
            wins,
            losses,
            points: member?.points || 0,
          };
        });

        const teamRecords: TeamRecord[] = teams.map((team) => {
          const memberIds = extractMemberIds(team);
          const membersForTeam = playerRecords.filter((item) => memberIds.includes(item.member?.id || -1));
          const relatedContests = contests.filter((item) => item.team1_fk === team.id || item.team2_fk === team.id);
          const wins = relatedContests.filter((item) => item.winner_team_fk === team.id).length;
          const losses = relatedContests.filter((item) => item.winner_team_fk && item.winner_team_fk !== team.id).length;
          const draws = relatedContests.filter((item) => !item.winner_team_fk).length;
          const firstClub = membersForTeam[0]?.club;
          const firstTarkam = team.tarkam_fk ? tarkamMap.get(team.tarkam_fk) : undefined;
          const points = membersForTeam.reduce((sum, item) => sum + item.points, 0);

          return {
            id: team.id,
            team,
            name: team.name || `Team ${team.id}`,
            logo: firstClub?.logo || "",
            teamPath: `/detail-tim/${team.id}`,
            gender: team.gender || "Open",
            members: membersForTeam.map((item) => item.item),
            group: team.group,
            description: firstTarkam?.description || "",
            wins,
            losses,
            draws,
            matches: relatedContests.length,
            rating: Math.max(3, Math.min(5, wins + 3)),
            points,
            tarkamLabel: firstTarkam?.week ? `Week ${firstTarkam.week}` : "Current Split",
          };
        });

        const matchRecords: MatchRecord[] = contests.map((contest) => {
          const stream = streamings.find((item) => item.id === contest.id);
          const team1 = contest.team1_fk ? teamMap.get(contest.team1_fk) : undefined;
          const team2 = contest.team2_fk ? teamMap.get(contest.team2_fk) : undefined;
          const team1Record = teamRecords.find((item) => item.id === team1?.id);
          const team2Record = teamRecords.find((item) => item.id === team2?.id);
          const tarkam = contest.tarkam_fk ? tarkamMap.get(contest.tarkam_fk) : undefined;
          const winner = winners.find((item) => item.team_fk === contest.winner_team_fk && item.tarkam_fk === contest.tarkam_fk);

          const item: MatchItem = {
            id: contest.id,
            leftTeam: team1?.name || `Team ${contest.team1_fk ?? contest.id}`,
            leftLogo: team1Record?.logo || "",
            rightTeam: team2?.name || `Team ${contest.team2_fk ?? contest.id}`,
            rightLogo: team2Record?.logo || "",
            group:
              tarkam?.title ||
              (tarkam?.week ? `Tarkam Week ${tarkam.week}` : contest.gender ? `${contest.gender} bracket` : ""),
            time: contest.score ? String(contest.score) : tarkam?.male_time || tarkam?.female_time || "",
            date: formatDateLabel(tarkam?.male_date || tarkam?.female_date) || "",
            path: `/detail-pertandingan/${contest.id}`,
            leftTeamPath: team1 ? `/team-details/${team1.id}` : "/team-details",
            rightTeamPath: team2 ? `/team-details/${team2.id}` : "/team-details",
            videoUrl: stream?.url || stream?.embed || "",
          };

          return {
            id: contest.id,
            item,
            contest,
            team1,
            team2,
            tarkam,
            winner,
            winnerTeam: contest.winner_team_fk ? teamMap.get(contest.winner_team_fk) : undefined,
          };
        });

        const productRecords: ProductRecord[] = products.map((product) => {
          const gallery = product.thumbnails
            ?.map((item) => item.product_thumbnail_path)
            .filter((item): item is string => Boolean(item));

          return {
            id: product.id,
            product,
            item: {
              id: product.id,
              name: product.title || `Product ${product.id}`,
              category: product.catprod?.title || product.catprod?.name || "",
              image: gallery?.[0] || "",
              price: Number(product.price ?? 0),
              oldPrice: undefined,
              badge: product.status || "",
              badgeClass: product.status === "Sold Out" ? "out-stock" : "",
              description: product.subject || product.description || "",
              sku: product.sku || `product-${product.id}`,
              tags: product.tags?.map((item) => item.name || "").filter(Boolean) || [],
              path: `/shop-details/${product.id}`,
              gallery: gallery?.length ? gallery : [],
              additionalInfo: product.additional_info || product.description || "",
            },
          };
        });

        const cartItems: CartRecord[] = carts.map((cart) => {
          const related = productRecords.find((item) => item.id === cart.product?.id);
          const relatedItem = related?.item;

          return {
            id: cart.id,
            quantity: cart.quantity || 1,
            product: {
              id: relatedItem?.id || cart.product?.id || 0,
              name: relatedItem?.name || cart.product?.title || "Product",
              category: relatedItem?.category || "",
              image: relatedItem?.image || "",
              price: Number(cart.unit_price ?? relatedItem?.price ?? 0),
              oldPrice: relatedItem?.oldPrice,
              badge: relatedItem?.badge || "",
              badgeClass: relatedItem?.badgeClass || "",
              description: relatedItem?.description || "",
              sku: relatedItem?.sku || `product-${cart.product?.id ?? 0}`,
              tags: relatedItem?.tags || [],
              path: relatedItem?.path || "/shop",
              gallery: relatedItem?.gallery || [],
              additionalInfo: relatedItem?.additionalInfo || "",
            },
          };
        });

        const blogRecords: BlogRecord[] = blogs.map((blog) => {
          const category = categoryMap.get(blog.category_id || -1) || "";
          const content = splitContent(blog.content);

          return {
            id: blog.id,
            blog,
            item: {
              id: blog.id,
              title: blog.title || `Blog ${blog.id}`,
              category,
              image: blog.image || "",
              date: formatDateLabel(blog.created_at),
              author: meta.author || "",
              excerpt: `${stripHtml(blog.content || "").slice(0, 150)}...`,
              content,
              tags: [category, "Tarkam", "Gaming"].filter(Boolean),
              path: `/blog-details/${blog.id}`,
              categoryPath: `/blog-grid?category=${slugify(category)}`,
            },
          };
        });

        const streams: StreamItem[] = streamings.map((stream, index) => ({
          id: stream.id,
          title: stream.title || "",
          image: stream.thumbnail || headers[index]?.image || "",
          category: stream.tags?.[0]?.name || "Live Stream",
          meta: formatDateLabel(stream.created_at),
          videoUrl: stream.embed || stream.url || "",
          path: `/tarkam-schedule#tarkam-${stream.id}`,
        }));

        const sponsors = penyawers.length
          ? penyawers.map((item) => ({
              image: "",
              name: item.name || `Sponsor ${item.id}`,
              url: "#",
            }))
          : clubs
              .filter((club) => Boolean(club.logo))
              .map((club) => ({
                image: club.logo!,
                name: club.name || `Club ${club.id}`,
                url: "#",
              }));

        setContent({
          loading: false,
          meta,
          menus: menuTree.length ? menuTree : buildMenuTree([]),
          footerLinks: buildFooterLinks(menuTree, usefulls),
          heroes: headers,
          matches: matchRecords.map((item) => item.item),
          matchRecords,
          streams,
          tarkams,
          players: playerRecords.map((item) => item.item),
          playerRecords,
          teams: teamRecords,
          clubs,
          products: productRecords.map((item) => item.item),
          productRecords,
          cartItems,
          posts: blogRecords.map((item) => item.item),
          blogRecords,
          blogCategories: Array.from(new Set(blogRecords.map((item) => item.item.category))).filter(Boolean),
          sponsors,
          penyawers,
          faqs: [],
          usefulLinks: usefulls,
        });
      } catch (error) {
        console.error("Failed to load galactic content", error);
        if (active) {
          setContent((current) => ({ ...current, loading: false }));
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return <GalacticContentContext.Provider value={content}>{children}</GalacticContentContext.Provider>;
}

export function useGalacticContent() {
  return useContext(GalacticContentContext);
}

export type {
  BlogRecord,
  CartRecord,
  FooterLink,
  MatchRecord,
  PlayerRecord,
  ProductRecord,
  SiteMeta,
  TeamRecord,
};
