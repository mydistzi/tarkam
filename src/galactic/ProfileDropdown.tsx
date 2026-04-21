import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "@/api";
import { useAuth } from "@/views/galactic/auth/AuthProvider";
import { setProfileRefetch } from "@/galactic/profileDropdownUtils";

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
  const { signOut, isAuthenticated } = useAuth();
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const refetchRef = useRef<(() => Promise<void>) | null>(null);

  const fetchMemberProfile = async () => {
    try {
      setLoading(true);
      const response = await Api.get<ApiResponse<MemberProfile>>(
        "/members/profile/me"
      );
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
  };

  // Store refetch function in ref and global
  useEffect(() => {
    refetchRef.current = fetchMemberProfile;
    setProfileRefetch(fetchMemberProfile);
  }, []);

  useEffect(() => {
    fetchMemberProfile();
  }, [isAuthenticated]);

  // Listen to profile-updated event from other components
  useEffect(() => {
    const handleProfileUpdated = () => {
      fetchMemberProfile();
    };

    window.addEventListener("profile-sync-complete", handleProfileUpdated);
    return () => {
      window.removeEventListener("profile-sync-complete", handleProfileUpdated);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (loading || !memberProfile?.nickname) {
    return (
      <Link className="default-btn" to="/signin">
        Login<span />
      </Link>
    );
  }

  return (
    <div className="user-profile-dropdown">
      <div className="profile-info"><span>{memberProfile.nickname}</span></div>
      <div className="profile-image"><img src={memberProfile.picture_url} alt={memberProfile.nickname} /></div>
      <div className="dropdown-content">
          <Link to="/profile"><i className="fa fa-user"></i> Profil</Link>
          {memberProfile.guild_position === "leader" && memberProfile.club && (
            <Link to="/club-profile"><i className="fa fa-users"></i> Klub</Link>
          )}
          <hr style={{ borderTop: "1px solid #333", margin: "0" }} />
          <a onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}><i className="las la-sign-out-alt"></i> Logout</a>
      </div>
    </div>
  );
};

export default ProfileDropdown;
