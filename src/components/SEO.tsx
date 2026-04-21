import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  brand,
  buildClubDetailPath,
  buildTarkamDetailPath,
  buildTeamDetailPath,
  faqs as fallbackFaqs,
  galacticRoutes,
} from "@/galactic/data";
import { useGalacticContent } from "@/views/galactic/shared";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildOrganizationEntitySchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildProductSchema,
  buildSportsEventSchema,
  buildSportsTeamSchema,
  buildWebPageSchema,
  buildWebsiteSchema,
  dedupeStructuredData,
  normalizeSiteUrl,
  stripHtmlText,
  toAbsoluteUrl,
  type StructuredDataInput,
} from "@/lib/structuredData";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  siteName?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  articleSection?: string;
  articleTag?: string[];
  structuredData?: StructuredDataInput;
}

const normalizePath = (value?: string) => {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "/";
  }

  if (normalized === "/") {
    return normalized;
  }

  return normalized.replace(/\/+$/, "") || "/";
};

const ROUTE_LABELS: Array<{ test: (pathname: string) => boolean; label: string }> = [
  { test: (pathname) => pathname === galacticRoutes.home, label: "Beranda" },
  { test: (pathname) => pathname === galacticRoutes.tarkamSchedule, label: "Jadwal Tarkam" },
  { test: (pathname) => pathname.startsWith("/detail-tarkam/"), label: "Detail Tarkam" },
  { test: (pathname) => pathname === galacticRoutes.matchSchedule, label: "Jadwal Pertandingan" },
  { test: (pathname) => pathname.startsWith("/detail-pertandingan/"), label: "Detail Pertandingan" },
  { test: (pathname) => pathname.startsWith("/detail-player/"), label: "Detail Player" },
  { test: (pathname) => pathname.startsWith("/detail-tim/"), label: "Detail Tim" },
  { test: (pathname) => pathname === galacticRoutes.clubs, label: "Klub" },
  { test: (pathname) => pathname.startsWith("/detail-klub/"), label: "Detail Klub" },
  { test: (pathname) => pathname === galacticRoutes.news, label: "News" },
  { test: (pathname) => pathname.startsWith("/news/category/"), label: "Kategori News" },
  { test: (pathname) => pathname.startsWith("/news/tag/"), label: "Tag News" },
  { test: (pathname) => pathname.startsWith("/detail-news/"), label: "Detail News" },
  { test: (pathname) => pathname === galacticRoutes.shop, label: "Toko" },
  { test: (pathname) => pathname.startsWith("/detail-shop/"), label: "Detail Produk" },
  { test: (pathname) => pathname === galacticRoutes.sponsors, label: "Sponsor" },
  { test: (pathname) => pathname === galacticRoutes.sponsorLeaderboard, label: "Sponsor Leaderboard" },
  { test: (pathname) => pathname === galacticRoutes.globalLeaderboard, label: "Global Leaderboard" },
  { test: (pathname) => pathname === galacticRoutes.clubLeaderboard, label: "Club Leaderboard" },
  { test: (pathname) => pathname === galacticRoutes.maleLeaderboard, label: "Male Leaderboard" },
  { test: (pathname) => pathname === galacticRoutes.femaleLeaderboard, label: "Female Leaderboard" },
  { test: (pathname) => pathname === galacticRoutes.helpCenter, label: "Pusat Bantuan" },
  { test: (pathname) => pathname === galacticRoutes.privacyPolicy, label: "Kebijakan Privasi" },
  { test: (pathname) => pathname === galacticRoutes.commentPolicy, label: "Kebijakan Komentar" },
  { test: (pathname) => pathname === galacticRoutes.terms, label: "Syarat dan Ketentuan" },
  { test: (pathname) => pathname === galacticRoutes.acceptableUse, label: "Ketentuan Penggunaan" },
  { test: (pathname) => pathname === galacticRoutes.dataDeletion, label: "Ketentuan Penghapusan Data" },
  { test: (pathname) => pathname === galacticRoutes.contact, label: "Hubungi Kami" },
  { test: (pathname) => pathname === galacticRoutes.cart, label: "Keranjang" },
  { test: (pathname) => pathname === galacticRoutes.checkout, label: "Checkout" },
  { test: (pathname) => pathname === galacticRoutes.signIn, label: "Masuk" },
  { test: (pathname) => pathname === galacticRoutes.register, label: "Daftar" },
  { test: (pathname) => pathname === galacticRoutes.whatsapp, label: "WhatsApp" },
];

