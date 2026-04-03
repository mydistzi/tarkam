import { useState } from 'react';
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Carousel = (CarouselLib as unknown as { default: React.ComponentType<any> }).default || (CarouselLib as React.ComponentType<any>);

interface Category {
    id: number;
    name: string;
}

interface LeaderboardItem {
    id: number;
    category_id: number;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    image_alt?: string;
    url?: string;
}

interface LeaderboardsProps {
    categories: Category[];
    leaderboards: LeaderboardItem[];
}

function Leaderboards({ categories, leaderboards }: LeaderboardsProps) {
    const [activeTab, setActiveTab] = useState<number>(0);

    if (!categories?.length) {
        return (
            <div className="zethtabsaits" id="leaderboardTarkam">
                <section>
                    <h3>LEADERBOARD</h3>
                    <div className="text-center">
                        <p>Leaderboard categories are not available at the moment.</p>
                    </div>
                </section>
            </div>
        );
    }

    const getLeaderboardsByCategory = (categoryId: number) => {
        // Some APIs may return numeric IDs as strings. Normalize both sides to ensure matching.
        const normalizedCategoryId = Number(categoryId);
        return leaderboards.filter((item: LeaderboardItem) => Number(item.category_id) === normalizedCategoryId);
    };

    // const renderStars = (rating: number = 5) => {
    //     const stars = [];
    //     for (let i = 1; i <= 5; i++) {
    //         if (i <= rating) {
    //             stars.push(<li key={i}><i className="fa fa-star" aria-hidden="true"></i></li>);
    //         } else if (i - 0.5 <= rating) {
    //             stars.push(<li key={i}><i className="fa fa-star-half-o" aria-hidden="true"></i></li>);
    //         } else {
    //             stars.push(<li key={i}><i className="fa fa-star-o" aria-hidden="true"></i></li>);
    //         }
    //     }
    //     return stars;
    // };

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div className="zethtabsaits" id="leaderboardTarkam">
            <section>
                <h3>LEADERBOARD</h3>
                <div className="tabs tabs-style-line">
                    <nav className="container">
                        <ul>
                            {categories?.map((category: Category, index: number) => (
                                <li key={category.id || index} className={activeTab === index ? 'tab-current' : ''}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab(index);
                                        }}
                                    >
                                        <span>{category.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="content-wrap">
                        {categories?.map((category: Category, index: number) => {
                            const categoryLeaderboards = getLeaderboardsByCategory(category.id);
                            return (
                                <section
                                    key={category.id}
                                    id={`section-line-${index + 1}`}
                                    style={{ display: activeTab === index ? 'block' : 'none' }}
                                >
                                    {categoryLeaderboards.length > 0 ? (
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
                                            dotListClass="custom-dot-list-style"
                                            itemClass="carousel-item-padding-0-px"
                                        >
                                            {categoryLeaderboards.map((item: LeaderboardItem) => (
                                                <div key={item.id} className="item">
                                                    <div className="agileinfoitem-image">
                                                        <img src={item.image} alt={item.image_alt || item.title} />
                                                    </div>
                                                    <h3>{item.title}</h3>
                                                    <h4>{item.description}</h4>
                                                    {/* <h4>{Math.floor(Math.random() * 900000) + 100000}+ Downloads</h4> */}
                                                    {/* <div className="zethratingaits">
                                                        <ul>
                                                            {renderStars(5)}
                                                        </ul>
                                                    </div>
                                                    <div className="zethitemdownload">
                                                        <a href={item.url || "#"}>Download</a>
                                                    </div> */}
                                                </div>
                                            ))}
                                        </Carousel>
                                    ) : (
                                        <div className="text-center">
                                            <p>No leaderboard items available for this category.</p>
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Leaderboards;
