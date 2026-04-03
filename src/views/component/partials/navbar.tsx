import { Link } from "react-router-dom";
import useLocalStorage from "./lstorage";

interface NavbarsProps {
	brandName: string;
	navItems: {
		url: string;
		title: string;
	}[];
}

function Navbars({ brandName, navItems }: NavbarsProps) {

	const [selectedIndex, setSelectedIndex] = useLocalStorage("selectedIndex", -1);

	const scrollToSection = (id: string) => {
		// Remove hash if present
		const cleanId = id.replace(/^#/, '');
		const element = document.getElementById(cleanId);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

  return (
    <div className="distnavigation">
			<nav className="navbar navbar-inverse agilehover-effect zetheffect navbar-default">

				<div className="navbar-header">
					<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span className="sr-only">{`Toggle navigation`}</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<div className="logo">
						<Link reloadDocument to="/" className="navbar-brand logo-dsl button">{` ${brandName}`}</Link>
					</div>
				</div>

				<div id="navbar" className="navbar-collapse navbar-right collapse">
					<ul className="nav navbar-nav navbar-right cross-effect" id="cross-effect">
					  {navItems.map((items, index) => {
						  return (
							  <li key={index} className={selectedIndex === index ? "scroll active" : "scroll"} onClick={() => { setSelectedIndex(index); scrollToSection(items.url); }}>
								  <Link to={`/#${items.url}`} className="scroll">
									  {items.title}
								  </Link>
							  </li>
						  );
					  })}
						{/* <li className="dropdown">
							<Link to="#" className="dropdown-toggle" data-toggle="dropdown">{`Login`}<b className="caret"></b></Link>
							<div className="dropdown-menu">
								
							</div>
						</li> */}
					</ul>
				</div>

			</nav>
		</div>
  )
}

export default Navbars;
