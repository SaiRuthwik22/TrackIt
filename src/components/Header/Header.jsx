import React, { useEffect } from "react";
import "./style.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../pages/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from "../../assets/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  function logout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logged out Successfully");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
  }
  return (
    <div className="header">
      <p className="name">TrackIt</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            alt=""
            style={{ borderRadius: "50%", height: "1.5rem", width: "1.5rem" }}
          />
          <p className="logo link" onClick={logout}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
