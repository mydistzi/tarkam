import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { PageHeader, PageShell } from "@/galactic/common";
import { useAuth } from "@/views/galactic/auth/AuthProvider";
import { refetchProfileDropdown } from "@/galactic/profileDropdownUtils";

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [profile, setProfile] = useState<MemberProfile | null>(() => {
    try {
      const saved = localStorage.getItem("tarkam_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

  // Helper to sync form with profile data
  const syncFormWithProfile = useCallback((data: MemberProfile) => {
    setFormData({
      username: data.username || "",
      gender: data.gender || "male",
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      picture_url: data.picture_url || "",
      image_sponsor: data.image_sponsor || "",
      city: data.city || "",
      facebook: data.facebook || "",
      instagram: data.instagram || "",
      tiktok: data.tiktok || "",
    });
    if (data.nickname) setNicknameInput(data.nickname);
  }, []);

  // Effect for localStorage and initial sync
  useEffect(() => {
    if (profile) {
      localStorage.setItem("tarkam_profile", JSON.stringify(profile));
      // Only sync if form is empty/initial
      if (!formData.username && profile.username) {
        syncFormWithProfile(profile);
      }
    } else {
      localStorage.removeItem("tarkam_profile");
    }
  }, [profile, syncFormWithProfile]);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load profile from API
  useEffect(() => {
    if (authLoading || !isAuthenticated || profile) return;

    const loadExistingProfile = async () => {
      try {
        setLoading(true);
        const response = await Api.get<ApiResponse<MemberProfile>>("/members/profile/me");
        if (response.data?.success && response.data?.data) {
          setProfile(response.data.data);
          syncFormWithProfile(response.data.data);
        }
      } catch (error) {
        console.error("No active profile session:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingProfile();
  }, [isAuthenticated, authLoading, profile, syncFormWithProfile]);

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
        syncFormWithProfile(memberData);
        Swal.fire("Sukses", "Profil berhasil disinkronisasi", "success");
        await refetchProfileDropdown();
        window.dispatchEvent(new Event("profile-sync-complete"));
      } else {
        Swal.fire("Error", response.data?.message || "Sync gagal", "error");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal sinkronisasi.";
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "picture" | "sponsor") => {
    const file = e.target.files?.[0];
    if (file) {
      type === "picture" ? setPictureFile(file) : setSponsorFile(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.nickname) return;

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("username", formData.username || "");
      data.append("nickname", profile.nickname);
      data.append("gender", formData.gender || "male");
      data.append("latitude", String(formData.latitude || 0));
      data.append("longitude", String(formData.longitude || 0));
      data.append("city", formData.city || "");
      data.append("facebook", formData.facebook || "");
      data.append("instagram", formData.instagram || "");
      data.append("tiktok", formData.tiktok || "");

      if (pictureFile) data.append("picture_url", pictureFile);
      if (sponsorFile) data.append("image_sponsor", sponsorFile);

      const response = await Api.put<ApiResponse<MemberProfile>>(`/members/${profile.nickname}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
        syncFormWithProfile(response.data.data);
        setPictureFile(null);
        setSponsorFile(null);
        Swal.fire("Sukses", "Profil berhasil diupdate", "success");
        await refetchProfileDropdown();
      }
    } catch (error: any) {
      Swal.fire("Error", error.response?.data?.message || "Gagal update.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
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
        description={profile ? "Update informasi profil Anda" : "Masukan nickname Anda untuk sinkronisasi"}
      />
      <section className="checkout-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 sm-padding">
              
              {!profile ? (
                /* FORM SINKRONISASI */
                <form onSubmit={handleSyncProfile} className="checkout-form-wrap">
                  <h2>Sinkronisasi Profil</h2>
                  <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>
                    Masukan nickname Anda untuk menemukan profil member.
                  </p>
                  <div className="checkout-form mb-30">
                    <div className="form-field">
                      <label style={{ color: "rgba(255,255,255,0.8)" }}>
                        Nickname <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        placeholder="Contoh: BangTarkam77"
                        required
                        className="form-control"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
                      />
                    </div>
                    <div className="flex justify-end mt-6">
                      <button type="submit" disabled={loading} className="default-btn">
                        {loading ? "Mencari..." : "Sinkronisasi Profil"}
                        <span />
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* FORM EDIT PROFIL */
                <div className="checkout-form-wrap" style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(71, 85, 105, 0.3)" }}>
                  <h2 style={{ marginBottom: "8px" }}>Profil {profile.nickname}</h2>
                  {profile.club && (
                    <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
                      Club: <strong>{profile.club.name}</strong>
                    </p>
                  )}

                  <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "24px" }}>
                    {/* Preview Foto */}
                    <div className="flex gap-4 items-end">
                      <div>
                        <p className="text-sm mb-2 text-white/70">Foto Profil</p>
                        <img 
                          src={profile.picture_url || `https://ui-avatars.com/api/?name=${profile.nickname}&background=0c0c35&color=fff`} 
                          alt="Avatar" 
                          className="w-24 h-24 rounded-lg object-cover border border-white/20"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="form-label text-white/70">Update Foto</label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "picture")} className="form-control" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-white/70">Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="form-control" />
                      </div>
                      <div>
                        <label className="form-label text-white/70">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-control">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-white/70">Kota</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Contoh: Jakarta" className="form-control" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label text-white/70">Instagram</label>
                        <input type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="@username" className="form-control" />
                      </div>
                      <div>
                        <label className="form-label text-white/70">Facebook</label>
                        <input type="text" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="URL Facebook" className="form-control" />
                      </div>
                      <div>
                        <label className="form-label text-white/70">TikTok</label>
                        <input type="text" name="tiktok" value={formData.tiktok} onChange={handleInputChange} placeholder="@username" className="form-control" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button 
                        type="button" 
                        onClick={() => { setProfile(null); localStorage.removeItem("tarkam_profile"); }} 
                        className="default-btn !bg-transparent border border-white/20"
                      >
                        Ganti Nickname
                      </button>
                      <button type="submit" disabled={submitting} className="default-btn">
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