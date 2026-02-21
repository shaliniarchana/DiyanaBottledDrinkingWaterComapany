"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminAuthWrapper({ children }) {
  const [authorized, setAuthorized] = useState(null); 
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
        
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          const adminDocRef = doc(db, "admins", user.uid);
          const adminDoc = await getDoc(adminDocRef);

          
          if (
            (userDoc.exists() && userDoc.data().role === "admin") ||
            adminDoc.exists()
          ) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (error) {
          console.error("Error verifying admin privileges:", error);
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
      setChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (checked && authorized === false) {
      router.replace("/");
    }
  }, [authorized, checked, router]);

  
  if (!checked || authorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
      <h1
  className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 font-bold text-3xl sm:text-5xl text-center tracking-widest animate-shine-glow"
  style={{ 
    fontFamily: "'Cinzel', serif",
    filter: "drop-shadow(0 0 15px rgba(0, 229, 255, 0.8))"
  }}
>
          Verifying Executive Privileges ...
        </h1>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }

          @keyframes shine-glow {
  0% {
    background-position: -200% center;
    filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 25px rgba(0, 229, 255, 0.9));
  }
  100% {
    background-position: 200% center;
    filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.4));
  }
}

.animate-shine-glow {
  background-size: 200% auto;
  animation: shine-glow 4s linear infinite;
}
        `}</style>
      </div>
    );
  }

  if (!authorized) return null; 

  return <>{children}</>;
}
