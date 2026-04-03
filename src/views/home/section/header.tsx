import { useState, useEffect } from "react";

interface HeaderProps {
	sliders: {
		title?: string;
		subtitle?: string;
		image?: string;
		imgAlt?: string;
	}[];
}

function Headers({ sliders }: HeaderProps) {
	const [autoPlayIndex, setAutoPlayIndex] = useState(0);

	// Auto-play hero carousel every 5 seconds
	useEffect(() => {
		if (sliders.length === 0) return;
		const interval = setInterval(() => {
			setAutoPlayIndex((prev) => (prev + 1) % sliders.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [sliders.length]);

	const currentSlide = sliders[autoPlayIndex];

	return (
		<div className="header-hero-container">
			<div className="hero-slide">
				{currentSlide?.image && (
					<img
						src={currentSlide.image}
						alt={currentSlide.imgAlt || "tarkam"}
						className="hero-image"
					/>
				)}
				<div className="hero-gradient"></div>
				<div className={currentSlide?.title || currentSlide?.subtitle ? "hero-content heading" : "hero-content"}>
					<h1>{currentSlide?.title}</h1>
				{currentSlide?.subtitle && <div dangerouslySetInnerHTML={{ __html: currentSlide.subtitle }} />}
				</div>
			</div>
		</div>
	);
}

export default Headers;