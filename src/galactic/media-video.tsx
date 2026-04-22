import { getExternalVideoUrl, getNormalizedVideoUrl, PlaySvg } from "@/galactic/media-helpers";

const VideoCardButton = ({ href, normalizeFacebook = false }: { href: string; normalizeFacebook?: boolean }) => {
  const normalizedHref = normalizeFacebook ? getNormalizedVideoUrl(href) : href;
  const sourceHref = getExternalVideoUrl(href);

  return (
    <button
      className="dl-video-popup play-btn vbox-item"
      data-video-title="Tarkam Highlight Reel"
      data-video-url={normalizedHref}
      data-video-source-url={sourceHref}
      type="button"
    >
      <PlaySvg />
      <div className="ripple" />
    </button>
  );
};

const VideoStreemButton = ({
  href,
  normalizeFacebook = false,
  label = "Watch Stream",
}: {
  href: string;
  normalizeFacebook?: boolean;
  label?: string;
}) => {
  const normalizedHref = normalizeFacebook ? getNormalizedVideoUrl(href) : href;
  const sourceHref = getExternalVideoUrl(href);

  return (
    <button
      className="dl-video-popup vbox-item fb-video"
      data-video-title={label}
      data-autoplay="true"
      data-mute="false"
      data-allowfullscreen="true"
      data-video-url={normalizedHref}
      data-video-source-url={sourceHref}
      type="button"
    >
      <i className="lab la-youtube" /> {label}
    </button>
  );
};

export { VideoCardButton, VideoStreemButton };
