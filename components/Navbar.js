"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [isExecutive, setIsExecutive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u && u.emailVerified) {
        setIsLoggedIn(true);


        if (u.email === "sliitshalini@gmail.com") {
          setIsExecutive(true);
          setIsTeacher(false);
          return;
        }

        try {
    
          const userDoc = await getDoc(doc(db, "users", u.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

          
            
            setIsExecutive(role === "executive" || role === "admin");
          } else {
     
    
            setIsExecutive(false);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      } else {
        setIsLoggedIn(false);
  
        setIsExecutive(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
      { href: "/products", label: "Products"},
    { href: "/Orders", label: "Orders",requiresLogin: true },
    { href: "/Order History", label: "Order History", requiresLogin: true },
    { href: "/Profile", label: "Account", requiresLogin: true },
    { href: "/contact", label: "Contact Us" },
  ];

  const executiveLinks = [
    { name: "Executive Panel", href: "/admin" },
    { name: "Manage Users", href: "/admin/manage-users" },
       { name: "Manage Inventory Items", href: "/admin/manage-inventory" },
    { name: "Manage Orders", href: "/admin/manage-orders" },
   
  ];

  return (
    <>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[60]">
           <div className="loader-ring"></div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A0F1C] text-white px-6 pt-2 pb-3 shadow-lg border-b border-blue-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={50} height={50} className="rounded-md object-cover cursor-pointer" priority />
          </Link>
        </div>

       
        <div className="hidden md:flex gap-6 items-center">
          {navItems
            .filter(item => {
              if (item.requiresLogin && !isLoggedIn) return false;
              return true;
            })
            .map(({ href, label }) => (
              <Link key={href} href={href} className="text-blue-glow hover:brightness-125 transition-all font-semibold">
                {label}
              </Link>
            ))}

          {isExecutive && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setAdminDropdownOpen(!adminDropdownOpen)} className="text-blue-glow hover:brightness-125 transition-all font-semibold flex items-center gap-1">
                Executive Panel
                <svg className={`w-4 h-4 transition-transform ${adminDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" />
                </svg>
              </button>
              {adminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#132E48] border border-blue-700 rounded-md shadow-lg z-50">
                  {executiveLinks.map(({ name, href }) => (
                    <Link key={name} href={href} className="block px-4 py-2 text-sm text-blue-300 hover:bg-blue-600 hover:text-white" onClick={() => setAdminDropdownOpen(false)}>
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-400">Logout</button>
          ) : (
            <div className="flex gap-4">
              <Link href="/auth/login" className="text-blue-glow font-semibold">Login</Link>
              <Link href="/auth/signup" className="text-blue-glow font-semibold">Sign Up</Link>
            </div>
          )}
        </div>

       
        <button className="md:hidden p-2 text-blue-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>


      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full bg-[#0A0F1C] border-b border-blue-800 z-40 max-h-screen overflow-y-auto pb-10">
          <nav className="flex flex-col gap-2 py-4 px-6">
            {navItems
              .filter(item => {
                if (item.requiresLogin && !isLoggedIn) return false;
                if (item.hideForTeacher && isTeacher) return false;
                return true;
              })
              .map(({ href, label }) => (
                <Link key={href} href={href} className="block py-2 text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </Link>
              ))}

            {isExecutive && (
              <>
                <div className="text-blue-500 font-bold mt-4">Executive Panel</div>
                {executiveLinks.map(({ name, href }) => (
                  <Link key={name} href={href} className="block py-2 pl-4 text-blue-300 border-l border-blue-800" onClick={() => setMobileMenuOpen(false)}>
                    {name}
                  </Link>
                ))}
              </>
            )}

            <div className="mt-6 border-t border-blue-900 pt-4">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full text-left py-2 text-red-500">Logout</button>
              ) : (
                <>
                  <Link href="/auth/login" className="block py-2 text-blue-300" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link href="/auth/signup" className="block py-2 text-blue-300" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}