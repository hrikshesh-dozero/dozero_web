"use client";

import { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AppShowcase from '../components/landing/AppShowcase';
import JoinModal from '../components/landing/JoinModal';
import BentoGrid from '../components/ui/bento';
import LLMProviders from '../components/landing/LLMProviders';

export default function LandingPage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#020818]">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />
      <HeroSection onJoinClick={() => setIsJoinOpen(true)} />
      <AppShowcase />
      <BentoGrid />
      <LLMProviders />
      <JoinModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </div>
  );
}
