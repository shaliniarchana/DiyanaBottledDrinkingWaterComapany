"use client";

import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaSearch, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Fetch from 'users' collection directly
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Filter Logic for Users
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return users;

    return users.filter((user) => {
      return (
        user.displayName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.contactNumber?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  return (
    <>
      <Navbar />
      <div
        className="relative min-h-screen bg-center bg-cover mt-26 mb-30 bg-fixed"
        style={{
          backgroundImage: "url('/blue.jpg')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(5, 22, 43, 0.85)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#05192bcc] via-[#062b4acc] to-[#0a436bcc] backdrop-blur-sm" />

        <main
          className="relative z-10 max-w-7xl mx-auto p-8 pt-26 pb-12 text-cyan-100 min-h-screen flex flex-col border-4 border-cyan-500 rounded-3xl bg-opacity-30 backdrop-blur-md"
          style={{ backgroundColor: "rgba(5, 22, 43, 0.75)" }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="flex-grow flex flex-col justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mb-6"></div>
                <p className="text-xl font-mono tracking-widest text-cyan-300 uppercase animate-pulse">
                  Fetching System Users...
                </p>
              </motion.div>
            ) : (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-extrabold mb-12 text-center text-cyan-300 drop-shadow-[0_0_15px_rgba(14,165,233,0.9)]"
                >
                  Manage Users
                </motion.h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-10">
                  <div className="relative w-full sm:w-1/2">
                    <input
                      type="search"
                      placeholder="Search by name, email, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-3xl px-6 py-3 bg-black/50 border-2 border-blue-500 text-white focus:border-cyan-400 outline-none transition"
                    />
                    <FaSearch className="absolute right-5 top-4 text-cyan-400" />
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto w-full rounded-xl shadow-2xl">
                  <table className="min-w-full border-collapse text-cyan-50 bg-blue-900/60 backdrop-blur-md">
                    <thead className="bg-cyan-800/80 text-white uppercase text-sm tracking-wider">
                      <tr>
                        <th className="p-4 text-left">User</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Contact</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-cyan-900/50 hover:bg-cyan-500/20 transition-all duration-300"
                          >
                            <td className="p-4 flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-400">
                                {user.profileImageUrl ? (
                                  <img
                                    src={user.profileImageUrl}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-cyan-900 flex items-center justify-center">
                                    <FaUser className="text-cyan-400" />
                                  </div>
                                )}
                              </div>
                              <span className="font-bold">{user.displayName || "N/A"}</span>
                            </td>
                            <td className="p-4 text-sm">{user.email}</td>
                            <td className="p-4 text-sm">{user.contactNumber || "-"}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 text-sm opacity-70">
                              {user.createdAt?.seconds 
                                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB') 
                                : "Recently"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-10 text-center text-cyan-400 italic">
                            No users found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </AnimatePresence>

        </main>
      </div>
   
      <style jsx>{`
        tbody tr:hover {
          box-shadow: inset 0 0 20px rgba(34, 211, 238, 0.1);
        }
      `}</style>
     <Footer />
    </>
    
  );
}