import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Sparkles, 
  ChevronUp, 
  RotateCcw, 
  ChevronLeft, 
  Info,
  Maximize2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Languages,
  Heart
} from 'lucide-react';

/**
 * HeartSync - 深度对话卡牌原型 (V62.0 完整恢复版)
 * 1. URL 参数：支持 ?lang=en 或 ?lang=zh 初始加载。
 * 2. 轮播动效：首页示例文字采用纵向 Slide Up 逻辑。
 * 3. 全居中对齐：3D 扇形堆叠随卡牌数量动态计算中心。
 * 4. 极致结语：无 Logo，14px 字号，元素间距固定 24px，文字拆分为两行。
 * 5. 样式：移除生成按钮上方横线，英文版按钮 Regular 字重。
 */

// Vite only exposes env vars prefixed with `VITE_`
// Create `heartsync-app/.env` locally with: VITE_GEMINI_API_KEY=...
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

const TRANSLATIONS = {
  zh: {
    logoSubtitle: "Deep talk reimagined",
    inputLabel: "描述此刻的情境 / THE SCENE",
    generateBtn: "生成专属对话命题",
    loadingStages: ["正在聆听语境...", "正在触碰灵魂...", "即将开启。"],
    galleryBack: "调整情境",
    galleryTitle: "未知即是惊喜 · 抽取一张开启对话",
    focusBack: "返回列表",
    revealHint: "点击揭晓内容",
    flipHint: "点击翻看洞察",
    whyLabel: "逻辑解析",
    tipLabel: "对话锦囊",
    resetBtn: "返回问题",
    markUsedBtn: "标记为使用过",
    emptyBack: "重新开始",
    finishedMessage: "对话终有尽头，但灵魂的共鸣没有。\n愿你在这些诚实的触碰中，已寻获内心渴望的答案。",
    examples: [
      "我正和一位很久没见的老友在深夜的微醺时刻，想要叙旧并更新近况，语气温情且怀旧。",
      "和初次约会的对象在雨天的咖啡馆，想要跳过尬聊直接测试彼此的默契，语气浪漫且哲思。",
      "深夜一个人在阳台进行深度自我复盘，与内心的不安和解，语气诚实且冷静。",
      "和刚认识的旅伴在长途自驾的路上，想要打破尴尬并分享人生观，语气轻松幽默。",
      "平凡的晚餐时间，想和伴侣探讨深层价值观，规划共同的未来，语气治愈且温暖。"
    ]
  },
  en: {
    logoSubtitle: "Deep talk reimagined",
    inputLabel: "Describe the scene",
    generateBtn: "Generate conversation prompts",
    loadingStages: ["Sensing context...", "Connecting souls...", "Almost there."],
    galleryBack: "Edit context",
    galleryTitle: "Embrace the unknown · Pick a card",
    focusBack: "Back to list",
    revealHint: "Click to reveal content",
    flipHint: "Flip for insight",
    whyLabel: "Insight",
    tipLabel: "Pro-tip",
    resetBtn: "Back to question",
    markUsedBtn: "Mark as used",
    emptyBack: "Restart",
    finishedMessage: "Every conversation has an end, but resonance lives on.\nMay you find exactly what you were looking for within these deep connections.",
    examples: [
      "I'm catching up with an old friend late at night over drinks, feeling nostalgic and warm.",
      "A first date at a rainy cafe, wanting to skip small talk and test our deeper chemistry.",
      "Midnight on my balcony, having a deep honest conversation with my inner self.",
      "On a long road trip with a new travel buddy, sharing life philosophies to break the ice.",
      "A quiet dinner with my partner, discussing core values and planning our future together."
    ]
  }
};

const getCardTransform = (index, total, isExpanded, isTargetCard, windowWidth) => {
  const isMobile = windowWidth < 640;
  const baseRotation = "rotateY(-30deg) rotateX(10deg)";
  const lift = isTargetCard ? (isMobile ? -30 : -50) : 0; 
  const spacing = isExpanded ? (isMobile ? 28 : 55) : (isMobile ? 8 : 12);
  const totalWidth = (total - 1) * spacing;
  const startX = -totalWidth / 2;
  const visualNudge = isExpanded ? (isMobile ? -20 : -40) : (isMobile ? -10 : -20);
  const z = isExpanded ? (index * -80 + (total - 1) * 40) : (index * -40 + (total - 1) * 20);
  const x = startX + (index * spacing) + visualNudge;
  const y = (index * -5) + (total / 2 * 5) + lift;
  return `${baseRotation} translateZ(${z}px) translateX(${x}px) translateY(${y}px)`;
};

