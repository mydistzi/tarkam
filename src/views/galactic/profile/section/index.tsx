import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { PageHeader, PageShell } from "@/galactic/common";
import { useAuth } from "@/views/galactic/auth/AuthProvider";

type MemberProfile = {
  id: number;
  username?: string;
  nickname?: string;
  slug?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  picture_url?: string;
  image_sponsor?: string;
  city?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  guild_position?: string;
  club_fk?: number;
  club?: {
    id: number;
    name: string;
    slug: string;
  };
  user_fk?: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const ProfileContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [nicknameEntered, setNicknameEntered] = useState(false);
  const [tempNickname, setTempNickname] = useState("");
  const [formData, setFormData] = useState<Partial<MemberProfile>>({
    username: "",
    gender: "male",
    latitude: 0,
    longitude: 0,
    picture_url: "",
    image_sponsor: "",
    city: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  });
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [sponsorFile, setSponsorFile] = useState<File | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch member profile
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await Api.get<ApiResponse<MemberProfile>>(
          "/members/profile/me"
        );

        if (response.data?.success && response.data?.data) {
          const memberData = response.data.data;
          setProfile(memberData);
          setFormData({
            username: memberData.username || "",
            gender: memberData.gender || "male",
            latitude: memberData.latitude || 0,
            longitude: memberData.longitude || 0,
            picture_url: memberData.picture_url || "",
            image_sponsor: memberData.image_sponsor || "",
            city: memberData.city || "",
            facebook: memberData.facebook || "",
            instagram: memberData.instagram || "",
            tiktok: memberData.tiktok || "",
          });

          if (memberData.nickname) {
            setTempNickname(memberData.nickname);
            setNicknameEntered(true);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setProfile(null);
          setNicknameEntered(false);
        } else {
          Swal.fire(
            "Error",
            "Gagal memuat profil. Silakan coba lagi.",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempNickname.trim()) {
      Swal.fire("Error", "Nickname tidak boleh kosong", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await Api.post<ApiResponse<MemberProfile>>(
        "/members",
        {
          nickname: tempNickname,
          gender: formData.gender || "male",
          username: user?.name || "",
        }
      );

      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
        setFormData({
          username: response.data.data.username || "",
          gender: response.data.data.gender || "male",
          latitude: response.data.data.latitude || 0,
          longitude: response.data.data.longitude || 0,
          picture_url: response.data.data.picture_url || "",
          image_sponsor: response.data.data.image_sponsor || "",
          city: response.data.data.city || "",
          facebook: response.data.data.facebook || "",
          instagram: response.data.data.instagram || "",
          tiktok: response.data.data.tiktok || "",
        });
        setNicknameEntered(true);
        Swal.fire("Sukses", "Nickname berhasil disimpan", "success");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Gagal menyimpan nickname. Silakan coba lagi.";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "picture" | "sponsor"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "picture") {
        setPictureFile(file);
      } else {
        setSponsorFile(file);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.nickname) {
      Swal.fire("Error", "Nickname harus diisi terlebih dahulu", "error");
      return;
    }

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username || "");
      formDataToSend.append("nickname", profile.nickname);
      formDataToSend.append("gender", formData.gender || "male");
      formDataToSend.append("latitude", String(formData.latitude || 0));
      formDataToSend.append("longitude", String(formData.longitude || 0));
      formDataToSend.append("city", formData.city || "");
      formDataToSend.append("facebook", formData.facebook || "");
      formDataToSend.append("instagram", formData.instagram || "");
      formDataToSend.append("tiktok", formData.tiktok || "");

      if (pictureFile) {
        formDataToSend.append("picture_url", pictureFile);
      }

      if (sponsorFile) {
        formDataToSend.append("image_sponsor", sponsorFile);
      }

      const response = await Api.put<ApiResponse<MemberProfile>>(
        `/members/${profile.nickname}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
        setFormData({
          username: response.data.data.username || "",
          gender: response.data.data.gender || "male",
          latitude: response.data.data.latitude || 0,
          longitude: response.data.data.longitude || 0,
          picture_url: response.data.data.picture_url || "",
          image_sponsor: response.data.data.image_sponsor || "",
          city: response.data.data.city || "",
          facebook: response.data.data.facebook || "",
          instagram: response.data.data.instagram || "",
          tiktok: response.data.data.tiktok || "",
        });
        setPictureFile(null);
        setSponsorFile(null);

        Swal.fire("Sukses", "Profil berhasil diupdate", "success");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Gagal mengupdate profil. Silakan coba lagi.";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <PageShell title="Sinkronisasi Profil">
      <PageHeader
        eyebrow="Halaman Profil"
        title="Sinkronisasi Profil Anda"
        description="Perbarui informasi profil Anda untuk memastikan semua data akurat."
      />
    <section className="checkout-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 sm-padding">
        {!nicknameEntered ? (
          // Step 1: Enter Nickname
            <form onSubmit={handleNicknameSubmit} className="checkout-form-wrap">
              <h2>Detail Profil</h2>
              <div className="checkout-form mb-30">
                  <div className="form-field">
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  placeholder="Masukkan nickname Anda"
                  className="form-control transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  disabled={submitting}
                />
              </div>

              <div className="form-field">
                <select
                  name="gender"
                  value={formData.gender || "male"}
                  onChange={handleInputChange}
                  className="form-control transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="default-btn transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {submitting ? "Menyimpan..." : "Lanjutkan"}
              </button>
            </form>
        ) : (
          // Step 2: Edit Profile
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Profil {profile?.nickname}
            </h2>
            {profile?.club && (
              <p className="text-slate-400 mb-6">Club: {profile.club.name}</p>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || "male"}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kota
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama kota"
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                />
              </div>

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude || 0}
                    onChange={handleInputChange}
                    step="0.0001"
                    placeholder="0.0000"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude || 0}
                    onChange={handleInputChange}
                    step="0.0001"
                    placeholder="0.0000"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Foto Profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "picture")}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                />
                {formData.picture_url && (
                  <img
                    src={formData.picture_url}
                    alt="Profile"
                    className="mt-2 h-32 w-32 rounded-lg object-cover"
                  />
                )}
              </div>

              {/* Brand/Sponsor Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Foto Brand/Sponsor
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "sponsor")}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                />
                {formData.image_sponsor && (
                  <img
                    src={formData.image_sponsor}
                    alt="Sponsor"
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
                      value={formData.facebook}
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
                      value={formData.instagram}
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
                      value={formData.tiktok}
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
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    </div>
    </section>
    </PageShell>
  );
};

export default ProfileContent;
