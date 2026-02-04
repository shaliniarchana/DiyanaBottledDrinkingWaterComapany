"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaVk,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
  FaTiktok,
  FaDiscord,
  FaFacebookMessenger,
  FaWeixin,
  FaViber,
  FaSkype,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { auth, db } from "../../../firebase/firebase"; // added db import for Firestore
import Swal from "sweetalert2";


import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="mb-4 text-gray-700 dark:text-gray-300">{children}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
      const [showPassword, setShowPassword] = useState(false);

     const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/share/16wXKT1vb8/" },
    { icon: FaInstagram, href: "https://www.instagram.com/ibedux/" },
    { icon: FaYoutube, href: "https://youtube.com/@infinitebrainery8963?si=tTIhF8dDmwzMhLVN" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@ceylon_edux?_t=ZS-8z8tDacmeLw&_r=1" },
    { icon: FaTwitter, href: "https://x.com/home" },
    { icon: FaWhatsapp, href: "https://www.ibedux.com/" },
    { icon: FaLinkedinIn, href: "https://www.ibedux.com/" },
    { icon: FaFacebookMessenger, href: "https://www.ibedux.com/" },
    { icon: FaTelegramPlane, href: "https://www.ibedux.com/" },
    { icon: FaWeixin, href: "https://www.ibedux.com/" },
    { icon: FaVk, href: "https://www.ibedux.com/" },
    { icon: FaViber, href: "https://www.ibedux.com/" },
    { icon: FaSkype, href: "https://secure.skype.com/portal/overview" },
    { icon: FaDiscord, href: "https://www.ibedux.com/" },
    { icon: FaTelegramPlane, href: "https://web.telegram.org/a/" }, // extra placeholder to fill grid
  ];


  // Load from localStorage on mount (only email now)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email") || "");
    }
  }, []);

  // Check if it's the executive admin (hardcoded)
    /*if (email === "example@gmail.com" && password === "123") {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("email", user.email || "");
      localStorage.setItem("role", "executive");

      router.push("/app/executive");
      return; // stop further execution
    }*/

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check admins collection
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (adminDoc.exists()) {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "admin");
      
      Swal.fire({
        icon: "success",
        title: "Welcome! 🎉",
        text: "You have logged in successfully.",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/");
      return;
    }

    // Check students collection
    const studentDoc = await getDoc(doc(db, "students", user.uid));
    if (studentDoc.exists()) {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "student");

      Swal.fire({
        icon: "success",
        title: "Welcome  🎉",
        text: "You have logged in successfully",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/");
      return;
    }

    // Check teachers collection
    const teacherDoc = await getDoc(doc(db, "teachers", user.uid));
    if (teacherDoc.exists()) {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "teacher");

      Swal.fire({
        icon: "success",
        title: "Welcome 🎉",
        text: "You have logged in successfully as a Teacher.",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/admin");
      return;
    }

    setError("No account found that was registered using Google");
  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};



const handleGoogleLogin = async () => {
  setLoading(true);
  setError("");
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const studentDoc = await getDoc(doc(db, "students", user.uid));
    const teacherDoc = await getDoc(doc(db, "teachers", user.uid));

    let userData = null;
    if (studentDoc.exists()) userData = { role: "student", ...studentDoc.data() };
    else if (teacherDoc.exists()) userData = { role: "teacher", ...teacherDoc.data() };

    if (userData) {
      localStorage.setItem("email", userData.email || user.email || "");
      localStorage.setItem("role", userData.role);

      Swal.fire({
        icon: "success",
        title: "Welcome! 🎉",
        text: `You have successfully logged in successfully as a ${userData.role}.`,
        showConfirmButton: false,
        timer: 2000,
      });

      if (userData.role === "teacher") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      // User not found in DB => ask to sign up
      Swal.fire({
        icon: "info",
        title: "Account Not Found",
        text: "It looks like you haven't signed up yet. Please sign up to log in!",
        showCancelButton: true,
        confirmButtonText: "Sign Up",
        cancelButtonText: "Cancel",
        background: "#032F40",
        color: "#fff",
        confirmButtonColor: "#0D6073",
        cancelButtonColor: "#A1D929",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/signup"); // adjust your signup page path
        }
      });
    }
  } catch (err) {
    // Any other Firebase error
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.message,
      background: "#032F40",
      color: "#fff",
      confirmButtonColor: "#0D6073",
    });
  } finally {
    setLoading(false);
  }
};


  const openForgotPasswordModal = () => {
    setForgotEmail(email || "");
    setForgotMessage("");
    setForgotError("");
    setShowForgotPasswordModal(true);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setForgotError("Please enter a valid email.");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage("Password reset email sent! Check your inbox (and spam).");
    } catch (err) {
      setForgotError(err.message);
    }
    setForgotLoading(false);
  };

  return (
    <>
      <Navbar />
   <main
  className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white px-4 sm:px-6 pt-28 sm:pt-32 relative"
  style={{
    backgroundImage: `linear-gradient(to bottom right, rgba(0, 10, 40, 0.9), rgba(0, 30, 60, 0.9)), url('/blue.jpg')`,
    backgroundBlendMode: "overlay",
  }}
>

  <div
    className="absolute inset-0 bg-[url('/images/blue-bg.jpg')] bg-cover opacity-20 -z-10"
    aria-hidden="true"
  />

  <div className="relative w-full max-w-md mx-auto p-10 sm:p-12 bg-blue-800/60 backdrop-blur-md rounded-3xl border-2 border-cyan-400 shadow-2xl animate-glow-blue space-y-6 mb-10">

    <h2
      className="text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg tracking-widest animate-pulse"
    >
      Login to Ceylon EduX
    </h2>

    <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-900/40 placeholder-blue-200 text-white focus:ring-4 focus:ring-cyan-300 transition transform focus:scale-105 focus:outline-none"
              required
            />

           <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 pr-10 rounded-lg bg-blue-900/40 placeholder-blue-200 text-white focus:ring-4 focus:ring-cyan-300 transition transform focus:scale-105 focus:outline-none"
    required
    minLength={6}
  />
  <div
    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-black"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
  </div>
</div>


            <div className="flex justify-between items-center text-sm mt-1 px-1">
            <button
              type="button"
              onClick={openForgotPasswordModal}
              className="text-cyan-300 hover:text-cyan-100 transition underline"
            >
              Forgot Password?
            </button>
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold py-3 rounded-xl shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
{/*<div className="my-4 text-center text-gray-300 font-semibold">OR</div>*/}
          

          <div className="mt-6">
        {/*
<button
  onClick={handleGoogleLogin}
  className="w-full py-3 border-2 border-white rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={loading}
  aria-label="Login with Google"
  type="button"
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 533.5 544.3"
    className="w-6 h-6"
    fill="none"
  >
    <path
      d="M533.5 278.4c0-18.9-1.5-37-4.3-54.6H272v103.4h146.9c-6.4 34.6-25.5 63.9-54.6 83.7v69.4h88.4c51.7-47.7 81.8-118 81.8-201.9z"
      fill="#4285F4"
    />
    <path
      d="M272 544.3c73.7 0 135.6-24.3 180.9-66.1l-88.4-69.4c-24.5 16.4-56 26-92.5 26-71 0-131.2-47.9-152.7-112.1H28.3v70.5C73.2 481.6 165 544.3 272 544.3z"
      fill="#34A853"
    />
    <path
      d="M119.3 325.3c-8.5-25.5-8.5-53 0-78.5v-70.5H28.3c-32.6 63.3-32.6 138.5 0 201.9l91-52.9z"
      fill="#FBBC05"
    />
    <path
      d="M272 107.7c39.7 0 75.5 13.7 103.7 40.5l77.7-77.7C403.4 24.7 340.6 0 272 0 165 0 73.2 62.7 28.3 156.9l91 52.9c21.5-64.2 81.7-112.1 152.7-112.1z"
      fill="#EA4335"
    />
  </svg>
  <span className="text-lg font-semibold">Login with Google</span>
</button>
*/}

       <span className="block text-center text-lg font-semibold mt-5 pt-5">
  Don&apos;t have an account?{" "}
  <Link href="/auth/signup" className="text-blue-500 hover:underline">
    Sign Up Here
  </Link>
</span>

          </div>

          {error && (
            <p className="mt-4 text-center text-red-400 font-semibold animate-fadeIn">
              {error}
            </p>
          )}
        </div>
      </main>

      
       <footer className="bg-[#06111e] text-white py-8 border-t border-cyan-600 shadow-inner text-sm sm:text-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row flex-wrap justify-between gap-6 sm:gap-8 items-center sm:items-start">

        {/* Branding & Contact */}
        <div className="flex flex-col items-center sm:items-start flex-1 min-w-[200px] text-center sm:text-left">
          <div className="flex items-center flex-col sm:flex-row">
            <img 
              src="/logo.jpg" 
              alt="IB EduX Logo" 
              className="w-16 h-16 object-contain mr-0 sm:mr-3 mb-2 sm:mb-0" 
            />
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 tracking-wide">Ceylon EduX</h2>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm">By : IB International (Pvt) Ltd</p>
            </div>
          </div>

          {/* Hotline & Email */}
          <div className="mt-9 flex flex-col items-center sm:items-start gap-1 text-gray-300">
            <a href="mailto:ceylonedux@gmail.com" className="flex items-center gap-1 hover:text-white">
              <FaEnvelope /> ceylonedux@gmail.com
            </a>
            <a href="tel:+94705519933" className="flex items-center gap-1 hover:text-white">
              <FaPhone /> +94 70 551 9933
            </a>
          </div>
        </div>

        {/* Resources & Links */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-2 text-gray-300 items-center sm:items-start text-center sm:text-left">
          <a href="/resourcesAndLinks" className="hover:text-white transition-colors">Resources & Links</a>
          <a href="/Terms" className="hover:text-white transition-colors">Terms & Conditions</a>
          <a href="/Privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/Refund" className="hover:text-white transition-colors">Refund Policy</a>
          <a href="/otherPolicy" className="hover:text-white transition-colors">Other Policies</a>
        </div>

     <div className="flex-1 min-w-[200px] grid grid-cols-5 gap-x-4 gap-y-10 justify-center">
  {socialLinks.map(({ icon: Icon, href }, idx) => (
    <a
      key={idx}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-transform duration-200 hover:scale-110 cursor-pointer text-2xl flex justify-center"
    >
      <Icon />
    </a>
  ))}
</div>

      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} Ceylon EduX - IB International (Pvt) Ltd. All rights reserved.
      </div>
    </footer>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <Modal
          title="Reset Password"
          onClose={() => setShowForgotPasswordModal(false)}
        >
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {forgotMessage && (
              <p className="text-green-600 mb-4">{forgotMessage}</p>
            )}
            {forgotError && <p className="text-red-600 mb-4">{forgotError}</p>}
            <button
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotLoading ? "Sending..." : "Send Reset Email"}
            </button>
          </>
        </Modal>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes glowBlue {
          0%,
          100% {
            box-shadow: 0 0 8px #22d3ee, 0 0 20px #22d3ee;
          }
          50% {
            box-shadow: 0 0 12px #06b6d4, 0 0 28px #06b6d4;
          }
        }
        .animate-glow-blue {
          animation: glowBlue 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
