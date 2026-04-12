import { Link } from "react-router-dom";
import { DisqusThread } from "@/galactic/common";
import type { MatchRecord } from "../../shared";

const MatchDetailsContent = ({ record }: { record?: MatchRecord }) => {
  const match = record?.item;

  if (!match) {
    return (
      <section className="match-details-section padding-top">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="match-details">
              <h2>Belum ada data pertandingan.</h2>
              <p>Feed kontes publik belum mengembalikan catatan apa pun. Coba lagi nanti.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header match-details">
        <div className="page-header-shape">
          <div className="shape" />
          <div className="shape center" />
          <div className="shape center back" />
          <div className="shape right" />
        </div>
        <div className="container">
          <div className="match-details-header">
            <img className="left" src={match.leftLogo || "/assets/images/placeholder-team.png"} alt={match.leftTeam} />
            <h3 className="left-team"><Link to={match.leftTeamPath || "/team-details"}>{match.leftTeam}</Link></h3>
            <div className="vs"><h2>vs</h2></div>
            <h3 className="right-team"><Link to={match.rightTeamPath || "/team-details"}>{match.rightTeam}</Link></h3>
            <img className="right" src={match.rightLogo || "/assets/images/placeholder-team.png"} alt={match.rightTeam} />
          </div>
        </div>
      </section>
      <section className="match-details-section padding-top">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="match-details">
              <ul className="post-meta">
                <li><i className="las la-calendar" />{match.date}</li>
                <li><i className="las la-gamepad" />{record?.contest?.gender || "Divisi Terbuka"}</li>
                <li><i className="las la-trophy" />{record?.winnerTeam?.name || "Pemenang belum ditentukan"}</li>
              </ul>
              <h2>{match.leftTeam} Vs {match.rightTeam}</h2>
              <p>
                Halaman detail ini sekarang dihasilkan dari graph kontes di API Tarkam live. Ia menggabungkan entri kontes,
                kedua tim yang terhubung, dan jadwal induk Tarkam jadi satu narasi pertandingan.
              </p>
              <p>
                {record?.tarkam?.description || "Deskripsi jadwal belum diisi, jadi halaman ini fallback ke ringkasan netral agar layout tetap rapi."}
              </p>
              <blockquote>
                <i className="fas fa-quote-right" />
                Pemenang: {record?.winner?.nickname || record?.winnerTeam?.name || "TBA"}
                <span>- Hadiah: {record?.winner?.prize || "Menunggu update"}</span>
              </blockquote>
              <p>
                Skor pertandingan: {record?.contest?.score || "TBA"}. Label turnamen: {record?.tarkam?.title || record?.tarkam?.week || match.group}.
                Ini membuat halaman detail tetap berguna meski sistem sumber hanya menyimpan sedikit informasi terstruktur.
              </p>
              <ul className="tags mb-30">
                <li><a href="#">{record?.contest?.gender || "Terbuka"}</a></li>
                <li><a href="#">{record?.tarkam?.status || "Turnamen"}</a></li>
                <li><a href="#">{record?.winnerTeam?.name || "Hasil menunggu"}</a></li>
                <li><a href="#">{record?.tarkam?.week ? `Minggu ${record.tarkam.week}` : "Braket"}</a></li>
              </ul>
              <h3 className="comment-title">Community Notes</h3>
              <DisqusThread
                identifier={record?.item?.id ? `match-${record.item.id}` : `${record?.item?.leftTeam}-${record?.item?.rightTeam}`}
                title={`${match.leftTeam} vs ${match.rightTeam}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MatchDetailsContent;