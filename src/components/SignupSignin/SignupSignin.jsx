import React, { useEffect, useState } from "react";
import "./style.css";
import { auth, db, doc, provider, setDoc } from "../../pages/firebase";
import Input from "../Input/Input";
import Button from "../Button/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";

function SignupSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupUsingEmailandPassword() {
    setLoading(true);
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("user", user);
            setLoading(false);
            setConfirmPassword("");
            setEmail("");
            setName("");
            setPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(error.message);
            setLoading(false);
          });
      } else {
        toast.error("Both the Passwords are not Same");
        setLoading(false);
      }
    } else {
      toast.error("All fields are necessary!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("User Doc created successfully");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("success");
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      toast.error("Email and Password is required!");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          toast.success("Successful");
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");

          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          toast.error(error.message);
          setLoading(false);
          // ...
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>TrackIt.</span>{" "}
          </h2>
          <form action="">
            <Input
              label={"Email"}
              placeholder={"johndoe@gmail.com"}
              state={email}
              setState={setEmail}
              type={"email "}
            />
            <Input
              label={"Password"}
              placeholder={"New Password"}
              state={password}
              setState={setPassword}
              type={"password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading" : "Log In with Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login">Or</p>
            <Button
              onClick={googleAuth}
              disabled={loading}
              text={loading ? "Loading" : "Log In With Google"}
              blue={true}
            />
            <p className="p-login p-link" onClick={() => setLoginForm(false)}>
              Or Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>TrackIt.</span>{" "}
          </h2>
          <form action="">
            <Input
              label={"Full Name"}
              placeholder={"John Doe"}
              state={name}
              setState={setName}
              type={"text"}
            />
            <Input
              label={"Email"}
              placeholder={"johndoe@gmail.com"}
              state={email}
              setState={setEmail}
              type={"email "}
            />
            <Input
              label={"Password"}
              placeholder={"New Password"}
              state={password}
              setState={setPassword}
              type={"password"}
            />
            <Input
              label={"Confirm Password"}
              placeholder={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              type={"password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading" : "Signup Using Email and Password"}
              onClick={signupUsingEmailandPassword}
            />
            <p className="p-login">Or</p>
            <Button
              onClick={googleAuth}
              disabled={loading}
              text={loading ? "Loading" : "Signup Using Google"}
              blue={true}
            />
            <p className="p-login p-link" onClick={() => setLoginForm(true)}>
              Or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;
