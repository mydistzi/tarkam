export type StructuredDataNode = Record<string, unknown>;
export type StructuredDataInput =
  | StructuredDataNode
  | StructuredDataNode[]
  | null
  | undefined;

type SiteIdentity = {
  siteName: string;
  siteUrl: string;
  description?: string;
  author?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  socialLinks?: Array<{ label?: string; href: string }>;
};

type ListEntry = {
  name: string;
  url: string;
  image?: string;
};

const PROTOCOL_PATTERN = /^[a-z][a-z\d+.-]*:/i;

export function normalizeSiteUrl(value?: string, fallback = ""): string {
  const rawValue = String(value || fallback || "").trim();
  if (!rawValue) {
    return "";
  }

  if (PROTOCOL_PATTERN.test(rawValue)) {
    return rawValue.replace(/\/+$/, "");
  }

  return `https://${rawValue.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

export function toAbsoluteUrl(value?: string, siteUrl = ""): string | undefined {
  const rawValue = String(value || "").trim();
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  if (!rawValue) {
    return undefined;
  }

  if (rawValue.startsWith("//")) {
    return `https:${rawValue}`;
  }

  if (PROTOCOL_PATTERN.test(rawValue)) {
    return rawValue;
  }

  if (!normalizedSiteUrl) {
    return rawValue.startsWith("/") ? rawValue : `/${rawValue.replace(/^\/+/, "")}`;
  }

  const relativePath = rawValue.startsWith("/") ? rawValue : `/${rawValue.replace(/^\/+/, "")}`;
  return `${normalizedSiteUrl}${relativePath}`;
}

export function normalizeIsoDate(value?: string): string | undefined {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return undefined;
  }

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }

  return date.toISOString();
}

export function stripHtmlText(value?: string): string | undefined {
  const stripped = String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return stripped || undefined;
}

export function cleanStructuredData(value: unknown): unknown | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => cleanStructuredData(item))
      .filter((item) => item !== undefined);

    return items.length ? items : undefined;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, cleanStructuredData(item)] as const)
      .filter(([, item]) => item !== undefined);

    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  return value;
}

export function normalizeStructuredDataInput(input: StructuredDataInput): StructuredDataNode[] {
  if (!input) {
    return [];
  }

  const items = Array.isArray(input) ? input : [input];

  return items
    .map((item) => cleanStructuredData(item))
    .filter((item): item is StructuredDataNode => Boolean(item) && typeof item === "object" && !Array.isArray(item));
}

export function dedupeStructuredData(inputs: StructuredDataInput[]): StructuredDataNode[] {
  const normalized = inputs.flatMap((item) => normalizeStructuredDataInput(item));
  const byId = new Map<string, StructuredDataNode>();
  const anonymous: StructuredDataNode[] = [];

  normalized.forEach((item) => {
    const itemId = typeof item["@id"] === "string" ? item["@id"] : undefined;
    if (itemId) {
      byId.set(itemId, item);
      return;
    }

    const serialized = JSON.stringify(item);
    if (!anonymous.some((entry) => JSON.stringify(entry) === serialized)) {
      anonymous.push(item);
    }
  });

  return [...byId.values(), ...anonymous];
}

export function buildOrganizationSchema({
  organizationId,
  site,
  logoUrl,
}: {
  organizationId: string;
  site: SiteIdentity;
  logoUrl?: string;
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.siteName,
    url: site.siteUrl,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: site.address
      ? {
          "@type": "PostalAddress",
          streetAddress: site.address,
          addressCountry: "ID",
        }
      : undefined,
    logo: logoUrl
      ? {
          "@type": "ImageObject",
          url: logoUrl,
        }
      : undefined,
    sameAs: site.socialLinks?.map((item) => item.href).filter(Boolean),
  };
}

export function buildOrganizationEntitySchema({
  entityId,
  entityType = "Organization",
  name,
  url,
  description,
  imageUrl,
  sameAs,
}: {
  entityId: string;
  entityType?: string;
  name: string;
  url: string;
  description?: string;
  imageUrl?: string;
  sameAs?: string[];
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": entityType,
    "@id": entityId,
    name,
    url,
    description,
    image: imageUrl,
    logo: imageUrl,
    sameAs,
  };
}

export function buildWebsiteSchema({
  websiteId,
  organizationId,
  site,
}: {
  websiteId: string;
  organizationId: string;
  site: SiteIdentity;
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: site.siteUrl,
    name: site.siteName,
    headline: site.siteName,
    description: site.description,
    inLanguage: "id-ID",
    publisher: {
      "@id": organizationId,
    },
  };
}

export function buildWebPageSchema({
  pageId,
  pageType = "WebPage",
  pageUrl,
  title,
  description,
  imageUrl,
  websiteId,
  breadcrumbId,
  mainEntity,
  about,
}: {
  pageId: string;
  pageType?: string;
  pageUrl: string;
  title: string;
  description?: string;
  imageUrl?: string;
  websiteId: string;
  breadcrumbId?: string;
  mainEntity?: unknown;
  about?: unknown;
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": pageId,
    url: pageUrl,
    name: title,
    headline: title,
    description,
    image: imageUrl,
    isPartOf: {
      "@id": websiteId,
    },
    inLanguage: "id-ID",
    breadcrumb: breadcrumbId
      ? {
          "@id": breadcrumbId,
        }
      : undefined,
    mainEntity,
    about,
  };
}

export function buildBreadcrumbSchema({
  breadcrumbId,
  pageUrl,
  items,
}: {
  breadcrumbId: string;
  pageUrl: string;
  items: Array<{ name: string; url?: string }>;
}): StructuredDataNode | undefined {
  if (!items.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url || (index === items.length - 1 ? pageUrl : undefined),
    })),
  };
}

export function buildItemListSchema({
  itemListId,
  name,
  items,
}: {
  itemListId: string;
  name: string;
  items: ListEntry[];
}): StructuredDataNode | undefined {
  if (!items.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": itemListId,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      image: item.image,
    })),
  };
}

export function buildArticleSchema({
  articleId,
  pageUrl,
  title,
  description,
  imageUrl,
  authorName,
  organizationId,
  publishedTime,
  modifiedTime,
  articleSection,
  articleTag,
}: {
  articleId: string;
  pageUrl: string;
  title: string;
  description?: string;
  imageUrl?: string;
  authorName: string;
  organizationId: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTag?: string[];
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": articleId,
    mainEntityOfPage: pageUrl,
    headline: title,
    description,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@id": organizationId,
    },
    datePublished: normalizeIsoDate(publishedTime),
    dateModified: normalizeIsoDate(modifiedTime || publishedTime),
    articleSection,
    keywords: articleTag?.join(", "),
  };
}

export function buildProductSchema({
  productId,
  pageUrl,
  name,
  description,
  imageUrl,
  category,
  sku,
  price,
  availability,
  organizationId,
  tags,
}: {
  productId: string;
  pageUrl: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  sku?: string;
  price?: number;
  availability?: string;
  organizationId: string;
  tags?: string[];
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productId,
    name,
    description,
    image: imageUrl,
    url: pageUrl,
    category,
    sku,
    keywords: tags?.join(", "),
    brand: {
      "@id": organizationId,
    },
    offers:
      price !== undefined
        ? {
            "@type": "Offer",
            url: pageUrl,
            price,
            priceCurrency: "IDR",
            availability: availability || "https://schema.org/InStock",
            seller: {
              "@id": organizationId,
            },
          }
        : undefined,
  };
}

export function buildPersonSchema({
  personId,
  pageUrl,
  name,
  description,
  imageUrl,
  identifier,
  gender,
  addressLocality,
  affiliation,
  sameAs,
}: {
  personId: string;
  pageUrl: string;
  name: string;
  description?: string;
  imageUrl?: string;
  identifier?: string;
  gender?: string;
  addressLocality?: string;
  affiliation?: { name: string; url?: string; id?: string };
  sameAs?: string[];
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    url: pageUrl,
    name,
    description,
    image: imageUrl,
    identifier,
    gender,
    address: addressLocality
      ? {
          "@type": "PostalAddress",
          addressLocality,
          addressCountry: "ID",
        }
      : undefined,
    memberOf: affiliation
      ? {
          "@type": "Organization",
          "@id": affiliation.id,
          name: affiliation.name,
          url: affiliation.url,
        }
      : undefined,
    sameAs,
  };
}

export function buildSportsTeamSchema({
  teamId,
  pageUrl,
  name,
  description,
  imageUrl,
  members,
  sport = "Esports",
}: {
  teamId: string;
  pageUrl: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members?: Array<{ name: string; url?: string }>;
  sport?: string;
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "@id": teamId,
    url: pageUrl,
    name,
    description,
    image: imageUrl,
    logo: imageUrl,
    sport,
    member: members?.map((member) => ({
      "@type": "Person",
      name: member.name,
      url: member.url,
    })),
  };
}

export function buildSportsEventSchema({
  eventId,
  pageUrl,
  name,
  description,
  imageUrl,
  startDate,
  locationName,
  organizerId,
  homeTeam,
  awayTeam,
  winnerTeam,
}: {
  eventId: string;
  pageUrl: string;
  name: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  locationName?: string;
  organizerId: string;
  homeTeam?: { name: string; id: string };
  awayTeam?: { name: string; id: string };
  winnerTeam?: { name: string; id: string };
}): StructuredDataNode {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": eventId,
    url: pageUrl,
    name,
    description,
    image: imageUrl,
    sport: "Esports",
    startDate: normalizeIsoDate(startDate),
    location: locationName
      ? {
          "@type": "Place",
          name: locationName,
        }
      : undefined,
    organizer: {
      "@id": organizerId,
    },
    homeTeam: homeTeam
      ? {
          "@type": "SportsTeam",
          "@id": homeTeam.id,
          name: homeTeam.name,
        }
      : undefined,
    awayTeam: awayTeam
      ? {
          "@type": "SportsTeam",
          "@id": awayTeam.id,
          name: awayTeam.name,
        }
      : undefined,
    competitor: [homeTeam, awayTeam]
      .filter(Boolean)
      .map((team) => ({
        "@type": "SportsTeam",
        "@id": team?.id,
        name: team?.name,
      })),
    winner: winnerTeam
      ? {
          "@type": "SportsTeam",
          "@id": winnerTeam.id,
          name: winnerTeam.name,
        }
      : undefined,
  };
}
