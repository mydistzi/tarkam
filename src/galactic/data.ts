import bodyBg from "@/assets/images/body-bg.jpg";
import client1 from "@/assets/images/client-1.png";
import client2 from "@/assets/images/client-2.png";
import client3 from "@/assets/images/client-3.png";
import client4 from "@/assets/images/client-4.png";
import client5 from "@/assets/images/client-5.png";
import client6 from "@/assets/images/client-6.png";
import gameCharacters from "@/assets/images/game-charecters.png";
import logo from "@/assets/images/logo.png";
import post1 from "@/assets/images/post-1.jpg";
import post2 from "@/assets/images/post-2.jpg";
import post3 from "@/assets/images/post-3.jpg";
import product1 from "@/assets/images/product-1.png";
import product2 from "@/assets/images/product-2.png";
import product3 from "@/assets/images/product-3.png";
import product4 from "@/assets/images/product-4.png";
import product5 from "@/assets/images/product-5.png";
import team1 from "@/assets/images/team-1.png";
import team2 from "@/assets/images/team-2.png";
import team3 from "@/assets/images/team-3.png";
import team4 from "@/assets/images/team-4.png";
import team5 from "@/assets/images/team-5.png";
import teamLogo1 from "@/assets/images/team-logo-1.png";
import teamLogo2 from "@/assets/images/team-logo-2.png";
import teamLogo3 from "@/assets/images/team-logo-3.png";
import teamLogo4 from "@/assets/images/team-logo-4.png";
import teamLogo5 from "@/assets/images/team-logo-5.png";
import teamLogo6 from "@/assets/images/team-logo-6.png";
import videoThumb1 from "@/assets/images/video-thumb-1.jpg";
import videoThumb2 from "@/assets/images/video-thumb-2.jpg";
import videoThumb3 from "@/assets/images/video-thumb-3.jpg";

export type GalacticMenuItem = {
  label: string;
  path?: string;
  children?: GalacticMenuItem[];
};

export const galacticRoutes = {
  home: "/",
  tarkamSchedule: "/tarkam-schedule",
  tarkamDetail: "/detail-tarkam",
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
  `${galacticRoutes.tarkamDetail}/${normalizeRouteParam(value)}`;

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
  status?: string;
  image?: string;
  path?: string;
};

type ClubTimelineItem = {
  label: string;
  value: string;
};

