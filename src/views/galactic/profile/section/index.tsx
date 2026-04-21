import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { PageHeader } from "@/galactic/common";
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

const PROFILE_STORAGE_KEY = "tarkam_profile";

const getAvatarFallback = (value?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(value || "Member")}&background=0c0c35&color=fff`;

const getSocialValue = (value?: string) => {
  const trimmed = String(value || "").trim();
  return trimmed || "Belum diisi";
};

export const ProfileContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [profile, setProfile] = useState<MemberProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) as MemberProfile : null;
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
    setNicknameInput(data.nickname || "");
  }, []);

  const broadcastProfileRefresh = useCallback(async () => {
    await refetchProfileDropdown();
    window.dispatchEvent(new Event("profile-sync-complete"));
  }, []);

  const loadExistingProfile = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const response = await Api.get<ApiResponse<MemberProfile>>("/members/profile/me");
      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
        syncFormWithProfile(response.data.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("No active profile session:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, syncFormWithProfile]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    void loadExistingProfile();
  }, [authLoading, isAuthenticated, loadExistingProfile]);

  const handleSyncProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nicknameInput.trim()) {
      Swal.fire("Error", "Nickname tidak boleh kosong.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await Api.post<ApiResponse<MemberProfile>>("/members/sync-profile", {
        nickname: nicknameInput.trim(),
      });

      if (response.data?.success && response.data?.data) {
        const memberData = response.data.data;
        setProfile(memberData);
        syncFormWithProfile(memberData);
        setPictureFile(null);
        setSponsorFile(null);
        await broadcastProfileRefresh();
        Swal.fire("Sukses", "Profil berhasil disinkronisasi.", "success");
        return;
      }

      Swal.fire("Error", response.data?.message || "Sync profil gagal.", "error");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal sinkronisasi profil.";
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "picture" | "sponsor",
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (type === "picture") {
      setPictureFile(file);
      return;
    }

    setSponsorFile(file);
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile?.nickname) {
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("username", formData.username || "");
      payload.append("nickname", profile.nickname);
      payload.append("gender", formData.gender || "male");
      payload.append("latitude", String(formData.latitude || 0));
      payload.append("longitude", String(formData.longitude || 0));
      payload.append("city", formData.city || "");
      payload.append("facebook", formData.facebook || "");
      payload.append("instagram", formData.instagram || "");
      payload.append("tiktok", formData.tiktok || "");

      if (pictureFile) {
        payload.append("picture_url", pictureFile);
      }
      if (sponsorFile) {
        payload.append("image_sponsor", sponsorFile);
      }

      const response = await Api.put<ApiResponse<MemberProfile>>(`/members/${profile.nickname}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
        syncFormWithProfile(response.data.data);
        setPictureFile(null);
        setSponsorFile(null);
        await broadcastProfileRefresh();
        Swal.fire("Sukses", "Profil berhasil diperbarui.", "success");
        return;
      }

      Swal.fire("Error", response.data?.message || "Update profil gagal.", "error");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal menyimpan perubahan profil.";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetProfile = () => {
    setProfile(null);
    setPictureFile(null);
    setSponsorFile(null);
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
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  if (authLoading || (loading && !profile)) {
    return (
      <section className="checkout-section padding-top padding-bottom">
        <div className="container">
          <div className="galactic-account-empty-state">
            <h3>Memuat profil...</h3>
            <p>Sedang menyiapkan data akun Anda.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Profil Member"
        title="Pusat Profil Saya"
        description={
          profile
            ? "Kelola identitas, avatar, banner sponsor, dan tautan sosial dari satu tempat."
            : "Masukkan nickname Anda dulu untuk menautkan akun login ke profil member yang sudah ada."
        }
      />

      <section className="checkout-section padding-top padding-bottom galactic-account-section">
        <div className="container">
          {!profile ? (
            <div className="row justify-content-center">
              <div className="col-lg-7 sm-padding">
                <div className="galactic-account-panel galactic-account-panel--sync">
                  <div className="galactic-account-panel__heading">
                    <span className="galactic-account-kicker">Sinkronisasi Profil</span>
                    <h3>Hubungkan akun login dengan profil member</h3>
                    <p>
                      Setelah nickname cocok ditemukan, Anda bisa melengkapi foto, kota,
                      dan sosial media tanpa perlu input dari nol.
                    </p>
                  </div>

                  <form onSubmit={handleSyncProfile} className="galactic-account-form galactic-account-form--single">
                    <div className="galactic-account-field">
                      <label htmlFor="nickname-sync">Nickname</label>
                      <input
                        id="nickname-sync"
                        type="text"
                        value={nicknameInput}
                        onChange={(event) => setNicknameInput(event.target.value)}
                        placeholder="Contoh: BangTarkam77"
                        required
                      />
                    </div>

                    <div className="galactic-account-actions">
                      <button type="submit" disabled={loading} className="default-btn">
                        {loading ? "Mencari..." : "Sinkronisasi Profil"}
                        <span />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="row galactic-account-grid">
              <div className="col-lg-4 sm-padding">
                <div className="galactic-account-panel galactic-account-panel--summary">
                  <div className="galactic-account-profile">
                    <div className="galactic-account-avatar">
                      <img
                        src={profile.picture_url || getAvatarFallback(profile.nickname)}
                        alt={profile.nickname || "Profile"}
                      />
                    </div>
                    <span className="galactic-account-kicker">Akun Aktif</span>
                    <h3>{profile.nickname || "Member"}</h3>
                    <p>
                      {profile.club?.name
                        ? `Terhubung dengan club ${profile.club.name}.`
                        : "Belum terhubung ke club."}
                    </p>
                  </div>

                  <div className="galactic-account-chip-row">
                    <span className="galactic-account-chip">{profile.guild_position || "member"}</span>
                    <span className="galactic-account-chip">{formData.gender || "male"}</span>
                    <span className="galactic-account-chip">{formData.city || "Kota belum diisi"}</span>
                  </div>

                  <div className="galactic-account-stat-list">
                    <div className="galactic-account-stat">
                      <span>Username</span>
                      <strong>{formData.username || "-"}</strong>
                    </div>
                    <div className="galactic-account-stat">
                      <span>Instagram</span>
                      <strong>{getSocialValue(formData.instagram)}</strong>
                    </div>
                    <div className="galactic-account-stat">
                      <span>TikTok</span>
                      <strong>{getSocialValue(formData.tiktok)}</strong>
                    </div>
                  </div>

                  {profile.guild_position === "leader" && profile.club ? (
                    <Link className="default-btn galactic-account-btn-secondary" to="/club-profile">
                      Kelola Club
                      <span />
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="col-lg-8 sm-padding">
                <div className="galactic-account-panel">
                  <div className="galactic-account-panel__heading">
                    <span className="galactic-account-kicker">Edit Profil</span>
                    <h3>Lengkapi detail yang tampil di halaman member</h3>
                    <p>
                      Perubahan di sini membantu profil Anda terlihat lebih rapi saat tampil
                      di leaderboard, detail player, dan dropdown akun.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="galactic-account-form">
                    <div className="galactic-account-upload-grid">
                      <div className="galactic-account-upload-card">
                        <span>Foto Profil</span>
                        <img
                          src={profile.picture_url || getAvatarFallback(profile.nickname)}
                          alt="Avatar"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleFileChange(event, "picture")}
                        />
                        {pictureFile ? <small>{pictureFile.name}</small> : <small>Ukuran kotak agar avatar konsisten.</small>}
                      </div>

                      <div className="galactic-account-upload-card">
                        <span>Banner Sponsor</span>
                        {formData.image_sponsor ? (
                          <img src={formData.image_sponsor} alt="Sponsor banner" />
                        ) : (
                          <div className="galactic-account-upload-placeholder">Belum ada banner sponsor</div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleFileChange(event, "sponsor")}
                        />
                        {sponsorFile ? <small>{sponsorFile.name}</small> : <small>Pakai visual landscape jika tersedia.</small>}
                      </div>
                    </div>

                    <div className="galactic-account-form-grid">
                      <div className="galactic-account-field">
                        <label htmlFor="profile-username">Username</label>
                        <input
                          id="profile-username"
                          type="text"
                          name="username"
                          value={formData.username || ""}
                          onChange={handleInputChange}
                          placeholder="Username publik"
                        />
                      </div>

                      <div className="galactic-account-field">
                        <label htmlFor="profile-gender">Gender</label>
                        <select
                          id="profile-gender"
                          name="gender"
                          value={formData.gender || "male"}
                          onChange={handleInputChange}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="galactic-account-form-grid">
                      <div className="galactic-account-field">
                        <label htmlFor="profile-nickname">Nickname</label>
                        <input
                          id="profile-nickname"
                          type="text"
                          value={profile.nickname || ""}
                          readOnly
                          className="is-readonly"
                        />
                      </div>

                      <div className="galactic-account-field">
                        <label htmlFor="profile-city">Kota</label>
                        <input
                          id="profile-city"
                          type="text"
                          name="city"
                          value={formData.city || ""}
                          onChange={handleInputChange}
                          placeholder="Contoh: Jakarta"
                        />
                      </div>
                    </div>

                    <div className="galactic-account-form-grid galactic-account-form-grid--triple">
                      <div className="galactic-account-field">
                        <label htmlFor="profile-instagram">Instagram</label>
                        <input
                          id="profile-instagram"
                          type="text"
                          name="instagram"
                          value={formData.instagram || ""}
                          onChange={handleInputChange}
                          placeholder="@username"
                        />
                      </div>

                      <div className="galactic-account-field">
                        <label htmlFor="profile-facebook">Facebook</label>
                        <input
                          id="profile-facebook"
                          type="text"
                          name="facebook"
                          value={formData.facebook || ""}
                          onChange={handleInputChange}
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      <div className="galactic-account-field">
                        <label htmlFor="profile-tiktok">TikTok</label>
                        <input
                          id="profile-tiktok"
                          type="text"
                          name="tiktok"
                          value={formData.tiktok || ""}
                          onChange={handleInputChange}
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    <div className="galactic-account-actions">
                      <button
                        type="button"
                        onClick={handleResetProfile}
                        className="default-btn galactic-account-btn-secondary"
                      >
                        Ganti Nickname
                        <span />
                      </button>

                      <button type="submit" disabled={submitting} className="default-btn">
                        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        <span />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProfileContent;
