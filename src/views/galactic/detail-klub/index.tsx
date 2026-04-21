import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { PageShell } from "@/galactic/common";
import { buildPlayerDetailPath } from "@/galactic/data";
import {
  buildOrganizationEntitySchema,
  normalizeSiteUrl,
  toAbsoluteUrl,
} from "@/lib/structuredData";
import { useGalacticContent } from "../shared";
import { ClubsContent } from "./section";
import type { ClubItem, ClubSessionItem, ClubTimelineItem, MemberItem } from "@/galactic/data";

type ApiResourceEnvelope<T> = {
  data?: T;
};

type ApiClubReference = {
  name?: string;
  slug?: string;
  logo?: string;
};

type ApiAliasRecord = {
  alias?: string;
};

type ApiSessionRecord = {
  id?: number | string;
  sesi?: number | string;
  point?: number | string;
  participant?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ApiTimelineRecord = {
  id?: number | string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ApiClubTimelineRelation = {
  id?: number | string;
  timeline_fk?: number | string;
  session_fk?: number | string;
  created_at?: string;
  updated_at?: string;
  description?: string | null;
  timeline?: ApiTimelineRecord | null;
  session?: ApiSessionRecord | null;
};

type ApiMemberRecord = {
  id?: number | string;
  username?: string;
  nickname?: string;
  slug?: string;
  alias?: ApiAliasRecord[] | ApiAliasRecord | null;
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
  about?: string;
  club_fk?: number;
  club?: ApiClubReference | null;
  wins?: number;
  losses?: number;
  t_matches?: number;
  points?: number;
  lifetime_points?: number;
  session_points?: number;
  session_reward?: number | string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type ApiClubSessionRelation = {
  id?: number | string;
  session_fk?: number | string;
  created_at?: string;
  updated_at?: string;
};

type ApiClubRecord = {
  id?: number | string;
  code?: string;
  slug?: string;
  name?: string;
  logo?: string;
  level?: string;
  points?: number | string;
  lifetime_points?: number | string;
  session_points?: number | string;
  session_reward?: number | string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  members_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  members?: ApiMemberRecord[];
  sessions?: ApiClubSessionRelation[];
  timelines?: ApiClubTimelineRelation[];
};

const mapTimelineItem = (item: ApiClubTimelineRelation): ClubTimelineItem => {
  const timeline = item?.timeline ?? item;
  const session = item?.session;

  return {
    id: timeline?.id ?? item?.timeline_fk ?? item?.id,
    title: session?.sesi ? `Session ${session.sesi}` : "Timeline Klub",
    description: String(
      timeline?.description || item?.description || "Belum ada deskripsi timeline."
    ),
    sessionLabel: session?.sesi ? `Session ${session.sesi}` : undefined,
    sessionStatus: session?.status ? String(session.status) : undefined,
    createdAt: timeline?.created_at || item?.created_at,
    updatedAt: timeline?.updated_at || item?.updated_at,
  };
};

const mapMemberItem = (member: ApiMemberRecord): MemberItem => ({
  id: member.id,
  username: member.username,
  nickname: member.nickname,
  slug: member.slug,
  alias: Array.isArray(member.alias) ? member.alias[0]?.alias : member.alias?.alias,
  discordUserId: member.discord_user_id,
  phoneNumber: member.phone_number,
  tunisiaPhone: member.tunisia_phone,
  facebook: member.facebook,
  instagram: member.instagram,
  tiktok: member.tiktok,
  gender: member.gender,
  latitude: member.latitude,
  longitude: member.longitude,
  pictureUrl: member.picture_url,
  tier: member.tier,
  city: member.city,
  about: member.about,
  clubFk: member.club_fk,
  clubName: member.club?.name,
  clubSlug: member.club?.slug,
  clubLogo: member.club?.logo,
  wins: Number(member.wins ?? 0),
  losses: Number(member.losses ?? 0),
  tMatches: Number(member.t_matches ?? 0),
  points: Number(member.points ?? 0),
  lifetimePoints: Number(member.lifetime_points ?? member.points ?? 0),
  sessionPoints: Number(member.session_points ?? 0),
  sessionReward: Number(member.session_reward ?? 0),
  status: member.status,
  createdAt: member.created_at,
  updatedAt: member.updated_at,
  image: member.picture_url,
  path: member.slug ? buildPlayerDetailPath(member.slug) : undefined,
});

const mapSessionItem = (
  relation: ApiClubSessionRelation,
  sessions: ApiSessionRecord[],
): ClubSessionItem => {
  const sessionFk = relation?.session_fk ?? relation?.id;
  const matched = sessions.find(
    (session) => String(session?.id ?? "") === String(sessionFk ?? ""),
  );

  return {
    id: matched?.id ?? relation?.id ?? sessionFk,
    sessionFk,
    sesi: matched?.sesi !== undefined ? Number(matched.sesi) : undefined,
    point: matched?.point !== undefined ? Number(matched.point) : undefined,
    participant: matched?.participant || undefined,
    status: matched?.status || undefined,
    relationCreatedAt: relation?.created_at,
    relationUpdatedAt: relation?.updated_at,
    createdAt: matched?.created_at,
    updatedAt: matched?.updated_at,
  };
};

const mapClubItem = (
  club: ApiClubRecord,
  sessions: ApiSessionRecord[],
): ClubItem => ({
  id: club.id,
  code: club.code,
  slug: club.slug,
  name: club.name,
  logo: club.logo,
  level: club.level,
  points: Number(club.points ?? 0),
  lifetimePoints: Number(club.lifetime_points ?? club.points ?? 0),
  sessionPoints: Number(club.session_points ?? 0),
  sessionReward: Number(club.session_reward ?? 0),
  facebook: club.facebook,
  instagram: club.instagram,
  tiktok: club.tiktok,
  membersCount: club.members_count ?? club.members?.length,
  createdAt: club.created_at,
  updatedAt: club.updated_at,
  deletedAt: club.deleted_at,
  sessions: Array.isArray(club.sessions)
    ? club.sessions.map((session) => mapSessionItem(session, sessions))
    : [],
  timeline: Array.isArray(club.timelines) ? club.timelines.map(mapTimelineItem) : [],
});

const ClubDetailsPage = () => {
  const liveKey = useLiveUpdate(
    ["clubs", "members", "sessions", "timelines", "member-timeline"],
    { fallbackIntervalMs: 45000 },
  );
  const { slug } = useParams();
  const { meta } = useGalacticContent();
  const normalizedSlug = slug?.trim().toLowerCase();
  const invalidSlug = !normalizedSlug;
  const [record, setRecord] = useState<ClubItem | null>(null);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [clubWins, setClubWins] = useState(0);
  const [clubLosses, setClubLosses] = useState(0);
  const [clubPoints, setClubPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteUrl = normalizeSiteUrl(meta.siteUrl, "https://tarkam.fun");
  const pageUrl =
    toAbsoluteUrl(`/detail-klub/${encodeURIComponent(record?.slug || normalizedSlug || "")}`, siteUrl) ||
    siteUrl;
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
    ? buildOrganizationEntitySchema({
        entityId: `${pageUrl}#club`,
        entityType: "SportsOrganization",
        name: record.name || "Klub Tarkam",
        url: pageUrl,
        description: `${record.name || "Klub Tarkam"} memiliki ${members.length} member dengan total ${clubPoints} poin session.`,
        imageUrl: toAbsoluteUrl(record.logo, siteUrl),
        sameAs: [
          normalizeSocialUrl(record.facebook),
          normalizeSocialUrl(record.instagram),
          normalizeSocialUrl(record.tiktok),
        ].filter((item): item is string => Boolean(item)),
      })
    : undefined;

  useEffect(() => {
    if (!normalizedSlug) {
      return;
    }

    let cancelled = false;
    const frameId = window.requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }
      setLoading(true);
      setError(null);
    });

    Promise.allSettled([
      Api.get(`/clubs/${encodeURIComponent(normalizedSlug)}`),
      Api.get("/sessions"),
    ])
      .then((results) => {
        if (cancelled) {
          return;
        }

        const clubResponse = results[0];
        const sessionsResponse = results[1];

        if (clubResponse.status !== "fulfilled") {
          throw clubResponse.reason;
        }

        const club = (clubResponse.value.data as ApiResourceEnvelope<ApiClubRecord> | undefined)?.data;
        const sessions =
          sessionsResponse.status === "fulfilled"
            ? ((sessionsResponse.value.data as ApiResourceEnvelope<ApiSessionRecord[]> | undefined)?.data ?? [])
            : [];

        if (!club) {
          setError("Data klub tidak ditemukan.");
          setRecord(null);
          setMembers([]);
          return;
        }

        const mappedClub = mapClubItem(club, sessions);
        const mappedMembers = Array.isArray(club.members)
          ? club.members.map((member) => mapMemberItem(member))
          : [];

        setRecord(mappedClub);
        setMembers(mappedMembers);
        setClubPoints(mappedClub.sessionPoints ?? 0);
        setClubWins(mappedMembers.reduce((sum: number, item: MemberItem) => sum + (item.wins ?? 0), 0));
        setClubLosses(mappedMembers.reduce((sum: number, item: MemberItem) => sum + (item.losses ?? 0), 0));
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setError("Terjadi kesalahan saat memuat data klub.");
        setRecord(null);
        setMembers([]);
        console.error(error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [normalizedSlug, liveKey]);

  return (
    <PageShell
      title={record?.name || "Detail Klub"}
      image={record?.logo}
      structuredData={structuredData}
    >
      {invalidSlug ? (
        <section className="about-team-section padding-top">
          <div className="container">
            <div className="section-heading text-center">
              <h2>Slug klub tidak valid.</h2>
            </div>
          </div>
        </section>
      ) : loading ? (
        <section className="about-team-section padding-top">
          <div className="container">
            <div className="section-heading text-center">
              <h2>Memuat detail klub...</h2>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="about-team-section padding-top">
          <div className="container">
            <div className="section-heading text-center">
              <h2>{error}</h2>
            </div>
          </div>
        </section>
      ) : (
        <ClubsContent
          record={record ?? undefined}
          members={members}
          clubWins={clubWins}
          clubLosses={clubLosses}
          clubPoints={clubPoints}
        />
      )}
    </PageShell>
  );
};

export default ClubDetailsPage;
