import { lazy, Profiler, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Footer, GalacticChrome } from "@/galactic/common";
import { GalacticDataProvider, useGalacticSiteContent } from "./shared";
import { RequireAuth } from "./auth/AuthProvider";
import { recordPageRender } from "./shared/renderAudit";

const HomeDefaultPage = lazy(() => import("./home"));
const TarkamSchedulePage = lazy(() => import("./tarkam-schedule"));
const DetailTarkamPage = lazy(() => import("./detail-tarkam"));
const UpcomingMatchesPage = lazy(() => import("./jadwal-pertandingan"));
const MatchDetailsPage = lazy(() => import("./detail-pertandingan"));
const PlayerDetailsPage = lazy(() => import("./detail-player"));
const TeamDetailsPage = lazy(() => import("./detail-tim"));
const ClubsPage = lazy(() => import("./klub"));
const ClubDetailsPage = lazy(() => import("./detail-klub"));
const NewsPage = lazy(() => import("./news"));
const NewsDetailsPage = lazy(() => import("./detail-news"));
const ShopGridPage = lazy(() => import("./shop"));
const ShopDetailsPage = lazy(() => import("./detail-shop"));
const CartPage = lazy(() => import("./cart"));
const CheckoutPage = lazy(() => import("./checkout"));
const SignInPage = lazy(() => import("./auth/SignIn"));
const RegisterPage = lazy(() => import("./auth/Register"));
const LogoutPage = lazy(() => import("./auth/Logout"));
const ProfilePage = lazy(() => import("./profile"));
const ClubProfilePage = lazy(() => import("./club-profile"));
const SponsorsPage = lazy(() => import("./sponsors"));
const SponsorLeaderboardPage = lazy(() => import("./sponsor-leaderboard"));
const GlobalLeaderboardPage = lazy(() => import("./global-leaderboard"));
const ClubLeaderboardPage = lazy(() => import("./club-leaderboard"));
const MaleLeaderboardPage = lazy(() => import("./male-leaderboard"));
const FemaleLeaderboardPage = lazy(() => import("./female-leaderboard"));
const FaqPage = lazy(() => import("./pusat-bantuan"));
const ContactPage = lazy(() => import("./hubungi-kami"));
const WhatsAppPage = lazy(() => import("./whatsapp"));
const Error404Page = lazy(() => import("./error404"));
const RouteErrorPage = lazy(() => import("./route-error"));
const AcceptableUsePolicy = lazy(() => import("../policies/AcceptableUsePolicy"));
const DataDeletionPolicy = lazy(() => import("../policies/DataDeletionPolicy"));
const PrivacyPolicy = lazy(() => import("../policies/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../policies/TermsOfService"));
const CommentPolicy = lazy(() => import("../policies/CommentPolicy"));

const RouteFallback = () => (
  <div className="tarkam-empty-state" style={{ margin: "48px auto", maxWidth: "720px" }}>
    <h3 style={{ marginBottom: "12px" }}>Memuat halaman...</h3>
    <p>Konten sedang dipersiapkan supaya halaman tetap lebih ringan saat pertama dibuka.</p>
  </div>
);

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

const withLazyPage = (name: string, Component: LazyExoticComponent<ComponentType<any>>) =>
  withAudit(
    name,
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>,
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
      <Suspense fallback={<RouteFallback />}>
        <RouteErrorPage />
      </Suspense>
    </GalacticChrome>
  </GalacticDataProvider>
);

