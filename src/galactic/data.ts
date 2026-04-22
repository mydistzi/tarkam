import gameCharacters from "@/assets/images/game-charecters.png";
const logo = "/assets/images/logo.png";
const videoThumb1 = "/assets/images/video-thumb.png";
const videoThumb2 = "/assets/images/video-thumb.png";
const videoThumb3 = "/assets/images/video-thumb.png";

export type GalacticMenuItem = {
  label: string;
  path?: string;
  children?: GalacticMenuItem[];
};

export const galacticRoutes = {
  home: "/",
  tarkamSchedule: "/tarkam-schedule",
  tarkamDetail: "/detail-tarkam/week-",
  matchSchedule: "/jadwal-pertandingan",
  matchDetail: "/detail-pertandingan",
  playerDetail: "/detail-player",
  teamDetail: "/detail-tim",
  clubs: "/klub",
  clubDetail: "/detail-klub",
  news: "/news",
  newsDetail: "/detail-news",
  shop: "/shop",
  shopDetail: "/detail-shop",
  sponsors: "/sponsors",
  sponsorLeaderboard: "/sponsor-leaderboard",
  globalLeaderboard: "/global-leaderboard",
  clubLeaderboard: "/club-leaderboard",
  maleLeaderboard: "/male-leaderboard",
  femaleLeaderboard: "/female-leaderboard",
  helpCenter: "/pusat-bantuan",
  privacyPolicy: "/kebijakan-privasi",
  commentPolicy: "/comment-policy",
  terms: "/syarat-dan-ketentuan",
  acceptableUse: "/ketentuan-penggunaan",
  dataDeletion: "/ketentuan-penghapusan-data",
  contact: "/hubungi-kami",
  cart: "/cart",
  checkout: "/checkout",
  signIn: "/signin",
  register: "/register",
  logout: "/logout",
  whatsapp: "/whatsapp",
  error404: "/404",
} as const;

export const galacticMenuRouteAliases: Record<string, string> = {
  home: galacticRoutes.home,
  "home default": galacticRoutes.home,
  "home esports": galacticRoutes.home,
  tournament: galacticRoutes.tarkamSchedule,
  "upcoming matches": galacticRoutes.matchSchedule,
  "stream schedule": galacticRoutes.tarkamSchedule,
  "match details": galacticRoutes.matchSchedule,
  "player details": galacticRoutes.clubs,
  "team details": galacticRoutes.clubs,
  pages: galacticRoutes.home,
  "about us": galacticRoutes.home,
  "our gamers": galacticRoutes.clubs,
  sponsors: galacticRoutes.sponsors,
  "sponsor leaderboard": galacticRoutes.sponsorLeaderboard,
  "global leaderboard": galacticRoutes.globalLeaderboard,
  "club leaderboard": galacticRoutes.clubLeaderboard,
  "male leaderboard": galacticRoutes.maleLeaderboard,
  "female leaderboard": galacticRoutes.femaleLeaderboard,
  "help & faq's": galacticRoutes.helpCenter,
  "help & faqs": galacticRoutes.helpCenter,
  shop: galacticRoutes.shop,
  "shop grid": galacticRoutes.shop,
  "shop details": galacticRoutes.shop,
  "add to cart page": galacticRoutes.cart,
  "checkout page": galacticRoutes.checkout,
  blog: galacticRoutes.news,
  news: galacticRoutes.news,
  "grid layout": galacticRoutes.news,
  "classic layout": galacticRoutes.news,
  "blog details": galacticRoutes.news,
  "news details": galacticRoutes.news,
  contact: galacticRoutes.contact,
};

export type NewsCategoryWidgetItem = {
  id?: number | string;
  title: string;
  slug: string;
  count?: number;
  path: string;
};

export type NewsTagWidgetItem = {
  label: string;
  slug: string;
  path: string;
};

const normalizeRouteParam = (value: number | string) => encodeURIComponent(String(value).trim());

export const buildTarkamDetailPath = (value: number | string) =>
  `${galacticRoutes.tarkamDetail}${normalizeRouteParam(value)}`;

export const buildMatchDetailPath = (value: number | string) =>
  `${galacticRoutes.matchDetail}/${normalizeRouteParam(value)}`;

export const buildPlayerDetailPath = (value: number | string) =>
  `${galacticRoutes.playerDetail}/${normalizeRouteParam(value)}`;

export const buildTeamDetailPath = (value: number | string) =>
  `${galacticRoutes.teamDetail}/${normalizeRouteParam(value)}`;

export const buildClubDetailPath = (value: number | string) =>
  `${galacticRoutes.clubDetail}/${normalizeRouteParam(value)}`;

