import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@/api";
import { PageShell } from "@/galactic/common";
import { ClubsContent } from "./section";
import { buildPlayerDetailPath } from "@/galactic/data";
import type { ClubItem, MemberItem } from "@/galactic/data";

const mapTimelineItem = (item: any) => {
  const timeline = item?.timeline ?? item;
  const session = item?.session;
  const label = String(
    timeline?.description || session?.name || session?.title || item?.description || "Timeline"
  );
  const value = String(
    session?.name || session?.title || timeline?.description || item?.created_at || ""
  );

  return {
    label,
    value,
  };
};

const mapMemberItem = (member: any): MemberItem => ({
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
  status: member.status,
  image: member.picture_url,
  path: member.slug ? buildPlayerDetailPath(member.slug) : undefined,
});

const mapClubItem = (club: any): ClubItem => ({
  id: club.id,
  code: club.code,
  slug: club.slug,
  name: club.name,
  logo: club.logo,
  level: club.level,
  points: Number(club.points ?? 0),
  facebook: club.facebook,
  instagram: club.instagram,
  tiktok: club.tiktok,
  membersCount: club.members_count ?? club.members?.length,
  timeline: Array.isArray(club.timelines) ? club.timelines.map(mapTimelineItem) : [],
});

const ClubDetailsPage = () => {
  const { slug } = useParams();
  const [record, setRecord] = useState<ClubItem | null>(null);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [clubWins, setClubWins] = useState(0);
  const [clubLosses, setClubLosses] = useState(0);
  const [clubPoints, setClubPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalizedSlug = slug?.trim().toLowerCase();
    if (!normalizedSlug) {
      setRecord(null);
      setMembers([]);
      setError("Slug klub tidak valid.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Api.get(`/clubs/${encodeURIComponent(normalizedSlug)}`)
      .then((response) => {
        if (cancelled) {
          return;
        }

        const club = response.data?.data;
        if (!club) {
          setError("Data klub tidak ditemukan.");
          setRecord(null);
          setMembers([]);
          return;
        }

        const mappedClub = mapClubItem(club);
        const mappedMembers = Array.isArray(club.members)
          ? club.members.map(mapMemberItem)
          : [];

        setRecord(mappedClub);
        setMembers(mappedMembers);
        setClubPoints(mappedClub.points ?? 0);
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
    };
  }, [slug]);

  return (
    <PageShell title={record?.name || "Detail Klub"} image={record?.logo}>
      {loading ? (
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
