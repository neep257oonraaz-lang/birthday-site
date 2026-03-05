/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Heart, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Question {
  id: string;
  text: string;
  options: string[];
  gradient: string;
}

// --- Constants ---

const QUESTIONS: Question[] = [
  {
    id: 'feel',
    text: 'It’s your birthday today 🎂 — how do you feel right now?',
    options: ['✨ Feeling special', '😌 Calm & happy', '😄 Excited', '🫶 Just grateful'],
    gradient: 'from-indigo-500/40 via-purple-500/40 to-pink-500/40'
  },
  {
    id: 'spend',
    text: 'How would you like to spend today?',
    options: ['🎉 Celebration time', '🏠 Peaceful & quiet', '👨👩👧 With close people', '🎁 Surprise me'],
    gradient: 'from-emerald-500/40 via-teal-500/40 to-cyan-500/40'
  },
  {
    id: 'matters',
    text: 'What matters more to you today?',
    options: ['💛 Love & care', '🎂 Cake & fun', '🌱 Growth & goals', '📸 Memories'],
    gradient: 'from-amber-500/40 via-orange-500/40 to-rose-500/40'
  },
  {
    id: 'more',
    text: 'One thing you’d love more of this year?',
    options: ['🚀 Career growth', '😄 Happiness', '💪 Confidence', '🌍 New experiences'],
    gradient: 'from-blue-500/40 via-indigo-500/40 to-violet-500/40'
  },
  {
    id: 'vibe',
    text: 'Right now, what kind of vibe do you enjoy the most?',
    options: ['🌿 Calm & peaceful', '✨ Light & cheerful', '🎶 Music & vibes', '💭 Thoughtful'],
    gradient: 'from-rose-500/40 via-pink-500/40 to-fuchsia-500/40'
  },
  {
    id: 'blessing',
    text: 'What kind of blessing would you choose today?',
    options: ['🌸 Peace of mind', '🌟 Success ahead', '🧿 Protection & strength', '💖 Love & positivity'],
    gradient: 'from-purple-500/40 via-indigo-500/40 to-blue-500/40'
  }
];

// --- Components ---

