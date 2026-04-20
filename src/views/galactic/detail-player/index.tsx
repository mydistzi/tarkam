import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@/api";
import { useLiveUpdate } from "@/views/galactic/socket/SocketProvider";
import { PageShell } from "@/galactic/common";
import { PlayerDetailsContent, type MemberDetailPayload } from "./section";

type ApiEnvelope<T> = {
  data?: T;
};

const PlayerDetailsPage = () => {
  const liveKey = useLiveUpdate();
  const { slug } = useParams();
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

  return (
    <PageShell title={title} type="profile" image={record?.picture_url}>
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
