import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Footer, GalacticChrome } from "@/galactic/common";
import {
  AboutPage,
  BlogClassicPage,
  BlogDetailsPage,
  BlogGridPage,
  CartPage,
  CheckoutPage,
  ContactPage,
  Error404Page,
  FaqPage,
  HomeDefaultPage,
  HomeEsportsPage,
  MatchDetailsPage,
  OurGamersPage,
  PlayerDetailsPage,
  RouteErrorPage,
  ShopDetailsPage,
  ShopGridPage,
  SponsorsPage,
  TarkamSchedulePage,
  TeamDetailsPage,
  UpcomingMatchesPage,
  WhatsAppPage,
} from "./index";
import { GalacticDataProvider, useGalacticContent } from "./shared";
import AcceptableUsePolicy from "../policies/AcceptableUsePolicy";
import DataDeletionPolicy from "../policies/DataDeletionPolicy";
import PrivacyPolicy from "../policies/PrivacyPolicy";
import TermsOfService from "../policies/TermsOfService";

const GalacticLayout = () => {
  const { footerLinks, menus, meta } = useGalacticContent();

  return (
    <GalacticChrome menuItems={menus} logoUrl={meta.logoUrl}>
      <Helmet>
        <meta name="author" content={meta.author || meta.siteName} />
        <meta name="application-name" content={meta.siteName} />
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:locale" content="id_ID" />
        <link rel="canonical" href={meta.siteUrl} />
        {meta.faviconUrl ? <link rel="icon" href={meta.faviconUrl} /> : null}
      </Helmet>
      <Outlet />
      <Footer
        logoUrl={meta.logoUrl}
        siteName={meta.siteName}
        description={meta.description}
        socialLinks={meta.socialLinks}
        usefulLinks={footerLinks}
        contact={{
          location: meta.address,
          email: meta.email,
          phone: meta.phone,
        }}
      />
    </GalacticChrome>
  );
};

const GalacticRoot = () => (
  <GalacticDataProvider>
    <GalacticLayout />
  </GalacticDataProvider>
);

const GalacticErrorRoot = () => (
  <GalacticDataProvider>
    <GalacticChrome>
      <RouteErrorPage />
    </GalacticChrome>
  </GalacticDataProvider>
);

export const getGalacticRoutes = (): RouteObject[] => [
  {
    element: <GalacticRoot />,
    errorElement: <GalacticErrorRoot />,
    children: [
      { path: "/", element: <HomeDefaultPage /> },
      { path: "/index-2", element: <HomeEsportsPage /> },
      { path: "/jadwal-pertandingan", element: <UpcomingMatchesPage /> },
      { path: "/tarkam-schedule", element: <TarkamSchedulePage /> },
      { path: "/detail-pertandingan", element: <MatchDetailsPage /> },
      { path: "/detail-pertandingan/:contestId", element: <MatchDetailsPage /> },
      { path: "/player-details", element: <PlayerDetailsPage /> },
      { path: "/player-details/:playerId", element: <PlayerDetailsPage /> },
      { path: "/detail-tim", element: <TeamDetailsPage /> },
      { path: "/detail-tim/:teamId", element: <TeamDetailsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/our-gamers", element: <OurGamersPage /> },
      { path: "/sponsors", element: <SponsorsPage /> },
      { path: "/pusat-bantuan", element: <FaqPage /> },
      { path: "/404", element: <Error404Page /> },
      { path: "/shop", element: <ShopGridPage /> },
      { path: "/shop-details", element: <ShopDetailsPage /> },
      { path: "/shop-details/:productId", element: <ShopDetailsPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/blog-grid", element: <BlogGridPage /> },
      { path: "/news", element: <BlogClassicPage /> },
      { path: "/blog-details", element: <BlogDetailsPage /> },
      { path: "/blog-details/:blogId", element: <BlogDetailsPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/whatsapp", element: <WhatsAppPage /> },
      { path: "/syarat-dan-ketentuan", element: <TermsOfService /> },
      { path: "/kebijakan-privasi", element: <PrivacyPolicy /> },
      { path: "/ketentuan-penggunaan", element: <AcceptableUsePolicy /> },
      { path: "/penghapusan-data", element: <DataDeletionPolicy /> },
      { path: "*", element: <Error404Page /> },
    ],
  },
];
