"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "/components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Swal from "sweetalert2"; // make sure this is imported at the top
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
import { auth, db, storage } from "/firebase/firebase";
import Image from "next/image";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const notifyFormspree = async (user) => {
  try {
    await fetch("https://formspree.io/f/xvgbpzwj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        displayName: user.displayName || "Unknown",
        uid: user.uid,
        message: "✅ A new user has signed up and verified their email successfully!",
      }),
    });
    console.log("📧 Notification sent to Formspree");
  } catch (err) {
    console.error("❌ Failed to send Formspree notification:", err);
  }
};



const defaultAvatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
  "/avatars/avatar11.png",
  "/avatars/avatar13.png",
  "/avatars/avatar14.png",
  "/avatars/avatar15.png",
  "/avatars/avatar16.png",
  "/avatars/avatar17.png",
  "/avatars/avatar18.png",
  "/avatars/avatar19.png",
  "/avatars/avatar20.png",
  "/avatars/avatar21.png",
];

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

export default function SignupPage() {
 
  const [password, setPassword] = useState("");

  const [profileFile, setProfileFile] = useState(null);
  const [profileURL, setProfileURL] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(null);
  const [profileMethodLocked, setProfileMethodLocked] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [activeSignupMethod, setActiveSignupMethod] = useState(null); 

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);



  const [modalInfo, setModalInfo] = useState({ open: false, title: "", content: null });

 const [displayName, setDisplayName] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("displayName") || "";
  }
  return "";
});

const [email, setEmail] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("email") || "";
  }
  return "";
});

const [role, setRole] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role") || "student";
  }
  return "student";
});

const [profileImageURL, setProfileImageURL] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("profileImageURL") || "";
  }
  return "";
});



  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (displayName) localStorage.setItem("displayName", displayName);
      else localStorage.removeItem("displayName");
    }
  }, [displayName]);

  useEffect(() => {
  if (typeof window !== "undefined") {
    if (email) localStorage.setItem("email", email);
    else localStorage.removeItem("email");
  }
}, [email]);

useEffect(() => {
  if (typeof window !== "undefined") {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }
}, [role]);

