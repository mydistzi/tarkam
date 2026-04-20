import { useEffect, useState } from "react";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { PageShell } from "@/galactic/common";
import { ClubsContent } from "./section";
import type { ClubItem } from "@/galactic/data";

type ApiEnvelope<T> = {
  data?: T;
};

type ApiClubRecord = {
  id?: number | string;
  code?: string;
  slug?: string;
  name?: string;
  logo?: string;
  level?: string;
  points?: number | string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  members_count?: number;
  active_members_count?: number;
  sessions_count?: number;
  timelines_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type ClubRegistryRecord = ClubItem & {
  activeMembersCount?: number;
  sessionCount?: number;
  timelineCount?: number;
};

const ClubPage = () => {
  const liveKey = useLiveUpdate();
  const [clubs, setClubs] = useState<ClubRegistryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Api.get("/clubs")
      .then((response) => {
        if (cancelled) {
          return;
        }

        const payload = response.data as ApiEnvelope<ApiClubRecord[]> | ApiClubRecord[] | undefined;
        const records = (payload as ApiEnvelope<ApiClubRecord[]> | undefined)?.data ?? (payload as ApiClubRecord[] | undefined) ?? [];
        const mappedClubs = records.map((club) => ({
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
          membersCount: club.members_count ?? 0,
          activeMembersCount: club.active_members_count ?? 0,
          sessionCount: club.sessions_count ?? 0,
          timelineCount: club.timelines_count ?? 0,
          createdAt: club.created_at,
          updatedAt: club.updated_at,
          deletedAt: club.deleted_at,
        }));

        setClubs(mappedClubs);
      })
      .catch((fetchError) => {
        if (cancelled) {
          return;
        }

        console.error(fetchError);
        setError("Data klub resmi tidak dapat dimuat saat ini.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [liveKey]);

  return (
    <PageShell title="Direktori Klub Resmi" image={clubs[0]?.logo}>
      <ClubsContent key={`${loading}-${clubs.length}`} clubs={clubs} loading={loading} error={error} />
    </PageShell>
  );
};

export default ClubPage;
