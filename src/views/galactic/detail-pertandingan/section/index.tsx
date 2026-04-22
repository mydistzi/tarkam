import {
  Bracket,
  Seed,
  SeedItem,
  SeedTeam,
  SeedTime,
  SingleLineSeed,
  type IRenderSeedProps,
  type IRoundProps,
} from "@sportsgram/brackets";
import { Link } from "react-router-dom";
import { DisqusThread, PageHeader, VideoCardButton } from "@/galactic/common";
import { placeholderTeam } from "@/galactic/placeholders";
import type { MatchRecord } from "../../shared";

type MatchDetailsContentProps = {
  record?: MatchRecord;
  relatedRecords?: MatchRecord[];
};

type BracketTeamData = {
  name: string;
  label?: string;
  isWinner?: boolean;
};

type BracketSeedData = {
  id: number | string;
  date: string;
  teams: [BracketTeamData, BracketTeamData];
  winnerLabel?: string;
};

const formatCurrency = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return "Menunggu update";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const nextPowerOfTwo = (value: number) => {
  let power = 1;

  while (power < value) {
    power *= 2;
  }

  return power;
};

const getRoundTitle = (roundIndex: number, totalRounds: number) => {
  if (totalRounds <= 1) {
    return "Featured Match";
  }

  if (roundIndex === totalRounds - 1) {
    return "Grand Final";
  }

  if (roundIndex === totalRounds - 2) {
    return "Semifinal";
  }

  if (roundIndex === 0) {
    return "Opening Round";
  }

  return `Round ${roundIndex + 1}`;
};

const buildBracketRounds = (records: MatchRecord[]): IRoundProps[] => {
  const validRecords = records
    .filter((item) => item.team1 || item.team2)
    .sort((left, right) => Number(left.id || 0) - Number(right.id || 0));

  if (!validRecords.length) {
    return [];
  }

  const uniqueTeams = new Set(
    validRecords.flatMap((item) => [
      item.team1?.id ? `team-${item.team1.id}` : item.item.leftTeam,
      item.team2?.id ? `team-${item.team2.id}` : item.item.rightTeam,
    ]),
  ).size;

  let offset = 0;
  let expectedParticipants = Math.max(2, nextPowerOfTwo(uniqueTeams || validRecords.length + 1));
  const groups: MatchRecord[][] = [];

  while (offset < validRecords.length) {
    const remainingMatches = validRecords.length - offset;
    const roundMatchCount = Math.min(
      Math.max(1, Math.floor(expectedParticipants / 2)),
      remainingMatches,
    );

    groups.push(validRecords.slice(offset, offset + roundMatchCount));
    offset += roundMatchCount;
    expectedParticipants = Math.max(2, Math.ceil(expectedParticipants / 2));
  }

  return groups.map((group, roundIndex) => ({
    title: getRoundTitle(roundIndex, groups.length),
    seeds: group.map((entry) => ({
      id: entry.id,
      date: `${entry.item.date || "TBA"}${entry.item.time ? ` • ${entry.item.time}` : ""}`,
      teams: [
        {
          name: entry.item.leftTeam || "TBD",
          label:
            entry.winnerTeam?.id === entry.team1?.id
              ? "WIN"
              : entry.contest?.score
                ? String(entry.contest.score)
                : undefined,
          isWinner: entry.winnerTeam?.id === entry.team1?.id,
        },
        {
          name: entry.item.rightTeam || "TBD",
          label:
            entry.winnerTeam?.id === entry.team2?.id
              ? "WIN"
              : entry.contest?.score
                ? String(entry.contest.score)
                : undefined,
          isWinner: entry.winnerTeam?.id === entry.team2?.id,
        },
      ] as [BracketTeamData, BracketTeamData],
      winnerLabel: entry.winnerTeam?.name,
    })),
  }));
};

const MatchBracketSeed = ({
  seed,
  breakpoint,
  isMiddleOfTwoSided,
}: IRenderSeedProps) => {
  const bracketSeed = seed as BracketSeedData;
  const Wrapper = isMiddleOfTwoSided ? SingleLineSeed : Seed;

  return (
    <Wrapper
      className="luxury-bracket-seed"
      mobileBreakpoint={breakpoint}
    >
      <SeedItem className="luxury-bracket-seed__item">
        <div className="luxury-bracket-seed__body">
          {bracketSeed.teams.map((team) => (
            <SeedTeam
              className={`luxury-bracket-seed__team${team.isWinner ? " is-winner" : ""}`}
              key={`${bracketSeed.id}-${team.name}`}
            >
              <span>{team.name}</span>
              <strong>{team.label || "TBD"}</strong>
            </SeedTeam>
          ))}
        </div>
      </SeedItem>
      <SeedTime className="luxury-bracket-seed__time" mobileBreakpoint={breakpoint}>
        {bracketSeed.date}
      </SeedTime>
    </Wrapper>
  );
};

