interface AboutsProps {
	description: string;
	imageSrc: string;
	altText: string;
}

function Abouts({ description, imageSrc, altText }: AboutsProps) {
  return (
    <div className="distaboutaits" id="aboutTarkam">
		<div className="container">
			<div className="distaboutaits-grids">
				<div className="col-md-6 distaboutaits-grid distaboutaits-grid-1">
					<h3>{`About Tarkam`}</h3>
					<p><div dangerouslySetInnerHTML={{ __html: description }} /></p>
				</div>
				<div className="col-md-6 distaboutaits-grid distaboutaits-grid-2">
					<img src={imageSrc} alt={altText || "Tarkam"} />
				</div>
				<div className="clearfix"></div>
			</div>
		</div>
	</div>
  );
}

export default Abouts;
