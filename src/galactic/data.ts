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
  title: "Tarkam | eSports and Gaming HTML5 Template",
  description:
    "Tarkam eSports showcase with complete pages for tournaments, streams, roster profiles, shop, blog, and contact.",
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
    label: "Home",
    children: [
      { label: "Home Default", path: "/" },
      { label: "Home eSports", path: "/index-2" },
    ],
  },
  {
    label: "Tournament",
    children: [
      { label: "Upcoming Matches", path: "/upcoming-matches" },
      { label: "Stream Schedule", path: "/stream-schedule" },
      { label: "Match Details", path: "/match-details" },
      { label: "Player Details", path: "/player-details" },
      { label: "Team Details", path: "/team-details" },
    ],
  },
  {
    label: "Pages",
    children: [
      { label: "About Us", path: "/about" },
      { label: "Our Gamers", path: "/our-gamers" },
      { label: "Sponsors", path: "/sponsors" },
      { label: "Help & Faq's", path: "/faq-page" },
      { label: "404 Error", path: "/404" },
    ],
  },
  {
    label: "Shop",
    children: [
      { label: "Shop Grid", path: "/shop" },
      { label: "Shop Details", path: "/shop-details" },
      { label: "Add to Cart Page", path: "/cart" },
      { label: "Checkout Page", path: "/checkout" },
    ],
  },
  {
    label: "Blog",
    children: [
      { label: "Grid Layout", path: "/blog-grid" },
      { label: "Classic Layout", path: "/blog-classic" },
      { label: "Blog Details", path: "/blog-details" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

export const matches: MatchItem[] = [
  {
    leftTeam: "Purple Death Cadets",
    leftLogo: teamLogo1,
    rightTeam: "Trigger Brain Squad",
    rightLogo: teamLogo2,
    group: "Group 04 | Match 06th",
    time: "10:00",
    date: "25TH May 2024",
  },
  {
    leftTeam: "The Black Hat Hackers",
    leftLogo: teamLogo3,
    rightTeam: "Your Worst Nightmare",
    rightLogo: teamLogo4,
    group: "Group 05 | Match 02nd",
    time: "12:30",
    date: "10TH Jan 2024",
  },
  {
    leftTeam: "Witches and Quizards",
    leftLogo: teamLogo5,
    rightTeam: "Resting Bitch Faces",
    rightLogo: teamLogo6,
    group: "Group 02 | Match 03rd",
    time: "04:20",
    date: "15TH Dec 2024",
  },
];

export const streams: StreamItem[] = [
  {
    title: "Rocket League Grand Finals Broadcast",
    image: videoThumb1,
    category: "Live Match",
    meta: "Thursday 08 PM",
    videoUrl: "https://www.youtube.com/watch?v=tv7LfFeamsc",
  },
  {
    title: "Valorant Showmatch With Pro Casters",
    image: videoThumb2,
    category: "Featured Stream",
    meta: "Friday 09 PM",
    videoUrl: "https://www.youtube.com/watch?v=tv7LfFeamsc",
  },
  {
    title: "Counter Strike Tactical Review Night",
    image: videoThumb3,
    category: "Community Stream",
    meta: "Saturday 07 PM",
    videoUrl: "https://www.youtube.com/watch?v=tv7LfFeamsc",
  },
];

export const players: PlayerItem[] = [
  {
    name: "Brandon Larned",
    game: "Overwatch",
    image: team1,
    speciality: "Flanker",
    role: "Team Captain",
    country: "United States",
    team: "Purple Death Cadets",
    teamLogo: teamLogo1,
    about:
      "Brandon leads fast-paced rotations, keeps the squad composed under pressure, and closes rounds with explosive tempo swings.",
  },
  {
    name: "Felix Lengyel",
    game: "Valorant",
    image: team2,
    speciality: "Entry Fragger",
    role: "Main Duelist",
    country: "Canada",
    team: "Trigger Brain Squad",
    teamLogo: teamLogo2,
    about:
      "Felix is the spark plug of the roster, combining high-risk mechanics with a deep understanding of timing and spacing.",
  },
  {
    name: "Sasha Hostyn",
    game: "StarCraft II",
    image: team3,
    speciality: "Macro Control",
    role: "Strategist",
    country: "Canada",
    team: "The Black Hat Hackers",
    teamLogo: teamLogo3,
    about:
      "Sasha anchors long-form strategy, reviews scrims obsessively, and translates map control into repeatable team wins.",
  },
  {
    name: "Zaqueri Black",
    game: "Call of Duty",
    image: team4,
    speciality: "Objective Play",
    role: "Flex",
    country: "United Kingdom",
    team: "Your Worst Nightmare",
    teamLogo: teamLogo4,
    about:
      "Zaqueri thrives in mid-round adjustments and turns chaotic engagements into coordinated pushes for the whole lineup.",
  },
  {
    name: "Fredrik Johanson",
    game: "Counter Strike",
    image: team5,
    speciality: "Clutching",
    role: "AWPer",
    country: "Sweden",
    team: "Resting Bitch Faces",
    teamLogo: teamLogo6,
    about:
      "Fredrik brings calm mechanics and elite sightline control, making him the last player opponents want alive in a clutch.",
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
    category: "Steering",
    image: product1,
    price: 69,
    badge: "In Stock",
    badgeClass: "in-stock",
    description:
      "A precision racing wheel built for sim sessions, night tournaments, and practice blocks that need comfort and control.",
    sku: "GLX-SW-001",
    tags: ["Racing", "Esports", "Controller"],
  },
  {
    name: "Fantech Mouse",
    category: "Mouse",
    image: product2,
    price: 49,
    badge: "Hot",
    badgeClass: "hot",
    description:
      "Ultra-light shell, tournament-grade switches, and quick response tracking for FPS players who flick with confidence.",
    sku: "GLX-MS-002",
    tags: ["Mouse", "FPS", "Gear"],
  },
  {
    name: "Targus Console",
    category: "Console",
    image: product3,
    price: 39,
    oldPrice: 129,
    badge: "-70%",
    badgeClass: "sale",
    description:
      "Compact entertainment console designed for training rooms, lounge spaces, and team scrim downtime between events.",
    sku: "GLX-CS-003",
    tags: ["Console", "Lounge", "Streaming"],
  },
  {
    name: "Xbox Controller",
    category: "Controller",
    image: product4,
    price: 19,
    badge: "Hot",
    badgeClass: "hot",
    description:
      "A comfortable all-round controller with reliable triggers and grip texture that stays stable through long sessions.",
    sku: "GLX-CT-004",
    tags: ["Controller", "Console", "Action"],
  },
  {
    name: "Ergonomic Chair",
    category: "Chair",
    image: product5,
    price: 39,
    badge: "Out Of Stock",
    badgeClass: "out-stock",
    description:
      "Supportive gaming chair tuned for marathon match days with adjustable angles, lumbar support, and breathable fabric.",
    sku: "GLX-CH-005",
    tags: ["Chair", "Comfort", "Setup"],
  },
];

export const posts: PostItem[] = [
  {
    title: "How to start initiating an startup in few days.",
    category: "Business",
    image: post1,
    date: "Jan 01 2022",
    author: "Elliot Alderson",
    excerpt:
      "Financial experts support or help you to find out which way you can raise your funds more effectively.",
    content: [
      "Galactic keeps the same editorial tone as the original template, mixing esports culture with business-minded headlines and community updates.",
      "This article shows how the long-form layout behaves with featured imagery, highlighted quotes, navigation, author boxes, and comments.",
      "Use the surrounding template pages to preview how a finished content hub feels when every route is fully presented.",
    ],
    tags: ["Business", "Startup", "Esports"],
  },
  {
    title: "Financial experts support help you to find out.",
    category: "Startup",
    image: post2,
    date: "Jan 01 2022",
    author: "Elliot Alderson",
    excerpt:
      "Detailed planning, smart partner choices, and sustainable revenue are still the backbone of high-growth gaming teams.",
    content: [
      "The classic post layout emphasizes larger imagery and more room for narrative sections that can support sponsors, recaps, or event commentary.",
      "The content here stays readable and balanced so the page feels complete while remaining independent from any live API data.",
      "Every article block is wired to the same local assets folder, keeping the build self-contained and aligned with the original design system.",
    ],
    tags: ["Finance", "Startup", "Growth"],
  },
  {
    title: "Innovative business all over the world.",
    category: "Finance",
    image: post3,
    date: "Jan 01 2022",
    author: "Elliot Alderson",
    excerpt:
      "Esports organizations thrive when content, tournaments, merch, and community programs reinforce each other consistently.",
    content: [
      "Global teams increasingly build ecosystems instead of single rosters, and this template structure is designed to showcase that full brand story.",
      "From sponsors to player cards to product pages, each route helps present a broader, more polished gaming organization narrative.",
      "That makes the Galactic kit useful as a complete demo site, not just a single landing page.",
    ],
    tags: ["Finance", "Innovation", "Global"],
  },
];

export const faqs: FaqItem[] = [
  {
    question: "How do I join the Galactic roster?",
    answer:
      "Submit the contact form, include your preferred title, platform, and recent match history, then our recruitment team will review the application.",
  },
  {
    question: "Do you host community tournaments every month?",
    answer:
      "Yes, the showcase schedule highlights monthly brackets, themed scrims, and fan events to mirror the original tournament-driven template.",
  },
  {
    question: "Can I become a sponsor or affiliate partner?",
    answer:
      "Sponsors can reach the partnership team through the contact page to request a deck, media kit, and seasonal campaign options.",
  },
  {
    question: "What games does the team currently compete in?",
    answer:
      "The sample roster covers Overwatch, Valorant, StarCraft II, Call of Duty, and Counter Strike to keep the page variety close to the template.",
  },
  {
    question: "Is there a shop for official gaming gear?",
    answer:
      "Yes, the shop pages include a full catalog, product details, cart flow, and checkout layout built with the existing theme assets.",
  },
  {
    question: "Where can I watch Galactic live streams?",
    answer:
      "Use the home page streaming section or the dedicated stream schedule page to explore featured broadcasts and recorded showcase entries.",
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
