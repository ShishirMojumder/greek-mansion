"use client";

import { motion } from "framer-motion";

// Rotating "stamp" seal — curved text around a gold-ringed circle, gentle float, reacts to hover.
export default function SharingSeal({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`group ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative grid h-36 w-36 place-items-center rounded-full border-2 border-gold bg-navy shadow-xl shadow-navy/30 transition-shadow duration-300 group-hover:shadow-[0_0_0_5px_rgba(201,162,39,0.22)]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full [animation:spin_18s_linear_infinite] group-hover:[animation-duration:6s] motion-reduce:animate-none"
          aria-hidden="true"
        >
          <defs>
            <path id="sharing-seal-curve" d="M50,50 m0,-38 a38,38 0 1,1 0,76 a38,38 0 1,1 0,-76" />
          </defs>
          <text className="fill-gold font-label uppercase" fontSize="8.5" letterSpacing="1.8">
            <textPath href="#sharing-seal-curve" startOffset="0">
              Made for sharing · Greek Mansion ·
            </textPath>
          </text>
        </svg>
        <span className="font-serif text-xl leading-none text-gold transition-transform duration-300 group-hover:rotate-90">✦</span>
      </div>
    </motion.div>
  );
}
