'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { LiquidGlassSurface } from '../ui/LiquidGlass';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    social: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ email: '', name: '', phone: '', social: '' });
    }
  }, [isOpen]);

  // 3D Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { damping: 30, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), spring);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), spring);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [30, 70]), spring);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [30, 70]), spring);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(ellipse 60% 40% at ${gx}% ${gy}%, rgba(140,180,255,0.2), transparent 70%)`
  );

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mouseX.set(0); mouseY.set(0); };

  const nextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 5) setStep(step + 1);
  };

  const finishAndClose = () => {
    setTimeout(onClose, 1800);
  };

  // Submit the collected answers to the Google Form configured in NEXT_PUBLIC_GFORM_LINK.
  // The env link is a "prefill" viewform URL (…/viewform?…&entry.NNN=EMAIL_HERE&…). We swap
  // the placeholders for the real values and POST to the form's /formResponse endpoint.
  // Google Forms doesn't send CORS headers, so we fire-and-forget with mode: 'no-cors'.
  const submitToGoogleForm = () => {
    const link = process.env.NEXT_PUBLIC_GFORM_LINK;
    if (!link) return;

    const filled = link
      .replace('EMAIL_HERE', encodeURIComponent(formData.email))
      .replace('NAME_HERE', encodeURIComponent(formData.name))
      .replace('PHONE_HERE', encodeURIComponent(formData.phone))
      .replace('SOCIAL_HERE', encodeURIComponent(formData.social));

    const [base, query = ''] = filled.replace('/viewform', '/formResponse').split('?');

    try {
      void fetch(base, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: query,
      });
    } catch {
      /* fire-and-forget — the success screen shows regardless */
    }
  };

  useEffect(() => {
    if (step === 5) {
      submitToGoogleForm();
      finishAndClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Backdrop — keeps the page softly visible (a touch brighter at the edges)
              and gives the glass something to refract. Fades in fast and BEFORE the card
              (see card delay below) so the panel never appears over the un-dimmed hero. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-0 backdrop-blur-[7px] backdrop-saturate-[1.1]
              bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(2,6,20,0.84)_0%,rgba(2,6,20,0.6)_100%)]"
          />

          {/* 3D Tilted Glass Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            // The card stays hidden for ~180ms after the backdrop appears, giving
            // liquid-glass-react time to generate its filter and paint, so the card
            // reveals already-glassy instead of flashing bare content first.
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="will-change-transform"
          >
            {/* Refractive liquid-glass form panel (inputs & buttons inside stay normal) */}
            <LiquidGlassSurface
              width={496}
              height={534}
              cornerRadius={32}
              padding="0px"
              mouseContainer={cardRef}
              immediate
              className="shadow-[0_28px_90px_rgba(0,0,0,0.6)]"
            >
              <div className="relative w-[494px] max-w-[calc(100vw-3rem)] p-12">
              {/* Top refraction highlight */}
              <div className="absolute top-0 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.35)] to-transparent pointer-events-none" />

              {/* Moving specular glare following cursor */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{ background: glareBackground }}
              />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full
                  bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.14)]
                  text-[rgba(180,200,240,0.5)] hover:text-white
                  border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]
                  transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Icon — plain white, no container */}
              <div className="flex justify-center mb-7">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1 — Email */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    <h2 className="text-[28px] font-bold text-white/95 tracking-[-0.02em] mb-1.5">Join the Waitlist</h2>
                    <p className="text-[13px] text-[rgba(160,180,220,0.6)] mb-7">Be the first to build with DoZero.</p>

                    <form onSubmit={nextStep} className="w-full flex flex-col gap-3.5">
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl text-[15px] text-white
                          bg-[rgba(255,255,255,0.04)]
                          backdrop-blur-lg
                          border border-[rgba(255,255,255,0.1)]
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                          placeholder:text-[rgba(120,150,200,0.4)]
                          focus:outline-none focus:border-[rgba(100,140,255,0.5)] focus:shadow-[0_0_20px_rgba(80,100,220,0.15),inset_0_0_0_1px_rgba(100,140,255,0.1)]
                          transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="w-full py-4 text-[14px] font-semibold tracking-[0.06em] uppercase text-white rounded-xl cursor-pointer
                          bg-gradient-to-r from-[#4158D0] via-[#5B6FE6] to-[#7B68EE]
                          shadow-[0_0_25px_rgba(80,100,220,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                          hover:shadow-[0_0_40px_rgba(80,100,220,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]
                          hover:brightness-110 active:scale-[0.98]
                          transition-all duration-300 border-none"
                      >
                        Continue →
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* STEP 2 — Name */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    <h2 className="text-[28px] font-bold text-white/95 tracking-[-0.02em] mb-1.5">What&apos;s Your Name?</h2>
                    <p className="text-[13px] text-[rgba(160,180,220,0.6)] mb-7">Step 2 of 4</p>

                    <form onSubmit={nextStep} className="w-full flex flex-col gap-3.5">
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl text-[15px] text-white
                          bg-[rgba(255,255,255,0.04)] backdrop-blur-lg
                          border border-[rgba(255,255,255,0.1)]
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                          placeholder:text-[rgba(120,150,200,0.4)]
                          focus:outline-none focus:border-[rgba(100,140,255,0.5)] focus:shadow-[0_0_20px_rgba(80,100,220,0.15),inset_0_0_0_1px_rgba(100,140,255,0.1)]
                          transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="w-full py-4 text-[14px] font-semibold tracking-[0.06em] uppercase text-white rounded-xl cursor-pointer
                          bg-gradient-to-r from-[#4158D0] via-[#5B6FE6] to-[#7B68EE]
                          shadow-[0_0_25px_rgba(80,100,220,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                          hover:shadow-[0_0_40px_rgba(80,100,220,0.45)] hover:brightness-110 active:scale-[0.98]
                          transition-all duration-300 border-none"
                      >
                        Continue →
                      </button>
                    </form>
                    <button onClick={() => nextStep()} className="mt-5 text-[11px] text-[rgba(160,180,220,0.4)] hover:text-[rgba(180,200,240,0.8)] uppercase tracking-[0.15em] font-medium transition-colors cursor-pointer bg-transparent border-none">
                      Skip this step
                    </button>
                  </motion.div>
                )}

                {/* STEP 3 — Phone */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    <h2 className="text-[28px] font-bold text-white/95 tracking-[-0.02em] mb-1.5">Phone Number</h2>
                    <p className="text-[13px] text-[rgba(160,180,220,0.6)] mb-7">Step 3 of 4 (optional)</p>

                    <form onSubmit={nextStep} className="w-full flex flex-col gap-3.5">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl text-[15px] text-white
                          bg-[rgba(255,255,255,0.04)] backdrop-blur-lg
                          border border-[rgba(255,255,255,0.1)]
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                          placeholder:text-[rgba(120,150,200,0.4)]
                          focus:outline-none focus:border-[rgba(100,140,255,0.5)] focus:shadow-[0_0_20px_rgba(80,100,220,0.15),inset_0_0_0_1px_rgba(100,140,255,0.1)]
                          transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="w-full py-4 text-[14px] font-semibold tracking-[0.06em] uppercase text-white rounded-xl cursor-pointer
                          bg-gradient-to-r from-[#4158D0] via-[#5B6FE6] to-[#7B68EE]
                          shadow-[0_0_25px_rgba(80,100,220,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                          hover:shadow-[0_0_40px_rgba(80,100,220,0.45)] hover:brightness-110 active:scale-[0.98]
                          transition-all duration-300 border-none"
                      >
                        Continue →
                      </button>
                    </form>
                    <button onClick={() => nextStep()} className="mt-5 text-[11px] text-[rgba(160,180,220,0.4)] hover:text-[rgba(180,200,240,0.8)] uppercase tracking-[0.15em] font-medium transition-colors cursor-pointer bg-transparent border-none">
                      Skip this step
                    </button>
                  </motion.div>
                )}

                {/* STEP 4 — Social */}
                {step === 4 && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    <h2 className="text-[28px] font-bold text-white/95 tracking-[-0.02em] mb-1.5">Social Media</h2>
                    <p className="text-[13px] text-[rgba(160,180,220,0.6)] mb-7">Step 4 of 4 (optional)</p>

                    <form onSubmit={nextStep} className="w-full flex flex-col gap-3.5">
                      <input
                        type="text"
                        placeholder="Twitter / LinkedIn"
                        value={formData.social}
                        onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl text-[15px] text-white
                          bg-[rgba(255,255,255,0.04)] backdrop-blur-lg
                          border border-[rgba(255,255,255,0.1)]
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                          placeholder:text-[rgba(120,150,200,0.4)]
                          focus:outline-none focus:border-[rgba(100,140,255,0.5)] focus:shadow-[0_0_20px_rgba(80,100,220,0.15),inset_0_0_0_1px_rgba(100,140,255,0.1)]
                          transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="w-full py-4 text-[14px] font-semibold tracking-[0.06em] uppercase text-white rounded-xl cursor-pointer
                          bg-gradient-to-r from-[#4158D0] via-[#5B6FE6] to-[#7B68EE]
                          shadow-[0_0_25px_rgba(80,100,220,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                          hover:shadow-[0_0_40px_rgba(80,100,220,0.45)] hover:brightness-110 active:scale-[0.98]
                          transition-all duration-300 border-none"
                      >
                        Complete Profile
                      </button>
                    </form>
                    <button onClick={() => nextStep()} className="mt-5 text-[11px] text-[rgba(160,180,220,0.4)] hover:text-[rgba(180,200,240,0.8)] uppercase tracking-[0.15em] font-medium transition-colors cursor-pointer bg-transparent border-none">
                      Skip this step
                    </button>
                  </motion.div>
                )}

                {/* STEP 5 — Success */}
                {step === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    {/* Animated blue tick — ring then checkmark draw themselves in */}
                    <svg
                      width="74" height="74" viewBox="0 0 52 52"
                      className="mb-5 drop-shadow-[0_0_14px_rgba(123,164,255,0.45)]"
                    >
                      <motion.circle
                        cx="26" cy="26" r="24"
                        fill="rgba(91,111,230,0.10)"
                        stroke="#5aaaffff" strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M15 27l7 7 15-17"
                        fill="none" stroke="#5aaaffff" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.42, ease: 'easeOut' }}
                      />
                    </svg>

                    <h2 className="text-[22px] font-bold text-white/95 mb-1.5">You&apos;re In!</h2>
                    <p className="text-[13px] text-[rgba(160,180,220,0.6)] mb-2">We&apos;ve secured your spot. Stay tuned.</p>
                    <p className="text-[11px] text-[rgba(120,150,200,0.4)] tracking-[0.08em] uppercase font-medium">
                      Priority access for {formData.email || 'you'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer note (step 1 only) */}
              {step === 1 && (
                <p className="text-center text-[11px] text-[rgba(120,150,200,0.35)] mt-5">
                  No spam, ever. We&apos;ll only notify you when it&apos;s time.
                </p>
              )}
              </div>
            </LiquidGlassSurface>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
