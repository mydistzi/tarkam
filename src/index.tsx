import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import Root from "@/routes/root";
import App from '@/App';
import TermsOfService from '@/views/policies/TermsOfService';
import PrivacyPolicy from '@/views/policies/PrivacyPolicy';
import DataDeletionPolicy from '@/views/policies/DataDeletionPolicy';
import AcceptableUsePolicy from '@/views/policies/AcceptableUsePolicy';
import '@/assets/css/Bootstrap.css';
import '@/assets/css/App.css';


const router = createBrowserRouter([
  {
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/data-deletion",
        element: <DataDeletionPolicy />,
      },
      {
        path: "/acceptable-use",
        element: <AcceptableUsePolicy />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
)