useEffect(() => {
  if (typeof window !== "undefined") {
    if (profileImageURL) {
      localStorage.setItem("profileImageURL", profileImageURL);
    } else {
      localStorage.removeItem("profileImageURL");
    }
  }
}, [profileImageURL]);


 
  const getProfileURL = async (uid) => {
    if (profileFile) {
      const imgRef = ref(storage, `profiles/${uid}`);
      await uploadBytes(imgRef, profileFile);
      return await getDownloadURL(imgRef);
    } else if (profileURL.trim()) {
      return profileURL.trim();
    } else if (avatarIndex !== null) {
      return defaultAvatars[avatarIndex];
    }
    return defaultAvatars[0]; // automatically assign avatar1.png

  };

  const sanitizeRole = (role) => {
  if (role === "student" || role === "teacher") return role;
  return "student"; // fallback default role
};


 const saveUserData = async (uid, role, userData) => {
  const validRole = sanitizeRole(role);
  const collection = validRole === "student" ? "students" : "teachers";

  await setDoc(doc(db, collection, uid), {
    ...userData,
    uid,
    role: validRole,
    createdAt: new Date(),
  });
};



 const initUserInFirestore = async (user, photoURL) => {
  // sanitize role before saving
  const validRole = sanitizeRole(role);
  const path = validRole === "teacher" ? "teachers" : "students";

  const refUser = doc(db, path, user.uid);
  const snap = await getDoc(refUser);
  if (!snap.exists()) {
    await setDoc(refUser, {
      uid: user.uid,
      email: user.email || "",
      displayName,
      role: validRole,
      profileImageURL: photoURL || user.photoURL || "",
      createdAt: serverTimestamp(),
    });
  }
};

  const clearSignupData = () => {
  localStorage.removeItem("displayName");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("profileImageURL");


  setDisplayName("");
  setEmail("");
  setPassword("");
  setRole("student");
  setProfileImageURL("");
  resetProfileInputs();
};
{/*
  // Google signup
const handleGoogle = async () => {
  // Check if another signup method is active
  if (activeSignupMethod && activeSignupMethod !== "google") {
    Swal.fire({
      imageUrl: "/black.png", // path to your logo
  imageWidth: 200, // adjust size as needed
  imageHeight: 100,
  imageAlt: "Logo",
      title: "Signup In Progress",
      text: "Complete or reset the current signup method first.",
      confirmButtonColor: "#0D6073",
    });
    return;
  }

  // Check if display name is filled
  if (!displayName.trim()) {
    Swal.fire({
     imageUrl: "/black.png", // path to your logo
  imageWidth: 200, // adjust size as needed
  imageHeight: 100,
  imageAlt: "Logo",
      title: "Display Name Required",
      text: "Please enter your display name before signing up with Google.",
      confirmButtonColor: "#0D6073",
    });
    return;
  }

  setActiveSignupMethod("google");
  setError("");
  setLoading(true);

  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    // Ensure Google account has a display name
    if (!res.user.displayName || res.user.displayName.trim() === "") {
      Swal.fire({
      imageUrl: "/black.png", // path to your logo
  imageWidth: 200, // adjust size as needed
  imageHeight: 100,
  imageAlt: "Logo",
        title: "Google Name Missing",
        text: "Update your Google account display name before signing in.",
        confirmButtonColor: "#0D6073",
      });
      setActiveSignupMethod(null);
      setLoading(false);
      return;
    }

    // Save display name locally
    localStorage.setItem("displayName", res.user.displayName);

   const defaultAvatar = "/avatars/avatar13.png";

await saveUserData(res.user.uid, sanitizeRole(role), {
  email: res.user.email || "",
  displayName: res.user.displayName || displayName,
  profileImageURL: res.user.photoURL || defaultAvatar,
  createdAt: serverTimestamp(),
});

    router.push("/auth/login");
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Google Sign-In Failed",
      text: err.message,
      confirmButtonColor: "#0D6073",
    });
    setActiveSignupMethod(null);
  } finally {
    setLoading(false);
  }
};
*/}

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

      {/* Step 1 */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          1
        </div>
        <p className="leading-relaxed">
          Check your inbox for the verification email we just sent.
        </p>
      </div>

      {/* Step 2 */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          2
        </div>
        <p className="leading-relaxed">
          If you don’t see it, check your <strong>Spam / Junk</strong> folder.
        </p>
      </div>

      {/* Step 3 */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">
          3
        </div>
        <p className="leading-relaxed">
          Open the email and click the <strong>Verify</strong> button/link.
        </p>
      </div>

      {/* Step 4 */}
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


    // Poll email verification every 3s
    const checkInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(checkInterval);

          // Save user data only after email verification
          const validRole = sanitizeRole(role);
          await saveUserData(user.uid, validRole, {
            email: user.email || "",
            displayName,
            profileImageURL: photoURL || "",
            createdAt: serverTimestamp(),
          });

          // ✅ Send signup info to Formspree
          try {
            await fetch("https://formspree.io/f/xvgbpzwj", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                displayName,
                email: user.email,
                role: validRole,
                profileImageURL: photoURL || "",
                signupMethod: "email",
                signupDate: new Date().toISOString(),
              }),
            });
          } catch (formError) {
            console.error("Formspree submission failed:", formError);
          }

          clearSignupData();
          setModalInfo({ open: false, title: "", content: null });
          router.push("/auth/login");
        }
      }
    }, 3000);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      Swal.fire({
        icon: "error",
        title: "Email Already In Use",
        text: "❗ This email is already registered. Please use another email or login.",
        confirmButtonColor: "#0D6073",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: "❗ " + err.message,
        confirmButtonColor: "#0D6073",
      });
    }
    setActiveSignupMethod(null);
  }
  setLoading(false);
};


  // Profile inputs locking logic
  useEffect(() => {
    if (profileFile) {
      setProfileURL("");
      setAvatarIndex(null);
      setProfileMethodLocked(true);
    }
  }, [profileFile]);

  useEffect(() => {
    if (profileURL.trim()) {
      setProfileFile(null);
      setAvatarIndex(null);
      setProfileMethodLocked(true);
    }
  }, [profileURL]);

  useEffect(() => {
    if (avatarIndex !== null) {
      setProfileFile(null);
      setProfileURL("");
      setProfileMethodLocked(true);
    }
  }, [avatarIndex]);

  const resetProfileInputs = () => {
    setProfileFile(null);
    setProfileURL("");
    setAvatarIndex(null);
    setProfileMethodLocked(false);
  };

  const [filePreviewURL, setFilePreviewURL] = useState("");
  useEffect(() => {
    if (profileFile) {
      const url = URL.createObjectURL(profileFile);
      setFilePreviewURL(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewURL("");
    }
  }, [profileFile]);

  const previewImage =
    filePreviewURL || profileURL.trim() || (avatarIndex !== null ? defaultAvatars[avatarIndex] : "");

  // Reset signup form & active method on reset button
  const resetAllSignup = () => {
    setActiveSignupMethod(null);
    setError("");
    setMessage("");
    setDisplayName("");
    setEmail("");
    setPassword("");
   
    resetProfileInputs();
  };

  // Disable inputs if another signup method active
  const isDisabled = (method) => {
    return activeSignupMethod !== null && activeSignupMethod !== method;
  };
  return (
    <>
      <Navbar />

     <main
  className="flex flex-col min-h-screen items-center justify-center bg-cover bg-center text-white px-6 py-38 selection:bg-cyan-300 selection:text-white relative"
  style={{
    backgroundImage: `linear-gradient(to bottom right, rgba(0, 10, 40, 0.9), rgba(0, 30, 60, 0.9)), url('/blue.jpg')`,
    backgroundBlendMode: "overlay"
  }}
>

        <div className="absolute inset-0 bg-[url('/images/blue-bg.jpg')] bg-cover opacity-20 -z-10" />

        <div
          className="relative max-w-lg mx-auto p-12 pt-20 bg-blue-800/60 backdrop-blur-md rounded-3xl border-2 border-cyan-400 shadow-2xl animate-glow-blue space-y-6"
          role="main"
        >
       <h2 className="text-center text-3xl font-extrabold drop-shadow tracking-wide transition-colors duration-300">
  {displayName.trim() ? (
    <>
      <span className="block text-cyan-400 animate-fadeInDown">Welcome</span>
      <span className="block text-yellow-300 text-xl sm:text-2xl md:text-3xl font-extrabold animate-fadeInUp break-words text-center max-w-full">
        {displayName.trim()}
      </span>
    </>
  ) : (
    <span className="block text-white animate-pulse">Ceylon EduX</span>
  )}
</h2>



       {previewImage || profileImageURL ? (
  <div className="flex justify-center mb-6 animate-fadeIn">
   <Image
  src={previewImage || profileImageURL || "/avatars/avatar13.png"}
  alt="Profile Preview"
  width={96} // 24 * 4 (Tailwind w-24 = 6rem = 96px)
  height={96} // same as width
  className="rounded-full object-cover border-4 border-cyan-400 shadow-xl"
/>

  </div>
) : null}


{!profileMethodLocked ? (
  <div className="space-y-4 mb-15 animate-fadeIn">
    <label
      htmlFor="choose-avatar"
      className="block text-center font-semibold text-cyan-300 cursor-pointer bg-blue-900/40 py-2 px-4 rounded-lg hover:bg-cyan-500 transition"
      onClick={() => setShowAvatarModal(true)}
    >
      Choose an Avatar
    </label>

   {/*
<input
  type="file"
  accept="image/*"
  className="block w-full text-center px-4 py-2 bg-blue-900/40 rounded-lg text-white cursor-pointer hover:bg-cyan-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-300"
  onChange={(e) => setProfileFile(e.target.files[0])}
  disabled={activeSignupMethod !== null}
/>

<input
  type="url"
  placeholder="Or paste image URL here"
  value={profileURL}
  onChange={(e) => setProfileURL(e.target.value)}
  className="w-full px-4 py-3 bg-blue-900/40 text-white rounded-lg placeholder-blue-300 focus:ring-4 focus:ring-cyan-300 transition focus:outline-none"
  disabled={activeSignupMethod !== null}
/>
*/}

  </div>
) : (
  <div className="mb-6 animate-fadeIn">
    <button
      onClick={resetProfileInputs}
      className="block w-full py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
      disabled={activeSignupMethod !== null}
      type="button"
    >
      🔁 Choose Different Avatar
    </button>
  </div>
)}

{/* Email Sign Up */}
<form onSubmit={handleEmailSignup} className="space-y-5 animate-fadeIn">
 <div className="mb-4">
  <input
    type="text"
    placeholder="Display Name"
    value={displayName}
    onChange={(e) => setDisplayName(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-blue-900/40 text-white placeholder-blue-200 placeholder-opacity-50 focus:ring-4 focus:ring-cyan-300 transition transform focus:scale-105 focus:outline-none"
    required
    minLength={2}
    maxLength={30}
    disabled={activeSignupMethod !== null && activeSignupMethod !== "email"}
  />
  <p className="text-sm text-yellow-400 mt-1">
    ⚠️ Please enter your full name. This cannot be changed later.
  </p>
</div>


<input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full px-4 py-3 rounded-lg bg-blue-900/40 text-white placeholder-blue-200 placeholder-opacity-50 focus:ring-4 focus:ring-cyan-300 transition transform focus:scale-105 focus:outline-none"
  required
  disabled={activeSignupMethod !== null && activeSignupMethod !== "email"}
/>

  <div className="relative w-full">
       <input
    type={showPassword ? "text" : "password"}
    placeholder="Password (min 6 chars)"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 pr-12 rounded-lg bg-blue-900/40 text-white placeholder-blue-200 placeholder-opacity-50 focus:ring-4 focus:ring-cyan-300 transition transform focus:scale-105 focus:outline-none"
    required
    minLength={6}
    disabled={activeSignupMethod !== null && activeSignupMethod !== "email"}
  />

      <div
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-black"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </div>
      
    </div>
     <p className="mt-1 text-sm text-cyan-200">
    Use at least 6 characters. Include uppercase & lowercase letters, numbers and special characters.
  </p>

  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-blue-900/40 text-white cursor-pointer transition transform focus:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
    disabled={activeSignupMethod !== null}
  >
   <option value="student">{'student'.charAt(0).toUpperCase() + 'student'.slice(1)}</option>
<option value="teacher">{'teacher'.charAt(0).toUpperCase() + 'teacher'.slice(1)}</option>

  </select>
<div className="flex items-start gap-2 text-sm text-white">
  <input
    type="checkbox"
    id="agree"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
    className="mt-1"
    disabled={activeSignupMethod !== null}
  />
  <label htmlFor="agree" className="text-left">
    I agree to the{" "}
  <Link
  href="/Terms"
  className="underline !text-red-500 hover:!text-red-300"
>
  Terms & Conditions
</Link>
{" "}
and{" "}
<Link
  href="/Privacy"
  className="underline !text-red-500 hover:!text-red-300"
>
  Privacy Policy
</Link>




  </label>
</div>

  <button
  type="submit"
  disabled={
    loading || !agreedToTerms || (activeSignupMethod !== null && activeSignupMethod !== "email")
  }
  className="w-full bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold py-3 mt-5 rounded-xl shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading && activeSignupMethod === "email" ? "Signing Up..." : "Sign Up with Email"}
</button>

</form>

{/*<div className="my-4 text-center text-gray-300 font-semibold">OR</div> */}

{/* Google Sign Up */}
<div className="mt-5">
  
  {/*
<button
  onClick={handleGoogle}
  className="w-full py-3 border-2 border-white rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={loading || !agreedToTerms || (activeSignupMethod !== null && activeSignupMethod !== "google")}
  aria-label="Sign Up with Google"
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
  <span className="text-lg font-semibold">Sign Up with Google</span>
</button>
*/}

  
   <span className="block text-center text-lg font-semibold mt-5 pt-5">
Already have an account?{" "}
  <Link href="/auth/login" className="text-blue-500 hover:underline">
    Login Here
  </Link>
</span>
</div>





<div id="recaptcha-container" />
{activeSignupMethod !== null && (
  <button
    onClick={resetAllSignup}
    className="mt-6 w-full py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
    type="button"
  >
    🔄 Reset / Cancel Signup
  </button>
)}

{/* Avatar Modal */}
{showAvatarModal && (
  <div
    className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
    onClick={() => setShowAvatarModal(false)}
  >
    <div
      className="bg-blue-900 p-6 rounded-3xl grid grid-cols-4 gap-4 max-w-md mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="col-span-4 text-center text-xl font-semibold text-white mb-4">
        Select an Avatar
      </h3>
      {defaultAvatars.map((avatar, i) => (
        <button
          key={i}
          onClick={() => {
            setAvatarIndex(i);
            setShowAvatarModal(false);
          }}
          className={`rounded-full border-4 ${
            avatarIndex === i ? "border-cyan-400" : "border-transparent"
          } hover:border-cyan-400 transition`}
          type="button"
        >
       <div className="relative w-20 h-20">
  <Image 
    src={avatar} 
    alt={`Avatar ${i + 1}`} 
    fill 
    className="rounded-full object-cover"
  />
</div>

        </button>
      ))}
      <button
        onClick={() => setShowAvatarModal(false)}
        className="col-span-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
        type="button"
      >
        Cancel
      </button>
    </div>
  </div>


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


      {/* Modal Popup */}
      {modalInfo.open && (
        <Modal
          title={modalInfo.title}
          onClose={() => setModalInfo({ open: false, title: "", content: null })}
        >
          {modalInfo.content}
        </Modal>
      )}

      {/* Tailwind Animations */}
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
