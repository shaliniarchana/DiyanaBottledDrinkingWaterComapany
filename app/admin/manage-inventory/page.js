"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "../../../firebase/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, increment, addDoc, deleteDoc } from "firebase/firestore";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AdminAuthWrapper from "../../../components/AdminAuthWrapper";
import { FaBoxOpen, FaSearch, FaPlus, FaMinus, FaSyncAlt, FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const BOTTLE_IMAGES = {
    "500ml": "/images/500ml.jpg",
    "1L": "/images/1L.jpg",
    "1.5L": "/images/1.5L.jpg",
    "5L": "/images/5L.jpg",
  };

  const BOTTLE_SIZES = Object.keys(BOTTLE_IMAGES);

  const [newItem, setNewItem] = useState({
    itemName: "",
    size: "500ml",
    stock: 0,
    reorderLevel: 50,
  });

  useEffect(() => {
    const q = query(collection(db, "inventory"), orderBy("itemName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "inventory"), {
        ...newItem,
        imageUrl: BOTTLE_IMAGES[newItem.size],
        stock: Number(newItem.stock),
        reorderLevel: Number(newItem.reorderLevel),
        createdAt: new Date()
      });
      setIsModalOpen(false);
      setNewItem({ itemName: "", size: "500ml", stock: 0, reorderLevel: 50 });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      await deleteDoc(doc(db, "inventory", deleteConfirm.id));
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const updateStock = async (id, amount) => {
    await updateDoc(doc(db, "inventory", id), { stock: increment(amount) });
  };


  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        item.itemName?.toLowerCase().includes(search) ||
        item.size?.toLowerCase().includes(search) ||
        item.stock?.toString().includes(search)
      );
    });
  }, [inventory, searchTerm]);

  return (
    <AdminAuthWrapper>
      <div className="flex flex-col min-h-screen  bg-[#00050a] text-white">
        <Navbar />
        <main className="relative flex-grow py-24 mb-10 px-6">
          <div className="relative z-10 max-w-7xl mx-auto">
            
    
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold mb-12 text-center text-cyan-300 drop-shadow-[0_0_15px_rgba(14,165,233,0.9)] uppercase italic"
            >
              Fleet Inventory
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search anything (size, name, stock)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 pl-14 outline-none focus:border-cyan-500 transition-all placeholder:text-white/20"
                />
                <FaSearch className="absolute left-6 top-5 text-cyan-500/40" />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(6, 182, 212, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)} 
                className="bg-cyan-600 px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FaPlus /> Add New SKU
              </motion.button>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredInventory.map((item) => (
                  <motion.div 
                    layout 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group bg-[#030d16] border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all shadow-xl"
                  >
                    <div className="h-56 bg-white/5 flex items-center justify-center p-4 relative overflow-hidden">
                      <img src={BOTTLE_IMAGES[item.size] || BOTTLE_IMAGES["500ml"]} alt={item.size} className="h-full object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-cyan-500 text-black text-[10px] font-black px-3 py-1 rounded-full">{item.size}</div>
                    </div>

                    <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{item.itemName}</h3>
                        <button 
                          onClick={() => setDeleteConfirm({ show: true, id: item.id })} 
                          className="text-red-500/40 hover:text-red-500 transition-colors p-2"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>

                      <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">In Stock</p>
                          <p className={`text-4xl font-black ${item.stock < item.reorderLevel ? 'text-red-500 animate-pulse' : 'text-white'}`}>{item.stock}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => updateStock(item.id, 1)} className="p-3 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-xl transition-all"><FaPlus /></button>
                          <button onClick={() => updateStock(item.id, -1)} className="p-3 bg-white/5 hover:bg-red-500 rounded-xl transition-all"><FaMinus /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>

    
        <AnimatePresence>
          {deleteConfirm.show && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-[#0a0a0a] border-2 border-red-500/30 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaExclamationTriangle className="text-red-500 text-4xl" />
                </div>
                <h2 className="text-2xl font-black mb-2">Are you sure?</h2>
                <p className="text-white/50 text-sm mb-8">This action cannot be undone. This SKU will be permanently removed.</p>
                <div className="flex gap-4">
                  <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="flex-1 py-4 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 py-4 rounded-xl bg-red-600 font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-900/40">Yes, Delete</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#05162b] border border-white/10 rounded-[2.5rem] w-full max-w-md p-10 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><FaTimes size={20} /></button>
                <h2 className="text-2xl font-black mb-8 text-cyan-400 uppercase italic tracking-tighter">Add New Asset</h2>
                
                <form onSubmit={handleAddItem} className="space-y-6">
                  <div className="flex gap-6 items-center bg-black/60 p-4 rounded-2xl border border-white/5">
                    <img src={BOTTLE_IMAGES[newItem.size]} alt="Preview" className="h-20 object-contain" />
                    <div className="flex-grow">
                      <label className="text-[10px] uppercase font-bold text-white/40 block mb-2">Bottle Size</label>
                      <select 
                        value={newItem.size} 
                        onChange={(e) => setNewItem({...newItem, size: e.target.value})}
                        className="w-full bg-[#1a1a1a] text-white border border-white/10 rounded-lg p-2 outline-none focus:border-cyan-500 cursor-pointer font-bold"
                      >
                        {BOTTLE_SIZES.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <input 
                    type="text" required placeholder="Asset Label (e.g. Batch #401)"
                    value={newItem.itemName} onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500 text-white placeholder:text-white/10"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-white/30 ml-2">Initial Qty</span>
                      <input type="number" placeholder="0" onChange={(e) => setNewItem({...newItem, stock: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-white/30 ml-2">Alert at</span>
                      <input type="number" placeholder="50" onChange={(e) => setNewItem({...newItem, reorderLevel: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500" />
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#22d3ee" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full py-5 bg-cyan-600 text-black font-black uppercase rounded-2xl shadow-lg shadow-cyan-900/40 transition-all"
                  >
                    Confirm SKU Entry
                  </motion.button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </AdminAuthWrapper>
  );
}