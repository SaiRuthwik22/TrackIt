import React from "react";
import Header from "./Header/Header";
import SignupSignin from "./SignupSignin/SignupSignin";
import "./SignupSignin/style.css";

function Signup() {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SignupSignin />
      </div>
    </div>
  );
}

export default Signup;
