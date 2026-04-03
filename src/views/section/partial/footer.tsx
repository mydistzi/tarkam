import { useEffect } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "@/views/component/partials/lstorage";
import DiscordWidget from "@/views/section/partial/DiscordWidget";
// import { DiscussionEmbed } from 'disqus-react';

interface FooterProps {
  site_name?: string;
  first_name?: string;
  author_name?: string;
  copyRight: string;
  Year: number;
  instagram_url: string;
  facebook_url: string;
  whatsapp_url: string;
  discord_url: string;
  email?: string;
  phone_number?: string;
  whatsapp_number?: string;
  address?: string;
  meta_description?: string;
  logoPath?: string;
  menus?: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  title: string;
  url: string;
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("movetop")!.style.display = "block";
  } else {
    document.getElementById("movetop")!.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
const topFunction = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


function Footers({ site_name, author_name, copyRight, Year, instagram_url, facebook_url, whatsapp_url, discord_url, meta_description, address, logoPath, first_name, menus }: FooterProps) {

  const [selectedIndex, setSelectedIndex] = useLocalStorage("selectedIndex", -1);

  useEffect(() => {
    // Disqus count widget requires the count.js script to be loaded.
    // This ensures it is available even if Disqus is never embedded elsewhere.
    if (!document.getElementById('disqus-count-script')) {
      const script = document.createElement('script');
      script.id = 'disqus-count-script';
      const shortname = import.meta.env.VITE_DISQUS_SHORTNAME || 'tarkam';
      script.src = `https://${shortname}.disqus.com/count.js`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
    <footer className="agilefooterzeth" id="agilefooterzeth">
      <div className="container">
        {/* <div className="footer-col">
            <DiscussionEmbed
              shortname={import.meta.env.VITE_DISQUS_SHORTNAME || "tarkam"}
              config={{
                url: window.location.href,
                identifier: `page-${window.location.pathname}`,
                title: document.title || site_name,
                language: 'en_US',
              }}
            />
          </div> */}
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">
                <Link reloadDocument to="/" className="footer-logo-link">
                  {logoPath ? (
                    <img src={logoPath} alt={`${first_name} Logo`} className="footer-logo-image" />
                  ) : (
                    <span className="footer-logo-text">{first_name || "Tarkam"}</span>
                  )}
                </Link>
              </span>
              <span className="footer-logo-text">
                <Link reloadDocument to="/" className="footer-logo-link">
                  {site_name || "Tarkam"}
                </Link>
              </span>
            </div>
            <p className="footer-desc">{meta_description}</p>
            <div className="footer-location">
              <i className="fa fa-map-marker" aria-hidden="true"></i>
              <span>{address}</span>
            </div>
            <div className="footer-social">
              <Link reloadDocument to={whatsapp_url} target="_blank" className="footer-social-link" title="WhatsApp">
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              </Link>
              <Link reloadDocument to={facebook_url} target="_blank" className="footer-social-link" title="Facebook">
                <i className="fa-brands fa-facebook" aria-hidden="true"></i>
              </Link>
              <Link reloadDocument to={discord_url} target="_blank" className="footer-social-link" title="Discord">
                <i className="fa-brands fa-discord" aria-hidden="true"></i>
              </Link>
              <Link reloadDocument to={instagram_url} target="_blank" className="footer-social-link" title="Instagram">
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </Link>
            </div>
            <div className="footer-status">
              <span className="footer-status-dot" />
              <span>{`All Operating Systems`}</span>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>{`QUICK LINKS`}</h4>
              <ul>
                {menus?.map((menu, index) => (
                  <li key={index} className={selectedIndex === index ? "scroll active" : "scroll"} onClick={() => { setSelectedIndex(index); scrollToSection(menu.url); }}>
                    <Link to={`/#${menu.url}`} className="scroll">{menu.title || menu.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>{`LEGAL`}</h4>
              <ul>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/data-deletion">Data Deletion Policy</Link>
                </li>
                <li>
                  <Link to="/acceptable-use">Acceptable Use Policy</Link>
                </li>
                <li>
                  <Link reloadDocument to={discord_url} target="_blank">Support Server</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <DiscordWidget />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            {site_name} {copyRight} {Year}. {`All rights reserved`} | {author_name && (<> {`Brought to you by`} <Link reloadDocument to={instagram_url} target="_blank">{author_name}</Link>.</>)}
          </p>
        </div>
      </div>

      <span onClick={topFunction} id="movetop" title="Go to top">
        <img src="/src/assets/images/to-top.png" alt="Go to top" />
      </span>
    </footer>
  );
};

export default Footers;