import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
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
      { path: "/tarkam-schedule", element: <TarkamSchedulePage /> },
      { path: "/detail-tarkam/week-:tarkamId", element: <DetailTarkamPage /> },
      { path: "/detail-tarkam/:tarkamId", element: <DetailTarkamPage /> },
      { path: "/jadwal-pertandingan", element: <UpcomingMatchesPage /> },
      {
        path: "/detail-pertandingan/:contestId",
        element: <MatchDetailsPage />,
      },
      { path: "/detail-player/:slug", element: <PlayerDetailsPage /> },
      { path: "/detail-tim/:teamId", element: <TeamDetailsPage /> },
      { path: "/klub", element: <ClubsPage /> },
      { path: "/detail-klub/:slug", element: <ClubDetailsPage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/news/category/:categorySlug", element: <NewsPage /> },
      { path: "/news/tag/:tagSlug", element: <NewsPage /> },
      { path: "/detail-news/:slug", element: <NewsDetailsPage /> },
      { path: "/shop", element: <ShopGridPage /> },
      { path: "/detail-shop/:slug", element: <ShopDetailsPage /> },
      { path: "/sponsors", element: <SponsorsPage /> },
      { path: "/sponsor-leaderboard", element: <SponsorLeaderboardPage /> },
      { path: "/global-leaderboard", element: <GlobalLeaderboardPage /> },
      { path: "/club-leaderboard", element: <ClubLeaderboardPage /> },
      { path: "/male-leaderboard", element: <MaleLeaderboardPage /> },
      { path: "/female-leaderboard", element: <FemaleLeaderboardPage /> },
      { path: "/pusat-bantuan", element: <FaqPage /> },
      { path: "/kebijakan-privasi", element: <PrivacyPolicy /> },
      { path: "/comment-policy", element: <CommentPolicy /> },
      { path: "/syarat-dan-ketentuan", element: <TermsOfService /> },
      { path: "/ketentuan-penggunaan", element: <AcceptableUsePolicy /> },
      { path: "/ketentuan-penghapusan-data", element: <DataDeletionPolicy /> },
      { path: "/hubungi-kami", element: <ContactPage /> },
      { path: "/cart", element: <CartPage /> },
      {
        path: "/profile",
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: "/club-profile",
        element: (
          <RequireAuth>
            <ClubProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: "/checkout",
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        ),
      },
      { path: "/signin", element: <SignInPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/logout", element: <LogoutPage /> },
      { path: "/404", element: <Error404Page /> },
      { path: "/whatsapp", element: <WhatsAppPage /> },
      { path: "*", element: <Error404Page /> },
    ],
  },
];