const availabilityForProduct = (badge?: string, badgeClass?: string) => {
  const text = `${badge || ""} ${badgeClass || ""}`.toLowerCase();
  return /habis|sold out|out-stock/.test(text)
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";
};

const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  keywords = [],
  siteName,
  twitterCard = "summary_large_image",
  articleSection,
  articleTag = [],
  structuredData,
}: SEOProps) => {
  const location = useLocation();
  const {
    meta,
    newsRecords,
    productRecords,
    playerRecords,
    teams,
    matchRecords,
    clubs,
    sponsors,
    tarkams,
    faqs,
  } = useGalacticContent();

  const fallbackSiteUrl =
    typeof window !== "undefined" ? window.location.origin : "https://tarkam.fun";
  const normalizedPathname = normalizePath(location.pathname);
  const siteUrl = normalizeSiteUrl(meta.siteUrl, fallbackSiteUrl);
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const defaultTitle = "TARKAM | Streaming dan WAR";
  const defaultDescription =
    "Komunitas Tarkam, gameplay, dan rewards. Gabung untuk pengalaman gaming yang seru dan fun.";
  const siteDisplayName = siteName || meta.siteName || brand.name;
  const siteDescription = meta.description || brand.description || defaultDescription;
  const siteLogo = toAbsoluteUrl(meta.logoUrl || brand.logo || "/logo.png", siteUrl);
  const pageUrl = toAbsoluteUrl(url || currentPath, siteUrl) || siteUrl;
  const pageImage = toAbsoluteUrl(image || meta.logoUrl || "/logo.png", siteUrl) || siteLogo;
  const pageTitle = title || defaultTitle;
  const pageDescription = description || siteDescription || defaultDescription;
  const fullTitle = title ? `${title} | ${siteDisplayName}` : defaultTitle;
  const keywordsString =
    keywords.length > 0
      ? keywords.join(", ")
      : meta.keywords?.length
        ? meta.keywords.join(", ")
        : "tarkam, gaming, streaming, komunitas, esports";
  const pageAuthor = author || meta.author || "dist" || siteDisplayName;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const pageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const matchedNewsRecord = useMemo(
    () => newsRecords.find((item) => normalizePath(item.item.path) === normalizedPathname),
    [newsRecords, normalizedPathname],
  );
  const matchedProductRecord = useMemo(
    () => productRecords.find((item) => normalizePath(item.item.path) === normalizedPathname),
    [productRecords, normalizedPathname],
  );
  const matchedPlayerRecord = useMemo(
    () => playerRecords.find((item) => normalizePath(item.item.path) === normalizedPathname),
    [playerRecords, normalizedPathname],
  );
  const matchedTeamRecord = useMemo(
    () => teams.find((item) => normalizePath(item.teamPath) === normalizedPathname),
    [teams, normalizedPathname],
  );
  const matchedMatchRecord = useMemo(
    () => matchRecords.find((item) => normalizePath(item.item.path) === normalizedPathname),
    [matchRecords, normalizedPathname],
  );
  const matchedClub = useMemo(
    () =>
      clubs.find((item) =>
        normalizePath(buildClubDetailPath(item.slug || item.id || "")) === normalizedPathname,
      ),
    [clubs, normalizedPathname],
  );
  const matchedTarkam = useMemo(() => {
    if (!normalizedPathname.startsWith("/detail-tarkam/")) {
      return undefined;
    }

    const currentSlug = normalizedPathname.split("/").pop()?.replace(/^week-/, "").trim();
    if (!currentSlug) {
      return undefined;
    }

    return tarkams.find(
      (item) => String(item.id) === currentSlug || String(item.week || "").trim() === currentSlug,
    );
  }, [normalizedPathname, tarkams]);

  const breadcrumbItems = (() => {
    const matchedLabel = ROUTE_LABELS.find((item) => item.test(normalizedPathname))?.label;
    const items = [{ name: "Beranda", url: siteUrl }];

    if (normalizedPathname !== "/") {
      items.push({
        name: matchedLabel || title || pageTitle,
        url: pageUrl,
      });
    }

    return items;
  })();

  const autoStructuredData = (() => {
    const nodes: StructuredDataInput[] = [];
    let pageType = "WebPage";
    let mainEntity: unknown;
    const about: unknown = { "@id": organizationId };

    const socialLinks = (meta.socialLinks || brand.socialLinks || [])
      .filter((item) => Boolean(item.href?.trim()) && item.href.trim() !== "#")
      .map((item) => ({
        label: item.label,
        href: toAbsoluteUrl(item.href, siteUrl) || item.href,
      }))
      .filter((item) => /^https?:\/\//i.test(item.href));

    nodes.push(
      buildOrganizationSchema({
        organizationId,
        site: {
          siteName: siteDisplayName,
          siteUrl,
          description: siteDescription,
          author: meta.author,
          email: meta.email,
          phone: meta.phone,
          address: meta.address,
          logoUrl: meta.logoUrl,
          socialLinks,
        },
        logoUrl: siteLogo,
      }),
    );

    nodes.push(
      buildWebsiteSchema({
        websiteId,
        organizationId,
        site: {
          siteName: siteDisplayName,
          siteUrl,
          description: siteDescription,
          socialLinks,
        },
      }),
    );

    nodes.push(
      buildBreadcrumbSchema({
        breadcrumbId,
        pageUrl,
        items: breadcrumbItems,
      }),
    );

    const itemListId = `${pageUrl}#itemlist`;
    const collectionItems =
      normalizedPathname === galacticRoutes.news ||
      normalizedPathname.startsWith("/news/category/") ||
      normalizedPathname.startsWith("/news/tag/")
        ? newsRecords
            .slice(0, 12)
            .map((item) => ({
              name: item.item.title,
              url: toAbsoluteUrl(item.item.path, siteUrl) || pageUrl,
              image: toAbsoluteUrl(item.item.image, siteUrl),
            }))
        : normalizedPathname === galacticRoutes.shop
          ? productRecords
              .slice(0, 12)
              .map((item) => ({
                name: item.item.name,
                url: toAbsoluteUrl(item.item.path, siteUrl) || pageUrl,
                image: toAbsoluteUrl(item.item.image, siteUrl),
              }))
          : normalizedPathname === galacticRoutes.clubs
            ? clubs
                .slice(0, 12)
                .map((item) => ({
                  name: item.name || `Klub ${item.id}`,
                  url:
                    toAbsoluteUrl(buildClubDetailPath(item.slug || item.id || ""), siteUrl) || pageUrl,
                  image: toAbsoluteUrl(item.logo, siteUrl),
                }))
            : normalizedPathname === galacticRoutes.sponsors ||
                normalizedPathname === galacticRoutes.sponsorLeaderboard
              ? sponsors
                  .slice(0, 12)
                  .map((item) => ({
                    name: item.name,
                    url:
                      item.url && /^https?:\/\//i.test(item.url)
                        ? item.url
                        : toAbsoluteUrl(galacticRoutes.sponsors, siteUrl) || pageUrl,
                    image: toAbsoluteUrl(item.image, siteUrl),
                  }))
              : normalizedPathname === galacticRoutes.globalLeaderboard ||
                  normalizedPathname === galacticRoutes.maleLeaderboard ||
                  normalizedPathname === galacticRoutes.femaleLeaderboard
                ? playerRecords
                    .slice(0, 12)
                    .map((item) => ({
                      name: item.item.name,
                      url: toAbsoluteUrl(item.item.path, siteUrl) || pageUrl,
                      image: toAbsoluteUrl(item.item.image, siteUrl),
                    }))
                : normalizedPathname === galacticRoutes.clubLeaderboard
                  ? clubs
                      .slice(0, 12)
                      .map((item) => ({
                        name: item.name || `Klub ${item.id}`,
                        url:
                          toAbsoluteUrl(buildClubDetailPath(item.slug || item.id || ""), siteUrl) ||
                          pageUrl,
                        image: toAbsoluteUrl(item.logo, siteUrl),
                      }))
                  : normalizedPathname === galacticRoutes.matchSchedule
                    ? matchRecords
                        .slice(0, 12)
                        .map((item) => ({
                          name: `${item.item.leftTeam} vs ${item.item.rightTeam}`,
                          url: toAbsoluteUrl(item.item.path, siteUrl) || pageUrl,
                          image: toAbsoluteUrl(item.item.leftLogo || item.item.rightLogo, siteUrl),
                        }))
                    : normalizedPathname === galacticRoutes.tarkamSchedule
                      ? tarkams
                          .slice(0, 12)
                          .map((item) => ({
                            name:
                              item.title || (item.week ? `Tarkam Week ${item.week}` : `Tarkam ${item.id}`),
                            url:
                              toAbsoluteUrl(
                                buildTarkamDetailPath(item.week || item.id || ""),
                                siteUrl,
                              ) || pageUrl,
                            image: toAbsoluteUrl(item.thumbnail || item.image, siteUrl),
                          }))
                      : [];

    if (collectionItems.length > 0) {
      pageType = "CollectionPage";
      nodes.push(
        buildItemListSchema({
          itemListId,
          name: pageTitle,
          items: collectionItems,
        }),
      );
      mainEntity = { "@id": itemListId };
    }

    const articleId = `${pageUrl}#article`;
    const productId = `${pageUrl}#product`;
    const personId = `${pageUrl}#person`;
    const teamId = `${pageUrl}#team`;
    const clubId = `${pageUrl}#club`;
    const eventId = `${pageUrl}#event`;

    if (matchedNewsRecord || type === "article") {
      nodes.push(
        buildArticleSchema({
          articleId,
          pageUrl,
          title: matchedNewsRecord?.item.title || pageTitle,
          description:
            matchedNewsRecord?.item.excerpt || stripHtmlText(pageDescription) || pageDescription,
          imageUrl: toAbsoluteUrl(matchedNewsRecord?.item.image || pageImage, siteUrl) || pageImage,
          authorName: matchedNewsRecord?.item.author || pageAuthor,
          organizationId,
          publishedTime: publishedTime || matchedNewsRecord?.news.created_at,
          modifiedTime: modifiedTime || matchedNewsRecord?.news.updated_at,
          articleSection: articleSection || matchedNewsRecord?.item.category,
          articleTag: articleTag.length ? articleTag : matchedNewsRecord?.item.tags,
        }),
      );
      mainEntity = { "@id": articleId };
    }

    if (matchedProductRecord) {
      nodes.push(
        buildProductSchema({
          productId,
          pageUrl,
          name: matchedProductRecord.item.name,
          description:
            matchedProductRecord.item.description ||
            stripHtmlText(matchedProductRecord.product.description) ||
            pageDescription,
          imageUrl: toAbsoluteUrl(matchedProductRecord.item.image || pageImage, siteUrl) || pageImage,
          category: matchedProductRecord.item.category,
          sku: matchedProductRecord.item.sku,
          price: Number.isFinite(matchedProductRecord.item.price)
            ? matchedProductRecord.item.price
            : undefined,
          availability: availabilityForProduct(
            matchedProductRecord.item.badge,
            matchedProductRecord.item.badgeClass,
          ),
          organizationId,
          tags: matchedProductRecord.item.tags,
        }),
      );
      mainEntity = { "@id": productId };
    }

    if (type === "profile") {
      pageType = "ProfilePage";
      nodes.push(
        buildPersonSchema({
          personId,
          pageUrl,
          name: matchedPlayerRecord?.item.name || pageTitle,
          description: matchedPlayerRecord?.item.about || pageDescription,
          imageUrl: toAbsoluteUrl(matchedPlayerRecord?.item.image || pageImage, siteUrl) || pageImage,
          identifier: matchedPlayerRecord?.member?.slug || matchedPlayerRecord?.alias,
          gender: matchedPlayerRecord?.member?.gender,
          addressLocality: matchedPlayerRecord?.member?.city,
          affiliation:
            matchedPlayerRecord?.club?.name
              ? {
                  id: matchedPlayerRecord.club.slug
                    ? `${toAbsoluteUrl(buildClubDetailPath(matchedPlayerRecord.club.slug), siteUrl)}#club`
                    : undefined,
                  name: matchedPlayerRecord.club.name,
                  url: matchedPlayerRecord.club.slug
                    ? toAbsoluteUrl(buildClubDetailPath(matchedPlayerRecord.club.slug), siteUrl)
                    : undefined,
                }
              : undefined,
          sameAs: [
            matchedPlayerRecord?.member?.facebook,
            matchedPlayerRecord?.member?.instagram,
            matchedPlayerRecord?.member?.tiktok,
          ].filter((item): item is string => Boolean(item)),
        }),
      );
      mainEntity = { "@id": personId };
    }

    if (matchedTeamRecord) {
      nodes.push(
        buildSportsTeamSchema({
          teamId,
          pageUrl,
          name: matchedTeamRecord.name,
          description: matchedTeamRecord.description || pageDescription,
          imageUrl: toAbsoluteUrl(matchedTeamRecord.logo || pageImage, siteUrl) || pageImage,
          members: matchedTeamRecord.members.map((item) => ({
            name: item.name,
            url: toAbsoluteUrl(item.path, siteUrl),
          })),
        }),
      );
      mainEntity = { "@id": teamId };
    }

    if (matchedClub) {
      nodes.push(
        buildOrganizationEntitySchema({
          entityId: clubId,
          entityType: "SportsOrganization",
          name: matchedClub.name || pageTitle,
          url: pageUrl,
          description:
            `${matchedClub.name || "Klub Tarkam"} adalah bagian dari komunitas Tarkam.`,
          imageUrl: toAbsoluteUrl(matchedClub.logo || pageImage, siteUrl) || pageImage,
        }),
      );
      mainEntity = { "@id": clubId };
    }

    if (matchedMatchRecord) {
      nodes.push(
        buildSportsEventSchema({
          eventId,
          pageUrl,
          name: `${matchedMatchRecord.item.leftTeam} vs ${matchedMatchRecord.item.rightTeam}`,
          description: pageDescription,
          imageUrl:
            toAbsoluteUrl(
              matchedMatchRecord.item.leftLogo || matchedMatchRecord.item.rightLogo || pageImage,
              siteUrl,
            ) || pageImage,
          startDate:
            matchedMatchRecord.contest?.time ||
            matchedMatchRecord.tarkam?.male_date ||
            matchedMatchRecord.tarkam?.female_date,
          locationName: matchedMatchRecord.tarkam?.location || meta.address || "Online",
          organizerId: organizationId,
          homeTeam: {
            id: `${toAbsoluteUrl(matchedMatchRecord.item.leftTeamPath, siteUrl) || pageUrl}#team`,
            name: matchedMatchRecord.item.leftTeam,
          },
          awayTeam: {
            id: `${toAbsoluteUrl(matchedMatchRecord.item.rightTeamPath, siteUrl) || pageUrl}#team`,
            name: matchedMatchRecord.item.rightTeam,
          },
          winnerTeam: matchedMatchRecord.winnerTeam
            ? {
                id: `${toAbsoluteUrl(
                  matchedMatchRecord.winnerTeam.id
                    ? buildTeamDetailPath(matchedMatchRecord.winnerTeam.id)
                    : undefined,
                  siteUrl,
                ) || pageUrl}#team`,
                name: matchedMatchRecord.winnerTeam.name || "Pemenang",
              }
            : undefined,
        }),
      );
      mainEntity = { "@id": eventId };
    }

    if (matchedTarkam && !matchedMatchRecord) {
      nodes.push(
        buildSportsEventSchema({
          eventId,
          pageUrl,
          name:
            matchedTarkam.title ||
            (matchedTarkam.week ? `Tarkam Week ${matchedTarkam.week}` : pageTitle),
          description: stripHtmlText(matchedTarkam.description) || pageDescription,
          imageUrl: toAbsoluteUrl(matchedTarkam.thumbnail || matchedTarkam.image || pageImage, siteUrl) || pageImage,
          startDate: matchedTarkam.male_date || matchedTarkam.female_date,
          locationName: matchedTarkam.location || meta.address || "Online",
          organizerId: organizationId,
        }),
      );
      mainEntity = { "@id": eventId };
    }

    if (normalizedPathname === galacticRoutes.helpCenter) {
      pageType = "FAQPage";
      mainEntity = (faqs.length ? faqs : fallbackFaqs).map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }));
    }

    if (normalizedPathname === galacticRoutes.contact) {
      pageType = "ContactPage";
      mainEntity = { "@id": organizationId };
    }

    if (normalizedPathname === galacticRoutes.checkout) {
      pageType = "CheckoutPage";
    }

    nodes.push(
      buildWebPageSchema({
        pageId,
        pageType,
        pageUrl,
        title: pageTitle,
        description: pageDescription,
        imageUrl: pageImage,
        websiteId,
        breadcrumbId: breadcrumbItems.length > 1 ? breadcrumbId : undefined,
        mainEntity,
        about,
      }),
    );

    return dedupeStructuredData([...nodes, structuredData]);
  })();

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={pageAuthor} />

      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteDisplayName} />

      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />

      {type === "article" && pageAuthor ? (
        <meta property="article:author" content={pageAuthor} />
      ) : null}
      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {type === "article" && articleSection ? (
        <meta property="article:section" content={articleSection} />
      ) : null}
      {type === "article" && articleTag.length > 0
        ? articleTag.map((tag, index) => (
            <meta key={`article-tag-${tag}-${index}`} property="article:tag" content={tag} />
          ))
        : null}

      <meta name="robots" content="index, follow" />
      <meta name="language" content="id" />
      <meta name="revisit-after" content="7 days" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
      <meta name="theme-color" content="#262626" />

      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/maskable/logo72.png" />
      <link rel="apple-touch-icon" sizes="96x96" href="/icons/maskable/logo96.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/icons/maskable/logo128.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/maskable/logo144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/maskable/logo152.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/maskable/logo192.png" />
      <link rel="apple-touch-icon" sizes="384x384" href="/icons/maskable/logo384.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/maskable/logo512.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/rounded/logo72.png" />
      <link rel="apple-touch-icon" sizes="96x96" href="/icons/rounded/logo96.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/icons/rounded/logo128.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/rounded/logo144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/rounded/logo152.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/rounded/logo192.png" />
      <link rel="apple-touch-icon" sizes="384x384" href="/icons/rounded/logo384.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/rounded/logo512.png" />

      {autoStructuredData.map((item, index) => (
        <script
          key={String(item["@id"] || `structured-data-${index}`)}
          type="application/ld+json"
        >
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
