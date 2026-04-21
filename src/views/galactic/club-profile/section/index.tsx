import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "@/api";
import { PageHeader } from "@/galactic/common";
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

const getClubLogoFallback = (value?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(value || "Club")}&background=07122d&color=ffd27a&bold=true`;

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

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const response = await Api.get<ApiResponse<MemberProfile>>("/members/profile/me");

      if (response.data?.success && response.data?.data) {
        const member = response.data.data;
        setMemberProfile(member);
        setClubData({
          slogan: member.club?.slogan || "",
          facebook: member.club?.facebook || "",
          instagram: member.club?.instagram || "",
          tiktok: member.club?.tiktok || "",
        });
        return;
      }

      setMemberProfile(null);
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        Swal.fire("Error", "Profil member tidak ditemukan.", "error");
      } else {
        Swal.fire("Error", "Gagal memuat data club.", "error");
      }
      navigate("/profile", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }

    void fetchProfile();
  }, [authLoading, fetchProfile, isAuthenticated, navigate]);

  const isLeader = memberProfile?.guild_position === "leader";
  const club = memberProfile?.club;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setClubData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSaveClub = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!club?.slug) {
      Swal.fire("Error", "Club tidak ditemukan.", "error");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("code", club.code || "");
      payload.append("name", club.name || "");
      payload.append("slogan", clubData.slogan || "");
      payload.append("facebook", clubData.facebook || "");
      payload.append("instagram", clubData.instagram || "");
      payload.append("tiktok", clubData.tiktok || "");

      if (logoFile) {
        payload.append("logo", logoFile);
      }

      const response = await Api.put<ApiResponse<ClubProfile>>(`/clubs/${club.slug}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success && response.data?.data) {
        const nextClub = response.data.data;
        setClubData({
          slogan: nextClub.slogan || "",
          facebook: nextClub.facebook || "",
          instagram: nextClub.instagram || "",
          tiktok: nextClub.tiktok || "",
        });
        setLogoFile(null);
        setMemberProfile((current) =>
          current
            ? {
                ...current,
                club: {
                  ...(current.club || {}),
                  ...nextClub,
                },
              }
            : current,
        );
        Swal.fire("Sukses", "Profil club berhasil diperbarui.", "success");
        return;
      }

      Swal.fire("Error", response.data?.message || "Update club gagal.", "error");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal mengupdate club.";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <section className="checkout-section padding-top padding-bottom">
        <div className="container">
          <div className="galactic-account-empty-state">
            <h3>Memuat data club...</h3>
            <p>Sedang mengambil informasi manajemen club Anda.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isLeader) {
    return (
      <>
        <PageHeader
          eyebrow="Club Profile"
          title="Akses Manajemen Club"
          description="Halaman ini hanya tersedia untuk member dengan peran leader."
        />
        <section className="checkout-section padding-top padding-bottom galactic-account-section">
          <div className="container">
            <div className="galactic-account-empty-state">
              <h3>Akses Ditolak</h3>
              <p>Hanya leader club yang bisa mengelola logo, slogan, dan tautan sosial club.</p>
              <div className="galactic-account-actions galactic-account-actions--center">
                <Link className="default-btn" to="/profile">
                  Kembali ke Profil
                  <span />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!club) {
    return (
      <>
        <PageHeader
          eyebrow="Club Profile"
          title="Club Belum Tersedia"
          description="Akun leader Anda belum terhubung ke data club."
        />
        <section className="checkout-section padding-top padding-bottom galactic-account-section">
          <div className="container">
            <div className="galactic-account-empty-state">
              <h3>Club Tidak Ditemukan</h3>
              <p>Silakan sinkronkan profil terlebih dulu atau hubungi admin untuk pengecekan data club.</p>
              <div className="galactic-account-actions galactic-account-actions--center">
                <Link className="default-btn" to="/profile">
                  Kembali ke Profil
                  <span />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Club Profile"
        title="Kelola Identitas Club"
        description="Perbarui logo, slogan, dan link sosial agar halaman club terlihat lebih rapi di seluruh website."
      />

      <section className="checkout-section padding-top padding-bottom galactic-account-section">
        <div className="container">
          <div className="row galactic-account-grid">
            <div className="col-lg-4 sm-padding">
              <div className="galactic-account-panel galactic-account-panel--summary">
                <div className="galactic-account-profile">
                  <div className="galactic-account-avatar galactic-account-avatar--club">
                    <img
                      src={club.logo || getClubLogoFallback(club.name)}
                      alt={club.name || "Club"}
                    />
                  </div>
                  <span className="galactic-account-kicker">Leader Mode</span>
                  <h3>{club.name || "Club"}</h3>
                  <p>
                    Dikelola oleh {memberProfile?.nickname || "leader aktif"}.
                  </p>
                </div>

                <div className="galactic-account-chip-row">
                  <span className="galactic-account-chip">{club.code || "Tanpa kode"}</span>
                  <span className="galactic-account-chip">{club.level || "Level belum diisi"}</span>
                  <span className="galactic-account-chip">{club.slug || "Slug belum ada"}</span>
                </div>

                <div className="galactic-account-stat-list">
                  <div className="galactic-account-stat">
                    <span>Slogan</span>
                    <strong>{clubData.slogan || "Belum diisi"}</strong>
                  </div>
                  <div className="galactic-account-stat">
                    <span>Instagram</span>
                    <strong>{clubData.instagram || "Belum diisi"}</strong>
                  </div>
                  <div className="galactic-account-stat">
                    <span>TikTok</span>
                    <strong>{clubData.tiktok || "Belum diisi"}</strong>
                  </div>
                </div>

                <Link className="default-btn galactic-account-btn-secondary" to="/profile">
                  Kembali ke Profil
                  <span />
                </Link>
              </div>
            </div>

            <div className="col-lg-8 sm-padding">
              <div className="galactic-account-panel">
                <div className="galactic-account-panel__heading">
                  <span className="galactic-account-kicker">Brand Club</span>
                  <h3>Rapikan identitas club Anda</h3>
                  <p>
                    Perubahan ini akan membantu halaman detail club terlihat lebih kuat,
                    konsisten, dan mudah dikenali.
                  </p>
                </div>

                <form onSubmit={handleSaveClub} className="galactic-account-form">
                  <div className="galactic-account-upload-grid">
                    <div className="galactic-account-upload-card">
                      <span>Logo Club</span>
                      <img
                        src={club.logo || getClubLogoFallback(club.name)}
                        alt={club.name || "Club logo"}
                      />
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      {logoFile ? <small>{logoFile.name}</small> : <small>Gunakan gambar persegi agar hasil lebih rapi.</small>}
                    </div>

                    <div className="galactic-account-upload-card galactic-account-upload-card--copy">
                      <span>Identitas Dasar</span>
                      <div className="galactic-account-upload-placeholder galactic-account-upload-placeholder--stack">
                        <strong>{club.code || "Tanpa kode"}</strong>
                        <small>{club.name || "Nama club belum ada"}</small>
                        <small>{club.slug || "Slug belum ada"}</small>
                      </div>
                    </div>
                  </div>

                  <div className="galactic-account-field">
                    <label htmlFor="club-slogan">Slogan Club</label>
                    <textarea
                      id="club-slogan"
                      name="slogan"
                      value={clubData.slogan || ""}
                      onChange={handleInputChange}
                      placeholder="Masukkan slogan club"
                      rows={4}
                      disabled={submitting}
                    />
                  </div>

                  <div className="galactic-account-form-grid galactic-account-form-grid--triple">
                    <div className="galactic-account-field">
                      <label htmlFor="club-facebook">Facebook</label>
                      <input
                        id="club-facebook"
                        type="text"
                        name="facebook"
                        value={clubData.facebook || ""}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/..."
                        disabled={submitting}
                      />
                    </div>

                    <div className="galactic-account-field">
                      <label htmlFor="club-instagram">Instagram</label>
                      <input
                        id="club-instagram"
                        type="text"
                        name="instagram"
                        value={clubData.instagram || ""}
                        onChange={handleInputChange}
                        placeholder="@username"
                        disabled={submitting}
                      />
                    </div>

                    <div className="galactic-account-field">
                      <label htmlFor="club-tiktok">TikTok</label>
                      <input
                        id="club-tiktok"
                        type="text"
                        name="tiktok"
                        value={clubData.tiktok || ""}
                        onChange={handleInputChange}
                        placeholder="@username"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="galactic-account-actions">
                    <button type="submit" disabled={submitting} className="default-btn">
                      {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                      <span />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubProfileContent;
