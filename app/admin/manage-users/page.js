"use client";

import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, collectionGroup } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../../components/Navbar";
import { FaSearch } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
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

import { motion, AnimatePresence } from "framer-motion";

const SKILLS_ORDER = ["listening", "reading", "writing", "speaking", "other"];

const prettySkillName = (skill) => {
  switch (skill) {
    case "other":
      return "Other";
    default:
      return skill.charAt(0).toUpperCase() + skill.slice(1);
  }
};

export default function AdminStudentManagement() {
  const [userId, setUserId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");

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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!userId) return;

  // Query all 'records' subcollections across /payments/*
  const recordsQuery = collectionGroup(db, "records");

  const unsubscribe = onSnapshot(recordsQuery, (snapshot) => {
    const paidStudents = snapshot.docs
      .map(doc => ({ id: doc.id, data: doc.data() }))
      .filter(student =>
        student.data.teacher === userId && // matches logged-in teacher
        student.data.adminConfirmed === true // only paid/approved students
      );

    setStudents(paidStudents);
    setLoading(false);
  });

  return () => unsubscribe();
}, [userId]);


  const skills = useMemo(() => {
    const setSkills = new Set(students.map(({ data }) => data.skill).filter(Boolean));
    const sorted = [...setSkills].sort(
      (a, b) => SKILLS_ORDER.indexOf(a) - SKILLS_ORDER.indexOf(b)
    );
    return sorted;
  }, [students]);

  const gradesBySkill = useMemo(() => {
    const map = {};
    students.forEach(({ data }) => {
      if (!data.skill || !data.grade) return;
      if (!map[data.skill]) map[data.skill] = new Set();
      map[data.skill].add(data.grade);
    });
    Object.keys(map).forEach((skill) => {
      map[skill] = [...map[skill]].sort();
    });
    return map;
  }, [students]);

 const filteredStudents = useMemo(() => {
  const term = searchTerm.toLowerCase();
  return students.filter(({ data }) => {
    if (selectedSkill !== "all" && data.skill !== selectedSkill) return false;
    if (selectedGrade !== "all" && data.grade !== selectedGrade) return false;

    if (!term) return true;

    const searchableFields = [
      data.fullName,
      data.address,
      data.birthday,
      data.telephone,
      data.whatsapp,
      data.skill,
      data.grade,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      String(field).toLowerCase().includes(term)
    );
  });
}, [students, searchTerm, selectedSkill, selectedGrade]);

  const groupedStudents = useMemo(() => {
    const group = {};
    filteredStudents.forEach(({ data, id }) => {
      if (!group[data.skill]) group[data.skill] = {};
      if (!group[data.skill][data.grade]) group[data.skill][data.grade] = [];
      group[data.skill][data.grade].push({ id, ...data });
    });
    return group;
  }, [filteredStudents]);

  const downloadPDF = (skill = "all", grade = "all") => {
  const doc = new jsPDF();

  // Add logo image (make sure logo.jpg is a base64 or URL or use fetch to convert to base64)
  // Here I'll assume you have the logo as base64 data or a URL accessible by your environment.
  // For example, if logo.jpg is base64 string or you can convert it before this call:
  const logoImg = "/logo.jpg"; // or base64 data URL if available

  // Add logo to top-left corner (x=14, y=10), size 30x30
  doc.addImage(logoImg, "JPEG", 14, 10, 30, 30);

  // Add company name right of logo (x=50 to give space), y=20 vertically centered with logo
  doc.setFontSize(16);
  doc.setTextColor("#0d94d8");
  doc.setFont("helvetica", "bold");
  doc.text("IB International (Pvt) Ltd", 50, 20);

  // Add developer credit below company name
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#0a75c2");
  doc.text("Ceylon EduX", 50, 28);

  // Then your existing title moved down a bit (start y = 50 instead of 22)
  doc.setFontSize(18);
  doc.setTextColor("#0d94d8");
  doc.setFont("helvetica", "bold");
  doc.text("Student Payment Report", 14, 50);

  if (skill !== "all") {
    doc.setFontSize(14);
    doc.setTextColor("#0da3e5");
    doc.text(`Skill: ${prettySkillName(skill)}`, 14, 60);
  }
  if (grade !== "all") {
    doc.setFontSize(14);
    doc.setTextColor("#0da3e5");
    doc.text(`Grade: ${grade}`, 14, 68);
  }

  let dataToExport = students;
  if (skill !== "all")
    dataToExport = dataToExport.filter((s) => s.data.skill === skill);
  if (grade !== "all")
    dataToExport = dataToExport.filter((s) => s.data.grade === grade);

  const columns = [
    "Full Name",
    "Address",
    "Birthdate",
    "Telephone",
    "WhatsApp",
    "Skill",
    "Grade",
  ];

  const rows = dataToExport.map(({ data }) => [
    data.fullName || "-",
    data.address || "-",
    data.birthday || "-",
    data.telephone || "-",
    data.whatsapp || "-",
    prettySkillName(data.skill) || "-",
    data.grade || "-",
  ]);

  autoTable(doc, {
    startY: grade !== "all" || skill !== "all" ? 80 : 70, // moved down to fit header
    head: [columns],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: "#0d94d8", textColor: "white" },
    alternateRowStyles: { fillColor: "#d0e7ff" },
  });

  doc.save(`student-report-${skill}-${grade}.pdf`);
};

  return (
    <>
      <Navbar />
      <div
        className="relative min-h-screen bg-center bg-cover bg-fixed"
        style={{
          backgroundImage: "url('/blue.jpg')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(5, 22, 43, 0.85)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#05192bcc] via-[#062b4acc] to-[#0a436bcc] backdrop-blur-sm" />

 <main className="relative z-10 max-w-7xl mx-auto p-8 pt-30 pb-12 text-cyan-100 min-h-screen flex flex-col border-4 border-cyan-500 rounded-3xl bg-[url('/blue.jpg')] bg-cover bg-center bg-no-repeat shadow-[0_0_20px_5px_rgba(14,165,233,0.8)] backdrop-blur-md bg-opacity-30"
  style={{
    backgroundBlendMode: "overlay",
    backgroundColor: "rgba(5, 22, 43, 0.75)",
  }}
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
                <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin-slow mb-6"></div>
                <p className="text-xl font-mono tracking-widest text-cyan-300 uppercase animate-pulse">
                  Loading students...
                </p>
              </motion.div>
            ) : (
              <>
              <motion.h1
  key="title"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.8 }}
  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center break-words drop-shadow-[0_0_20px_rgba(14,165,233,0.9)] tracking-wide text-cyan-300"
  style={{
    textShadow:
      "0 0 6px #0ea5e9, 0 0 12px #3b82f6, 0 0 20px #0ea5e9, 0 0 30px #22d3ee",
  }}
>
Manage Students
</motion.h1>

               <motion.div
  key="filters"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="flex flex-col sm:flex-row justify-center gap-6 mb-10 pt-6 pb-6"
>

                {/* Search */}
<div className="relative w-full sm:w-1/3">
  <input
    type="search"
    placeholder="Search students by any key..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    aria-label="Search students"
    className="w-full rounded-3xl px-5 py-3 font-semibold text-white shadow-lg outline-none border-2 border-blue-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-70 transition bg-black placeholder:text-cyan-400 placeholder:opacity-80 backdrop-blur-sm"
    style={{ caretColor: "#0ff", paddingRight: "3rem" }}
  />
  <FaSearch
    className="absolute right-4 top-3.5 text-cyan-400 drop-shadow-[0_0_6px_cyan] animate-pulse"
    size={18}
  />
</div>


                  {/* Skill Select */}
                  <select
                    className="rounded-3xl px-5 py-3 bg-cyan-700 bg-opacity-70 font-bold shadow-lg hover:bg-cyan-600 transition text-white outline-none border-2 border-transparent focus:border-cyan-400 backdrop-blur-sm"
                    value={selectedSkill}
                    onChange={(e) => {
                      setSelectedSkill(e.target.value);
                      setSelectedGrade("all");
                    }}
                    aria-label="Filter by skill"
                  >
                    <option value="all">All Skills</option>
                    {skills.map((skill) => (
                      <option key={skill} value={skill}>
                        {prettySkillName(skill)}
                      </option>
                    ))}
                  </select>

                  {/* Grade Select */}
                  <select
                    className="rounded-3xl px-5 py-3 bg-cyan-700 bg-opacity-70 font-bold shadow-lg hover:bg-cyan-600 transition text-white outline-none border-2 border-transparent focus:border-cyan-400 disabled:opacity-50 backdrop-blur-sm"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    disabled={selectedSkill === "all"}
                    aria-label="Filter by grade"
                  >
                    <option value="all">All Grades</option>
                    {selectedSkill !== "all" &&
                      gradesBySkill[selectedSkill]?.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                  </select>

                  {/* Download Button */}
                  <button
                    onClick={() => downloadPDF(selectedSkill, selectedGrade)}
                   className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg hover:scale-105 sm:hover:scale-110 transition-transform duration-300 animate-pulse whitespace-nowrap"
                    aria-label="Download student report PDF"
                    title="Download filtered report as PDF"
                  >
                    <FaDownload size={18} />
                    Download Student Report
                  </button>
                </motion.div>

                {/* Student List */}
          {selectedSkill === "all" ? (
  skills.length === 0 ? (
    <p className="text-center text-cyan-300 text-lg mt-16 font-semibold animate-pulse">
      No students found.
    </p>
  ) : (
    <div className="space-y-12">
      {skills.map((skill) => (
        <section key={skill} className="animate-fadeInUp">
          <h2 className="text-4xl font-bold mb-6 border-b border-cyan-500 pb-3 tracking-wide text-cyan-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.7)]">
            {prettySkillName(skill)}
          </h2>

          {gradesBySkill[skill]?.map((grade) => (
            <div key={grade} className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-cyan-200 tracking-wide drop-shadow-[0_0_6px_rgba(14,165,233,0.5)] break-words">
  Grade: {grade}
</h3>


              <StudentTable students={groupedStudents[skill]?.[grade] ?? []} />
            </div>
          ))}
        </section>
      ))}
    </div>
  )
) : selectedGrade === "all" ? (
  gradesBySkill[selectedSkill]?.map((grade) => (
    <section key={grade} className="mb-12 animate-fadeInUp">
   <h3 className="text-3xl font-semibold mb-4 text-cyan-200 tracking-wide drop-shadow-[0_0_6px_rgba(14,165,233,0.5)] break-words">
  Grade: {grade}
</h3>

      {/* Fix here: use selectedSkill instead of skill */}
      <StudentTable students={groupedStudents[selectedSkill]?.[grade] ?? []} />
    </section>
  ))
) : (
  <section className="animate-fadeInUp">
    <StudentTable
      students={groupedStudents[selectedSkill]?.[selectedGrade] || []}
    />
  </section>
)}

              </>
            )}
          </AnimatePresence>
        </main>
      </div>
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
        input::placeholder {
          color: #4dd0e1;
          opacity: 1;
          font-weight: 600;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        /* Glow on hover for rows */
        tbody tr:hover {
          box-shadow: 0 0 12px 3px rgba(14, 165, 233, 0.8);
          transition: box-shadow 0.3s ease-in-out;
          background-color: rgba(14, 165, 233, 0.25);
        }
      `}</style>
    </>
  );
}

function StudentTable({ students }) {
  if (!students || students.length === 0)
    return <p className="text-cyan-400 font-semibold">No students found.</p>;

  return (
     <div className="overflow-x-auto w-full rounded-xl shadow-xl">
    <motion.table
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="min-w-[800px] w-full border-collapse text-cyan-50 bg-blue-900 bg-opacity-90 rounded-xl"
    >
      <thead className="bg-cyan-700 text-white">
        <tr>
          <th className="p-4 text-left text-base">Full Name</th>
          <th className="p-4 text-left text-base">Address</th>
          <th className="p-4 text-left text-base">Birthday</th>
          <th className="p-4 text-left text-base">Telephone</th>
          <th className="p-4 text-left text-base">WhatsApp</th>
          <th className="p-4 text-left text-base">Skill</th>
          <th className="p-4 text-left text-base">Grade</th>
        </tr>
      </thead>
      <tbody>
        {students.map((stu) => (
          <tr
            key={stu.id}
            className="border-b border-cyan-600 hover:bg-cyan-600/40 transition-colors duration-300 cursor-pointer"
          >
            <td className="p-4 font-semibold">{stu.fullName || "-"}</td>
            <td className="p-4 opacity-90">{stu.address || "-"}</td>
            <td className="p-4">{stu.birthday || "-"}</td>
            <td className="p-4">{stu.telephone || "-"}</td>
            <td className="p-4">{stu.whatsapp || "-"}</td>
            <td className="p-4 capitalize">{prettySkillName(stu.skill) || "-"}</td>
            <td className="p-4">{stu.grade || "-"}</td>
          </tr>
        ))}
      </tbody>
    </motion.table>
      </div>
  );
}