const GlassShards = () => {
  const shards = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 15,
      clip: `polygon(${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%)`,
      animX: [(Math.random() - 0.5) * 400, 0, (Math.random() - 0.5) * 400],
      animY: [(Math.random() - 0.5) * 400, 0, (Math.random() - 0.5) * 400],
      rotate: [Math.random() * 360, 0, Math.random() * -360],
      delay: i * 0.08
    }));
  }, []);

  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
      {shards.map((s) => (
        <motion.div
          key={s.id}
          className="absolute bg-white/10 backdrop-blur-md border border-white/30 shadow-xl"
          style={{ width: s.size, height: s.size, clipPath: s.clip }}
          animate={{ x: s.animX, y: s.animY, rotate: s.rotate, opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </div>
  );
};

const Logo = ({ lang, shadowStyle }) => (
  <div className="flex flex-col items-center gap-1 md:gap-2 mb-6 md:mb-10">
    <div className="flex items-center gap-3 md:gap-4">
      <svg width="40" height="20" viewBox="0 0 60 30" fill="none" className="opacity-90 w-10 md:w-16">
        <motion.path
          d="M0 15H12L16 5L22 25L28 0L34 30L38 15H60"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
        />
      </svg>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal font-['Caveat'] tracking-normal" style={shadowStyle}>HeartSync</h1>
    </div>
    <p className={`text-white/70 font-light text-[9px] md:text-[13px] opacity-80 tracking-[0.45em] uppercase`} style={shadowStyle}>
      {TRANSLATIONS[lang].logoSubtitle}
    </p>
  </div>
);

export default function App() {
  const getInitialLang = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const l = params.get('lang');
      if (l === 'en' || l === 'zh') return l;
    }
    return 'zh';
  };

  const [lang, setLang] = useState(getInitialLang()); 
  const [step, setStep] = useState('input'); 
  const [description, setDescription] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  const [winWidth, setWinWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const t = TRANSLATIONS[lang];
  const trackingClass = lang === 'zh' ? 'tracking-widest' : 'tracking-normal';
  const buttonWeight = lang === 'zh' ? 'font-bold' : 'font-normal';

  useEffect(() => {
    if (step === 'input') {
      const interval = setInterval(() => {
        setExampleIndex((prev) => (prev + 1) % t.examples.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [step, lang, t.examples.length]);

  useEffect(() => {
    let interval;
    if (step === 'loading') {
      let i = 0;
      setLoadingMessage(t.loadingStages[0]);
      interval = setInterval(() => {
        i++;
        if (i < t.loadingStages.length) setLoadingMessage(t.loadingStages[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step, lang, t.loadingStages]);

  const generateCards = async () => {
    if (!apiKey) {
      setError(lang === 'zh' ? "缺少 Gemini API Key（VITE_GEMINI_API_KEY）。" : "Missing Gemini API key (VITE_GEMINI_API_KEY).");
      setTimeout(() => setError(null), 3500);
      return;
    }
    if (description.trim().length < 5) {
      setError(lang === 'zh' ? "请描述一下你目前的情境。" : "Please describe your context.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setStep('loading');
    setError(null);
    const prompt = lang === 'en' 
      ? `You are a conversation expert. Based on: "${description}", generate 10 deep conversation cards JSON array. Objects: question_cn, question_en, why, proTip. Use sentence case for all English text. NO italics.`
      : `你是一位对话引导专家。根据情境： "${description}" 生成 10 张深度卡牌 JSON 数组，含 question_cn, question_en, why, proTip。禁止斜体。英文内容统一 Sentence case。`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;
      setCards(JSON.parse(text));
      setTimeout(() => { setStep('gallery'); setHoveredCardIndex(null); }, 1000);
    } catch (err) {
      setError(lang === 'zh' ? "对话引擎暂未响应。" : "Conversation engine not responding.");
      setStep('input');
    }
  };

  const markAsUsed = () => {
    const updatedCards = cards.filter((_, i) => i !== selectedCardIndex);
    setCards(updatedCards);
    setIsFlipped(false);
    setHoveredCardIndex(null);
    if (updatedCards.length === 0) { setStep('finished'); return; }
    setStep('gallery');
  };

  const cinematicShadow = { textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.4)' };

  return (
    <div className="relative min-h-screen w-full font-['Noto_Sans_SC'] antialiased font-light text-white overflow-hidden selection:bg-white/30">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, #root { background-color: #000 !important; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        .perspective-container { perspective: 1200px; transform-style: preserve-3d; }
      `}} />
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden bg-black" style={{ zIndex: 0 }} />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        <AnimatePresence mode="wait">
          
          {step === 'input' && (
            <motion.div key="input-step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="w-full max-w-[320px] sm:max-w-md flex flex-col items-center">
              <Logo lang={lang} shadowStyle={cinematicShadow} />
              <div className="w-full aspect-[3/4] bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden">
                <div className="flex-1 flex flex-col text-left">
                  <span className={`text-[9px] sm:text-[10px] text-white/90 mb-4 sm:mb-6 block font-medium ${lang === 'zh' ? 'tracking-[0.3em] uppercase' : 'tracking-normal'}`} style={cinematicShadow}>{t.inputLabel}</span>
                  <div className="relative flex-1 flex flex-col overflow-hidden">
                    {!description && (
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={exampleIndex}
                          initial={{ opacity: 0, y: 25 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -25 }}
                          transition={{ type: "spring", stiffness: 120, damping: 18 }}
                          className={`absolute inset-0 text-white/30 text-[16px] sm:text-[20px] font-light leading-relaxed pointer-events-none pr-4 ${trackingClass}`}
                        >
                          {t.examples[exampleIndex]}
                        </motion.div>
                      </AnimatePresence>
                    )}
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full h-full bg-transparent border-none focus:ring-0 focus:outline-none text-[16px] sm:text-[20px] text-white font-light leading-relaxed resize-none p-0 relative z-20 ${trackingClass}`} spellCheck="false" style={cinematicShadow} />
                  </div>
                </div>
                <div className="mt-4 pt-4">
                  <button onClick={generateCards} className={`w-full py-4 sm:py-5 bg-white text-slate-950 rounded-2xl ${buttonWeight} text-[13px] sm:text-[16px] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all active:scale-[0.98] shadow-2xl ${lang === 'zh' ? 'tracking-widest uppercase' : 'tracking-normal'}`}>{t.generateBtn}</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center space-y-8 sm:space-y-12">
              <GlassShards />
              <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p key={loadingMessage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`text-[13px] sm:text-[14px] font-light text-white/90 ${trackingClass}`} style={cinematicShadow}>{loadingMessage}</motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 'gallery' && (
            <motion.div key="gallery-step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center">
              <div className="mb-8 sm:mb-12 text-center transform -translate-y-[40px] sm:-translate-y-[120px]">
                <button onClick={() => setStep('input')} className={`flex items-center justify-center gap-2 text-[12px] sm:text-[14px] opacity-60 hover:opacity-100 transition-opacity mb-4 mx-auto ${lang === 'zh' ? 'tracking-widest uppercase font-bold' : 'tracking-normal font-normal'}`} style={cinematicShadow}><ChevronLeft size={16} /> {t.galleryBack}</button>
                <h2 className={`text-lg sm:text-xl font-light px-6 ${lang === 'zh' ? 'tracking-[0.2em]' : 'tracking-normal'}`} style={cinematicShadow}>{t.galleryTitle}</h2>
              </div>
              <div className="perspective-container relative w-[75vw] h-[100vw] max-w-[320px] max-h-[426px] flex items-center justify-center" onMouseEnter={() => setIsContainerHovered(true)} onMouseLeave={() => { setIsContainerHovered(false); setHoveredCardIndex(null); }} onTouchStart={() => setIsContainerHovered(true)}>
                {cards.map((card, index) => (
                  <motion.div key={`${card.question_cn}-${cards.length}`} onMouseEnter={() => setHoveredCardIndex(index)} onMouseLeave={() => setHoveredCardIndex(null)} animate={{ transform: getCardTransform(index, cards.length, isContainerHovered, hoveredCardIndex === index, winWidth), opacity: 0.85, scale: hoveredCardIndex === index ? 1.05 : 1 }} transition={{ type: "spring", stiffness: 140, damping: 24 }} onClick={() => { setSelectedCardIndex(index); setStep('focus'); }} className="absolute inset-0 bg-white/[0.1] backdrop-blur-2xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden group select-none cursor-pointer origin-center" style={{ zIndex: hoveredCardIndex === index ? 100 : cards.length - index }}>
                    <span className={`text-[10px] text-white/40 mb-4 ${lang === 'zh' ? 'tracking-[0.4em] uppercase' : 'tracking-normal'}`}>Card {index + 1}</span>
                    <h3 className={`text-[15px] sm:text-[18px] font-normal leading-relaxed px-2 sm:px-4 line-clamp-4 transition-all duration-700 ${trackingClass}`} style={{ ...cinematicShadow, filter: 'blur(15px)', opacity: 0.8 }}>{lang === 'zh' ? card.question_cn : card.question_en}</h3>
                    <div className={`mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white/60 text-[10px] ${lang === 'zh' ? 'tracking-widest uppercase font-bold' : 'tracking-normal font-normal'}`}><Maximize2 size={12} /> {t.revealHint}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'focus' && (
            <motion.div key="focus-step" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-[320px] sm:max-w-md flex flex-col items-center gap-6 sm:gap-8">
              <div className="w-full flex justify-between items-center px-4">
                <button onClick={() => { setStep('gallery'); setIsFlipped(false); setHoveredCardIndex(null); }} className={`flex items-center gap-2 text-[12px] sm:text-[14px] hover:opacity-70 transition-opacity ${lang === 'zh' ? 'tracking-widest uppercase font-bold' : 'tracking-normal font-normal'}`} style={cinematicShadow}><ChevronLeft size={16} /> {t.focusBack}</button>
                <span className="text-[14px] sm:text-[16px] font-medium" style={cinematicShadow}>{selectedCardIndex + 1} / {cards.length}</span>
              </div>
              <div className="relative w-full aspect-[3/4] perspective-2000">
                <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 180, damping: 22 }} style={{ transformStyle: "preserve-3d" }} className="relative w-full h-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                  <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-center items-center text-center shadow-2xl overflow-hidden">
                    <h2 className={`text-[18px] sm:text-[24px] font-normal leading-relaxed text-white tracking-tight px-2 ${lang === 'en' ? 'tracking-normal' : ''}`} style={cinematicShadow}>{lang === 'zh' ? cards[selectedCardIndex]?.question_cn : cards[selectedCardIndex]?.question_en}</h2>
                    <p className={`mt-4 sm:mt-8 text-[12px] sm:text-[16px] font-light text-white/90 leading-relaxed px-4 max-w-[95%] border-t border-white/10 pt-4 sm:pt-6 ${lang === 'en' ? 'tracking-normal' : ''}`} style={cinematicShadow}>{lang === 'zh' ? cards[selectedCardIndex]?.question_en : cards[selectedCardIndex]?.question_cn}</p>
                    <div className={`absolute bottom-6 sm:bottom-10 text-[9px] sm:text-[10px] text-white/60 flex flex-col items-center gap-2 ${lang === 'zh' ? 'tracking-widest uppercase font-bold' : 'tracking-normal font-normal'}`} style={cinematicShadow}><ChevronUp className="animate-bounce" /> {t.flipHint}</div>
                  </div>
                  <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="absolute inset-0 bg-white/[0.12] backdrop-blur-3xl border border-white/30 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between shadow-2xl text-left overflow-y-auto">
                    <div className="space-y-6 sm:space-y-8 text-[14px] sm:text-[16px] font-light">
                      <div className={lang === 'en' ? 'tracking-normal' : ''}>
                        <div className={`text-[10px] opacity-90 mb-3 flex items-center gap-2 font-medium text-white ${lang === 'zh' ? 'tracking-widest uppercase' : 'tracking-normal'}`} style={cinematicShadow}><Info size={14} /> {t.whyLabel}</div>
                        <p className="leading-relaxed text-white border-l border-white/20 pl-4">{cards[selectedCardIndex]?.why}</p>
                      </div>
                      <div className={`pt-4 sm:pt-6 border-t border-white/10 ${lang === 'en' ? 'tracking-normal' : ''}`}>
                        <div className={`text-[10px] opacity-90 mb-3 flex items-center gap-2 font-medium text-white ${lang === 'zh' ? 'tracking-widest uppercase' : 'tracking-normal'}`} style={cinematicShadow}><Sparkles size={14} /> {t.tipLabel}</div>
                        <p className="text-white font-light text-[13px] sm:text-[16px] leading-relaxed">{cards[selectedCardIndex]?.proTip}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className={`mt-6 w-full py-4 border border-white/10 rounded-2xl flex justify-center items-center gap-2 text-[12px] sm:text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-all uppercase shadow-lg ${lang === 'zh' ? 'tracking-widest font-bold' : 'tracking-normal font-normal'}`} style={cinematicShadow}><RotateCcw size={16} /> {t.resetBtn}</button>
                  </div>
                </motion.div>
              </div>
              <div className="w-full flex items-center gap-3 sm:gap-4">
                <NavButton lang={lang} onClick={() => { setSelectedCardIndex(prev => Math.max(0, prev - 1)); setIsFlipped(false); setHoveredCardIndex(null); }} disabled={selectedCardIndex === 0}><ArrowLeft size={20} className="sm:w-6 sm:h-6" /></NavButton>
                <button onClick={markAsUsed} className={`flex-grow py-4 sm:py-5 bg-white/10 hover:bg-red-500/20 border border-white/20 rounded-xl text-[12px] sm:text-[14px] transition-all flex items-center justify-center gap-2 active:scale-95 ${lang === 'zh' ? 'tracking-widest uppercase font-bold' : 'tracking-normal font-normal'}`} style={cinematicShadow}><CheckCircle size={16} /><span>{t.markUsedBtn}</span></button>
                <NavButton lang={lang} onClick={() => { setSelectedCardIndex(prev => Math.min(cards.length - 1, prev + 1)); setIsFlipped(false); setHoveredCardIndex(null); }} disabled={selectedCardIndex === cards.length - 1} primary><ArrowRight size={20} className="sm:w-6 sm:h-6" /></NavButton>
              </div>
            </motion.div>
          )}

          {step === 'finished' && (
            <motion.div key="finished-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-[75vw] max-w-lg flex flex-col items-center space-y-[24px]">
                 <Heart className="text-white/40 animate-pulse" size={32} />
                 <p className={`text-[14px] font-light leading-relaxed text-white/90 text-center whitespace-pre-line ${trackingClass}`} style={cinematicShadow}>
                   {t.finishedMessage}
                 </p>
                 <button onClick={() => setStep('input')} className={`py-3 px-10 bg-white/10 border border-white/20 rounded-xl md:rounded-2xl text-[14px] hover:bg-white/20 transition-all active:scale-[0.98] text-white/80 ${lang === 'zh' ? 'font-bold tracking-widest uppercase' : 'font-normal'}`}>
                  {t.emptyBack}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[12px] font-medium tracking-widest uppercase hover:bg-white/20 transition-all shadow-2xl active:scale-95 group">
          <Languages size={14} className="text-white/60 group-hover:text-white sm:w-4 sm:h-4" />
          <span>{lang === 'zh' ? 'English' : '中文'}</span>
        </button>
      </div>

      {error && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md px-6 py-3 sm:px-10 sm:py-5 rounded-full text-white text-[12px] sm:text-[14px] border border-red-400 z-50 shadow-2xl">{error}</motion.div>}
    </div>
  );
}

const NavButton = ({ children, onClick, disabled, primary, lang }) => {
  const weightClass = lang === 'zh' ? (primary ? 'font-bold' : 'font-semibold') : 'font-normal';
  return (
    <button 
      onClick={onClick} disabled={disabled} 
      className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl md:rounded-2xl transition-all duration-500 shadow-xl ${weightClass} ${
        disabled ? 'opacity-20 scale-95 cursor-not-allowed border border-white/10' : primary ? 'bg-white text-slate-900 hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] active:scale-95' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95'
      }`}
    >
      {children}
    </button>
  );
};