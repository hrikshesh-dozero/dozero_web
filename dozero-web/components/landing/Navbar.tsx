'use client';

import { motion } from 'motion/react';

interface NavbarProps {
  onJoinClick: () => void;
}

export default function Navbar({ onJoinClick }: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-0 left-0 right-0 z-[50] flex items-center justify-between px-8 md:px-12 py-6"
    >
      {/* Logo */}
      <a href="/" className="no-underline">
        <span className="text-[13px] font-medium tracking-[0.35em] uppercase text-white/85 hover:text- transition-colors duration-300">
          Do Zero AI
        </span>
      </a>

      {/* Right links */}
      <div className="flex items-center gap-8">
        <a
          href="#features"
          className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/50 hover:text-[#A6CDFF] transition-colors duration-300 no-underline"
        >
          Blog
        </a>
        <button
          onClick={onJoinClick}
          className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/50 hover:text-[#A6CDFF] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
        >
          Waitlist
        </button>
      </div>
    </motion.nav>
  );
}
