import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Api from "@/api";
import { getCartQueryString } from "@/galactic/session";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { recordSliceUpdate } from "./renderAudit";
import {
  placeholderPlayer,
  placeholderShop,
  placeholderSponsor,
  placeholderTeam,
} from "@/galactic/placeholders";
import {
  buildMatchDetailPath,
  buildNewsCategoryPath,
  buildNewsDetailPath,
  buildPlayerDetailPath,
  buildShopDetailPath,
  buildTarkamScheduleAnchorPath,
  buildTeamDetailPath,
  brand,
  galacticMenuRouteAliases,
  galacticRoutes,
  menus as defaultMenus,
  streams as defaultStreams,
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
  category?: { id?: number; title?: string; slug?: string };
  tags?: Array<{ id?: number; title?: string; slug?: string; name?: string }>;
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
  member?: ApiMember;
  logo?: string;
  image?: string;
  url?: string;
  showing?: string;
  detail?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
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
  streem?: string;
  url?: string;
  thumbnail?: string;
  embed?: string;
  description?: string;
  user_id?: number;
  tarkam_fk?: number | string | null;
  tags?: Array<{ id?: number; name?: string }>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiClub = {
  id: number;
  code?: string;
  slug?: string;
  name?: string;
  logo?: string;
  slogan?: string;
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
  slug?: string;
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
  image_sponsor?: string;
  tier?: string;
  city?: string;
  club_fk?: number | string | null;
  wins?: number;
  losses?: number;
  t_matches?: number;
  points?: number;
  status?: string;
  alias?: ApiAlias;
  guild_position?: string;
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
  member_fk?: number | string | null;
  tarkam_fk?: number | string | null;
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
  tarkam_fk?: number | string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

type ApiTeam = {
  id: number;
  name?: string;
  gender?: string;
  member1_fk?: number | string | null;
  member2_fk?: number | string | null;
  member3_fk?: number | string | null;
  group_fk?: number | string | null;
  tarkam_fk?: number | string | null;
  date?: string;
  time?: string;
  logo?: string;
  member1?: ApiMember;
  member2?: ApiMember;
  member3?: ApiMember;
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
  points_awarded?: number;
  mvp_m?: string;
  mvp_m_reward?: number;
  mvp_f?: string;
  mvp_f_reward?: number;
  location?: string;
  teams_count?: number;
  groups_count?: number;
  contests_count?: number;
  winners_count?: number;
  players_count?: number;
  penyawers_count?: number;
  streamings_count?: number;
  sessions_count?: number;
  timelines_count?: number;
  male_players_count?: number;
  female_players_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ApiContest = {
  id: number;
  team1_fk?: number | string | null;
  team2_fk?: number | string | null;
  winner_team_fk?: number | string | null;
  score?: number | string;
  tarkam_fk?: number | string | null;
  gender?: string;
  time?: string;
  streem?: string;
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
  team_fk?: number | string | null;
  tarkam_fk?: number | string | null;
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
  date?: string;
  gender?: string;
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

type NewsRecord = {
  id: number;
  news: ApiBlog;
  item: PostItem;
};

type CartRecord = {
  id: number;
  quantity: number;
  product: ProductItem;
};

const defaultMeta: SiteMeta = {
  siteName: brand.name,
  siteUrl: "http://127.0.0.1:5173",
  title: brand.title,
  description: brand.description,
  keywords: ["imd", "tarkam", "meta", "zeth"],
  tagline: "Have Fun no Drama!",
  author: brand.name,
  email: brand.contact.email,
  phone: brand.contact.phone,
  whatsapp: brand.contact.phone,
  address: brand.contact.location,
  logoUrl: brand.logo,
  socialLinks: brand.socialLinks,
};

const defaultHeader: ApiHeader = {
  id: 0,
  title: "Fun Group Random Team Tarkam",
  subtitle: "Have Fun no Drama!",
  image: brand.heroImage,
  image_alt: "Tarkam Hero",
  video_url: "https://www.facebook.com/100043981972979/videos/756597290539585/",
};

const defaultFooterLinks: FooterLink[] = [
  { label: "Pusat Bantuan", path: galacticRoutes.helpCenter },
  { label: "Kebijakan Privasi", path: galacticRoutes.privacyPolicy },
  { label: "Kebijakan Komentar", path: galacticRoutes.commentPolicy },
  { label: "Syarat dan Ketentuan", path: galacticRoutes.terms },
  { label: "Ketentuan Penggunaan", path: galacticRoutes.acceptableUse },
  { label: "Ketentuan Penghapusan Data", path: galacticRoutes.dataDeletion },
  { label: "Hubungi Kami", path: galacticRoutes.contact },
];

type SiteContentValue = {
  loading: boolean;
  meta: SiteMeta;
  menus: GalacticMenuItem[];
  footerLinks: FooterLink[];
  heroes: ApiHeader[];
  usefulLinks: ApiUsefull[];
};

type CompetitionContentValue = {
  loading: boolean;
  matches: MatchItem[];
  matchRecords: MatchRecord[];
  streams: StreamItem[];
  streamings: ApiStreaming[];
  tarkams: ApiTarkam[];
  players: PlayerItem[];
  playerRecords: PlayerRecord[];
  teams: TeamRecord[];
  clubs: ApiClub[];
  sponsors: SponsorItem[];
  penyawers: ApiPenyawer[];
};

type NewsContentValue = {
  loading: boolean;
  posts: PostItem[];
  newsRecords: NewsRecord[];
  newsCategories: string[];
};

type CommerceContentValue = {
  loading: boolean;
  products: ProductItem[];
  productRecords: ProductRecord[];
  cartItems: CartRecord[];
};

const defaultSiteContent: SiteContentValue = {
  loading: true,
  meta: defaultMeta,
  menus: [],
  footerLinks: [],
  heroes: [],
  usefulLinks: [],
};

const defaultCompetitionContent: CompetitionContentValue = {
  loading: true,
  matches: [],
  matchRecords: [],
  streams: [],
  streamings: [],
  tarkams: [],
  players: [],
  playerRecords: [],
  teams: [],
  clubs: [],
  sponsors: [],
  penyawers: [],
};

const defaultNewsContent: NewsContentValue = {
  loading: true,
  posts: [],
  newsRecords: [],
  newsCategories: [],
};

const defaultCommerceContent: CommerceContentValue = {
  loading: true,
  products: [],
  productRecords: [],
  cartItems: [],
};

const GalacticSiteContext = createContext<SiteContentValue>(defaultSiteContent);
const GalacticCompetitionContext = createContext<CompetitionContentValue>(defaultCompetitionContent);
const GalacticNewsContext = createContext<NewsContentValue>(defaultNewsContent);
const GalacticCommerceContext = createContext<CommerceContentValue>(defaultCommerceContent);

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

const formatTimeLabel = (value?: string) => {
  if (!value) {
    return "TBA";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
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

  return galacticMenuRouteAliases[(item.title || "").toLowerCase().trim()] || "";
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
  [team?.member1_fk, team?.member2_fk, team?.member3_fk]
    .map((value) => normalizeId(value))
    .filter((value): value is number => value != null);

const normalizeId = (value: number | string | null | undefined): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const numeric = Number(value);
  return Number.isInteger(numeric) ? numeric : undefined;
};


async function fetchSitePayloads() {
  const requests = await Promise.allSettled([
    Api.get("/menus"),
    Api.get("/web-setting"),
    Api.get("/headers"),
    Api.get("/usefulls"),
  ]);

  const read = <T,>(index: number): T | undefined =>
    requests[index].status === "fulfilled" ? requests[index].value.data : undefined;

  return {
    menus: read<ApiEnvelope<ApiMenuItem[]>>(0),
    webSetting: read<ApiEnvelope<ApiWebSetting>>(1),
    headers: read<ApiEnvelope<ApiHeader[]>>(2),
    usefulls: read<ApiEnvelope<ApiUsefull[]>>(3),
  };
}

async function fetchCompetitionPayloads() {
  const requests = await Promise.allSettled([
    Api.get("/streamings"),
    Api.get("/clubs"),
    Api.get("/members"),
    Api.get("/players"),
    Api.get("/teams"),
    Api.get("/tarkams"),
    Api.get("/contests"),
    Api.get("/winners"),
    Api.get("/penyawers"),
    Api.get("/groups"),
  ]);

  const read = <T,>(index: number): T | undefined =>
    requests[index].status === "fulfilled" ? requests[index].value.data : undefined;

  return {
    streamings: read<ApiEnvelope<ApiStreaming[]>>(0),
    clubs: read<ApiEnvelope<ApiClub[]>>(1),
    members: read<ApiEnvelope<ApiMember[]>>(2),
    players: read<ApiEnvelope<ApiPlayer[]>>(3),
    teams: read<ApiEnvelope<ApiTeam[]>>(4),
    tarkams: read<ApiEnvelope<ApiTarkam[]>>(5),
    contests: read<ApiEnvelope<ApiContest[]>>(6),
    winners: read<ApiEnvelope<ApiWinner[]>>(7),
    penyawers: read<ApiEnvelope<ApiPenyawer[]>>(8),
    groups: read<ApiEnvelope<ApiGroup[]>>(9),
  };
}

async function fetchNewsPayloads() {
  const requests = await Promise.allSettled([
    Api.get("/categories"),
    Api.get("/blogs", { params: { all: true } }),
  ]);

  const read = <T,>(index: number): T | undefined =>
    requests[index].status === "fulfilled" ? requests[index].value.data : undefined;

  return {
    categories: read<ApiEnvelope<ApiCategory[]>>(0),
    blogs: read<ApiEnvelope<ApiBlog[]>>(1),
  };
}

async function fetchCommercePayloads() {
  const cartQuery = getCartQueryString();
  const requests = await Promise.allSettled([
    Api.get("/products", { params: { all: true } }),
    Api.get(`/carts${cartQuery}`),
  ]);

  const read = <T,>(index: number): T | undefined =>
    requests[index].status === "fulfilled" ? requests[index].value.data : undefined;

  return {
    products: read<ApiEnvelope<ApiProduct[]>>(0),
    carts: read<ApiEnvelope<ApiCart[]>>(1),
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

const mapSiteContent = (payloads: Awaited<ReturnType<typeof fetchSitePayloads>>): SiteContentValue => {
  const menus = normalizeList(payloads.menus);
  const webSetting = normalizeItem(payloads.webSetting);
  const headers = normalizeList(payloads.headers);
  const usefulls = normalizeList(payloads.usefulls);
  const menuTree = buildMenuTree(menus);
  const fallbackMenus = menuTree.length ? menuTree : defaultMenus;
  const fallbackHeroHeaders = headers.length ? headers : [defaultHeader];
  const footerLinks = usefulls.length
    ? buildFooterLinks(fallbackMenus, usefulls)
    : defaultFooterLinks;

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

  return {
    loading: false,
    meta,
    menus: fallbackMenus,
    footerLinks,
    heroes: fallbackHeroHeaders,
    usefulLinks: usefulls,
  };
};

const mapCompetitionContent = (
  payloads: Awaited<ReturnType<typeof fetchCompetitionPayloads>>,
  heroHeaders: ApiHeader[],
): CompetitionContentValue => {
  const streamings = normalizeList(payloads.streamings);
  const clubs = normalizeList(payloads.clubs);
  const members = normalizeList(payloads.members);
  const players = normalizeList(payloads.players);
  const teams = normalizeList(payloads.teams);
  const tarkams = normalizeList(payloads.tarkams);
  const contests = normalizeList(payloads.contests);
  const winners = normalizeList(payloads.winners);
  const penyawers = normalizeList(payloads.penyawers);
  const groups = normalizeList(payloads.groups);

  const clubMap = new Map(clubs.map((item) => [item.id, item]));
  const memberMap = new Map(members.map((item) => [item.id, item]));
  const teamMap = new Map(teams.flatMap((item) => {
    const id = normalizeId(item.id);
    return id != null ? [[id, item] as const] : [];
  }));
  const tarkamMap = new Map(tarkams.flatMap((item) => {
    const id = normalizeId(item.id);
    return id != null ? [[id, item] as const] : [];
  }));
  const groupMap = new Map(groups.flatMap((item) => {
    const id = normalizeId(item.id);
    return id != null ? [[id, item] as const] : [];
  }));

  const playerRecords: PlayerRecord[] = players.map((player) => {
    const member = player.member || (player.member_fk ? memberMap.get(normalizeId(player.member_fk)!) : undefined);
    const club = member?.club_fk ? clubMap.get(normalizeId(member.club_fk)!) : undefined;
    const playerTarkamId = normalizeId(player.tarkam_fk);
    const tarkam = player.tarkam || (playerTarkamId != null ? tarkamMap.get(playerTarkamId) : undefined);
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
      image: member?.picture_url?.trim() || placeholderPlayer,
      speciality: member?.tier || "",
      role: member?.gender ? `${member.gender} Gender` : "",
      country: member?.city || "",
      team: team?.name || club?.name || "",
      teamLogo: club?.logo || "",
      about: tarkam?.description || "",
      path: buildPlayerDetailPath(member?.slug || player.id),
      teamPath: team ? buildTeamDetailPath(team.id) : undefined,
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
    const relatedContests = contests.filter(
      (item) => normalizeId(item.team1_fk) === team.id || normalizeId(item.team2_fk) === team.id
    );
    const wins = relatedContests.filter((item) => normalizeId(item.winner_team_fk) === team.id).length;
    const losses = relatedContests.filter(
      (item) => item.winner_team_fk != null && normalizeId(item.winner_team_fk) !== team.id
    ).length;
    const draws = relatedContests.filter((item) => item.winner_team_fk == null).length;
    const teamTarkamId = normalizeId(team.tarkam_fk);
    const firstTarkam = teamTarkamId != null ? tarkamMap.get(teamTarkamId) : undefined;
    const teamGroup = team.group || (() => {
      const groupId = normalizeId(team.group_fk);
      return groupId != null ? groupMap.get(groupId) : undefined;
    })();
    const points = membersForTeam.reduce((sum, item) => sum + item.points, 0);

    return {
      id: team.id,
      team,
      name: team.name || `Team ${team.id}`,
      logo: team.logo || placeholderTeam,
      teamPath: buildTeamDetailPath(team.id),
      gender: team.gender || "Open",
      members: membersForTeam.map((item) => item.item),
      group: teamGroup,
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
    const team1 = normalizeId(contest.team1_fk) != null ? teamMap.get(normalizeId(contest.team1_fk)!) : undefined;
    const team2 = normalizeId(contest.team2_fk) != null ? teamMap.get(normalizeId(contest.team2_fk)!) : undefined;
    const team1Record = teamRecords.find((item) => item.id === team1?.id);
    const team2Record = teamRecords.find((item) => item.id === team2?.id);
    const tarkam = normalizeId(contest.tarkam_fk) != null ? tarkamMap.get(normalizeId(contest.tarkam_fk)!) : undefined;
    const winner = winners.find(
      (item) => normalizeId(item.team_fk) === normalizeId(contest.winner_team_fk) && normalizeId(item.tarkam_fk) === normalizeId(contest.tarkam_fk)
    );

    const item: MatchItem = {
      id: contest.id,
      leftTeam: team1?.name || `Team ${contest.team1_fk ?? contest.id}`,
      leftLogo: team1?.logo || team1Record?.logo || "",
      rightTeam: team2?.name || `Team ${contest.team2_fk ?? contest.id}`,
      rightLogo: team2?.logo || team2Record?.logo || "",
      group:
        tarkam?.title ||
        (tarkam?.week ? `Tarkam Week ${tarkam.week}` : contest.gender ? `${contest.gender} bracket` : (team1?.gender === team2?.gender ? `${team1?.gender} bracket` : "Mixed bracket")),
      time: formatTimeLabel(contest.time) || "TBA",
      date: formatDateLabel(tarkam?.male_date || tarkam?.female_date) || "",
      path: buildMatchDetailPath(contest.id),
      gender: contest.gender as "male" | "female" | "mixed" | undefined || (team1?.gender === team2?.gender ? team1?.gender as "male" | "female" : "mixed"),
      leftTeamPath: team1 ? buildTeamDetailPath(team1.id) : galacticRoutes.clubs,
      rightTeamPath: team2 ? buildTeamDetailPath(team2.id) : galacticRoutes.clubs,
      videoUrl: contest?.streem || "",
    };

    return {
      id: contest.id,
      item,
      contest,
      team1,
      team2,
      tarkam,
      winner,
      winnerTeam: normalizeId(contest.winner_team_fk) != null ? teamMap.get(normalizeId(contest.winner_team_fk)!) : undefined,
    };
  });

  const effectiveHeroes = heroHeaders.length ? heroHeaders : [defaultHeader];
  const streamItems: StreamItem[] = streamings.map((stream, index) => ({
    id: stream.id,
    title: stream.title || "",
    image: stream.thumbnail || effectiveHeroes[index]?.image || "",
    category: stream.tags?.[0]?.name || "Live Stream",
    meta: formatDateLabel(stream.created_at),
    videoUrl: stream.streem || stream.embed || stream.url || "",
    path: buildTarkamScheduleAnchorPath(stream.id),
  }));
  const fallbackStreams = streamings.length ? streamItems : defaultStreams;

  const sponsors = penyawers.length
    ? penyawers.map((item) => {
        const member = item.member || (item.member_fk ? memberMap.get(normalizeId(item.member_fk)!) : undefined);
        const socialLinks: Array<{ icon: string; href: string }> = [];
        const facebookLink = member?.facebook;
        const instagramLink = member?.instagram;
        const tiktokLink = member?.tiktok;

        if (facebookLink) {
          socialLinks.push({ icon: "lab la-facebook-f", href: facebookLink });
        }
        if (instagramLink) {
          socialLinks.push({ icon: "lab la-instagram", href: instagramLink });
        }
        if (tiktokLink) {
          socialLinks.push({ icon: "lab la-tiktok", href: tiktokLink });
        }

        return {
          image: member?.image_sponsor?.trim() || placeholderSponsor,
          name: item.name || `Sponsor ${item.id}`,
          url: item.url || "#",
          amount: item.amount,
          message: item.pesan?.trim() || item.description?.trim() || item.detail?.trim() || undefined,
          memberPicture: member?.picture_url?.trim() || placeholderPlayer,
          memberImage: member?.image_sponsor?.trim() || placeholderSponsor,
          memberNickname: member?.nickname || member?.username || "Sponsor Member",
          detail: item.detail || item.description || member?.tier || undefined,
          socialLinks: socialLinks.length ? socialLinks : undefined,
        };
      })
    : clubs
        .filter((club) => Boolean(club.logo))
        .map((club) => ({
          image: club.logo!,
          name: club.name || `Club ${club.id}`,
          url: "#",
        }));

  return {
    loading: false,
    matches: matchRecords.map((item) => item.item),
    matchRecords,
    streams: fallbackStreams,
    streamings,
    tarkams,
    players: playerRecords.map((item) => item.item),
    playerRecords,
    teams: teamRecords,
    clubs,
    sponsors,
    penyawers,
  };
};

const mapNewsContent = (
  payloads: Awaited<ReturnType<typeof fetchNewsPayloads>>,
  authorFallback?: string,
): NewsContentValue => {
  const categories = normalizeList(payloads.categories);
  const blogs = normalizeList(payloads.blogs);
  const categoryMap = new Map(categories.map((item) => [item.id, item.name || item.title || "Gaming"]));

  const newsRecords: NewsRecord[] = blogs.map((blog) => {
    const category = categoryMap.get(blog.category_id || -1) || "";
    const content = splitContent(blog.content);
    const mappedTags = Array.isArray(blog.tags)
      ? blog.tags
          .map((item) => item?.title || item?.name || "")
          .filter(Boolean)
      : [category, "Tarkam", "IDM"].filter(Boolean);

    return {
      id: blog.id,
      news: blog,
      item: {
        id: blog.id,
        title: blog.title || `News ${blog.id}`,
        category,
        image: blog.image || "",
        date: formatDateLabel(blog.created_at),
        author: authorFallback || brand.name,
        excerpt: `${stripHtml(blog.content || "").slice(0, 150)}...`,
        content,
        tags: mappedTags,
        path: buildNewsDetailPath(blog.slug || blog.id),
        categoryPath: buildNewsCategoryPath(blog.category?.slug || slugify(category)),
      },
    };
  });

  return {
    loading: false,
    posts: newsRecords.map((item) => item.item),
    newsRecords,
    newsCategories: Array.from(new Set(newsRecords.map((item) => item.item.category))).filter(Boolean),
  };
};

const mapCommerceContent = (
  payloads: Awaited<ReturnType<typeof fetchCommercePayloads>>,
): CommerceContentValue => {
  const products = normalizeList(payloads.products);
  const carts = normalizeList(payloads.carts);

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
        image: gallery?.[0] || placeholderShop,
        price: Number(product.price ?? 0),
        oldPrice: undefined,
        badge: product.status || "",
        badgeClass: product.status === "Sold Out" ? "out-stock" : "",
        description: product.subject || product.description || "",
        sku: product.sku || `product-${product.id}`,
        tags: product.tags?.map((item) => item.name || "").filter(Boolean) || [],
        path: buildShopDetailPath(product.slug || product.id),
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
        image: relatedItem?.image || placeholderShop,
        price: Number(cart.unit_price ?? relatedItem?.price ?? 0),
        oldPrice: relatedItem?.oldPrice,
        badge: relatedItem?.badge || "",
        badgeClass: relatedItem?.badgeClass || "",
        description: relatedItem?.description || "",
        sku: relatedItem?.sku || `product-${cart.product?.id ?? 0}`,
        tags: relatedItem?.tags || [],
        path: relatedItem?.path || galacticRoutes.shop,
        gallery: relatedItem?.gallery || [],
        additionalInfo: relatedItem?.additionalInfo || "",
      },
    };
  });

  return {
    loading: false,
    products: productRecords.map((item) => item.item),
    productRecords,
    cartItems,
  };
};

export function GalacticDataProvider({ children }: { children: ReactNode }) {
  const siteLiveKey = useLiveUpdate(
    ["menus", "web-setting", "headers", "usefulls"],
    { fallbackIntervalMs: 45000 },
  );
  const competitionLiveKey = useLiveUpdate(
    ["streamings", "clubs", "members", "players", "teams", "tarkams", "contests", "winners", "penyawers", "groups"],
    { fallbackIntervalMs: 30000 },
  );
  const newsLiveKey = useLiveUpdate(
    ["categories", "blogs"],
    { fallbackIntervalMs: 45000 },
  );
  const commerceLiveKey = useLiveUpdate(
    ["products", "carts"],
    { fallbackIntervalMs: 30000 },
  );
  const [siteContent, setSiteContent] = useState<SiteContentValue>(defaultSiteContent);
  const [competitionContent, setCompetitionContent] = useState<CompetitionContentValue>(defaultCompetitionContent);
  const [newsContent, setNewsContent] = useState<NewsContentValue>(defaultNewsContent);
  const [commerceContent, setCommerceContent] = useState<CommerceContentValue>(defaultCommerceContent);
  const siteHeroSignature = siteContent.heroes
    .map((hero) => [hero.id, hero.title, hero.image, hero.updated_at].join(":"))
    .join("|");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const payloads = await fetchSitePayloads();
        if (!active) {
          return;
        }
        setSiteContent(mapSiteContent(payloads));
      } catch (error) {
        console.error("Failed to load galactic content", error);
        if (active) {
          setSiteContent((current) => ({ ...current, loading: false }));
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [siteLiveKey]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const payloads = await fetchCompetitionPayloads();
        if (!active) {
          return;
        }

        setCompetitionContent(mapCompetitionContent(payloads, siteContent.heroes));
      } catch (error) {
        console.error("Failed to load galactic competition content", error);
        if (active) {
          setCompetitionContent((current) => ({ ...current, loading: false }));
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [competitionLiveKey, siteHeroSignature]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const payloads = await fetchNewsPayloads();
        if (!active) {
          return;
        }

        setNewsContent(mapNewsContent(payloads, siteContent.meta.author));
      } catch (error) {
        console.error("Failed to load galactic news content", error);
        if (active) {
          setNewsContent((current) => ({ ...current, loading: false }));
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [newsLiveKey, siteContent.meta.author]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const payloads = await fetchCommercePayloads();
        if (!active) {
          return;
        }

        setCommerceContent(mapCommerceContent(payloads));
      } catch (error) {
        console.error("Failed to load galactic commerce content", error);
        if (active) {
          setCommerceContent((current) => ({ ...current, loading: false }));
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [commerceLiveKey]);

  useEffect(() => {
    recordSliceUpdate("site", {
      loading: siteContent.loading,
      menus: siteContent.menus.length,
      heroes: siteContent.heroes.length,
      usefulLinks: siteContent.usefulLinks.length,
    });
  }, [siteContent]);

  useEffect(() => {
    recordSliceUpdate("competition", {
      loading: competitionContent.loading,
      matches: competitionContent.matches.length,
      players: competitionContent.players.length,
      teams: competitionContent.teams.length,
      clubs: competitionContent.clubs.length,
      sponsors: competitionContent.sponsors.length,
      tarkams: competitionContent.tarkams.length,
    });
  }, [competitionContent]);

  useEffect(() => {
    recordSliceUpdate("news", {
      loading: newsContent.loading,
      posts: newsContent.posts.length,
      categories: newsContent.newsCategories.length,
    });
  }, [newsContent]);

  useEffect(() => {
    recordSliceUpdate("commerce", {
      loading: commerceContent.loading,
      products: commerceContent.products.length,
      cartItems: commerceContent.cartItems.length,
    });
  }, [commerceContent]);

  return (
    <GalacticSiteContext.Provider value={siteContent}>
      <GalacticCompetitionContext.Provider value={competitionContent}>
        <GalacticNewsContext.Provider value={newsContent}>
          <GalacticCommerceContext.Provider value={commerceContent}>
            {children}
          </GalacticCommerceContext.Provider>
        </GalacticNewsContext.Provider>
      </GalacticCompetitionContext.Provider>
    </GalacticSiteContext.Provider>
  );
}

export function useGalacticSiteContent() {
  return useContext(GalacticSiteContext);
}

export function useGalacticCompetitionContent() {
  return useContext(GalacticCompetitionContext);
}

export function useGalacticNewsContent() {
  return useContext(GalacticNewsContext);
}

export function useGalacticCommerceContent() {
  return useContext(GalacticCommerceContext);
}

export type {
  NewsRecord,
  CartRecord,
  FooterLink,
  MatchRecord,
  PlayerRecord,
  ProductRecord,
  SiteMeta,
  TeamRecord,
};