export type ClubItem = {
  id?: number | string;
  code?: string;
  slug?: string;
  name?: string;
  logo?: string;
  level?: string;
  points?: number;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  membersCount?: number;
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
  background: bodyBg,
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
      { label: "Sponsor Leaderboard", path: galacticRoutes.sponsors },
      { label: "Global Leaderboard", path: galacticRoutes.clubs },
      { label: "Club Leaderboard", path: galacticRoutes.sponsors },
      { label: "Male Leaderboard", path: galacticRoutes.helpCenter },
      { label: "Female Leaderboard", path: galacticRoutes.error404 },
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

export const matches: MatchItem[] = [
  {
    leftTeam: "Purple Death Cadets",
    leftLogo: teamLogo1,
    rightTeam: "Trigger Brain Squad",
    rightLogo: teamLogo2,
    group: "Grup 04 | Pertandingan 06",
    time: "10:00",
    date: "25 Mei 2024",
  },
  {
    leftTeam: "The Black Hat Hackers",
    leftLogo: teamLogo3,
    rightTeam: "Your Worst Nightmare",
    rightLogo: teamLogo4,
    group: "Grup 05 | Pertandingan 02",
    time: "12:30",
    date: "10 Jan 2024",
  },
  {
    leftTeam: "Witches and Quizards",
    leftLogo: teamLogo5,
    rightTeam: "Resting Bitch Faces",
    rightLogo: teamLogo6,
    group: "Grup 02 | Pertandingan 03",
    time: "04:20",
    date: "15 Des 2024",
  },
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

export const players: PlayerItem[] = [
  {
    name: "Brandon Larned",
    game: "Overwatch",
    image: team1,
    speciality: "Penyerang Cepat",
    role: "Kapten Tim",
    country: "Amerika Serikat",
    team: "Purple Death Cadets",
    teamLogo: teamLogo1,
    about:
      "Brandon pegang rotasi cepat, bikin squad tetap kalem di bawah tekanan, dan nutup ronde dengan tempo meledak.",
  },
  {
    name: "Felix Lengyel",
    game: "Valorant",
    image: team2,
    speciality: "Entry Fragger",
    role: "Duelis Utama",
    country: "Kanada",
    team: "Trigger Brain Squad",
    teamLogo: teamLogo2,
    about:
      "Felix adalah penyulut roster, gabungin mekanik berisiko tinggi dengan timing dan spacing yang paham banget.",
  },
  {
    name: "Sasha Hostyn",
    game: "StarCraft II",
    image: team3,
    speciality: "Kontrol Makro",
    role: "Strategi",
    country: "Kanada",
    team: "The Black Hat Hackers",
    teamLogo: teamLogo3,
    about:
      "Sasha pegang strategi jarak jauh, ngerjain scrim detail, dan ubah kontrol map jadi kemenangan tim yang bisa diulang.",
  },
  {
    name: "Zaqueri Black",
    game: "Call of Duty",
    image: team4,
    speciality: "Pemain Objektif",
    role: "Flex",
    country: "Inggris",
    team: "Your Worst Nightmare",
    teamLogo: teamLogo4,
    about:
      "Zaqueri paling jago adjust saat tengah ronde dan ubah chaos jadi push koordinasi buat seluruh lineup.",
  },
  {
    name: "Fredrik Johanson",
    game: "Counter Strike",
    image: team5,
    speciality: "Penyelamat",
    role: "AWPer",
    country: "Swedia",
    team: "Resting Bitch Faces",
    teamLogo: teamLogo6,
    about:
      "Fredrik bawa mekanik tenang dan kontrol sightline elite, bikin dia pemain terakhir yang musuh pengen lawan di clutch.",
  },
];

export const sponsors: SponsorItem[] = [
  { image: client1, name: "Sponsor 1", url: "#" },
  { image: client2, name: "Sponsor 2", url: "#" },
  { image: client3, name: "Sponsor 3", url: "#" },
  { image: client4, name: "Sponsor 4", url: "#" },
  { image: client5, name: "Sponsor 5", url: "#" },
  { image: client6, name: "Sponsor 6", url: "#" },
];

export const products: ProductItem[] = [
  {
    name: "Steering Wheel",
    category: "Kemudi",
    image: product1,
    price: 69,
    badge: "Tersedia",
    badgeClass: "in-stock",
    description:
      "Setir balap presisi buat sesi simulasi, turnamen malam, dan latihan yang butuh nyaman plus kontrol.",
    sku: "GLX-SW-001",
    tags: ["Balap", "Esports", "Kontroler"],
  },
  {
    name: "Fantech Mouse",
    category: "Mouse",
    image: product2,
    price: 49,
    badge: "Laris",
    badgeClass: "hot",
    description:
      "Cangkang super ringan, switch kelas turnamen, dan tracking responsif buat pemain FPS yang flick dengan pede.",
    sku: "GLX-MS-002",
    tags: ["Mouse", "FPS", "Gear"],
  },
  {
    name: "Targus Console",
    category: "Konsol",
    image: product3,
    price: 39,
    oldPrice: 129,
    badge: "-70%",
    badgeClass: "sale",
    description:
      "Konsol compact buat ruang latihan, lounge, dan jeda scrim tim antar event.",
    sku: "GLX-CS-003",
    tags: ["Konsol", "Lounge", "Streaming"],
  },
  {
    name: "Xbox Controller",
    category: "Kontroler",
    image: product4,
    price: 19,
    badge: "Laris",
    badgeClass: "hot",
    description:
      "Kontroler serba bisa yang nyaman, trigger andal, dan grip stabil walau main lama.",
    sku: "GLX-CT-004",
    tags: ["Kontroler", "Konsol", "Aksi"],
  },
  {
    name: "Ergonomic Chair",
    category: "Kursi",
    image: product5,
    price: 39,
    badge: "Habis",
    badgeClass: "out-stock",
    description:
      "Kursi gaming dukungan maksimal buat hari match maraton dengan sudut bisa diatur, bantalan lumbar, dan kain bernapas.",
    sku: "GLX-CH-005",
    tags: ["Kursi", "Nyaman", "Setup"],
  },
];

export const posts: PostItem[] = [
  {
    title: "Cara mulai startup dalam hitungan hari.",
    category: "Bisnis",
    image: post1,
    date: "Jan 01 2022",
    author: "Elliot Alderson",
    excerpt:
      "Ahli finansial bantu kamu cari cara terbaik buat ngumpulin dana dengan lebih efektif.",
    content: [
      "Galactic tetap pegang tone editorial aslinya, gabungin budaya esports dengan headline bisnis dan update komunitas.",
      "Artikel ini nunjukin gimana layout long-form tampil dengan imagery, kutipan sorotan, navigasi, kotak penulis, dan komentar.",
      "Pakai halaman template sekitarnya buat preview feel hub konten jadi lengkap saat setiap route udah tampil.",
    ],
    tags: ["Bisnis", "Startup", "Esports"],
  },
  {
    title: "Ahli finansial bantu kamu cari tahu.",
    category: "Startup",
    image: post2,
    date: "Jan 01 2022",
    author: "Elliot Alderson",
    excerpt:
      "Perencanaan detail, partner cerdas, dan pendapatan berkelanjutan tetap jadi tulang punggung tim gaming yang tumbuh cepat.",
    content: [
      "Layout posting klasik ngasih ruang gambar lebih besar dan narasi panjang buat sponsor, rekap, atau komentar event.",
      "Konten di sini tetap mudah dibaca dan seimbang supaya halaman terasa lengkap sekaligus mandiri dari data API live.",
      "Setiap blok artikel nyambung ke folder aset lokal yang sama, bikin build tetap self-contained dan sesuai desain asli.",
    ],
    tags: ["Finansial", "Startup", "Pertumbuhan"],
  },
  {
    title: "Bisnis inovatif di seluruh dunia.",
    category: "Finansial",
    image: post3,
    date: "Jan 01 2022",
    author: "Elliot Alderson",
    excerpt:
      "Organisasi esports makin kuat saat konten, turnamen, merch, dan program komunitas saling menguatkan.",
    content: [
      "Tim global makin bangun ekosistem ketimbang cuma roster tunggal, dan struktur template ini dirancang buat nunjukin cerita brand penuh.",
      "Dari sponsor sampai kartu pemain sampai halaman produk, setiap route bantu tampilkan narasi organisasi gaming yang lebih luas dan rapi.",
      "Itu bikin kit Galactic berguna sebagai demo site lengkap, bukan cuma landing page doang.",
    ],
    tags: ["Finansial", "Inovasi", "Global"],
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

export const cartItems = [
  { product: products[0], quantity: 1 },
  { product: products[1], quantity: 2 },
];

export const reviewAuthors = [
  { name: "Alice Morgan", date: "March 22, 2026", image: team1 },
  { name: "Jordan Cruz", date: "March 28, 2026", image: team2 },
];
