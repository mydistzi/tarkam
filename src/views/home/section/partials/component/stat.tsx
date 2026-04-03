interface StatsProps {
	mosts: {
		title: string;
		slug: string;
		nickname: string;
		image_path: string;
	}[];
}

function Stats({ mosts }: StatsProps) {
    return (
        <div className="diststatsaits" id="tarkamStats">
		<div className="container">

			<div className="diststatsaits-info">
				{mosts.map((most, index) => (
					<div key={index} className={`col-md-3 diststatsaits-grid diststatsaits-grid-${index}`}>
						<div className="diststatsaits-img">
							<img src={most.image_path} alt={most.nickname} />
						</div>
						<div className="diststatsaitsstats">{most.nickname}</div>
						<p>{most.title}</p>
					</div>
				))}
				<div className="clearfix"></div>
			</div>

		</div>
	</div>
    )
}

export default Stats;