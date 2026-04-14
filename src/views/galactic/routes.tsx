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
  ClubsPage,
  ClubDetailsPage,
  RouteErrorPage,
  ShopDetailsPage,
  ShopGridPage,
  SignInPage,
  RegisterPage,
  LogoutPage,
  SponsorsPage,
  TarkamSchedulePage,
  DetailTarkamPage,
  TeamDetailsPage,
  UpcomingMatchesPage,
  WhatsAppPage,
} from "./index";
import { GalacticDataProvider, useGalacticContent } from "./shared";
import { RequireAuth } from "./auth/AuthProvider";
import AcceptableUsePolicy from "../policies/AcceptableUsePolicy";
import DataDeletionPolicy from "../policies/DataDeletionPolicy";
import PrivacyPolicy from "../policies/PrivacyPolicy";
import TermsOfService from "../policies/TermsOfService";
import CommentPolicy from "../policies/CommentPolicy";

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
      { path: "/detail-pertandingan/:contestId", element: <MatchDetailsPage /> },
      { path: "/tarkam-schedule", element: <TarkamSchedulePage /> },
      { path: "/detail-tarkam/:tarkamId", element: <DetailTarkamPage /> },
      { path: "/detail-player/:playerId", element: <PlayerDetailsPage /> },
      { path: "/detail-tim/:teamId", element: <TeamDetailsPage /> },
      { path: "/klub", element: <ClubsPage /> },
      { path: "/detail-klub/:slug", element: <ClubDetailsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/our-gamers", element: <OurGamersPage /> },
      { path: "/sponsors", element: <SponsorsPage /> },
      { path: "/pusat-bantuan", element: <FaqPage /> },
      { path: "/404", element: <Error404Page /> },
      { path: "/shop", element: <ShopGridPage /> },
      { path: "/detail-shop/:slug", element: <ShopDetailsPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <RequireAuth><CheckoutPage /></RequireAuth> },
      { path: "/signin", element: <SignInPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/logout", element: <LogoutPage /> },
      { path: "/blog-grid", element: <BlogGridPage /> },
      { path: "/news", element: <BlogClassicPage /> },
      { path: "/detail-news/:slug", element: <BlogDetailsPage /> },
      { path: "/hubungi-kami", element: <ContactPage /> },
      { path: "/whatsapp", element: <WhatsAppPage /> },
      { path: "/syarat-dan-ketentuan", element: <TermsOfService /> },
      { path: "/kebijakan-privasi", element: <PrivacyPolicy /> },
      { path: "/ketentuan-penggunaan", element: <AcceptableUsePolicy /> },
      { path: "/ketentuan-penghapusan-data", element: <DataDeletionPolicy /> },
      { path: "/comment-policy", element: <CommentPolicy /> },
      { path: "*", element: <Error404Page /> },
    ],
  },
];
