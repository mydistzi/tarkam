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
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [profile, setProfile] = useState<MemberProfile | null>(null);
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

  const handleSyncProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nicknameInput.trim()) {
      Swal.fire("Error", "Nickname tidak boleh kosong", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await Api.post<ApiResponse<MemberProfile>>(
        "/members/sync-profile",
        { nickname: nicknameInput.trim() }
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
        Swal.fire("Sukses", "Profil ditemukan dan disinkronisasi", "success");
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menemukan profil. Silakan coba lagi.";
      Swal.fire("Error", message, "error");
      setProfile(null);
    } finally {
      setLoading(false);
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
      Swal.fire("Error", "Nickname tidak ditemukan", "error");
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
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengupdate profil. Silakan coba lagi.";
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
    <PageShell title="Profil Saya">
      <PageHeader
        eyebrow="Profil"
        title="Profil Saya"
        description="Masukan nickname Anda untuk sinkronisasi profil"
      />
      <section className="checkout-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 sm-padding">
              {!profile ? (
                // Input Nickname
                <form
                  onSubmit={handleSyncProfile}
                  className="checkout-form-wrap"
                >
                  <h2>Sinkronisasi Profil</h2>
                  <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>
                    Masukan nickname Anda untuk menemukan dan sinkronisasi profil member
                  </p>

                  <div className="checkout-form mb-30">
                    <div className="form-field">
                      <label style={{ color: "rgba(255,255,255,0.8)" }}>
                        Nickname
                      </label>
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        placeholder="Contoh: CozyGamer99"
                        className="form-control transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="default-btn transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    {loading ? "Mencari..." : "Cari Profil"}
                    <span />
                  </button>
                </form>
              ) : (
                // Edit Profile
                <div
                  className="checkout-form-wrap"
                  style={{
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                  }}
                >
                  <h2 style={{ marginBottom: "8px" }}>
                    Profil {profile?.nickname}
                  </h2>
                  {profile?.club && (
                    <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
                      Club: {profile.club.name}
                    </p>
                  )}

                  <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "24px" }}>
                    {/* Profile Picture */}
                    {profile?.picture_url && (
                      <div>
                        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "8px", fontSize: "0.875rem" }}>
                          Foto Profil Saat Ini
                        </p>
                        <img
                          src={profile.picture_url}
                          alt="Profile"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            marginBottom: "12px",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Update Foto Profil
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "picture")}
                        disabled={submitting}
                        className="form-control"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="form-control"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender || "male"}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="form-control"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Kota
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={submitting}
                        placeholder="Jakarta"
                        className="form-control"
                      />
                    </div>

                    {/* Social Media - Facebook */}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Facebook
                      </label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        disabled={submitting}
                        placeholder="https://facebook.com/..."
                        className="form-control"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Instagram
                      </label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        disabled={submitting}
                        placeholder="@username"
                        className="form-control"
                      />
                    </div>

                    {/* TikTok */}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        TikTok
                      </label>
                      <input
                        type="text"
                        name="tiktok"
                        value={formData.tiktok}
                        onChange={handleInputChange}
                        disabled={submitting}
                        placeholder="@username"
                        className="form-control"
                      />
                    </div>

                    {/* Sponsor Image */}
                    {profile?.image_sponsor && (
                      <div>
                        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "8px", fontSize: "0.875rem" }}>
                          Foto Sponsor Saat Ini
                        </p>
                        <img
                          src={profile.image_sponsor}
                          alt="Sponsor"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            marginBottom: "12px",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Update Foto Sponsor
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "sponsor")}
                        disabled={submitting}
                        className="form-control"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setProfile(null);
                          setNicknameInput("");
                          setFormData({
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
                        }}
                        disabled={submitting}
                        className="default-btn"
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        Kembali
                        <span />
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="default-btn transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        <span />
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
