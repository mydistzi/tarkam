import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Carousel = (CarouselLib as unknown as { default: React.ComponentType<any> }).default || (CarouselLib as React.ComponentType<any>);

interface PartnerProps {
    sponsors: {
        image?: string;
        alt?: string;
  }[];
}

export default function Partners({ sponsors }: PartnerProps) {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            partialVisibilityGutter: 0
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            partialVisibilityGutter: 0
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            partialVisibilityGutter: 0
        },
    };


    return (
            <div className="aitspartnersdsl">
                <Carousel
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    pauseOnHover={true}
                    responsive={responsive}
                    ssr={true}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    keyBoardControl={true}
                    transitionDuration={3000}
                    removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                    itemClass=""
                    containerClass="sponsor-carousel"
                >
                    {sponsors && sponsors.length > 0 ? (
                        sponsors.map((item, key) => (
                            <div className="sponsor-item" key={key}>
                                {item.image ? (
                                    <img src={item.image} alt={item.alt || "Partner"} />
                                ) : (
                                    <div style={{ textAlign: "center", color: "#666" }}>No Image</div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="sponsor-item" style={{ textAlign: "center", color: "#666" }}>No sponsors available</div>
                    )}
                </Carousel>
            </div>
    )
}