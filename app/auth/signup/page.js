"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  FaFacebookF, FaYoutube, FaInstagram, FaLinkedinIn, FaVk,
  FaTelegramPlane, FaTwitter, FaWhatsapp, FaTiktok, FaDiscord,
  FaFacebookMessenger, FaWeixin, FaViber, FaSkype,
} from "react-icons/fa";
import { auth, db } from "../../../firebase/firebase";
import Image from "next/image";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const defaultAvatars = [
  "/avatars/avatar1.png", "/avatars/avatar2.png", "/avatars/avatar3.png",
  "/avatars/avatar4.png", "/avatars/avatar5.png", "/avatars/avatar6.png",
  "/avatars/avatar7.png", "/avatars/avatar8.png", "/avatars/avatar9.png",
  "/avatars/avatar10.png", "/avatars/avatar11.png", "/avatars/avatar13.png",
  "/avatars/avatar14.png", "/avatars/avatar15.png", "/avatars/avatar16.png",
  "/avatars/avatar17.png", "/avatars/avatar18.png", "/avatars/avatar19.png",
  "/avatars/avatar20.png", "/avatars/avatar21.png",
];


const sanitizeRole = (role) => {
  return "user"; 
};

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

export default function SignupPage() {
  const router = useRouter();
  

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [modalInfo, setModalInfo] = useState({ open: false, title: "", content: null });
  
  const [profileFile, setProfileFile] = useState(null);
  const [profileURL, setProfileURL] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeSignupMethod, setActiveSignupMethod] = useState(null);
  const [filePreviewURL, setFilePreviewURL] = useState("");

  const getProfileURL = async (uid) => {
    if (profileFile) {
      const imgRef = ref(storage, `profiles/${uid}`);
      await uploadBytes(imgRef, profileFile);
      return await getDownloadURL(imgRef);
    } 
    return avatarIndex !== null ? defaultAvatars[avatarIndex] : defaultAvatars[0];
  };

  const saveUserData = async (uid, userData) => {
   
    await setDoc(doc(db, "users", uid), {
      ...userData,
      uid,
      role: "user",
      createdAt: serverTimestamp(),
    });
  };

  const clearSignupData = () => {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setAvatarIndex(null);
    setProfileFile(null);
  };


  const handleEmailSignup = async (e) => {
     e.preventDefault();
  if (activeSignupMethod && activeSignupMethod !== "email") {
    alert("Complete or reset the current signup method first.");
    return;
  }
  if (!displayName.trim()) {
    setError("Please enter your display name before signing up.");
    return;
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    setError("Please enter a valid email.");
    return;
  }
  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

    setActiveSignupMethod("email");
     setError("");
  setMessage("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      const photoURL = await getProfileURL(cred.user.uid);
      await sendEmailVerification(cred.user);



      setModalInfo({
  open: true,
  title: "🎉 Verify Your Email 🎉",
  content: (
    <div className="space-y-4 text-cyan-400 font-medium text-left">
      <p className="text-base">
        Your account has been successfully created! 🎊  
        Please verify your email to start using your account by following these steps:
      </p>

      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          1
        </div>
        <p className="leading-relaxed">
          Check your inbox for the verification email we just sent.
        </p>
      </div>

     
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          2
        </div>
        <p className="leading-relaxed">
          If you don’t see it, check your <strong>Spam / Junk</strong> folder.
        </p>
      </div>

     
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          3
        </div>
        <p className="leading-relaxed">
          Open the email and click the <strong>Verify</strong> button/link.
        </p>
      </div>


      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          4
        </div>
        <p className="leading-relaxed">
          Once verified, return to this page and continue using your account 🚀
        </p>
      </div>
    </div>
  ),
});

     
      const checkInterval = setInterval(async () => {
        const user = auth.currentUser;
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(checkInterval);
            await saveUserData(user.uid, {
              email: user.email,
              displayName,
              profileImageURL: photoURL,
            });
            
            clearSignupData();
            setModalInfo({ open: false, title: "", content: null });
            router.push("/auth/login");
          }
        }
      }, 3000);

    } catch (err) {
      Swal.fire({ icon: "error", title: "Signup Failed", text: err.message });
      setActiveSignupMethod(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (profileFile) {
      const url = URL.createObjectURL(profileFile);
      setFilePreviewURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreviewURL("");
  }, [profileFile]);

  const previewImage = filePreviewURL || (avatarIndex !== null ? defaultAvatars[avatarIndex] : "");

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen items-center justify-center bg-cover bg-center text-white px-6 py-32 relative"
        style={{ backgroundImage: `linear-gradient(to bottom right, rgba(0, 10, 40, 0.9), rgba(0, 30, 60, 0.9)), url('/blue.jpg')`, backgroundBlendMode: "overlay" }}>
        
        <div className="relative max-w-lg w-full p-10 bg-blue-800/60 backdrop-blur-md rounded-3xl border-2 border-cyan-400 shadow-2xl animate-glow-blue space-y-6">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-300 bg-clip-text text-transparent tracking-widest animate-pulse">
            {displayName ? <span className="text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-300 bg-clip-text text-transparent tracking-widest animate-pulse">Welcome {displayName}</span> : "Join With Us"}
          </h2>

    
          <div className="flex justify-center mb-4">
            <Image 
              src={previewImage || "/avatars/avatar13.png"} 
              alt="Preview" width={96} height={96} 
              className="rounded-full border-4 border-cyan-400 object-cover" 
            />
          </div>

          <button onClick={() => setShowAvatarModal(true)} className="w-full py-2 bg-blue-900/40 rounded-lg text-cyan-300 border border-cyan-300/30 hover:bg-cyan-500 hover:text-white transition">
            Choose Avatar
          </button>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <input
              type="text" placeholder="Full Name" value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-900/40 border border-transparent focus:border-cyan-400 outline-none transition"
              required
            />
            
            <input
              type="email" placeholder="Email Address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-900/40 border border-transparent focus:border-cyan-400 outline-none transition"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} placeholder="Password (min 6 chars)"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-blue-900/40 border border-transparent focus:border-cyan-400 outline-none transition"
                required minLength={6}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1" />
              <label>
                I agree to the <Link href="/Terms" className="text-red-400 underline">Terms</Link> and <Link href="/Privacy" className="text-red-400 underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit" disabled={loading || !agreedToTerms}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center text-sm">
            Already have an account? <Link href="/auth/login" className="text-cyan-400 font-bold hover:underline">Login Here</Link>
          </div>
        </div>
      </main>

      {/* Avatar Modal & Footer Logic... (same as your original) */}
      {showAvatarModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-blue-900 p-6 rounded-3xl grid grid-cols-4 gap-4 max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            {defaultAvatars.slice(0, 12).map((avatar, i) => (
              <button key={i} onClick={() => { setAvatarIndex(i); setShowAvatarModal(false); }} className={`relative w-16 h-16 rounded-full border-2 ${avatarIndex === i ? "border-cyan-400" : "border-transparent"}`}>
                <Image src={avatar} alt="Avatar" fill className="rounded-full" />
              </button>
            ))}
          </div>
        </div>
      )}
          <Footer />
   
      {modalInfo.open && (
        <Modal
          title={modalInfo.title}
          onClose={() => setModalInfo({ open: false, title: "", content: null })}
        >
          {modalInfo.content}
        </Modal>
      )}
    </>
  );
}