const MatchDetailsContent = ({
  record,
  relatedRecords = [],
}: MatchDetailsContentProps) => {
  const match = record?.item;
  const bracketRounds = buildBracketRounds(relatedRecords);
  const winnerLabel =
    record?.winner?.nickname ||
    record?.winnerTeam?.name ||
    "Pemenang belum ditentukan";
  const matchStatus =
    record?.winnerTeam?.name
      ? "Completed"
      : record?.contest?.score
        ? "Live Score"
        : record?.tarkam?.status || "Upcoming";

  if (!match) {
    return (
      <section className="match-details-section padding-top">
        <div className="container">
          <div className="match-detail-panel">
            <h2>Belum ada data pertandingan.</h2>
            <p>Feed kontes publik belum mengembalikan catatan apa pun. Coba lagi nanti.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Detail Pertandingan"
        title={
          <>
            {match.leftTeam} <span>vs</span> {match.rightTeam}
          </>
        }
        description={`Bracket ${record?.contest?.gender || "open"} dari ${
          record?.tarkam?.title ||
          (record?.tarkam?.week ? `Tarkam Week ${record.tarkam.week}` : "turnamen resmi")
        } dengan focus pada hasil pertandingan,
winner, dan progression round.`}
        className="luxury-page-header luxury-page-header--match"
        meta={
          <div className="luxury-match-hero-meta">
            <span>{matchStatus}</span>
            <span>{record?.contest?.gender || "Open bracket"}</span>
            <span>{match.date || "Tanggal menyusul"}</span>
          </div>
        }
      />

      <section className="match-details-section padding-top">
        <div className="container">
          <div className="match-detail-grid">
            <article className="match-detail-panel match-detail-panel--hero">
              <div className="match-detail-teams">
                <div className="match-detail-team">
                  <img src={match.leftLogo || placeholderTeam} alt={match.leftTeam} />
                  <div>
                    <span>Left Team</span>
                    <h3>
                      {match.leftTeamPath ? (
                        <Link to={match.leftTeamPath}>{match.leftTeam}</Link>
                      ) : (
                        match.leftTeam
                      )}
                    </h3>
                  </div>
                </div>

                <div className="match-detail-versus">
                  <small>Match Time</small>
                  <strong>{match.time || "TBA"}</strong>
                  <span>VS</span>
                </div>

                <div className="match-detail-team is-right">
                  <img src={match.rightLogo || placeholderTeam} alt={match.rightTeam} />
                  <div>
                    <span>Right Team</span>
                    <h3>
                      {match.rightTeamPath ? (
                        <Link to={match.rightTeamPath}>{match.rightTeam}</Link>
                      ) : (
                        match.rightTeam
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="match-detail-actions">
                {match.videoUrl ? (
                  <VideoCardButton href={match.videoUrl} normalizeFacebook />
                ) : (
                  <span className="match-detail-muted">Highlight belum tersedia</span>
                )}
                <Link className="default-btn" to="/jadwal-pertandingan">
                  Kembali ke Jadwal<span />
                </Link>
              </div>
            </article>

            <article className="match-detail-panel">
              <div className="match-detail-panel__eyebrow">Overview</div>
              <h2>{winnerLabel}</h2>
              <p>
                {record?.tarkam?.description ||
                  "Halaman ini merangkum pertandingan, progression bracket, dan hasil winner untuk kontes Tarkam yang dipilih."}
              </p>

              <div className="match-detail-stat-grid">
                <div className="match-detail-stat">
                  <span>Bracket</span>
                  <strong>{record?.contest?.gender || "Open"}</strong>
                </div>
                <div className="match-detail-stat">
                  <span>Winner</span>
                  <strong>{record?.winnerTeam?.name || "TBD"}</strong>
                </div>
                <div className="match-detail-stat">
                  <span>Prize</span>
                  <strong>{formatCurrency(record?.winner?.prize)}</strong>
                </div>
                <div className="match-detail-stat">
                  <span>Label</span>
                  <strong>
                    {record?.tarkam?.title ||
                      (record?.tarkam?.week ? `Week ${record.tarkam.week}` : match.group)}
                  </strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="match-details-section padding-top">
        <div className="container">
          <div className="match-detail-panel luxury-bracket-shell">
            <div className="match-detail-panel__head">
              <div>
                <div className="match-detail-panel__eyebrow">Bracket View</div>
                <h2>Progression pertandingan</h2>
              </div>
              <p>
                Bracket ini dirakit dari seluruh contest pada week dan gender yang sama, sehingga progression round terlihat dalam satu area.
              </p>
            </div>

            {bracketRounds.length ? (
              <div className="luxury-bracket-wrapper">
                <Bracket
                  bracketClassName="luxury-bracket"
                  mobileBreakpoint={880}
                  renderSeedComponent={MatchBracketSeed}
                  rounds={bracketRounds}
                  roundTitleComponent={(title) => (
                    <div className="luxury-bracket-round-title">{title}</div>
                  )}
                />
              </div>
            ) : (
              <div className="match-detail-muted">
                Belum ada cukup data contest untuk membangun bracket pada divisi ini.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="match-details-section padding-top">
        <div className="container">
          <div className="match-detail-grid match-detail-grid--secondary">
            <article className="match-detail-panel">
              <div className="match-detail-panel__eyebrow">Match Notes</div>
              <h2>{match.leftTeam} vs {match.rightTeam}</h2>
              <p>
                Score pertandingan saat ini adalah {record?.contest?.score || "TBA"} dan status pertandingan berada di fase {matchStatus.toLowerCase()}.
              </p>
              <p>
                Winner yang tercatat sekarang adalah {winnerLabel}. Jika admin memperbarui score, winner, atau komposisi team, metric session leaderboard akan ikut refresh otomatis dari trigger backend.
              </p>
            </article>

            <article className="match-detail-panel">
              <div className="match-detail-panel__eyebrow">Community Notes</div>
              <DisqusThread
                identifier={record?.item?.id ? `match-${record.item.id}` : `${record?.item?.leftTeam}-${record?.item?.rightTeam}`}
                title={`${match.leftTeam} vs ${match.rightTeam}`}
              />
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default MatchDetailsContent;
