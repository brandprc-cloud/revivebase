"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Spotlight ──────────────────────────────────────────────────
function SpotlightSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: active ? 1 : 0,
          transition: "opacity 0.6s ease",
          background: `radial-gradient(900px circle at ${mouse.x}px ${mouse.y}px, rgba(200,75,49,0.11), transparent 50%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── 3D Tilt Card ───────────────────────────────────────────────
function Card3D({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setS({
      rx: -ny * 14,
      ry: nx * 14,
      gx: ((e.clientX - r.left) / r.width) * 100,
      gy: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  };

  const onLeave = () => setS({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: s.rx, rotateY: s.ry, scale: s.on ? 1.025 : 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: s.on ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(200,75,49,0.14), transparent 65%)`,
        }}
      />
      <div style={{ transform: "translateZ(12px)" }}>{children}</div>
    </motion.div>
  );
}

// ─── Glow Button ────────────────────────────────────────────────
function GlowButton({
  children,
  href,
  submit = false,
  variant = "primary",
  size = "md",
}: {
  children: React.ReactNode;
  href?: string;
  submit?: boolean;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
}) {
  const sz = size === "lg" ? "px-8 py-4 text-base" : "px-5 py-2.5 text-sm";
  const vr =
    variant === "primary"
      ? "bg-[#C84B31] text-white hover:bg-[#D4603A] shadow-[0_0_22px_rgba(200,75,49,0.38)] hover:shadow-[0_0_42px_rgba(200,75,49,0.62)]"
      : "border border-[#2A2320] text-[#F5EDE8]/55 hover:text-[#F5EDE8] hover:border-[#C84B31]/40 hover:shadow-[0_0_18px_rgba(200,75,49,0.18)]";
  const cls = `inline-flex items-center gap-2 rounded-xl font-bold tracking-tight transition-all duration-300 ${sz} ${vr}`;

  if (href) return <a href={href} className={cls}>{children}</a>;
  return (
    <motion.button whileTap={{ scale: 0.97 }} type={submit ? "submit" : "button"} className={cls}>
      {children}
    </motion.button>
  );
}

// ─── Submit Button (full width) ──────────────────────────────────
function SubmitBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full bg-[#C84B31] text-white py-4 rounded-xl text-base font-bold tracking-tight hover:bg-[#D4603A] shadow-[0_0_24px_rgba(200,75,49,0.38)] hover:shadow-[0_0_44px_rgba(200,75,49,0.60)] transition-all duration-300"
    >
      {children}
    </button>
  );
}

// ─── Input ──────────────────────────────────────────────────────
const INPUT = "w-full bg-[#0C0A09] border border-[#2A2320] rounded-xl px-4 py-4 text-xl font-bold text-[#F5EDE8] placeholder-[#F5EDE8]/15 focus:outline-none focus:border-[#C84B31]/60 focus:shadow-[0_0_0_3px_rgba(200,75,49,0.10)] transition-all";
const LABEL = "block text-[10px] font-bold text-[#F5EDE8]/40 uppercase tracking-[0.14em] mb-2";