export const buildNewsDetailPath = (value: number | string) =>
  `${galacticRoutes.newsDetail}/${normalizeRouteParam(value)}`;

export const buildShopDetailPath = (value: number | string) =>
  `${galacticRoutes.shopDetail}/${normalizeRouteParam(value)}`;

export const buildNewsCategoryPath = (value: number | string) =>
  `${galacticRoutes.news}/category/${normalizeRouteParam(value)}`;

export const buildNewsTagPath = (value: number | string) =>
  `${galacticRoutes.news}/tag/${normalizeRouteParam(value)}`;

export const buildTarkamScheduleAnchorPath = (value: number | string) =>
  `${galacticRoutes.tarkamSchedule}#tarkam-${normalizeRouteParam(value)}`;

export type MatchItem = {
  id?: number | string;
  leftTeam: string;
  leftLogo: string;
  rightTeam: string;
  rightLogo: string;
  group: string;
  time: string;
  date: string;
  path?: string;
  malePath?: string;
  femalePath?: string;
  leftTeamPath?: string;
  rightTeamPath?: string;
  videoUrl?: string;
  gender?: 'male' | 'female' | 'mixed';
};

export type StreamItem = {
  id?: number | string;
  title: string;
  image: string;
  category: string;
  meta: string;
  videoUrl: string;
  path?: string;
};

export type PlayerItem = {
  id?: number | string;
  name: string;
  game: string;
  image: string;
  speciality: string;
  role: string;
  country: string;
  team: string;
  teamLogo: string;
  about: string;
  path?: string;
  teamPath?: string;
};

export type MemberItem = {
  id?: number | string;
  username?: string;
  nickname?: string;
  slug?: string;
  alias?: string;
  discordUserId?: string;
  phoneNumber?: string;
  tunisiaPhone?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  pictureUrl?: string;
  tier?: string;
  city?: string;
  clubFk?: number;
  clubName?: string;
  clubSlug?: string;
  clubLogo?: string;
  about?: string;
  wins?: number;
  losses?: number;
  tMatches?: number;
  points?: number;
  lifetimePoints?: number;
  sessionPoints?: number;
  sessionReward?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  path?: string;
};

