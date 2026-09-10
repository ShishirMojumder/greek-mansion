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

        {/* Center star — drawn rather than an emoji, so it is brand gold with a
            metallic gradient instead of the platform's flat yellow. */}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="relative z-10 h-7 w-7 drop-shadow-[0_1px_2px_rgba(0,0,0,.35)]">
          <defs>
            <linearGradient id="fab-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B08D1E" />
              <stop offset="28%" stopColor="#EBCE72" />
              <stop offset="52%" stopColor="#C9A227" />
              <stop offset="74%" stopColor="#F4E2A0" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>
          </defs>
          <path
            d="M12 2.6l2.78 5.63 6.22.9-4.5 4.38 1.06 6.19L12 16.78 6.44 19.7l1.06-6.19L3 9.13l6.22-.9L12 2.6z"
            fill="url(#fab-gold)"
          />
        </svg>
      </motion.div>
    </motion.a>
  );
}