export const getGalacticRoutes = (): RouteObject[] => [
  {
    element: <GalacticRoot />,
    errorElement: <GalacticErrorRoot />,
    children: [
      { path: "/", element: withLazyPage("HomeDefaultPage", HomeDefaultPage) },
      { path: "/tarkam-schedule", element: withLazyPage("TarkamSchedulePage", TarkamSchedulePage) },
      { path: "/detail-tarkam/week-:tarkamId", element: withLazyPage("DetailTarkamPage", DetailTarkamPage) },
      { path: "/detail-tarkam/:tarkamId", element: withLazyPage("DetailTarkamPage", DetailTarkamPage) },
      { path: "/jadwal-pertandingan", element: withLazyPage("UpcomingMatchesPage", UpcomingMatchesPage) },
      {
        path: "/detail-pertandingan/:contestId",
        element: withLazyPage("MatchDetailsPage", MatchDetailsPage),
      },
      { path: "/detail-player/:slug", element: withLazyPage("PlayerDetailsPage", PlayerDetailsPage) },
      { path: "/detail-tim/:teamId", element: withLazyPage("TeamDetailsPage", TeamDetailsPage) },
      { path: "/klub", element: withLazyPage("ClubsPage", ClubsPage) },
      { path: "/detail-klub/:slug", element: withLazyPage("ClubDetailsPage", ClubDetailsPage) },
      { path: "/news", element: withLazyPage("NewsPage", NewsPage) },
      { path: "/news/category/:categorySlug", element: withLazyPage("NewsPage", NewsPage) },
      { path: "/news/tag/:tagSlug", element: withLazyPage("NewsPage", NewsPage) },
      { path: "/detail-news/:slug", element: withLazyPage("NewsDetailsPage", NewsDetailsPage) },
      { path: "/shop", element: withLazyPage("ShopGridPage", ShopGridPage) },
      { path: "/detail-shop/:slug", element: withLazyPage("ShopDetailsPage", ShopDetailsPage) },
      { path: "/sponsors", element: withLazyPage("SponsorsPage", SponsorsPage) },
      { path: "/sponsor-leaderboard", element: withLazyPage("SponsorLeaderboardPage", SponsorLeaderboardPage) },
      { path: "/global-leaderboard", element: withLazyPage("GlobalLeaderboardPage", GlobalLeaderboardPage) },
      { path: "/club-leaderboard", element: withLazyPage("ClubLeaderboardPage", ClubLeaderboardPage) },
      { path: "/male-leaderboard", element: withLazyPage("MaleLeaderboardPage", MaleLeaderboardPage) },
      { path: "/female-leaderboard", element: withLazyPage("FemaleLeaderboardPage", FemaleLeaderboardPage) },
      { path: "/pusat-bantuan", element: withLazyPage("FaqPage", FaqPage) },
      { path: "/kebijakan-privasi", element: withLazyPage("PrivacyPolicy", PrivacyPolicy) },
      { path: "/comment-policy", element: withLazyPage("CommentPolicy", CommentPolicy) },
      { path: "/syarat-dan-ketentuan", element: withLazyPage("TermsOfService", TermsOfService) },
      { path: "/ketentuan-penggunaan", element: withLazyPage("AcceptableUsePolicy", AcceptableUsePolicy) },
      { path: "/ketentuan-penghapusan-data", element: withLazyPage("DataDeletionPolicy", DataDeletionPolicy) },
      { path: "/hubungi-kami", element: withLazyPage("ContactPage", ContactPage) },
      { path: "/cart", element: withLazyPage("CartPage", CartPage) },
      {
        path: "/profile",
        element: (
          <ProfiledRoute name="ProfilePage">
            <Suspense fallback={<RouteFallback />}>
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            </Suspense>
          </ProfiledRoute>
        ),
      },
      {
        path: "/club-profile",
        element: (
          <ProfiledRoute name="ClubProfilePage">
            <Suspense fallback={<RouteFallback />}>
              <RequireAuth>
                <ClubProfilePage />
              </RequireAuth>
            </Suspense>
          </ProfiledRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProfiledRoute name="CheckoutPage">
            <Suspense fallback={<RouteFallback />}>
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            </Suspense>
          </ProfiledRoute>
        ),
      },
      { path: "/signin", element: withLazyPage("SignInPage", SignInPage) },
      { path: "/register", element: withLazyPage("RegisterPage", RegisterPage) },
      { path: "/logout", element: withLazyPage("LogoutPage", LogoutPage) },
      { path: "/404", element: withLazyPage("Error404Page", Error404Page) },
      { path: "/whatsapp", element: withLazyPage("WhatsAppPage", WhatsAppPage) },
      { path: "*", element: withLazyPage("Error404Page", Error404Page) },
    ],
  },
];
