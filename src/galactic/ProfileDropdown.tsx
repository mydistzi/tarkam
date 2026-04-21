import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "@/api";
import { useAuth } from "@/views/galactic/auth/AuthProvider";
import { setProfileRefetch } from "@/galactic/profileDropdownUtils";

type MemberProfile = {
  id: number;
  username?: string;
  nickname?: string;
  picture_url?: string;
  city?: string;
  guild_position?: string;
  club?: {
    id: number;
    name: string;
    slug?: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { signOut, isAuthenticated, isLoading: authLoading } = useAuth();
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchMemberProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setMemberProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await Api.get<ApiResponse<MemberProfile>>("/members/profile/me");
      if (response.data?.success && response.data?.data) {
        setMemberProfile(response.data.data);
      } else {
        setMemberProfile(null);
      }
    } catch (error) {
      console.error("Failed to fetch member profile:", error);
      setMemberProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setProfileRefetch(fetchMemberProfile);
  }, [fetchMemberProfile]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setMemberProfile(null);
      setLoading(false);
      setOpen(false);
      return;
    }

    void fetchMemberProfile();
  }, [authLoading, fetchMemberProfile, isAuthenticated]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      void fetchMemberProfile();
    };

    window.addEventListener("profile-sync-complete", handleProfileUpdated);
    return () => {
      window.removeEventListener("profile-sync-complete", handleProfileUpdated);
    };
  }, [fetchMemberProfile]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate("/", { replace: true });
  };

  const avatarUrl =
    memberProfile?.picture_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(memberProfile?.nickname || memberProfile?.username || "User")}&color=FCFCFC&background=0c0c35`;
  const roleLabel =
    memberProfile?.guild_position === "leader"
      ? "Club Leader"
      : memberProfile?.club?.name
        ? "Club Member"
        : "Member";

  if (!isAuthenticated && !authLoading) {
    return (
      <Link className="default-btn" to="/signin">
        Login<span />
      </Link>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="user-profile-dropdown user-profile-dropdown--loading" aria-hidden="true">
        <div className="profile-info">
          <span>Memuat akun...</span>
        </div>
        <div className="profile-image profile-image--skeleton" />
      </div>
    );
  }

  return (
    <div
      className={`user-profile-dropdown${open ? " is-open" : ""}`}
      ref={containerRef}
    >
      <button
        className="user-profile-dropdown__trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <div className="profile-info">
          <small>{roleLabel}</small>
          <span>{memberProfile?.nickname || memberProfile?.username || "Member"}</span>
        </div>
        <div className="profile-image">
          <img src={avatarUrl} alt={memberProfile?.nickname || "Member"} />
        </div>
      </button>

      <div className="dropdown-content" role="menu">
        <div className="dropdown-content__header">
          <strong>{memberProfile?.nickname || memberProfile?.username || "Member"}</strong>
          <span>{memberProfile?.club?.name || memberProfile?.city || "Akun siap digunakan"}</span>
        </div>

        <Link to="/profile" onClick={() => setOpen(false)}>
          <i className="fa fa-user" />
          Profil Saya
        </Link>

        {memberProfile?.guild_position === "leader" && memberProfile.club ? (
          <Link to="/club-profile" onClick={() => setOpen(false)}>
            <i className="fa fa-users" />
            Club Profile
          </Link>
        ) : null}

        <button type="button" className="dropdown-content__action" onClick={handleLogout}>
          <i className="las la-sign-out-alt" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
