import { useState } from "react";

interface GalleryImageData {
	src: string;
	alt: string;
}

interface GalleriesProps {
	galleries: GalleryImageData[];
}

function Galleries({ galleries }: GalleriesProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	console.log("Gallery component received:", galleries);

	if (!galleries || galleries.length === 0) {
		return (
			<div className="dsportfolioaits" id="galleryTarkam">
				<h3>{`Gallery`}</h3>
				<p style={{ textAlign: "center", color: "#999" }}>{`No gallery images available`}</p>
			</div>
		);
	}

	const handlePrev = () => {
		if (selectedIndex === null) return;
		setSelectedIndex((prev) =>
			prev === 0 ? galleries.length - 1 : prev! - 1
		);
	};

	const handleNext = () => {
		if (selectedIndex === null) return;
		setSelectedIndex((prev) => (prev! + 1) % galleries.length);
	};

	const selectedImage = selectedIndex !== null ? galleries[selectedIndex] : null;

	return (
		<>
			<div className="dsportfolioaits" id="galleryTarkam">
				<h3>{`Gallery`}</h3>
				<div className="dsportfolioaits-items">
					{galleries.map((image, index) => (
						<div
							key={index}
							className="col-md-3 dsportfolioaits-item"
							onClick={() => setSelectedIndex(index)}
						>
							<div className="grid">
								<figure className="effect-apollo">
									<img src={image.src} alt={image.alt} />
									<figcaption></figcaption>
								</figure>
							</div>
						</div>
					))}
					<div className="clearfix"></div>
				</div>
			</div>

			{/* Gallery Modal */}
			{selectedImage && selectedIndex !== null && (
				<div
					className="gallery-modal-backdrop"
					onClick={() => setSelectedIndex(null)}
				>
					<div
						className="gallery-modal"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							className="gallery-modal-close"
							onClick={() => setSelectedIndex(null)}
						>
							✕
						</button>

						{/* Left Arrow */}
						<button
							className="gallery-modal-arrow gallery-modal-prev"
							onClick={handlePrev}
						>
							‹
						</button>

						{/* Image Display */}
						<div className="gallery-modal-content">
							<img
								src={selectedImage.src}
								alt={selectedImage.alt}
								className="gallery-modal-image"
							/>
						</div>

						{/* Right Arrow */}
						<button
							className="gallery-modal-arrow gallery-modal-next"
							onClick={handleNext}
						>
							›
						</button>

						{/* Pagination */}
						<div className="gallery-modal-pagination">
							<span>{selectedIndex + 1}</span>
							<span className="gallery-pagination-divider">/</span>
							<span>{galleries.length}</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Galleries;
