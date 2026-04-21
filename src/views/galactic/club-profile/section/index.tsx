import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { useAuth } from "@/views/galactic/auth/AuthProvider";

type ClubProfile = {
  id: number;
  code?: string;
  name?: string;
  slug?: string;
  logo?: string;
  slogan?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  level?: string;
};

type MemberProfile = {
  id: number;
  nickname?: string;
  guild_position?: string;
  club_fk?: number;
  club?: ClubProfile;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const ClubProfileContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [clubData, setClubData] = useState<Partial<ClubProfile>>({
    slogan: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLeader, setIsLeader] = useState(false);

  // Check authentication - wait until auth validation is complete
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch member profile
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await Api.get<ApiResponse<MemberProfile>>(
          "/members/profile/me"
        );

        if (response.data?.success && response.data?.data) {
          const member = response.data.data;
          setMemberProfile(member);

          // Check if user is a leader
          if (
            member.guild_position === "leader" &&
            member.club &&
            member.club.id
          ) {
            setIsLeader(true);
            setClubData({
              slogan: member.club.slogan || "",
              facebook: member.club.facebook || "",
              instagram: member.club.instagram || "",
              tiktok: member.club.tiktok || "",
            });
          } else {
            setIsLeader(false);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          Swal.fire("Error", "Profil member tidak ditemukan", "error");
        } else {
          Swal.fire(
            "Error",
            "Gagal memuat profil. Silakan coba lagi.",
            "error"
          );
        }
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, authLoading, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClubData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSaveClub = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberProfile?.club) {
      Swal.fire("Error", "Club tidak ditemukan", "error");
      return;
    }

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append("code", memberProfile.club.code || "");
      formDataToSend.append("name", memberProfile.club.name || "");
      formDataToSend.append("slogan", clubData.slogan || "");
      formDataToSend.append("facebook", clubData.facebook || "");
      formDataToSend.append("instagram", clubData.instagram || "");
      formDataToSend.append("tiktok", clubData.tiktok || "");

      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      const response = await Api.put<ApiResponse<ClubProfile>>(
        `/clubs/${memberProfile.club.slug}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success && response.data?.data) {
        setClubData({
          slogan: response.data.data.slogan || "",
          facebook: response.data.data.facebook || "",
          instagram: response.data.data.instagram || "",
          tiktok: response.data.data.tiktok || "",
        });
        setLogoFile(null);

        Swal.fire("Sukses", "Club berhasil diupdate", "success");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Gagal mengupdate club. Silakan coba lagi.";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isLeader) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Akses Ditolak
            </h2>
            <p className="text-slate-400 mb-6">
              Hanya leader club yang bisa mengakses halaman ini.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!memberProfile?.club) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Club Tidak Ditemukan
            </h2>
            <p className="text-slate-400 mb-6">
              Anda belum tergabung dalam sebuah club.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {memberProfile.club.name}
          </h2>
          <p className="text-slate-400 mb-6">Manajemen Club</p>

          <form onSubmit={handleSaveClub} className="space-y-6">
            {/* Slogan */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Slogan Club
              </label>
              <textarea
                name="slogan"
                value={clubData.slogan}
                onChange={handleInputChange}
                placeholder="Masukkan slogan club"
                rows={3}
                disabled={submitting}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Logo Club
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={submitting}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
              />
              {memberProfile.club.logo && (
                <img
                  src={memberProfile.club.logo}
                  alt="Club Logo"
                  className="mt-2 h-32 w-32 rounded-lg object-cover"
                />
              )}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Media Sosial
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={clubData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={clubData.instagram}
                    onChange={handleInputChange}
                    placeholder="@username"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    TikTok
                  </label>
                  <input
                    type="text"
                    name="tiktok"
                    value={clubData.tiktok}
                    onChange={handleInputChange}
                    placeholder="@username"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClubProfileContent;
