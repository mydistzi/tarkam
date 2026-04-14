import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const LogoutPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    signOut();
    navigate("/", { replace: true });
  }, [signOut, navigate]);

  return null;
};

export default LogoutPage;
