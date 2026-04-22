import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/views/galactic/auth/AuthProvider";
import { SocketProvider } from "@/views/galactic/socket/SocketProvider";
import { getGalacticRoutes } from "@/views/galactic/routes";
import "@/assets/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "@/assets/css/animate.min.css";
import "@/assets/css/line-awesome.min.css";
import "@/assets/css/venobox.min.css";
import "@/assets/css/keyframe-animation.css";
import "@/assets/css/header.css";
import "@/assets/css/elements.css";
import "@/assets/css/main.css";
import "@/assets/css/galactic-interactions.css";
import "@/assets/css/luxury-theme.css";
import "@/assets/css/tarkam-theme.css";
import "@/assets/css/responsive.css";

type OdometerWindow = Window & {
  odometerOptions?: {
    auto: boolean;
  };
};

const router = createBrowserRouter(getGalacticRoutes());

;(window as OdometerWindow).odometerOptions = { auto: false };

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SocketProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SocketProvider>
    </HelmetProvider>
  </StrictMode>,
)
