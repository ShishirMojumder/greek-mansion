"use client";

import { motion } from "framer-motion";

const GOOGLE_REVIEW_URL = "https://g.page/r/CWjzqGR7i7IAEBM/review";

const RADIUS = 44;
const TEXT = "LEAVE US A REVIEW • LEAVE US A REVIEW • ";

export default function ReviewFab() {
  return (
    <motion.a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Leave Greek Mansion a review on Google"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-[9999] hidden md:flex"
      style={{ width: 120, height: 120 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
        style={{ width: 120, height: 120 }}
      >
        {/* Solid navy circle — blocks everything underneath */}
        <div className="absolute inset-0 rounded-full bg-navy border border-gold/60 shadow-2xl shadow-black/40" />

        {/* Rotating curved text ribbon */}
        <motion.svg
          viewBox="0 0 120 120"
          className="absolute inset-0"
          style={{ width: 120, height: 120 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path
              id="circle-path"
              d={`M 60,60 m -${RADIUS},0 a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
            />
          </defs>
          <text
            style={{
              fontSize: 9.5,
              fontFamily: "var(--font-label, sans-serif)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fill: "#C9A84C",
            }}
          >
            <textPath href="#circle-path" startOffset="0%">
              {TEXT}
            </textPath>
          </text>
        </motion.svg>

        {/* Center star */}
        <span className="relative z-10 text-2xl select-none">⭐</span>
      </motion.div>
    </motion.a>
  );
}
