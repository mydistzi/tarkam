import {
  placeholderPlayer,
  placeholderSponsor,
  placeholderVideoThumb,
} from "@/galactic/placeholders";

const getImageSource = (src?: string, fallback?: string): string | undefined => {
  const normalized = src?.trim();
  if (normalized) {
    const isPlaceholderAsset = /\/assets\/images\/placeholder-[\w-]+\.(png|jpe?g|webp)$/i.test(normalized);
    if (isPlaceholderAsset) {
      return fallback?.trim() || undefined;
    }

    return normalized;
  }

  return fallback?.trim() || undefined;
};

const PlaySvg = () => (
  <svg enableBackground="new 0 0 41.999 41.999" version="1.1" viewBox="0 0 41.999 41.999" xmlSpace="preserve">
    <path d="M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176zM7.5,39.095V2.904l26.239,18.096L7.5,39.095z" />
  </svg>
);

const isFacebookVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  return /(?:facebook\.com|fb\.watch)\/(?:video\.php|watch|plugins\/video\.php|videos?)/i.test(normalized);
};

const getFacebookVideoPostUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  try {
    const parsed = new URL(
      normalized.startsWith("http") ? normalized : `https://${normalized.replace(/^\/+/u, "")}`,
    );
    const hostname = parsed.hostname.toLowerCase();
    if (hostname.endsWith("facebook.com") || hostname.endsWith("fb.watch")) {
      if (parsed.pathname.includes("plugins/video.php")) {
        const href = parsed.searchParams.get("href");
        return href ? decodeURIComponent(href) : normalized;
      }

      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return normalized;
  }

  return normalized;
};

const getFacebookEmbedUrl = (url: string) => {
  const postUrl = getFacebookVideoPostUrl(url);
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(postUrl)}&show_text=0&autoplay=1`;
};

const getYouTubeVideoId = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(
      normalized.startsWith("http") ? normalized : `https://${normalized.replace(/^\/+/u, "")}`,
    );
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      }
    }
  } catch {
    return "";
  }

  return "";
};

const getExternalVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  if (isFacebookVideoUrl(normalized)) {
    return getFacebookVideoPostUrl(normalized);
  }

  const youtubeId = getYouTubeVideoId(normalized);
  if (youtubeId) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  return normalized;
};

const getNormalizedVideoUrl = (url: string) => {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return normalized;
  }

  if (isFacebookVideoUrl(normalized)) {
    return getFacebookEmbedUrl(normalized);
  }

  const youtubeId = getYouTubeVideoId(normalized);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`;
  }

  return normalized;
};

export {
  getExternalVideoUrl,
  getImageSource,
  getNormalizedVideoUrl,
  placeholderPlayer,
  placeholderSponsor,
  placeholderVideoThumb,
  PlaySvg,
};
