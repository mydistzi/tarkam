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
              <h2>No match data available yet.</h2>
              <p>The public contest feed has not returned any records yet. Please come back later.</p>
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
            <img className="left" src={match.leftLogo} alt={match.leftTeam} />
            <h3 className="left-team"><Link to={match.leftTeamPath || "/team-details"}>{match.leftTeam}</Link></h3>
            <div className="vs"><h2>vs</h2></div>
            <h3 className="right-team"><Link to={match.rightTeamPath || "/team-details"}>{match.rightTeam}</Link></h3>
            <img className="right" src={match.rightLogo} alt={match.rightTeam} />
          </div>
        </div>
      </section>
      <section className="match-details-section padding-top">
        <div className="container">
          <div className="col-lg-8 offset-lg-2">
            <div className="match-details">
              <ul className="post-meta">
                <li><i className="las la-calendar" />{match.date}</li>
                <li><i className="las la-gamepad" />{record?.contest?.gender || "Open Division"}</li>
                <li><i className="las la-trophy" />{record?.winnerTeam?.name || "Winner pending"}</li>
              </ul>
              <h2>{match.leftTeam} Vs {match.rightTeam}</h2>
              <p>
                This detail page is now generated from the contest graph in the live Tarkam API. It combines the
                contest entry, both connected teams, and the parent tarkam schedule into one match narrative.
              </p>
              <p>
                {record?.tarkam?.description || "Schedule description has not been filled yet, so this page falls back to a clean neutral summary instead of breaking layout."}
              </p>
              <blockquote>
                <i className="fas fa-quote-right" />
                Winner: {record?.winner?.nickname || record?.winnerTeam?.name || "TBA"}
                <span>- Prize: {record?.winner?.prize || "Awaiting update"}</span>
              </blockquote>
              <p>
                Match score: {record?.contest?.score || "TBA"}. Tournament label: {record?.tarkam?.title || record?.tarkam?.week || match.group}.
                This makes the detail page useful even if the source system only stores a small amount of structured information.
              </p>
              <ul className="tags mb-30">
                <li><a href="#">{record?.contest?.gender || "Open"}</a></li>
                <li><a href="#">{record?.tarkam?.status || "Tournament"}</a></li>
                <li><a href="#">{record?.winnerTeam?.name || "Result Pending"}</a></li>
                <li><a href="#">{record?.tarkam?.week ? `Week ${record.tarkam.week}` : "Bracket"}</a></li>
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