interface PlatformsProps {
	platforms: {
		id?: number;
		name: string;
		image: string;
		icon: string;
	}[];
}

function Platforms({ platforms }: PlatformsProps) {
  return (
    <div className="agileinfoplatforms" id="platformsTarkam">
		<div className="agileinfoplatformsgrids">
			  {platforms.map((platform, index) => (
				  <div key={platform.id || index} className={`col-md-3 dsagile_gallery_grid dsagile_gallery_grid${index}`}>
					  <div className="dsagile_gallery_image">
						  <figure>
							  <img src={platform.image} alt={platform.name} className="img-responsive gray" />
							  <figcaption>
								  <h4>{platform.name}</h4>
								  <p><span><img src={platform.icon} alt={platform.name} /></span></p>
							  </figcaption>
						  </figure>
					  </div>
				  </div>
			  ))}
		</div>
		<div className="clearfix"></div>
	</div>
  );
}

export default Platforms;