export type ClubTimelineItem = {
  id?: number | string;
  title: string;
  description: string;
  sessionLabel?: string;
  sessionStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ClubSessionItem = {
  id?: number | string;
  sessionFk?: number | string;
  sesi?: number;
  point?: number;
  participant?: string;
  status?: string;
  relationCreatedAt?: string;
  relationUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ClubItem = {
  id?: number | string;
  code?: string;
  slug?: string;
  name?: string;
  logo?: string;
  slogan?: string;
  level?: string;
  points?: number;
  lifetimePoints?: number;
  sessionPoints?: number;
  sessionReward?: number;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  membersCount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  sessions?: ClubSessionItem[];
  timeline?: ClubTimelineItem[];
};

export type ProductItem = {
  id?: number | string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge: string;
  badgeClass: string;
  description: string;
  sku: string;
  tags: string[];
  path?: string;
  gallery?: string[];
  additionalInfo?: string;
};

export type PostItem = {
  id?: number | string;
  title: string;
  category: string;
  image: string;
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  tags: string[];
  path?: string;
  categoryPath?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SponsorItem = {
  image: string;
  name: string;
  url?: string;
  amount?: number;
  message?: string;
  detail?: string;
  memberPicture?: string;
  memberImage?: string;
  memberNickname?: string;
  socialLinks?: Array<{ icon: string; href: string }>;
};

export const brand = {
  name: "Tarkam",
  title: "Tarkam | Fun Group Random Team",
  description:
    "Tarkam adalah komunitas game tempat para pemain berkumpul untuk berkompetisi, streaming, dan menikmati pertarungan tim acak.",
  logo,
  background: "",
  heroImage: gameCharacters,
  contact: {
    location: "in-game",
    email: "mysurellinux@gmail.com",
    phone: "+62 (898) 684-8855",
  },
  socialLinks: [
    { icon: "lab la-facebook-f", label: "Facebook", href: "https://facebook.com/" },
    { icon: "lab la-twitter", label: "Twitter", href: "https://twitter.com/" },
    { icon: "lab la-instagram", label: "Instagram", href: "https://instagram.com/" },
    { icon: "lab la-youtube", label: "YouTube", href: "https://youtube.com/" },
    { icon: "lab la-discord", label: "Discord", href: "https://discord.gg/" },
    { icon: "lab la-whatsapp", label: "WhatsApp", href: "https://wa.me/" },
  ],
};

export const menus: GalacticMenuItem[] = [
  {
    label: "Beranda",
    children: [
      { label: "Beranda", path: galacticRoutes.home },
    ],
  },
  {
    label: "Turnamen",
    children: [
      { label: "Jadwal Tarkam", path: galacticRoutes.tarkamSchedule },
      { label: "Jadwal Pertandingan", path: galacticRoutes.matchSchedule },
      { label: "Detail Pertandingan", path: galacticRoutes.matchSchedule },
    ],
  },
  {
    label: "Leaderboard",
    children: [
      { label: "Sponsor Leaderboard", path: galacticRoutes.sponsorLeaderboard },
      { label: "Global Leaderboard", path: galacticRoutes.globalLeaderboard },
      { label: "Club Leaderboard", path: galacticRoutes.clubLeaderboard },
      { label: "Male Leaderboard", path: galacticRoutes.maleLeaderboard },
      { label: "Female Leaderboard", path: galacticRoutes.femaleLeaderboard },
    ],
  },
  {
    label: "Klub",
    path: galacticRoutes.clubs,
  },
  {
    label: "News",
    path: galacticRoutes.news,
  },
  {
    label: "Shop",
    path: galacticRoutes.shop,
  },
  { label: "Sponsor", path: galacticRoutes.sponsors },
];

export const streams: StreamItem[] = [
  {
    title: "Siaran Final Rocket League",
    image: videoThumb1,
    category: "Pertandingan Langsung",
    meta: "Kamis 20:00",
    videoUrl: "https://www.youtube.com/watch?v=tv7LfFeamsc",
  },
  {
    title: "Showmatch Valorant Bareng Caster Pro",
    image: videoThumb2,
    category: "Siaran Unggulan",
    meta: "Jumat 21:00",
    videoUrl: "https://www.youtube.com/watch?v=tv7LfFeamsc",
  },
  {
    title: "Malam Review Taktik Counter Strike",
    image: videoThumb3,
    category: "Stream Komunitas",
    meta: "Sabtu 19:00",
    videoUrl: "https://www.youtube.com/watch?v=tv7LfFeamsc",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Bagaimana cara mendaftar di Tarkam?",
    answer:
      "Anda dapat mendaftar dengan menekan tombol 'Daftar' di pojok kanan atas atau melalui link registrasi yang tersedia di menu navigasi.",
  },
  {
    question: "Bagaimana cara bergabung dengan tim (Gabung Tim Kami)?",
    answer:
      "Kirimkan formulir kontak Anda melalui menu 'Gabung Tim Kami'. Cantumkan role yang diinginkan, platform bermain, dan riwayat match terbaru Anda. Tim rekrutmen kami akan meninjau profil Anda.",
  },
  {
    question: "Bagaimana cara menghapus data saya?",
    answer:
      "Silakan merujuk pada halaman Ketentuan Penghapusan Data untuk prosedur lengkapnya.",
  },
  {
    question: "Di mana saya bisa melihat jadwal turnamen?",
    answer:
      "Semua jadwal kompetisi tersedia di menu TURNAMEN. Anda dapat melihat jadwal mendatang, detail pertandingan, dan hasil pertandingan sebelumnya di sana.",
  },
  {
    question: "Apakah ada turnamen komunitas setiap minggu?",
    answer:
      "Ya, Tarkam rutin mengadakan turnamen komunitas. Pantau halaman berita atau media sosial kami untuk pengumuman terbaru.",
  },
  {
    question: "Apa itu sistem Leaderboard?",
    answer:
      "Leaderboard mencatat prestasi pemain dan klub secara global. Kami memiliki kategori Leaderboard Sponsor, Global, Klub, Male, dan Female.",
  },
  {
    question: "Apa itu Klub di Tarkam?",
    answer:
      "Klub di Tarkam adalah komunitas pemain yang berkumpul berdasarkan minat atau tujuan yang sama dalam bermain game.",
  },
  {
    question: "Bagaimana cara bergabung ke Server Discord atau Grup WhatsApp?",
    answer:
      "Anda dapat menemukan tautan untuk bergabung dengan Server Discord dan Grup WhatsApp kami di bagian bawah halaman utama atau di menu kontak.",
  },
  {
    question: "Bagaimana cara menjadi sponsor atau partner?",
    answer:
      "Kami selalu terbuka untuk kolaborasi. Silakan hubungi tim support kami melalui email di bawah untuk proposal kemitraan.",
  },
  {
    question: "Hubungi Kami",
    answer:
      "Jika Anda tidak menemukan jawaban yang Anda cari, tim dukungan kami siap membantu. Silakan hubungi kami melalui email di bawah atau kunjungi halaman kontak untuk informasi lebih lanjut.",
  },
];