const PinScreen = ({ onCorrectPin }: { onCorrectPin: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '0007') {
      onCorrectPin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPin('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight"
    >
      <div className="w-full max-w-xs p-8 text-center">
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8 text-sm font-medium tracking-[0.3em] uppercase text-slate-400"
        >
          Private Access
        </motion.h2>
        <form onSubmit={handleSubmit} className="relative">
          <motion.input
            autoFocus
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="w-full bg-transparent border-b-2 border-slate-800 py-4 text-center text-4xl tracking-[1em] text-gold focus:outline-none focus:border-gold transition-colors duration-500"
            placeholder="••••"
          />
          <div className="mt-4 text-[10px] uppercase tracking-widest text-slate-600">
            Enter PIN to reveal
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const WallSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={onToggle}
        className={`relative w-20 h-32 rounded-lg transition-all duration-500 shadow-2xl ${
          isOn ? 'bg-slate-200' : 'bg-slate-300'
        } border-4 border-slate-400/20 overflow-hidden group`}
        style={{
          boxShadow: isOn 
            ? '0 10px 30px -5px rgba(251, 191, 36, 0.4), inset 0 2px 5px rgba(255,255,255,0.8)' 
            : '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.5)'
        }}
      >
        {/* Switch Plate Internal */}
        <div 
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ${
            isOn ? 'translate-y-0' : 'translate-y-0'
          }`}
        >
          <div className={`flex-1 transition-all duration-300 ${isOn ? 'bg-slate-100' : 'bg-slate-400 shadow-inner'}`} />
          <div className="h-[2px] bg-slate-500/20" />
          <div className={`flex-1 transition-all duration-300 ${isOn ? 'bg-slate-400 shadow-inner' : 'bg-slate-100'}`} />
        </div>
        
        {/* The actual toggle part */}
        <motion.div
          animate={{ rotateX: isOn ? -20 : 20 }}
          className="absolute inset-2 bg-slate-100 rounded shadow-md border border-slate-300 flex items-center justify-center"
        >
          <div className="w-1 h-8 bg-slate-300 rounded-full opacity-50" />
        </motion.div>
      </button>
      <motion.span 
        animate={{ opacity: isOn ? 0.5 : 1 }}
        className="text-xs uppercase tracking-[0.2em] text-gold font-medium"
      >
        {isOn ? 'Celebration Active' : 'Switch ON ✨'}
      </motion.span>
    </div>
  );
};

const HangingLight = ({ type, color, x, y, delay, edge }: any) => {
  const isBulb = type === 'bulb';
  
  return (
    <motion.div
      className={`absolute ${isBulb ? 'z-50' : 'z-40'} pointer-events-none flex flex-col items-center origin-top -translate-x-1/2`}
      style={{ left: x, top: y }}
      animate={{ 
        rotate: isBulb ? [-1, 1, -1] : [-0.5, 0.5, -0.5],
      }}
      transition={{ 
        duration: isBulb ? 8 + Math.random() * 4 : 6 + Math.random() * 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {/* Small attachment point to the wire */}
      <div className="w-[1px] h-[2px] bg-slate-800/60" />
      
      {isBulb ? (
        <motion.div
          className="relative flex flex-col items-center -mt-[1px]"
          animate={{ 
            opacity: [0.9, 1, 0.95, 1, 0.9],
            filter: [
              'brightness(1) drop-shadow(0 0 2px rgba(255,191,51,0.3))',
              'brightness(1.15) drop-shadow(0 0 10px rgba(255,191,51,0.7))',
              'brightness(0.92) drop-shadow(0 0 4px rgba(255,191,51,0.4))',
              'brightness(1.08) drop-shadow(0 0 8px rgba(255,191,51,0.6))',
              'brightness(1) drop-shadow(0 0 2px rgba(255,191,51,0.3))'
            ]
          }}
          transition={{ 
            duration: 4 + Math.random() * 3, 
            repeat: Infinity, 
            delay, 
            ease: "easeInOut" 
          }}
        >
          {/* Socket Cap - Sits on the wire */}
          <div className="w-[8px] h-[5px] bg-slate-900 rounded-t-sm z-10" />
          
          {/* Bulb Body */}
          <div 
            className="w-[16px] h-[24px] -mt-[1px] rounded-t-[50%] rounded-b-[45%] relative overflow-hidden"
            style={{ 
              background: 'radial-gradient(circle at 50% 30%, #fffdec 0%, #ffdf88 40%, #ffbf33 100%)',
              boxShadow: 'inset 0 -2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-white/40 blur-[1px] rounded-full" />
          </div>
          
          {/* Soft Bloom Glow */}
          <motion.div 
            className="absolute top-2 w-16 h-16 bg-yellow-400/20 blur-2xl rounded-full -z-10"
            animate={{ 
              scale: [1, 1.2, 0.95, 1.1, 1],
              opacity: [0.1, 0.3, 0.15, 0.25, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
          />
        </motion.div>
      ) : (
        /* Dot Light - Sits on the wire */
        <motion.div
          className="w-[6px] h-[6px] rounded-full -mt-[1px]"
          style={{ 
            backgroundColor: color,
          }}
          animate={{ 
            opacity: [0.6, 1, 0.7, 1, 0.6],
            boxShadow: [
              `0 0 4px ${color}44`,
              `0 0 12px ${color}aa`,
              `0 0 6px ${color}66`,
              `0 0 10px ${color}88`,
              `0 0 4px ${color}44`
            ],
            scale: [0.9, 1.1, 0.95, 1.05, 0.9]
          }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};

const StringLights = () => {
  const dotColors = ['#ff4d4d', '#4da6ff', '#4dff88', '#c77dff', '#ff6fb1'];
  const warmYellow = '#ffbf33';
  
  const lights = React.useMemo(() => {
    const generateEdge = (count: number, edge: 'top' | 'left' | 'right') => {
      const result = [];
      for (let i = 0; i < count; i++) {
        const isBulb = i > 0 && i < count - 1 && i % 8 === 0;
        const t = i / (count - 1);
        const pos = t * 100;
        // sag is the peak displacement of the curve
        // For top: peak is at middle (t=0.5), sag is 25px
        // For sides: peak is at middle (t=0.5), sag is 15px
        const peak = edge === 'top' ? 25 : 15;
        const sag = peak * (4 * t * (1 - t));
        const type = isBulb ? 'bulb' : 'dot';
        const color = isBulb ? warmYellow : dotColors[Math.floor(Math.random() * dotColors.length)];
        const delay = Math.random() * 5;
        result.push({ id: `${edge}-${i}`, type, color, pos: `${pos}%`, sag, delay, edge });
      }
      return result;
    };

    return [
      ...generateEdge(35, 'top'),
      ...generateEdge(25, 'left'),
      ...generateEdge(25, 'right')
    ];
  }, []);

  return (
    <>
      {/* Top Border - Corner to Corner */}
      <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d="M 0 0 Q 50% 50 100% 0" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeOpacity="0.5" />
        </svg>
        {lights.filter(l => l.edge === 'top').map((l) => (
          <HangingLight key={l.id} {...l} x={l.pos} y={l.sag} />
        ))}
      </div>

      {/* Left Border - Top to Bottom */}
      <div className="fixed top-0 bottom-0 left-0 w-24 pointer-events-none z-40">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d="M 0 0 Q 30 50% 0 100%" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeOpacity="0.5" />
        </svg>
        {lights.filter(l => l.edge === 'left').map((l) => (
          <HangingLight key={l.id} {...l} x={l.sag} y={l.pos} />
        ))}
      </div>

      {/* Right Border - Top to Bottom */}
      <div className="fixed top-0 bottom-0 right-0 w-24 pointer-events-none z-40">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d="M 100% 0 Q (100%-30) 50% 100% 100%" style={{ d: 'path("M 100 0 Q 70 50 100 100")' }} stroke="#1a1a1a" strokeWidth="1" fill="none" strokeOpacity="0.5" />
        </svg>
        {lights.filter(l => l.edge === 'right').map((l) => (
          <HangingLight key={l.id} {...l} x={`calc(100% - ${l.sag}px)`} y={l.pos} />
        ))}
      </div>
    </>
  );
};


const ConversationalSpace = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finalChoice, setFinalChoice] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];

  const sendResponse = async (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    try {
      fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionText: currentQuestion.text, 
          answer 
        })
      });
    } catch (e) {}

    if (currentIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 50);
    } else {
      setTimeout(() => {
        setIsFinished(true);
      }, 400);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 0 : -10,
      opacity: 0,
      scale: dir > 0 ? 0.92 : 1,
      zIndex: 0
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -10 : 0,
      opacity: 0,
      scale: dir > 0 ? 1 : 0.92,
      zIndex: 2
    })
  };

  return (
    <section className="relative w-full max-w-lg mx-auto px-6 py-12 min-h-[480px] flex flex-col items-center justify-center">
      <div className="relative w-full flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          {!isFinished ? (
            <div className="relative w-full flex items-center justify-center">
              {/* Stacked Card Behind - Only 1 behind as requested */}
              {currentIndex + 1 < QUESTIONS.length && (
                <div
                  className={`absolute w-[85vw] max-w-[320px] rounded-[2rem] border border-white/5 bg-gradient-to-br ${QUESTIONS[currentIndex + 1].gradient} backdrop-blur-3xl shadow-xl pointer-events-none`}
                  style={{
                    transform: `translateY(10px) scale(0.96)`,
                    opacity: 0.2,
                    zIndex: -1,
                  }}
                >
                  <div className="p-8 opacity-0">
                    <div className="h-64" />
                  </div>
                </div>
              )}

              {/* Active Card */}
              <motion.div
                key={currentQuestion.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1] 
                }}
                className={`w-[85vw] max-w-[320px] relative overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 border border-white/10 bg-gradient-to-br ${currentQuestion.gradient} backdrop-blur-3xl z-10`}
              >
                <div className="p-8 text-center">
                  <h3 className="text-lg md:text-xl font-serif italic text-white mb-8 leading-relaxed drop-shadow-sm">
                    {currentQuestion.text}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = answers[currentQuestion.id] === option;
                      return (
                        <motion.button
                          key={option}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => sendResponse(option)}
                          className={`w-full px-5 py-3.5 rounded-xl border transition-all duration-300 text-xs font-medium tracking-wide ${
                            isSelected 
                              ? 'bg-white/25 border-white/50 text-white shadow-lg' 
                              : 'bg-white/5 border-white/10 text-white/80 hover:text-white'
                          }`}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                      {currentIndex + 1} / {QUESTIONS.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              key="final-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              <AnimatePresence mode="wait">
                {!finalChoice ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    className="w-[85vw] max-w-[320px] p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl text-center"
                  >
                    <h3 className="text-2xl font-serif italic text-gold mb-8 leading-relaxed drop-shadow-md">
                      Party kab de rahe ho? 😊
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFinalChoice('soon');
                          fetch('/api/responses', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              questionText: "Party kab de rahe ho?", 
                              answer: "🎉 Soon pakka" 
                            })
                          }).catch(() => {});
                        }}
                        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition-all text-sm font-medium"
                      >
                        🎉 Soon pakka
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFinalChoice('never');
                          fetch('/api/responses', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              questionText: "Party kab de rahe ho?", 
                              answer: "😄 Kabhi nahi" 
                            })
                          }).catch(() => {});
                        }}
                        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition-all text-sm font-medium"
                      >
                        😄 Kabhi nahi
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-slate-200 font-serif italic text-3xl text-center py-12 drop-shadow-lg"
                  >
                    Enjoy your Day
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Previous Button - Bottom Right */}
      {!isFinished && currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handlePrevious}
          className="absolute -bottom-4 right-6 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors flex items-center gap-2 py-4"
        >
          ← Previous
        </motion.button>
      )}
    </section>
  );
};

const BirthdayCake = () => {
  const [buildComplete, setBuildComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBuildComplete(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center mt-12 mb-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: buildComplete ? [0, -6, 0] : 0 
        }}
        transition={{ 
          scale: { duration: 1.5, ease: "easeOut" },
          opacity: { duration: 1.5, ease: "easeOut" },
          y: buildComplete 
            ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 1.5, ease: "easeOut" }
        }}
        className="relative"
      >
        {/* Heavy Ground Shadow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 h-14 bg-black/60 blur-3xl rounded-full" 
        />
        
        <svg width="340" height="300" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          <defs>
            {/* Material Texture Filter */}
            <filter id="cakeTexture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" result="softNoise" />
              <feComposite in="SourceGraphic" in2="softNoise" operator="over" />
            </filter>

            {/* Tier Shadow Filter */}
            <filter id="tierShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feOffset dx="0" dy="4" result="offsetBlur" />
              <feFlood floodColor="black" floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
              <feComposite in="SourceGraphic" in2="shadow" operator="over" />
            </filter>

            {/* Gradients for Material Depth */}
            <linearGradient id="cakeSideGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="40%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <radialGradient id="cakeTopGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="85%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <linearGradient id="frostingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            <linearGradient id="candleBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="50%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>

          {/* Bottom Tier - Heavy Settle */}
          <motion.g
            initial={{ y: 200, opacity: 0, scaleY: 1.2 }}
            animate={{ y: 0, opacity: 1, scaleY: [1.2, 0.95, 1] }}
            transition={{ 
              duration: 1.4, 
              ease: "easeOut",
              times: [0, 0.8, 1],
              delay: 0.6 
            }}
            filter="url(#cakeTexture)"
          >
            {/* Base Shadow */}
            <ellipse cx="170" cy="225" rx="120" ry="42" fill="black" fillOpacity="0.25" filter="blur(10px)" />
            {/* Side */}
            <path d="M50 200 C 50 225, 100 245, 170 245 C 240 245, 290 225, 290 200 L 290 225 C 290 250, 240 270, 170 270 C 100 270, 50 250, 50 225 Z" fill="url(#cakeSideGrad)" />
            {/* Top */}
            <path d="M50 200 C 50 175, 100 155, 170 155 C 240 155, 290 175, 290 200 C 290 225, 240 245, 170 245 C 100 245, 50 225, 50 200 Z" fill="url(#cakeTopGrad)" />
            {/* Edge Highlight */}
            <path d="M52 198 C 52 178, 102 158, 170 158 C 238 158, 288 178, 288 198" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" fill="none" />
            
            {/* Frosting Drips */}
            <path d="M60 205 Q 70 225, 80 210 Q 90 230, 100 215 Q 120 240, 140 215 Q 170 245, 200 215 Q 230 235, 260 210 Q 275 225, 285 205" fill="none" stroke="url(#frostingGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          </motion.g>
          
          {/* Middle Tier - Compression Impact */}
          <motion.g
            initial={{ y: -150, opacity: 0, scaleY: 1.3 }}
            animate={{ y: 0, opacity: 1, scaleY: [1.3, 0.9, 1] }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              times: [0, 0.8, 1],
              delay: 1.5 
            }}
            filter="url(#cakeTexture)"
          >
            {/* Ambient Occlusion Shadow on Bottom Tier */}
            <ellipse cx="170" cy="160" rx="95" ry="35" fill="black" fillOpacity="0.4" filter="blur(4px)" />
            {/* Side */}
            <path d="M80 140 C 80 160, 120 180, 170 180 C 220 180, 260 160, 260 140 L 260 165 C 260 185, 220 205, 170 205 C 120 205, 80 185, 80 165 Z" fill="url(#cakeSideGrad)" />
            {/* Top */}
            <path d="M80 140 C 80 120, 120 100, 170 100 C 220 100, 260 120, 260 140 C 260 160, 220 180, 170 180 C 120 180, 80 160, 80 140 Z" fill="url(#cakeTopGrad)" />
            {/* Edge Highlight */}
            <path d="M82 138 C 82 122, 122 103, 170 103 C 218 103, 258 122, 258 138" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" fill="none" />
            
            {/* Frosting Drips */}
            <path d="M90 145 Q 110 165, 130 150 Q 150 175, 170 155 Q 190 170, 210 150 Q 230 165, 250 145" fill="none" stroke="url(#frostingGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </motion.g>
          
          {/* Top Tier - Imperfect Human Feel */}
          <motion.g
            initial={{ scale: 0.4, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 60,
              damping: 10,
              delay: 2.4 
            }}
            filter="url(#cakeTexture)"
            style={{ transformOrigin: '170px 90px' }}
          >
            {/* Ambient Occlusion Shadow on Middle Tier */}
            <ellipse cx="170" cy="100" rx="65" ry="25" fill="black" fillOpacity="0.4" filter="blur(3px)" />
            {/* Side */}
            <path d="M115 85 C 115 100, 140 115, 170 115 C 200 115, 225 100, 225 85 L 225 105 C 225 120, 200 135, 170 135 C 140 135, 115 120, 115 105 Z" fill="url(#cakeSideGrad)" />
            {/* Top - Slightly Irregular Path */}
            <path d="M115 85 C 118 68, 142 55, 172 55 C 202 55, 222 68, 225 85 C 222 102, 198 115, 168 115 C 138 115, 112 102, 115 85 Z" fill="url(#cakeTopGrad)" />
            {/* Edge Highlight */}
            <path d="M117 83 C 120 71, 144 58, 170 58 C 196 58, 220 71, 223 83" stroke="white" strokeOpacity="0.3" strokeWidth="2" fill="none" />
            
            {/* Frosting Drips */}
            <path d="M125 90 Q 140 105, 155 95 Q 170 110, 185 95 Q 200 105, 215 90" fill="none" stroke="url(#frostingGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          </motion.g>

          {/* Realistic Candles - Uneven & Sunk In */}
          {[
            { x: 135, rot: -4, delay: 3.2 },
            { x: 155, rot: 2, delay: 3.4 },
            { x: 175, rot: -1, delay: 3.6 },
            { x: 195, rot: 3, delay: 3.8 },
            { x: 210, rot: -2, delay: 4.0 }
          ].map((candle, i) => {
            const yBase = 75;
            return (
              <g key={i}>
                {/* Candle Body - Sunk into top tier */}
                <motion.g
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: candle.delay, ease: "easeOut" }}
                  style={{ transformOrigin: `${candle.x}px ${yBase + 15}px`, rotate: candle.rot }}
                >
                  <rect x={candle.x - 3} y={yBase - 15} width="6" height="28" rx="1.5" fill="url(#candleBodyGrad)" />
                  {/* Wick */}
                  <rect x={candle.x - 0.5} y={yBase - 20} width="1" height="5" fill="#222" />
                  
                  {/* Organic Flame */}
                  <motion.g
                    animate={{ 
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      opacity: [0.9, 1, 0.8, 1, 0.9],
                      skewX: [0, 2, -2, 1, 0],
                      y: [0, -2, 1, -1, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.8 + Math.random(), 
                      ease: "easeInOut" 
                    }}
                    style={{ transformOrigin: `${candle.x}px ${yBase - 20}px` }}
                  >
                    {/* Flame Glow */}
                    <circle cx={candle.x} cy={yBase - 28} r="12" fill="#f59e0b" fillOpacity="0.15" className="blur-lg" />
                    {/* Flame Body */}
                    <path
                      d={`M ${candle.x} ${yBase - 38} C ${candle.x + 5} ${yBase - 28}, ${candle.x + 4} ${yBase - 20}, ${candle.x} ${yBase - 20} C ${candle.x - 4} ${yBase - 20}, ${candle.x - 5} ${yBase - 28}, ${candle.x} ${yBase - 38} Z`}
                      fill="#f59e0b"
                      filter="url(#softGlow)"
                    />
                    {/* Flame Core */}
                    <path
                      d={`M ${candle.x} ${yBase - 30} C ${candle.x + 3} ${yBase - 26}, ${candle.x + 2} ${yBase - 20}, ${candle.x} ${yBase - 20} C ${candle.x - 2} ${yBase - 20}, ${candle.x - 3} ${yBase - 26}, ${candle.x} ${yBase - 30} Z`}
                      fill="#fffbeb"
                    />
                  </motion.g>
                </motion.g>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const questionsTriggerRef = useRef<HTMLDivElement | null>(null);

  const handleCorrectPin = () => {
    setIsUnlocked(true);
  };

  const handleToggle = () => {
    if (!isCelebrationActive) {
      setIsCelebrationActive(true);
      setHasInteracted(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#fef3c7', '#ffffff']
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
        setShowScrollIndicator(false);
      }

      // Check if we've reached the bottom to show questions
      if (questionsTriggerRef.current) {
        const rect = questionsTriggerRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setIsQuestionsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const triggerInteraction = () => setHasInteracted(true);
    window.addEventListener('click', triggerInteraction, { once: true });
    window.addEventListener('scroll', triggerInteraction, { once: true });
    window.addEventListener('touchstart', triggerInteraction, { once: true });
    return () => {
      window.removeEventListener('click', triggerInteraction);
      window.removeEventListener('scroll', triggerInteraction);
      window.removeEventListener('touchstart', triggerInteraction);
    };
  }, []);

  useEffect(() => {
    if (isUnlocked && hasInteracted && !isMuted && audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      
      // Smooth fade-in (~3 seconds)
      let vol = 0;
      audioRef.current.volume = 0;
      const interval = setInterval(() => {
        if (vol < 0.3) {
          vol += 0.01;
          if (audioRef.current) audioRef.current.volume = Math.min(vol, 0.3);
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isUnlocked, hasInteracted, isMuted]);

  return (
    <div className="min-h-screen selection:bg-gold/30">
      <AnimatePresence>
        {!isUnlocked && <PinScreen onCorrectPin={handleCorrectPin} />}
      </AnimatePresence>

      {isUnlocked && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative min-h-screen transition-colors duration-1000 ${
            isCelebrationActive ? 'bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]' : 'bg-midnight'
          }`}
        >
          {/* Background Ambient Glow & Light Spill */}
          <div className={`fixed inset-0 transition-opacity duration-1000 pointer-events-none ${isCelebrationActive ? 'opacity-40' : 'opacity-0'}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gold/5 rounded-full blur-[180px]" />
            {/* Corner Light Spills */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 blur-[100px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/10 blur-[100px]" />
          </div>

          <div className="fixed inset-0 vignette pointer-events-none z-10" />

          {/* Tiny Mute Icon */}
          <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                setHasInteracted(true);
              }}
              className="p-2 text-white/20 hover:text-white/60 transition-all focus:outline-none"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            loop
            src="https://cdn.pixabay.com/audio/2022/03/10/audio_7302484c61.mp3"
          />

          {/* Border Lights - Rendered immediately when active */}
          {isCelebrationActive && <StringLights />}

          {/* Hero Section */}
          <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            {!isCelebrationActive ? (
              <div className="z-20">
                <WallSwitch isOn={isCelebrationActive} onToggle={handleToggle} />
              </div>
            ) : (
              <div 
                className="z-20 flex flex-col items-center justify-center w-full h-full"
              >
                <div className="text-center mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-serif italic text-gold text-glow-gold mb-4"
                  >
                    Happy Birthday
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 2 }}
                    className="text-2xl md:text-4xl font-light tracking-[0.4em] uppercase text-slate-300"
                  >
                    Vishakha
                  </motion.div>
                </div>

                <BirthdayCake />
                
                {showScrollIndicator && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 3 }}
                    className="absolute bottom-12 flex flex-col items-center gap-2 text-slate-400 animate-bounce"
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em]">Scroll Down</span>
                    <div className="w-[1px] h-8 bg-gold/50" />
                  </motion.div>
                )}
              </div>
            )}
          </section>

          {/* Content Sections */}
          {isCelebrationActive && (
            <div className="relative z-20 pb-52">
              {/* Wishes Section */}
              <section className="max-w-2xl mx-auto px-6 py-24 text-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <Sparkles className="mx-auto mb-8 text-gold opacity-50" size={32} />
                  <p className="text-2xl md:text-3xl font-light leading-relaxed text-slate-200 font-serif italic">
                    “Wishing you growth, confidence, and success in everything you choose.”
                  </p>
                  <div className="mt-12 w-12 h-[1px] bg-gold/30 mx-auto" />
                </motion.div>
              </section>

              {/* Blessings Section (Spiritual & Peaceful) */}
              <section className="max-w-2xl mx-auto px-6 py-24 text-center">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
                    <motion.div 
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="relative text-gold/60 text-sm tracking-[0.6em] uppercase font-medium"
                    >
                      Blessings by Lord Krishna
                    </motion.div>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-300 font-serif italic">
                      “May your path be filled with peace, clarity, and inner strength”
                    </p>
                    <p className="text-lg md:text-xl font-light leading-relaxed text-slate-400 font-serif italic">
                      “Blessings for career growth, success, and a fulfilling journey ahead”
                    </p>
                  </div>

                  <div className="pt-12 flex items-center justify-center gap-4 text-gold/20">
                    <div className="w-8 h-[1px] bg-current" />
                    <Sparkles size={16} />
                    <div className="w-8 h-[1px] bg-current" />
                  </div>
                </motion.div>
              </section>

              {/* Conversational Space */}
              <div ref={questionsTriggerRef} className="h-1" />
              <AnimatePresence>
                {isQuestionsVisible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <ConversationalSpace />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final Note Section */}
              <section className="max-w-2xl mx-auto px-6 py-32 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <Heart className="mx-auto mb-8 text-pink-500/40" size={24} />
                  <p className="text-lg md:text-xl font-light text-slate-300 italic tracking-wide">
                    “May peace, clarity, and good energy always stay with you.”
                  </p>
                </motion.div>
              </section>

              {/* Footer */}
              <footer className="mt-20 px-8 pb-12 border-t border-white/5 pt-12">
                <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-[10px] md:text-xs text-slate-500 tracking-wider text-center"
                  >
                    No personal photos are used here, just to respect privacy and keep things comfortable.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="w-full text-right"
                  >
                    <span className="text-[10px] md:text-xs text-slate-400 tracking-[0.2em] font-light italic">
                      Created & Designed by <span className="text-gold/60 font-medium ml-1">Nipun</span>
                    </span>
                  </motion.div>
                </div>
              </footer>
            </div>
          )}
        </motion.main>
      )}
    </div>
  );
}
