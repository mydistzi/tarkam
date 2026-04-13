import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import { apiRequest, extractList } from "../../lib/api";

export default function Home() {
  const { user, token } = useAuth();
  const [counts, setCounts] = useState({
    tarkams: 0,
    members: 0,
    teams: 0,
    products: 0,
  });
  const [recentTarkams, setRecentTarkams] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const [tarkams, members, teams, products] = await Promise.all([
          apiRequest<Array<Record<string, unknown>>>("/admin/tarkams", { method: "GET", token }),
          apiRequest<Array<Record<string, unknown>>>("/admin/members", { method: "GET", token }),
          apiRequest<Array<Record<string, unknown>>>("/admin/teams", { method: "GET", token }),
          apiRequest<Array<Record<string, unknown>>>("/admin/products", { method: "GET", token }),
        ]);

        if (!mounted) {
          return;
        }

        const tarkamItems = extractList(tarkams);
        setCounts({
          tarkams: tarkamItems.length,
          members: extractList(members).length,
          teams: extractList(teams).length,
          products: extractList(products).length,
        });
        setRecentTarkams(tarkamItems.slice(0, 5));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <>
      <PageMeta
        title="Dashboard | Tarkam Admin"
        description="Ringkasan operasional tarkam, klub, tim, dan katalog situs."
      />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-brand-500">Tarkam Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Selamat datang, {user?.name || "Admin"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
            Dashboard ini merangkum resource utama yang dipakai website publik, panel admin,
            dan `tarkam-api`. Semua data di bawah ini diambil langsung dari endpoint admin live.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tarkam aktif"
            value={loading ? "..." : String(counts.tarkams)}
            hint="Total season atau event yang tersedia di backend."
          />
          <StatCard
            label="Member komunitas"
            value={loading ? "..." : String(counts.members)}
            hint="Data roster yang dipakai untuk player, tim, dan profil."
          />
          <StatCard
            label="Tim terdaftar"
            value={loading ? "..." : String(counts.teams)}
            hint="Formasi tim yang ikut kompetisi tarkam."
          />
          <StatCard
            label="Produk toko"
            value={loading ? "..." : String(counts.products)}
            hint="Item yang tampil di shop, cart, dan checkout."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tarkam terbaru</h2>
            <div className="mt-4 space-y-3">
              {recentTarkams.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loading ? "Memuat data tarkam..." : "Belum ada data tarkam."}
                </p>
              ) : (
                recentTarkams.map((tarkam, index) => (
                  <div
                    key={`tarkam-${index}`}
                    className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {String(tarkam.title || tarkam.week || "Tarkam")}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Week: {String(tarkam.week || "-")}
                        </p>
                      </div>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                        {String(tarkam.status || "draft")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {String(tarkam.location || "Lokasi belum diisi")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Status integrasi</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li>Frontend publik membaca data dari `api/v1` untuk menu, setting, jadwal, blog, dan shop.</li>
              <li>Panel admin ini mengelola resource lewat `api/v2/admin/*` setelah login.</li>
              <li>Perubahan data di resource inti langsung berdampak ke tampilan website utama.</li>
              <li>Resource teknis tetap tersedia melalui mode editor JSON untuk kebutuhan lanjutan.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
