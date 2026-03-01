"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminAuthWrapper from "../../components/AdminAuthWrapper";
import { FaUsers, FaBoxOpen, FaTruckLoading, FaArrowRight } from "react-icons/fa";

export default function AdminPage() {
  const cards = [
    {
      title: "User Management",
      desc: "Monitor customer accounts, update delivery addresses, and manage staff access permissions.",
      href: "/admin/manage-users",
      icon: <FaUsers />,
      accent: "from-cyan-400 to-blue-500",
      shadow: "shadow-cyan-500/20",
    },
    {
      title: "Inventory Control",
      desc: "Track stock levels for 5L, 10L, and 20L bottles. Manage purification supplies and equipment.",
      href: "/admin/manage-inventory",
      icon: <FaBoxOpen />,
      accent: "from-blue-400 to-indigo-600",
      shadow: "shadow-blue-500/20",
    },
    {
      title: "Order Processing",
      desc: "Manage pending water deliveries, track subscription refills, and generate billing invoices.",
      href: "/admin/manage-orders",
      icon: <FaTruckLoading />,
      accent: "from-blue-600 to-cyan-600",
      shadow: "shadow-indigo-500/20",
    },
  ];

  return (
    <AdminAuthWrapper>
      <div className="flex flex-col min-h-screen bg-[#00050a] text-white selection:bg-cyan-500/30">
        <Navbar />

        <main className="relative flex-grow flex items-center justify-center py-20 px-6 overflow-hidden">

          <div 
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-30 mix-blend-luminosity pointer-events-none"
            style={{ backgroundImage: "url('/images/blue.jpg')" }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

          <div className="relative z-10 max-w-7xl w-full mx-auto">
       
            <div className="text-center mb-20 space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  Admin Central
                </span>
              </h1>
              <div className="flex justify-center">
                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              </div>
              <p className="text-blue-200/60 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                Precision management for <span className="text-cyan-400">Diyana's Pure Hydration</span> network.
              </p>
            </div>

   
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {cards.map((card, idx) => (
                <Link key={idx} href={card.href} className="group block outline-none">
                <div className="relative h-full bg-[#030d16]/95 backdrop-blur-3xl border-[5px] border-cyan-500/30 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center overflow-hidden transition-colors duration-500 group-hover:border-cyan-400">
                    
                  
                    <div className={`absolute -inset-[1px] bg-gradient-to-br ${card.accent} rounded-[2rem] opacity-0 md:group-hover:opacity-100 blur-sm transition-opacity duration-500`} />
                    
                   
                    <div className="relative h-full bg-[#030d16]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center overflow-hidden">
           
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-scan pointer-events-none" />

           
                      <div className={`mb-8 p-5 rounded-2xl bg-gradient-to-br ${card.accent} text-white text-4xl shadow-2xl ${card.shadow} transform transition-transform duration-700 md:group-hover:rotate-[360deg]`}>
                        {card.icon}
                      </div>

                      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4 group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h2>
                      
                      <p className="text-blue-100/40 text-sm leading-relaxed mb-8 flex-grow">
                        {card.desc}
                      </p>

                    
                      <div className={`inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase py-3 px-6 rounded-full border border-white/10 bg-white/5 group-hover:bg-white group-hover:text-black transition-all duration-300`}>
                        Manage Now <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Prevent 'stuck' hover styles on mobile devices */
        @media (hover: none) {
          .group:hover .group-hover\:opacity-100 {
            opacity: 0 !important;
          }
          .group:hover {
            transform: none !important;
          }
          .group:active .active\:scale-95 {
            transform: scale(0.95) !important;
          }
        }
      `}</style>
    </AdminAuthWrapper>
  );
}