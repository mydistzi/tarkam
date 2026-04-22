import { Profiler, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Footer, GalacticChrome } from "@/galactic/common";
import {
  CartPage,
  CheckoutPage,
  ContactPage,
  Error404Page,
  FaqPage,
  NewsDetailsPage,
  NewsPage,
  HomeDefaultPage,
  MatchDetailsPage,
  PlayerDetailsPage,
  ClubsPage,
  ClubDetailsPage,
  RouteErrorPage,
  ShopDetailsPage,
  ShopGridPage,
  SignInPage,
  RegisterPage,
  LogoutPage,
  ProfilePage,
  ClubProfilePage,
  SponsorsPage,
  SponsorLeaderboardPage,
  GlobalLeaderboardPage,
  ClubLeaderboardPage,
  MaleLeaderboardPage,
  FemaleLeaderboardPage,
  TarkamSchedulePage,
  DetailTarkamPage,
  TeamDetailsPage,
  UpcomingMatchesPage,
  WhatsAppPage,
} from "./index";
import { GalacticDataProvider, useGalacticSiteContent } from "./shared";
import { RequireAuth } from "./auth/AuthProvider";
import AcceptableUsePolicy from "../policies/AcceptableUsePolicy";
import DataDeletionPolicy from "../policies/DataDeletionPolicy";
import PrivacyPolicy from "../policies/PrivacyPolicy";
import TermsOfService from "../policies/TermsOfService";
import CommentPolicy from "../policies/CommentPolicy";
import { recordPageRender } from "./shared/renderAudit";

const ProfiledRoute = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  const location = useLocation();

  return (
    <Profiler
      id={name}
      onRender={(id, phase, actualDuration) => {
        recordPageRender({
          name: String(id),
          pathname: location.pathname,
          phase,
          actualDurationMs: actualDuration,
        });
      }}
    >
      {children}
    </Profiler>
  );
};

const withAudit = (name: string, element: ReactNode) => (
  <ProfiledRoute name={name}>{element}</ProfiledRoute>
);

const GalacticLayout = () => {
  const { footerLinks, menus, meta } = useGalacticSiteContent();

  return (
    <GalacticChrome menuItems={menus} logoUrl={meta.logoUrl}>
      <Helmet>
        <meta name="author" content={meta.author || meta.siteName} />
        <meta name="application-name" content={meta.siteName} />
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:locale" content="id_ID" />
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
      { path: "/", element: withAudit("HomeDefaultPage", <HomeDefaultPage />) },
      { path: "/tarkam-schedule", element: withAudit("TarkamSchedulePage", <TarkamSchedulePage />) },
      { path: "/detail-tarkam/week-:tarkamId", element: withAudit("DetailTarkamPage", <DetailTarkamPage />) },
      { path: "/detail-tarkam/:tarkamId", element: withAudit("DetailTarkamPage", <DetailTarkamPage />) },
      { path: "/jadwal-pertandingan", element: withAudit("UpcomingMatchesPage", <UpcomingMatchesPage />) },
      {
        path: "/detail-pertandingan/:contestId",
        element: withAudit("MatchDetailsPage", <MatchDetailsPage />),
      },
      { path: "/detail-player/:slug", element: withAudit("PlayerDetailsPage", <PlayerDetailsPage />) },
      { path: "/detail-tim/:teamId", element: withAudit("TeamDetailsPage", <TeamDetailsPage />) },
      { path: "/klub", element: withAudit("ClubsPage", <ClubsPage />) },
      { path: "/detail-klub/:slug", element: withAudit("ClubDetailsPage", <ClubDetailsPage />) },
      { path: "/news", element: withAudit("NewsPage", <NewsPage />) },
      { path: "/news/category/:categorySlug", element: withAudit("NewsPage", <NewsPage />) },
      { path: "/news/tag/:tagSlug", element: withAudit("NewsPage", <NewsPage />) },
      { path: "/detail-news/:slug", element: withAudit("NewsDetailsPage", <NewsDetailsPage />) },
      { path: "/shop", element: withAudit("ShopGridPage", <ShopGridPage />) },
      { path: "/detail-shop/:slug", element: withAudit("ShopDetailsPage", <ShopDetailsPage />) },
      { path: "/sponsors", element: withAudit("SponsorsPage", <SponsorsPage />) },
      { path: "/sponsor-leaderboard", element: withAudit("SponsorLeaderboardPage", <SponsorLeaderboardPage />) },
      { path: "/global-leaderboard", element: withAudit("GlobalLeaderboardPage", <GlobalLeaderboardPage />) },
      { path: "/club-leaderboard", element: withAudit("ClubLeaderboardPage", <ClubLeaderboardPage />) },
      { path: "/male-leaderboard", element: withAudit("MaleLeaderboardPage", <MaleLeaderboardPage />) },
      { path: "/female-leaderboard", element: withAudit("FemaleLeaderboardPage", <FemaleLeaderboardPage />) },
      { path: "/pusat-bantuan", element: withAudit("FaqPage", <FaqPage />) },
      { path: "/kebijakan-privasi", element: withAudit("PrivacyPolicy", <PrivacyPolicy />) },
      { path: "/comment-policy", element: withAudit("CommentPolicy", <CommentPolicy />) },
      { path: "/syarat-dan-ketentuan", element: withAudit("TermsOfService", <TermsOfService />) },
      { path: "/ketentuan-penggunaan", element: withAudit("AcceptableUsePolicy", <AcceptableUsePolicy />) },
      { path: "/ketentuan-penghapusan-data", element: withAudit("DataDeletionPolicy", <DataDeletionPolicy />) },
      { path: "/hubungi-kami", element: withAudit("ContactPage", <ContactPage />) },
      { path: "/cart", element: withAudit("CartPage", <CartPage />) },
      {
        path: "/profile",
        element: (
          <ProfiledRoute name="ProfilePage">
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          </ProfiledRoute>
        ),
      },
      {
        path: "/club-profile",
        element: (
          <ProfiledRoute name="ClubProfilePage">
            <RequireAuth>
              <ClubProfilePage />
            </RequireAuth>
          </ProfiledRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProfiledRoute name="CheckoutPage">
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          </ProfiledRoute>
        ),
      },
      { path: "/signin", element: withAudit("SignInPage", <SignInPage />) },
      { path: "/register", element: withAudit("RegisterPage", <RegisterPage />) },
      { path: "/logout", element: withAudit("LogoutPage", <LogoutPage />) },
      { path: "/404", element: withAudit("Error404Page", <Error404Page />) },
      { path: "/whatsapp", element: withAudit("WhatsAppPage", <WhatsAppPage />) },
      { path: "*", element: withAudit("Error404Page", <Error404Page />) },
    ],
  },
];
