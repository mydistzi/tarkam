import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "@/api";
import { useAuth } from "@/views/galactic/auth/AuthProvider";

type MemberProfile = {
  id: number;
  nickname?: string;
  picture_url?: string;
  guild_position?: string;
  club?: {
    id: number;
    name: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        const response = await Api.get<ApiResponse<MemberProfile>>(
          "/members/profile/me"
        );
        if (response.data?.success && response.data?.data) {
          setMemberProfile(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch member profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberProfile();
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
    navigate("/", { replace: true });
  };

  if (loading || !memberProfile?.nickname) {
    return (
      <Link className="default-btn" to="/profile">
        Profile<span />
      </Link>
    );
  }

  return (
    <div className="profile-dropdown-container" style={{ position: "relative", display: "inline-block" }}>
      <button
        className="profile-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontSize: "0.9rem",
        }}
      >
        {memberProfile.picture_url && (
          <img
            src={memberProfile.picture_url}
            alt={memberProfile.nickname}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
        <span>{memberProfile.nickname}</span>
        <i className={`las ${isOpen ? "la-chevron-up" : "la-chevron-down"}`} />
      </button>

      {isOpen && (
        <div
          className="profile-dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            minWidth: "200px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
          }}
        >
          <Link
            to="/profile"
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
            style={{
              display: "block",
              padding: "12px 16px",
              color: "white",
              textDecoration: "none",
              fontSize: "0.9rem",
              borderBottom: "1px solid #374151",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <i className="las la-user" /> Profil Saya
          </Link>

          {memberProfile.guild_position === "leader" && memberProfile.club && (
            <Link
              to="/club-profile"
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                padding: "12px 16px",
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                borderBottom: "1px solid #374151",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <i className="las la-cog" /> Club Management
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="dropdown-item"
            style={{
              display: "block",
              width: "100%",
              padding: "12px 16px",
              color: "white",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <i className="las la-sign-out-alt" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
