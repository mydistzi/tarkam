import { useNavigate } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { user, logout } = useAuth();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? "×" : "≡"}
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Panel Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola website publik, data kompetisi, dan API backend.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "-"}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              void logout().then(() => navigate("/signin", { replace: true }));
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
