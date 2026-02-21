"use client";
import Navbar from "../../components/Navbar";
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
import Image from "next/image";

export default function AboutPage() {
 const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/share/16wXKT1vb8/" },
    { icon: FaInstagram, href: "https://www.instagram.com/ibedux/" },
    { icon: FaYoutube, href: "https://youtube.com/@infinitebrainery8963?si=tTIhF8dDmwzMhLVN" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@ceylon_edux?_t=ZS-8z8tDacmeLw&_r=1" },
  { icon: FaWhatsapp, href: "https://www.ibedux.com/" },
   
  ];


  return (
    <>
      <Navbar />
      <main
        className="page-container flex flex-col min-h-screen items-center justify-center px-6 py-32 relative overflow-hidden selection:bg-cyan-500 selection:text-white"
        style={{
          
          backgroundImage: "url('/blue.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
        }}
      >
      <div className="flex justify-center items-center w-full py-16 px-4 bg-transparent">
  <div className="w-full sm:max-w-6xl relative p-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 animate-glow-flicker shadow-[0_0_30px_rgba(0,255,255,0.8)] overflow-hidden">

    <div className="bg-[#0A1F38CC] backdrop-blur-md rounded-3xl p-14 shadow-lg text-cyan-100 relative z-10 border border-cyan-400/60">
      
      <h1 className="text-5xl font-extrabold mb-10 text-cyan-300 drop-shadow-neon text-center uppercase tracking-widest">
        About <span className="text-white">Diyana Bottled Drinking Water</span>
      </h1>

    <div className="text-center mx-auto max-w-4xl space-y-8">
  <p className="text-lg leading-relaxed text-cyan-100/90 font-semibold drop-shadow-sm">
    Diyana Bottled Drinking Water is a premier hydration provider in Sri Lanka, dedicated to delivering pure, safe, and refreshing water to households and businesses. Utilizing advanced filtration and purification technologies, we ensure that every drop meets the highest health standards, empowering our community with the essential foundation for a healthy lifestyle.
  </p>

  <p className="text-lg leading-relaxed text-cyan-100/90 font-semibold drop-shadow-sm">
    Founded and managed by Diyana Bottled Drinking Water Company (Pvt) Ltd, Diyana Water combines state-of-the-art manufacturing processes with a commitment to environmental sustainability. By integrating modern distribution logistics with rigorous quality control, we are transforming how Sri Lankans access clean drinking water, ensuring reliability and excellence from our plant to your doorstep.
  </p>

  <p className="text-lg leading-relaxed text-cyan-100/90 font-semibold drop-shadow-sm">
    Diyana Bottled Drinking Water is proudly powered by Diyana Bottled Drinking Water Company (Pvt) Ltd, a dynamic Sri Lankan company incorporated on <strong className="text-white text-xl">December 1, 2022</strong>, under the Companies Act. With a steadfast commitment to innovation and professionalism, we serve a diverse range of clients across the island, bringing industrial excellence to the manufacturing and beverage sector.
  </p>
</div>

<div className="bg-cyan-700/30 border border-cyan-400 rounded-lg p-6 text-cyan-100 font-semibold space-y-2 max-w-md mx-auto mb-12 shadow-lg">
  <p>
    Company Registration Number:{" "}
    <span className="font-normal text-cyan-200">PV 00267408</span>
  </p>
  <p>
    Legal Structure:{" "}
    <span className="font-normal text-cyan-200">
      Limited liability company, registered in Sri Lanka
    </span>
  </p>
</div>

{/* Mission */}
<section className="mb-12 max-w-3xl mx-auto text-center">
  <h2 className="text-4xl font-extrabold text-cyan-400 mb-6 tracking-wide drop-shadow-neon">
    Our Mission
  </h2>
  <p className="text-lg leading-relaxed text-cyan-100/90 font-semibold max-w-xl mx-auto">
    To provide diverse, high-quality hydration solutions that enrich lives, ensure the health of our communities, enable business productivity, and inspire industrial progress in Sri Lanka and beyond through pure and sustainable water manufacturing
  </p>
</section>

{/* Vision */}
<section className="max-w-3xl mx-auto text-center">
  <h2 className="text-4xl font-extrabold text-cyan-400 mb-6 tracking-wide drop-shadow-neon">
  Our Vision
</h2>
<p className="text-lg leading-relaxed text-cyan-100/90 font-semibold max-w-2xl mx-auto">
  To be Sri Lanka's most trusted leader in pure hydration, recognized for 
  manufacturing innovation, uncompromising integrity, and a meaningful 
  impact on public health and environmental sustainability.
</p>
</section>

    </div>
  </div>
</div>

      </main>

 <footer className="bg-[#06111e] text-white py-8 border-t border-cyan-600 shadow-inner text-sm sm:text-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row flex-wrap justify-between gap-6 sm:gap-8 items-center sm:items-start">

        {/* Branding & Contact */}
        <div className="flex flex-col items-center sm:items-start flex-1 min-w-[200px] text-center sm:text-left">
          <div className="flex items-center flex-col sm:flex-row">
            <img 
              src="/images/logo.png" 
              alt="Diyana Bottled Drinking Water Logo" 
              className="w-16 h-16 object-contain mr-0 sm:mr-3 mb-2 sm:mb-0" 
            />
            <div>
              <h2 className="text-md font-bold text-cyan-400 tracking-wide">Diyana Bottled Drinking Water Company (Pvt) Ltd</h2>
         
            </div>
          </div>

          {/* Hotline & Email */}
          <div className="mt-9 flex flex-col items-center sm:items-start gap-1 text-gray-300">
            <a href="mailto:diyanabottleddrinkingwater@gmail.com" className="flex items-center gap-1 hover:text-white">
              <FaEnvelope /> diyanabottleddrinkingwater@gmail.com
            </a>
            <a href="tel:+94702791523" className="flex items-center gap-1 hover:text-white">
              <FaPhone /> +94 70 279 1523
            </a>
          </div>
        </div>

        {/* Resources & Links */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-2 text-gray-300 items-center sm:items-start text-center sm:text-left">
       
          <a href="/Terms" className="hover:text-white transition-colors">Terms & Conditions</a>
          <a href="/Privacy" className="hover:text-white transition-colors">Privacy Policy</a>
         
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
        © {new Date().getFullYear()} Diyana Bottled Drinking Water Company (Pvt) Ltd. All rights reserved.
      </div>
    </footer>

      <style jsx>{`
        /* Animations */
        @keyframes glowFlicker {
          0%, 100% {
            box-shadow:
              0 0 10px 4px rgba(0, 255, 255, 0.8),
              0 0 20px 8px rgba(0, 128, 255, 0.7),
              0 0 30px 12px rgba(0, 255, 255, 0.5);
          }
          50% {
            box-shadow:
              0 0 12px 5px rgba(0, 255, 255, 1),
              0 0 25px 10px rgba(0, 128, 255, 0.9),
              0 0 40px 16px rgba(0, 255, 255, 0.7);
          }
        }

        .animate-glow-flicker {
          animation: glowFlicker 3.5s ease-in-out infinite;
        }

        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }

        /* Neon glow text */
      

        /* Selection colors override */
        ::selection {
          background-color: #00d8ff;
          color: white;
        }
      `}</style>
    </>
  );
}
