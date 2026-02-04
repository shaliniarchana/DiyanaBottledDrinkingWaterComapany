"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
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
import { useEffect } from "react";

export default function AdminPage() {
  const cards = [
    {
      title: "Manage Students",
      desc: "View students & Download student report.",
      href: "/admin/manage-students",
      colorStart: "#1e3a8a",
      colorEnd: "#2563eb",
      textColor: "#dbeafe",
    },
    {
      title: "Manage Lessons",
      desc: "View , Add & Remove lessons.",
      href: "/admin/manage-lessons",
      colorStart: "#2563eb",
      colorEnd: "#3b82f6",
      textColor: "#eff6ff",
    },
    {
      title: "Manage Payments",
      desc: "View student payments & Download payment reports",
      href: "/admin/payments",
      colorStart: "#3b82f6",
      colorEnd: "#60a5fa",
      textColor: "#e0e7ff",
    },
    {
      title: "Manage Grades",
      desc: "View , Add & Remove grades",
      href: "/admin/manage-grades",
      colorStart: "#3b82f6",
      colorEnd: "#60a5fa",
      textColor: "#e0e7ff",
    },
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


  // Optional: Particle dots animation effect (CSS only)
  useEffect(() => {
    // No JS needed for particles, CSS handles it
  }, []);

  return (
    <>
      <Navbar />
      <main
        className="page-container relative flex flex-col min-h-screen px-6 py-32 font-[geistMono] text-gray-100 pt-[100px] overflow-hidden"
        style={{
          backgroundImage: `url('/blue.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundColor: "#031D44",
        }}
      >
        {/* Animated Gradient Overlay */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 animate-gradient-bg"></div>

        {/* Subtle particles */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 pointer-events-none">
          <div className="particle-container" />
        </div>

        {/* Header Image */}
        <div className="relative z-10 flex justify-center mb-12 animate-floating">
          <Image
            src="/teacher.png"
            width={900}
            height={180}
            alt="Teacher Title"
            className="rounded-3xl shadow-2xl "
            loading="lazy"
          />
        </div>

        {/* Subtitle */}
        <p className="relative z-10 mb-20 text-center text-2xl sm:text-3xl font-extrabold italic tracking-wide text-blue-300 drop-shadow-lg animate-slide-fade-in-up delay-150">
          Welcome to <span className="text-blue-400">Ceylon EduX</span> Teacher Panel
        </p>

        {/* Cards Grid */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 justify-center">
          {cards.map((card, idx) => (
            <AdminCard key={idx} card={card} index={idx} />
          ))}
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
      <style jsx>{`
        /* Gradient background animation */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-bg {
          background: linear-gradient(270deg, #082145, #1e40af, #2563eb, #3b82f6, #2563eb, #1e40af, #082145);
          background-size: 1400% 1400%;
          animation: gradientShift 30s ease infinite;
          opacity: 0.5;
          filter: brightness(0.75);
          z-index: -10;
        }

        /* Floating animation */
        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-floating {
          animation: floating 6s ease-in-out infinite;
        }

        /* Slide up + fade in */
        @keyframes slideFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-fade-in-up {
          animation: slideFadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        /* Staggered delays for cards */
        .card-0 {
          animation-delay: 0.1s;
        }
        .card-1 {
          animation-delay: 0.3s;
        }
        .card-2 {
          animation-delay: 0.5s;
        }
        .card-3 {
          animation-delay: 0.7s;
        }

        /* Card pulse glow */
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 40px 10px var(--glow-color);
          }
          100% {
            box-shadow: 0 0 80px 25px var(--glow-color);
          }
        }

        /* Shimmer + flicker effect on card title */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 22%, 24%, 55% {
            opacity: 0.7;
          }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            var(--glow-color) 20%,
            #ffffff 40%,
            var(--glow-color) 60%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite, flicker 4s linear infinite;
          user-select: none;
          text-shadow: 0 0 15px var(--glow-color);
        }

        /* Enter button glow pulse */
        .enter-btn {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 20px 0 var(--glow-color);
        }
        .enter-btn:hover,
        .enter-btn:focus {
          transform: scale(1.1);
          box-shadow: 0 0 40px 12px var(--glow-color);
          outline: none;
        }

        /* Particle dots */
        .particle-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .particle-container::before,
        .particle-container::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 3px);
          background-size: 40px 40px;
          opacity: 0.2;
          animation: moveParticles 120s linear infinite;
        }
        .particle-container::after {
          background-size: 60px 60px;
          opacity: 0.1;
          animation-delay: 60s;
        }
        @keyframes moveParticles {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </>
  );
}

// --- Admin Card Component ---
function AdminCard({ card, index }) {
  return (
    <div
      className={`relative group card-${index} animate-slide-fade-in-up flex flex-col justify-between min-h-[280px] p-8 rounded-3xl cursor-pointer shadow-xl backdrop-blur-md bg-white/10 border border-white/20 transform transition-transform duration-700 hover:scale-[1.08] hover:shadow-[0_0_40px_10px_rgba(37,99,235,0.85)] hover:-translate-y-3 hover:rotate-1`}
      style={{
        color: card.textColor,
        "--glow-color": card.colorEnd,
        borderColor: card.colorEnd + "aa",
        boxShadow: `0 0 20px 4px ${card.colorEnd}80`,
      }}
      tabIndex={0}
    >
      {/* Neon glowing border */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-900"
        style={{
          boxShadow: `0 0 60px 15px ${card.colorEnd}cc`,
          filter: "blur(25px)",
          zIndex: 0,
          animation: "pulseGlow 3s ease-in-out infinite alternate",
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h2
            className="text-3xl font-extrabold mb-5 shimmer-text select-none"
            style={{ color: card.colorEnd }}
          >
            {card.title}
          </h2>
          <p
            className="text-lg font-semibold leading-relaxed drop-shadow-lg"
            style={{ color: card.textColor }}
          >
            {card.desc}
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href={card.href}
            className="enter-btn px-14 py-3 text-lg font-bold uppercase rounded-full shadow-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70"
            style={{
              background: `linear-gradient(90deg, ${card.colorStart}, ${card.colorEnd})`,
              boxShadow: `0 0 20px 6px ${card.colorEnd}`,
            }}
          >
            Enter
          </Link>
        </div>
      </div>
    </div>
  );
}
