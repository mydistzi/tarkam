import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { getGalacticRoutes } from "@/views/galactic/routes";
import "@/assets/css/bootstrap.min.css";
import "react-multi-carousel/lib/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "@/assets/css/animate.min.css";
import "@/assets/css/line-awesome.min.css";
import "@/assets/css/odometer.min.css";
import "@/assets/js/odometer.min.js";
import "@/assets/css/venobox.min.css";
import "@/assets/css/keyframe-animation.css";
import "@/assets/css/header.css";
import "@/assets/css/blog.css";
import "@/assets/css/shop.css";
import "@/assets/css/elements.css";
import "@/assets/css/main.css";
import "@/assets/css/galactic-interactions.css";
import "@/assets/css/responsive.css";

const router = createBrowserRouter(getGalacticRoutes());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
)
