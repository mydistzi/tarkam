import { PageHeader, WatchLiveGrid } from "@/galactic/common";
import type { StreamItem } from "@/galactic/data";

const TarkamScheduleContent = ({ items }: { items: StreamItem[] }) => (
  <>
    <PageHeader
      eyebrow="Tarkam Mendatang"
      title="Jadwal Streaming Live"
      description="Stream pilihan sekarang tarik data dari endpoint `streamings` dan tetap jaga layout galactic."
    />
    <section className="latest-matches padding-top">
      <div className="container">
        <WatchLiveGrid items={items} />
        <div className="row mt-40">
          {items.map((stream) => (
            <div className="col-lg-4 col-md-6 sm-padding" id={stream.id ? `stream-${stream.id}` : undefined} key={`${stream.title}-${stream.meta}`}>
              <div className="post-card galactic-hover-card">
                <div className="post-thumb">
                  <img src={stream.image} alt={stream.title} />
                  <a className="post-category" href={stream.path || "#"}>{stream.category}</a>
                </div>
                <div className="post-content-wrap">
                  <ul className="post-meta">
                    <li><i className="las la-calendar" />{stream.meta}</li>
                    <li><i className="las la-video" />Streaming Live</li>
                  </ul>
                  <div className="post-content">
                    <h3>{stream.title}</h3>
                    <p>Stream live dan jadwal showcase ini diambil dari API yang terhubung.</p>
                    <a className="read-more" href={stream.videoUrl} rel="noreferrer" target="_blank">Nonton Stream</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export { TarkamScheduleContent };
