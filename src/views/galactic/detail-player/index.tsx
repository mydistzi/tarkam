import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { PageShell } from "@/galactic/common";
import { buildClubDetailPath } from "@/galactic/data";
import {
  buildPersonSchema,
  normalizeSiteUrl,
  toAbsoluteUrl,
} from "@/lib/structuredData";
import { useGalacticContent } from "../shared";
import { PlayerDetailsContent, type MemberDetailPayload } from "./section";

type ApiEnvelope<T> = {
  data?: T;
};

const PlayerDetailsPage = () => {
  const liveKey = useLiveUpdate(
    ["members", "aliases", "clubs"],
    { fallbackIntervalMs: 45000 },
  );
  const { slug } = useParams();
  const { meta } = useGalacticContent();
  const hasSlug = Boolean(slug?.trim());
  const [record, setRecord] = useState<MemberDetailPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resolvedError = hasSlug ? error : "Slug member tidak valid.";
  const loading = hasSlug && (!record || record.slug !== slug?.trim()) && !resolvedError;

  useEffect(() => {
    const normalizedSlug = slug?.trim();
    if (!normalizedSlug) {
      return;
    }

    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setError(null);
      }
    });

    Api.get(`/members/${encodeURIComponent(normalizedSlug)}`)
      .then((response) => {
        if (cancelled) {
          return;
        }

        const payload = response.data as
          | ApiEnvelope<MemberDetailPayload>
          | MemberDetailPayload
          | undefined;
        const member =
          (payload as ApiEnvelope<MemberDetailPayload> | undefined)?.data ??
          (payload as MemberDetailPayload | undefined);
        if (!member) {
          setRecord(null);
          setError("Data member tidak ditemukan.");
          return;
        }

        setRecord(member);
      })
      .catch((fetchError) => {
        if (cancelled) {
          return;
        }

        console.error(fetchError);
        setRecord(null);
        setError("Terjadi kesalahan saat memuat detail member.");
      });

    return () => {
      cancelled = true;
    };
  }, [hasSlug, slug, liveKey]);

  const title = record?.nickname || record?.username || "Detail Member";
  const siteUrl = normalizeSiteUrl(meta.siteUrl, "https://tarkam.fun");
  const pageUrl =
    toAbsoluteUrl(`/detail-player/${encodeURIComponent(record?.slug || slug?.trim() || "")}`, siteUrl) ||
    siteUrl;
  const clubUrl = record?.club?.slug
    ? toAbsoluteUrl(buildClubDetailPath(record.club.slug), siteUrl)
    : undefined;
  const normalizeSocialUrl = (value?: string) => {
    const normalized = String(value || "").trim();
    if (!normalized) {
      return undefined;
    }

    return /^https?:\/\//i.test(normalized)
      ? normalized
      : `https://${normalized.replace(/^\/+/, "")}`;
  };
  const structuredData = record
    ? buildPersonSchema({
        personId: `${pageUrl}#person`,
        pageUrl,
        name: record.nickname || record.username || title,
        description:
          `Profil member Tarkam ${record.nickname || record.username || "Player"} dengan point lifetime ${Number(record.lifetime_points ?? record.points ?? 0)} dan point session ${Number(record.session_points ?? 0)}.`.trim(),
        imageUrl: toAbsoluteUrl(record.picture_url, siteUrl),
        identifier: record.slug || record.username,
        gender: record.gender,
        addressLocality: record.city,
        affiliation: record.club?.name
          ? {
              id: clubUrl ? `${clubUrl}#club` : undefined,
              name: record.club.name,
              url: clubUrl,
            }
          : undefined,
        sameAs: [
          normalizeSocialUrl(record.facebook),
          normalizeSocialUrl(record.instagram),
          normalizeSocialUrl(record.tiktok),
        ].filter((item): item is string => Boolean(item)),
      })
    : undefined;

  return (
    <PageShell
      title={title}
      type="profile"
      image={record?.picture_url}
      structuredData={structuredData}
    >
      <PlayerDetailsContent
        key={record?.slug || slug}
        record={record}
        loading={loading}
        error={resolvedError}
      />
    </PageShell>
  );
};

export default PlayerDetailsPage;
