"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";
import {
  FaFacebookF, FaYoutube, FaInstagram, FaLinkedinIn, FaVk,
  FaTelegramPlane, FaTwitter, FaWhatsapp, FaTiktok, FaDiscord,
  FaFacebookMessenger, FaWeixin, FaViber, FaSkype
} from "react-icons/fa";
import { auth, db } from "../../../firebase/firebase"; 
import Swal from "sweetalert2";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


// --- Components ---
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="mb-4 text-gray-700 dark:text-gray-300">{children}</div>
        <button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Close</button>
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
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const socialLinks = [
    { icon: FaFacebookF, href: "https://sites.google.com/view/diyanabottleddrinkingwater/home" },
    { icon: FaInstagram, href: "https://sites.google.com/view/diyanabottleddrinkingwater/home" },
    { icon: FaYoutube, href: "https://sites.google.com/view/diyanabottleddrinkingwater/home" },
    { icon: FaTiktok, href: "https://sites.google.com/view/diyanabottleddrinkingwater/home" },
        { icon: FaWhatsapp, href: "https://sites.google.com/view/diyanabottleddrinkingwater/home" },
   
  ];


  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email") || "");
    }
  }, []);

 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (adminDoc.exists()) {
        localStorage.setItem("email", email);
        localStorage.setItem("role", "admin");
        
      Swal.fire({
  icon: "success",
  title: "Welcome Admin! 🎉",
  background: "#000814",
  color: "#E0F7FA",     
  iconColor: "#00E5FF",  
  timer: 2000,
  showConfirmButton: false,
  customClass: {
    popup: "border border-cyan-500 shadow-[0_0_20px_rgba(0,229,255,0.4)]",
    title: "font-sans tracking-wide"
  }
});
        router.push("/admin"); 
        return;
      }


      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        localStorage.setItem("email", email);
        localStorage.setItem("role", "user");

       Swal.fire({
  icon: "success",
  title: "Welcome back! 🎉",
  text: "Refreshing your session...",
  background: "#000814",
  color: "#E0F7FA",      
  iconColor: "#00E5FF", 
  timer: 2000,
  showConfirmButton: false,
  backdrop: `rgba(0, 8, 20, 0.8)`, 
  customClass: {
    popup: "border border-cyan-500/50 shadow-[0_0_25px_rgba(0,229,255,0.2)]",
    title: "text-2xl font-bold tracking-tight"
  }
});
        router.push("/");
        return;
      }

      setError("Account record not found in database.");
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

      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (adminDoc.exists()) {
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", "admin");
        router.push("/admin");
      } else if (userDoc.exists()) {
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", "user");
        router.push("/");
      } else {
        Swal.fire({
          icon: "info",
          title: "Account Not Found",
          text: "Please sign up first!",
          showCancelButton: true,
          confirmButtonText: "Sign Up",
          background: "#032F40",
          color: "#fff",
        }).then((res) => { if (res.isConfirmed) router.push("/auth/signup"); });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login Failed", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.includes("@")) {
      setForgotError("Please enter a valid email.");
      return;
    }
    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage("Reset email sent! Check your inbox.");
    } catch (err) {
      setForgotError(err.message);
    }
    setForgotLoading(false);
  };

  return (
    <>
      <Navbar />
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white px-4 pt-32 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 10, 40, 0.9), rgba(0, 30, 60, 0.9)), url('/blue.jpg')`,
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="relative w-full max-w-md p-10 bg-blue-800/60 backdrop-blur-md rounded-3xl border-2 border-cyan-400 shadow-2xl animate-glow-blue space-y-6 mb-10">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-300 bg-clip-text text-transparent tracking-widest animate-pulse">
            Login Now
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-900/40 placeholder-blue-200 text-white focus:ring-4 focus:ring-cyan-300 transition outline-none"
              required
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg bg-blue-900/40 placeholder-blue-200 text-white focus:ring-4 focus:ring-cyan-300 transition outline-none"
                required
              />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-black" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>

            <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="text-cyan-300 text-sm hover:underline">
              Forgot Password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm">Don't have an account? </span>
            <Link href="/auth/signup" className="text-cyan-400 font-bold hover:underline">Sign Up Here</Link>
          </div>

          {error && <p className="text-red-400 text-center font-semibold">{error}</p>}
        </div>
      </main>

     
      
      {showForgotPasswordModal && (
        <Modal title="Reset Password" onClose={() => setShowForgotPasswordModal(false)}>
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 mb-4 outline-none"
          />
          {forgotMessage && <p className="text-green-500 mb-2">{forgotMessage}</p>}
          {forgotError && <p className="text-red-500 mb-2">{forgotError}</p>}
          <button onClick={handleForgotPassword} disabled={forgotLoading} className="w-full py-3 rounded-lg font-bold tracking-wide text-white   bg-gradient-to-br from-black via-[#001c3d] to-[#0ea5e9]   hover:from-[#001c3d] hover:to-[#22d3ee]  transition-all duration-300 shadow-lg hover:shadow-cyan-500/50  border border-white/10 active:scale-[0.98]">
            {forgotLoading ? "Sending..." : "Send Reset Email"}
          </button>
        </Modal>
      )}

      <style jsx global>{`
        @keyframes glowBlue {
          0%, 100% { box-shadow: 0 0 8px #22d3ee; }
          50% { box-shadow: 0 0 20px #06b6d4; }
        }
        .animate-glow-blue { animation: glowBlue 3s ease-in-out infinite; }
      `}</style>
       <Footer />
    </>
  );
}