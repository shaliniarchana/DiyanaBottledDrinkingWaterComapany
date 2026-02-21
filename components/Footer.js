"use client";

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

export default function Footer() {
  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/share/16wXKT1vb8/" },
    { icon: FaInstagram, href: "https://www.instagram.com/ibedux/" },
    { icon: FaYoutube, href: "https://youtube.com/@infinitebrainery8963?si=tTIhF8dDmwzMhLVN" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@ceylon_edux?_t=ZS-8z8tDacmeLw&_r=1" },
    { icon: FaWhatsapp, href: "https://www.ibedux.com/" },
  ];

  return (
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
              <p className="text-gray-400 text-sm mt-1">Pure. Refreshing. Trusted.</p>
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
  );
}