// ════════════════════════════════════════════════════════════════
export default function Home() {
  const [step, setStep] = useState<1 | 2>(1);
  const [contacts, setContacts] = useState("");
  const [avgCheck, setAvgCheck] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dormant = Math.round(Number(contacts) * 0.35);
  const potential = Math.round(dormant * Number(avgCheck) * 0.15);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts && avgCheck) setStep(2);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const stats = [
    { num: "35%", label: "клиентов спят\nв любой базе", note: "статистика 500+ компаний" },
    { num: "98%", label: "open rate\nв WhatsApp", note: "vs 21% у email-рассылок" },
    { num: "5×",  label: "дешевле вернуть\nчем найти нового", note: "данные Harvard Business Review" },
  ];

  const steps = [
    { n: "01", title: "Загрузи базу", body: "Excel, Google Sheets или CSV. 15 минут — и система знает каждого клиента." },
    { n: "02", title: "AI строит стратегию", body: "Анализирует сегменты, прогнозирует выручку, готовит персональные тексты." },
    { n: "03", title: "Нажимаешь «Запустить»", body: "Система сама пишет клиентам через WhatsApp и email. Ты смотришь на цифры." },
  ];

  const niches = [
    "Рестораны", "Салоны красоты", "Фитнес", "Стоматологии",
    "Онлайн-магазины", "Консультанты", "Турагентства", "Барбершопы",
    "Ателье", "Автосервисы", "СПА", "Любой сервис",
  ];

  return (
    <main className="min-h-screen bg-[#0C0A09] text-[#F5EDE8]">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1A1614] bg-[#0C0A09]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight">
            Revive<span className="text-[#C84B31]">Base</span>
          </span>
          <GlowButton href="http://23.88.109.33/upload" size="md">Рассчитать потенциал →</GlowButton>
        </div>
      </nav>

      {/* ── HERO ── */}
      <SpotlightSection className="min-h-[88vh] flex items-center border-b border-[#1A1614]">
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(#F5EDE8 1px, transparent 1px), linear-gradient(90deg, #F5EDE8 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="max-w-5xl mx-auto px-6 py-32 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#1A1614] border border-[#C84B31]/25 text-[#C84B31] text-[10px] font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-[0.14em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] animate-pulse" />
            AI-платформа для реактивации клиентов
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-extrabold tracking-[-0.03em] leading-[0.88] mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            В твоей базе<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C84B31] via-[#E27045] to-[#C84B31]">
              лежат деньги
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#F5EDE8]/45 max-w-lg mx-auto mb-12 leading-relaxed"
          >
            35% клиентов любого бизнеса не покупали больше 90 дней.
            Мы их находим, пишем и возвращаем деньги — без рекламных бюджетов.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <GlowButton href="http://23.88.109.33/upload" size="lg">Узнать потенциал базы →</GlowButton>
            <GlowButton href="#how" variant="ghost" size="lg">Как это работает ↓</GlowButton>
          </motion.div>

          <p className="text-xs text-[#F5EDE8]/20 mt-5 tracking-wide">
            Бесплатно · Без регистрации · 30 секунд
          </p>
        </div>
      </SpotlightSection>

      {/* ── STATS 3D ── */}
      <section className="py-24 border-b border-[#1A1614]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ perspective: "1400px" }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <Card3D className="relative bg-[#141210] border border-[#1E1A18] rounded-2xl p-8 hover:border-[#C84B31]/25 transition-colors duration-500 cursor-default">
                  <div className="text-5xl font-extrabold tracking-[-0.03em] text-[#F5EDE8] mb-2">{s.num}</div>
                  <div className="text-[#F5EDE8]/75 font-semibold leading-snug mb-3 whitespace-pre-line">{s.label}</div>
                  <div className="text-xs text-[#F5EDE8]/30">{s.note}</div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <section id="calculator" className="py-28 border-b border-[#1A1614]">
        <div className="max-w-[520px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="font-extrabold tracking-[-0.03em] mb-3"
              style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}
            >
              Сколько денег<br />в твоей базе?
            </h2>
            <p className="text-[#F5EDE8]/35 text-sm">Два числа — и ты видишь потенциал</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCalc}
                className="bg-[#141210] border border-[#1E1A18] rounded-2xl p-8 space-y-5"
              >
                <div>
                  <label className={LABEL}>Клиентов в базе</label>
                  <input
                    type="number"
                    value={contacts}
                    onChange={e => setContacts(e.target.value)}
                    placeholder="500"
                    className={INPUT}
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className={LABEL}>Средний чек ($)</label>
                  <input
                    type="number"
                    value={avgCheck}
                    onChange={e => setAvgCheck(e.target.value)}
                    placeholder="50"
                    className={INPUT}
                    required
                    min="1"
                  />
                </div>
                <SubmitBtn>Показать потенциал →</SubmitBtn>
              </motion.form>
            )}

            {step === 2 && !submitted && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-[#141210] border border-[#1E1A18] rounded-2xl p-8"
              >
                <div
                  className="rounded-xl p-7 mb-7 text-center"
                  style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.18)" }}
                >
                  <p className={LABEL + " mb-1"}>Спящих клиентов</p>
                  <p className="text-5xl font-extrabold tracking-[-0.03em] mb-5">{dormant.toLocaleString()}</p>
                  <p className={LABEL + " mb-1"}>Потенциал выручки</p>
                  <p className="text-6xl font-extrabold tracking-[-0.03em] text-[#E27045]">${potential.toLocaleString()}</p>
                  <p className="text-[11px] text-[#F5EDE8]/25 mt-3">При конверсии 15% — данные 500+ кампаний</p>
                </div>
                <p className="text-center text-[#F5EDE8]/50 text-sm font-medium mb-5">
                  Оставь email — скажем первым когда откроемся
                </p>
                <form onSubmit={handleWaitlist} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="твой@email.com"
                    className="w-full bg-[#0C0A09] border border-[#2A2320] rounded-xl px-4 py-4 text-[#F5EDE8] placeholder-[#F5EDE8]/20 focus:outline-none focus:border-[#C84B31]/60 focus:shadow-[0_0_0_3px_rgba(200,75,49,0.10)] transition-all"
                    required
                  />
                  <SubmitBtn>Хочу вернуть ${potential.toLocaleString()} из базы</SubmitBtn>
                  <p className="text-[11px] text-[#F5EDE8]/20 text-center">Без спама. Только уведомление о запуске.</p>
                </form>
              </motion.div>
            )}

            {submitted && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="bg-[#141210] border border-[#1E1A18] rounded-2xl p-10 text-center"
                style={{ borderColor: "rgba(200,75,49,0.25)" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
                  style={{ background: "rgba(200,75,49,0.12)", border: "1px solid rgba(200,75,49,0.28)" }}
                >
                  ✓
                </motion.div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Ты в списке</h3>
                <p className="text-[#F5EDE8]/40 mb-5">Напишем как только откроемся.</p>
                <p className="text-[#E27045] font-bold text-xl tracking-tight">
                  Потенциал: ${potential.toLocaleString()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 border-b border-[#1A1614]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-extrabold tracking-[-0.03em] text-center mb-14"
            style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}
          >
            Как это работает
          </motion.h2>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="group flex gap-6 items-start bg-[#141210] border border-[#1E1A18] hover:border-[#C84B31]/20 rounded-2xl p-7 transition-all duration-500"
              >
                <span className="shrink-0 text-[#C84B31]/30 group-hover:text-[#C84B31]/65 font-extrabold text-5xl tracking-[-0.04em] leading-none select-none transition-colors duration-300">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-bold mb-1.5">{s.title}</h3>
                  <p className="text-[#F5EDE8]/40 text-sm leading-relaxed">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="py-24 border-b border-[#1A1614]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-extrabold tracking-[-0.03em] mb-3"
            style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}
          >
            Для кого
          </motion.h2>
          <p className="text-[#F5EDE8]/30 text-sm mb-10">Любой бизнес с базой клиентов</p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {niches.map((n, i) => (
              <motion.span
                key={n}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#141210] border border-[#1E1A18] hover:border-[#C84B31]/30 text-[#F5EDE8]/55 hover:text-[#F5EDE8]/90 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-default"
              >
                {n}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <SpotlightSection className="py-36 border-b border-[#1A1614]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[0.9] mb-6"
              style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}
            >
              Узнай сколько<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C84B31] via-[#E27045] to-[#C84B31]">
                денег в твоей базе
              </span>
            </h2>
            <p className="text-[#F5EDE8]/30 mb-10 text-sm tracking-wide">
              Бесплатно · 30 секунд · Никаких обязательств
            </p>
            <GlowButton href="http://23.88.109.33/upload" size="lg">Рассчитать потенциал →</GlowButton>
          </motion.div>
        </div>
      </SpotlightSection>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1A1614] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="font-extrabold text-sm tracking-tight">
            Revive<span className="text-[#C84B31]">Base</span>
          </span>
          <span className="text-[11px] text-[#F5EDE8]/22 tracking-wide">
            © 2025 · Реактивация клиентов для малого бизнеса
          </span>
        </div>
      </footer>

    </main>
  );
}
