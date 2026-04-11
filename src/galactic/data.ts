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
};

export const brand = {
  name: "Tarkam",
  title: "Tarkam | Template HTML5 eSports dan Gaming",
  description:
    "Tarkam jadi showcase eSports dengan halaman lengkap buat turnamen, streaming, profil roster, toko, blog, dan kontak.",
  logo,
  background: bodyBg,
  heroImage: gameCharacters,
  contact: {
    location: "153 Williamson Plaza, Maggieberg, MT 09514",
    email: "Info@YourGmail24.com",
    phone: "+1 (062) 109-9222",
  },
  socialLinks: [
    { icon: "lab la-facebook-f", label: "Facebook", href: "#" },
    { icon: "lab la-twitter", label: "Twitter", href: "#" },
    { icon: "lab la-instagram", label: "Instagram", href: "#" },
    { icon: "lab la-youtube", label: "YouTube", href: "#" },
  ],
};

export const menus: GalacticMenuItem[] = [
  {
    label: "Beranda",
    children: [
      { label: "Beranda Utama", path: "/" },
      { label: "Beranda eSports", path: "/index-2" },
    ],
  },
  {
    label: "Turnamen",
    children: [
      { label: "Pertandingan Mendatang", path: "/upcoming-matches" },
      { label: "Jadwal Streaming", path: "/stream-schedule" },
      { label: "Detail Pertandingan", path: "/match-details" },
      { label: "Detail Pemain", path: "/player-details" },
      { label: "Detail Tim", path: "/team-details" },
    ],
  },
  {
    label: "Halaman",
    children: [
      { label: "Tentang Kami", path: "/about" },
      { label: "Para Gamer Kami", path: "/our-gamers" },
      { label: "Sponsor", path: "/sponsors" },
      { label: "Bantuan & FAQ", path: "/faq-page" },
      { label: "404", path: "/404" },
    ],
  },
  {
    label: "Toko",
    children: [
      { label: "Toko", path: "/shop" },
      { label: "Detail Produk", path: "/shop-details" },
      { label: "Keranjang", path: "/cart" },
      { label: "Pembayaran", path: "/checkout" },
    ],
  },
  {
    label: "Blog",
    children: [
      { label: "Grid", path: "/blog-grid" },
      { label: "Klasik", path: "/blog-classic" },
      { label: "Detail Artikel", path: "/blog-details" },
    ],
  },
  { label: "Kontak", path: "/contact" },
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
    question: "Gimana cara gabung roster Galactic?",
    answer:
      "Kirim form kontak, cantumkan role yang diinginkan, platform, dan riwayat match terbaru, lalu tim rekrutmen kami bakal cek aplikasimu.",
  },
  {
    question: "Apa kalian gelar turnamen komunitas tiap bulan?",
    answer:
      "Iya, jadwal showcase nunjukin bracket bulanan, scrim bertema, dan event fan supaya mirip template turnamen aslinya.",
  },
  {
    question: "Bisa nggak jadi sponsor atau partner afiliasi?",
    answer:
      "Sponsor bisa hubungi tim partnership lewat halaman kontak untuk minta deck, media kit, dan opsi kampanye musiman.",
  },
  {
    question: "Game apa aja yang tim ikut sekarang?",
    answer:
      "Roster contoh ini mencakup Overwatch, Valorant, StarCraft II, Call of Duty, dan Counter Strike supaya variasi halaman tetap seru.",
  },
  {
    question: "Ada toko gear gaming resmi nggak?",
    answer:
      "Iya, halaman toko punya katalog lengkap, detail produk, alur keranjang, dan layout checkout yang dibangun dengan aset tema yang sama.",
  },
  {
    question: "Di mana bisa nonton stream live Galactic?",
    answer:
      "Gunakan bagian streaming di beranda atau halaman jadwal streaming untuk lihat siaran unggulan dan rekaman showcase.",
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
