"use client";

import { motion } from "framer-motion";

// Greek Mansion Google Business Profile — opens the write-a-review dialog directly.
const GOOGLE_REVIEW_URL = "https://g.page/r/CWjzqGR7i7IAEBM/review";

export default function ReviewFab() {
  return (
    <motion.a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Leave Greek Mansion a review on Google"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: .5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: .96 }}
      className="group fixed bottom-5 right-5 z-40 hidden items-center gap-2.5 rounded-full border border-gold/60 bg-navy py-3 pl-3.5 pr-4 shadow-xl shadow-navy/30 transition-colors hover:bg-ink md:inline-flex"
    >
      <span className="text-base leading-none transition-transform duration-300 group-hover:rotate-[18deg] group-hover:scale-110">⭐</span>
      <span className="font-label text-[11px] font-semibold uppercase tracking-[.14em] text-white">Leave us a review</span>
    </motion.a>
  );
}
