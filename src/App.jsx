import { useState, useEffect, useRef } from "react";
import { Mail, ExternalLink, ChevronDown, Globe, ArrowRight, Send } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
// ═══════════════════════════════ DATA ═══════════════════════════════

const ROLES = ["Software Engineer", "AI Developer", "Full Stack Builder", "Problem Solver"];

const STATS = [
  { value: 25, suffix: "+", label: "DSA Problems Solved", icon: "⚡" },
  { value: 20,  suffix: "+", label: "Projects Built",      icon: "🚀" },
  { value: 8,   suffix: "+", label: "Technologies",        icon: "🛠️" },
  { value: 1000,suffix: "+", label: "Hours of Code",       icon: "💻" },
];

const SKILL_TABS = {
  "Frontend": [
    { name: "React",        pct: 90 },
    { name: "JavaScript",   pct: 88 },
    { name: "TypeScript",   pct: 75 },
    { name: "HTML & CSS",   pct: 92 },
    { name: "Node.js",      pct: 82 },
  ],
  "Backend": [
    { name: "Python",  pct: 88 },
    { name: "Java",    pct: 78 },
    { name: "C++",     pct: 85 },
    { name: "SQL",     pct: 75 },
    { name: "MongoDB", pct: 72 },
  ],
  "AI & ML": [
    { name: "TensorFlow.js",    pct: 80 },
    { name: "Scikit-learn",     pct: 82 },
    { name: "NumPy / Pandas",   pct: 85 },
    { name: "Claude Vision API",pct: 78 },
    { name: "OpenCV",           pct: 70 },
  ],
  "Tools": [
    { name: "Git & GitHub", pct: 88 },
    { name: "VS Code",      pct: 95 },
    { name: "Postman",      pct: 80 },
    { name: "Docker",       pct: 65 },
    { name: "Vercel",       pct: 85 },
  ],
};

const PROJECTS = [
  {
    id: 1, emoji: "🌿", name: "AgriVision",
    tagline: "AI Crop Disease Detection",
    desc: "Dual AI pipeline: TensorFlow.js CNN (MobileNetV2) + Claude Vision API for potato leaf disease detection. Real-time side-by-side model comparison with session accuracy tracking.",
    tech: ["TensorFlow.js", "Claude API", "React", "Python", "OpenCV"],
    metrics: ["95%+ Accuracy", "Dual AI Models", "Real-time Analysis"],
    color: "#00D4FF", featured: true,
    github: "https://github.com/GauravYadav1430/agrivision",
    demo: "https://agrivision-1e1f.onrender.com/",
  },
  {
    id: 2, emoji: "🔐", name: "CascadeLock",
    tagline: "Triple-Layer Hybrid Encryption",
    desc: "XOR + RC4 + AES-256-CBC with RSA-OAEP key wrapping. Interactive in-browser cyberpunk demo with animated UI.",
    tech: ["Web Crypto API", "JavaScript", "GSAP", "HTML/CSS"],
    metrics: ["3-Layer Crypto", "RSA-OAEP", "Browser Native"],
    color: "#7C3AED",
    github: "https://github.com/GauravYadav1430/CascadeLock-V2",
    demo: "https://cascade-lock-v2.vercel.app/",
  },
  {
    id: 3, emoji: "📊", name: "MESScope",
    tagline: "Mess Demand Prediction",
    desc: "ML-powered mess analytics platform using Python backend and real-time HTML dashboard for demand forecasting.",
    tech: ["Python", "Scikit-learn", "Chart.js", "Node.js"],
    metrics: ["ML Forecasting", "Live Dashboard", "Analytics"],
    color: "#FF6B6B",
    github: "https://github.com/GauravYadav1430",
    demo: "https://messcope.vercel.app",
  },
  {
    id: 4, emoji: "🍱", name: "Tiffy",
    tagline: "Campus Food Delivery Platform",
    desc: "Front-End tiffin ordering ecosystem for NIT Jalandhar. Role-based dashboards, subscription management, cart engine. Working on BackEnd.",
    tech: ["HTML", "CSS" ,"JavaScript"],
    metrics: ["Role-based Auth", "Subscriptions", "Multi-page"],
    color: "#F59E0B",
    github: "https://github.com/GauravYadav1430",
    demo: "https://tiffy-one.vercel.app/about.html",
  },
  {
    id: 5, emoji: "⚽", name: "PITCH",
    tagline: "World-Class Football Analytics",
    desc: "Premium football analytics app competing with Sofascore — live data, xG analytics, AI insights, fantasy tools, dark UI.",
    tech: ["React", "Node.js", "Football API", "Chart.js"],
    metrics: ["Live Data", "xG Analytics", "AI Insights"],
    color: "#10B981",
    github: "https://github.com/GauravYadav1430",
    demo: "https://agrivision-1e1f.onrender.com/",
  },
  {
    id: 6, emoji: "💰", name: "Loan Predictor",
    tagline: "ML Loan Approval System",
    desc: "Multi-algorithm ML system for loan approval prediction with comprehensive comparative analysis and visualization.",
    tech: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    metrics: ["89% Accuracy", "Multi-Algorithm", "Visual Reports"],
    color: "#34D399",
    github: "https://github.com/GauravYadav1430",
    demo: "https://agrivision-1e1f.onrender.com/",
  },
];

const TIMELINE = [
  { year: "2023",    title: "Joined NIT Jalandhar",     desc: "Began B.Tech CS Engineering. Deep-dived into DSA, algorithms, and competitive programming from day one.", type: "edu" },
  { year: "2023–24", title: "75+ DSA Problems",         desc: "LeetCode, Codeforces, GFG — specialized in graphs, DP, trees and number theory.", type: "win" },
  { year: "2024",    title: "CascadeLock & DineOnTime",  desc: "Built triple-layer hybrid encryption protocol and campus restaurant app as IS&S lab projects.", type: "proj" },
  { year: "2025",    title: "AgriVision AI System",      desc: "Combined TensorFlow.js + Claude Vision API for 95%+ accurate real-time crop disease detection.", type: "ai" },
  { year: "2026",    title: "Building at Scale",         desc: "Production apps, PITCH analytics, expanded ML expertise. Open to internships and opportunities.", type: "now" },
];

// ═══════════════════════════ PARTICLE CANVAS ═══════════════════════

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();

    const N = 80;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * (W || 1000), y: Math.random() * (H || 600),
      vx: (Math.random() - 0.5) * 0.42, vy: (Math.random() - 0.5) * 0.42,
      r: Math.random() * 1.8 + 0.4,
      cyan: Math.random() > 0.52,
    }));

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const md = Math.hypot(dx, dy);
        if (md < 200 && md > 0) { p.vx += (dx / md) * 0.022; p.vy += (dy / md) * 0.022; }
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.3) { p.vx *= 0.97; p.vy *= 0.97; }
        ctx.globalAlpha = 0.68;
        ctx.fillStyle = p.cyan ? "#00D4FF" : "#7C3AED";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 120) {
          ctx.globalAlpha = (1 - d / 120) * 0.22;
          ctx.strokeStyle = "#00D4FF";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// ═══════════════════════════ CUSTOM CURSOR ══════════════════════════

function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let tx = 0, ty = 0, rx = 0, ry = 0, id;
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${tx - 4}px,${ty - 4}px)`;
    };
    const animate = () => {
      rx += (tx - rx) * 0.13; ry += (ty - ry) * 0.13;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      id = requestAnimationFrame(animate);
    };
    document.addEventListener("mousemove", onMove);
    animate();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(id); };
  }, []);
  return (
    <>
      <div ref={dot}  style={{ position:"fixed", zIndex:9999, pointerEvents:"none", width:8,  height:8,  borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 14px #00D4FF,0 0 28px rgba(0,212,255,0.35)", top:0, left:0, willChange:"transform" }} />
      <div ref={ring} style={{ position:"fixed", zIndex:9998, pointerEvents:"none", width:36, height:36, borderRadius:"50%", border:"1px solid rgba(0,212,255,0.4)", top:0, left:0, willChange:"transform" }} />
    </>
  );
}

// ═══════════════════════════ COUNTER HOOK ═══════════════════════════

function useCounter(target, running) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!running) return;
    let start, id;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / 2400, 1);
      setVal(Math.floor((1 - Math.pow(1 - prog, 3)) * target));
      if (prog < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, running]);
  return val;
}

// ═══════════════════════════ SKILL BAR ══════════════════════════════

function SkillBar({ name, pct, delay }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      style={{ padding:"18px 22px", borderRadius:14, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", transition:"border-color 0.3s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#fff" }}>{name}</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#00D4FF" }}>{pct}%</span>
      </div>
      <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:4, background:"linear-gradient(90deg,#00D4FF,#7C3AED)", boxShadow:"0 0 8px rgba(0,212,255,0.5)", width: vis ? `${pct}%` : "0%", transition: vis ? `width 1.1s cubic-bezier(0.25,1,0.5,1) ${delay}ms` : "none" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════ PROJECT CARD ═══════════════════════════

function ProjectCard({ p }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale(1.02)`;
  };

  return (
    <div onMouseMove={onMove}
      onMouseEnter={e => { e.currentTarget.style.borderColor=`${p.color}50`; e.currentTarget.style.boxShadow=`0 24px 64px ${p.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform="perspective(700px) rotateY(0) rotateX(0) scale(1)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow="none"; }}
      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:22, padding:"26px", transition:"transform 0.15s ease, box-shadow 0.3s, border-color 0.3s", willChange:"transform", position:"relative", overflow:"hidden", cursor:"default" }}>
      
      <div style={{ position:"absolute", top:-40, right:-40, width:130, height:130, borderRadius:"50%", background:p.color, opacity:0.07, filter:"blur(40px)", pointerEvents:"none" }} />
      
      <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:`${p.color}18`, border:`1px solid ${p.color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{p.emoji}</div>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#fff" }}>{p.name}</div>
          <div style={{ color:p.color, fontSize:11, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{p.tagline}</div>
        </div>
      </div>
      
      <p style={{ color:"rgba(255,255,255,0.47)", fontSize:13, lineHeight:1.75, marginBottom:18 }}>{p.desc}</p>
      
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {p.metrics.map(m => <span key={m} style={{ padding:"3px 10px", borderRadius:100, background:`${p.color}14`, border:`1px solid ${p.color}30`, color:p.color, fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{m}</span>)}
      </div>
      
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {p.tech.map(t => <span key={t} style={{ padding:"3px 9px", borderRadius:100, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.55)", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>)}
      </div>

      {/* ══════════════ ACTION BUTTONS ══════════════ */}
      <div style={{ display: "flex", gap: 8 }}>
        
        {/* GitHub Button */}
        {p.github && (
          <a href={p.github} target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:"rgba(255,255,255,0.55)", textDecoration:"none", padding:"7px 14px", borderRadius:100, border:"1px solid rgba(255,255,255,0.1)", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}>
            <FiGithub size={13} /> GitHub
          </a>
        )}

        {/* Live Demo Button */}
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:"#fff", textDecoration:"none", padding:"7px 14px", borderRadius:100, border:`1px solid ${p.color}60`, background:`${p.color}20`, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background=`${p.color}40`; e.currentTarget.style.boxShadow=`0 0 12px ${p.color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background=`${p.color}20`; e.currentTarget.style.boxShadow="none"; }}>
            <ExternalLink size={13} /> Live Demo
          </a>
        )}

      </div>
      {/* ═════════════════════════════════════════════ */}

    </div>
  );
}

// ═══════════════════════════ CONTACT LINK ═══════════════════════════

function ContactLink({ icon, label, val, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderTop:"1px solid rgba(255,255,255,0.05)", textDecoration:"none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <span style={{ color:"#00D4FF", opacity:0.8 }}>{icon}</span>
      <span style={{ flex:1 }}>
        <div style={{ color:"rgba(255,255,255,0.25)", fontSize:10, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
        <div style={{ color: hov ? "#00D4FF" : "rgba(255,255,255,0.5)", fontSize:13, transition:"color 0.2s" }}>{val}</div>
      </span>
      <ExternalLink size={11} style={{ color:"rgba(255,255,255,0.15)" }} />
    </a>
  );
}

// ═══════════════════════════ MAIN PORTFOLIO ══════════════════════════

export default function Portfolio() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed,   setTyped]   = useState("");
  const [tab,     setTab]     = useState("Frontend");
  const [statsOn, setStatsOn] = useState(false);
  const [navId,   setNavId]   = useState("home");
  const [form,    setForm]    = useState({ name:"", email:"", msg:"" });
  const statsRef = useRef(null);

  // ── Fonts + CSS keyframes ──────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=JetBrains+Mono:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    const s = document.createElement("style");
    s.textContent = `
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      ::-webkit-scrollbar { width:5px; }
      ::-webkit-scrollbar-track  { background:#050505; }
      ::-webkit-scrollbar-thumb  { background:#1c1c1c; border-radius:10px; }
      html { scroll-behavior:smooth; }
      @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
      @keyframes a1 { 0%{transform:translate(-50%,-50%)scale(1)rotate(0deg)} 50%{transform:translate(-44%,-56%)scale(1.18)rotate(180deg)} 100%{transform:translate(-50%,-50%)scale(1)rotate(360deg)} }
      @keyframes a2 { 0%{transform:translate(-50%,-50%)scale(1)rotate(0deg)} 50%{transform:translate(-56%,-44%)scale(0.86)rotate(-180deg)} 100%{transform:translate(-50%,-50%)scale(1)rotate(-360deg)} }
      @keyframes badge-glow { 0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,0)} 55%{box-shadow:0 0 22px 6px rgba(0,212,255,0.12)} }
      @keyframes dot-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.45)} }
      @keyframes card-in { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
      .blink { animation:blink 1s ease-in-out infinite; }
      .float { animation:float 7s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
    return () => { link.remove(); s.remove(); };
  }, []);

  // ── Typing effect ─────────────────────────────────────────────────
  useEffect(() => {
    const role = ROLES[roleIdx];
    let i = 0, del = false, t;
    const run = () => {
      if (!del) { setTyped(role.slice(0, ++i)); if (i === role.length) { del = true; t = setTimeout(run, 2200); return; } }
      else      { setTyped(role.slice(0, --i)); if (i === 0) { setRoleIdx(p => (p + 1) % ROLES.length); return; } }
      t = setTimeout(run, del ? 42 : 80);
    };
    t = setTimeout(run, 200);
    return () => clearTimeout(t);
  }, [roleIdx]);

  // ── Stats trigger ─────────────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Active section nav ────────────────────────────────────────────
  useEffect(() => {
    const ids = ["home","about","skills","projects","contact"];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setNavId(e.target.id); }),
      { threshold: 0.35 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const v0 = useCounter(STATS[0].value, statsOn);
  const v1 = useCounter(STATS[1].value, statsOn);
  const v2 = useCounter(STATS[2].value, statsOn);
  const v3 = useCounter(STATS[3].value, statsOn);
  const SV  = [v0, v1, v2, v3];

  const BG   = "#050505";
  const GL   = "rgba(255,255,255,0.03)";
  const BDR  = "rgba(255,255,255,0.08)";
  const BLUE = "#00D4FF";
  const VIO  = "#7C3AED";
  const GRD  = "linear-gradient(135deg,#00D4FF,#7C3AED)";

  const navBtn = (id) => ({
    background: navId === id ? "rgba(0,212,255,0.09)" : "transparent",
    border:"none", cursor:"pointer",
    color: navId === id ? BLUE : "rgba(255,255,255,0.48)",
    fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500,
    padding:"8px 18px", borderRadius:100, textTransform:"capitalize", transition:"all 0.25s",
  });

  return (
    <div style={{ background:BG, color:"#fff", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>
      <Cursor />

      {/* ══════════════════════════ NAV ══════════════════════════════ */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, padding:"14px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(5,5,5,0.88)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div onClick={() => scrollTo("home")} style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, background:GRD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", cursor:"pointer", userSelect:"none" }}>GY.</div>
        <div style={{ display:"flex", gap:2 }}>
          {["home","about","skills","projects","contact"].map(id =>
            <button key={id} onClick={() => scrollTo(id)} style={navBtn(id)}>{id}</button>
          )}
        </div>
        <a href="https://github.com/GauravYadav1430" target="_blank" rel="noreferrer"
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:100, background:GL, border:`1px solid ${BDR}`, color:"#fff", textDecoration:"none", fontSize:13, transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.09)"}
          onMouseLeave={e => e.currentTarget.style.background=GL}>
          <FiGithub size={15} /> GitHub
        </a>
      </nav>

      {/* ══════════════════════════ HERO ══════════════════════════════ */}
      <section id="home" style={{ minHeight:"100vh", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"120px 48px 80px" }}>
        <ParticleCanvas />

        {/* Aurora blobs */}
        <div style={{ position:"absolute", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,255,0.09)0%,transparent 70%)", top:"25%", left:"18%", transform:"translate(-50%,-50%)", animation:"a1 22s ease-in-out infinite", pointerEvents:"none", filter:"blur(50px)" }} />
        <div style={{ position:"absolute", width:900, height:900, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.08)0%,transparent 70%)", top:"65%", left:"72%", transform:"translate(-50%,-50%)", animation:"a2 28s ease-in-out infinite", pointerEvents:"none", filter:"blur(60px)" }} />

        {/* Grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.022)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022)1px,transparent 1px)", backgroundSize:"64px 64px", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:840, margin:"0 auto" }}>
          {/* Status badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"7px 20px", borderRadius:100, background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.22)", color:BLUE, fontSize:12, marginBottom:38, fontFamily:"'JetBrains Mono',monospace", animation:"badge-glow 3s ease-in-out infinite" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:BLUE, display:"inline-block", animation:"dot-pulse 2s ease-in-out infinite" }} />
            Open to Opportunities · NIT Jalandhar, IN
          </div>

          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, color:"rgba(255,255,255,0.32)", letterSpacing:4, textTransform:"uppercase", marginBottom:14 }}>Hi, I'm</div>

          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(56px,9.5vw,108px)", lineHeight:0.92, letterSpacing:-3, color:"#fff", marginBottom:14 }}>
            Gaurav<br />
            <span style={{ background:GRD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Yadav</span>
          </h1>

          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(16px,2.4vw,26px)", marginBottom:28, minHeight:"2.2em", display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>
            <span style={{ background:GRD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{typed}</span>
            <span className="blink" style={{ color:BLUE }}>|</span>
          </div>

          <p style={{ color:"rgba(255,255,255,0.44)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.9, maxWidth:530, margin:"0 auto 52px" }}>
            Building intelligent software that solves real-world problems. I design, build, and deploy scalable applications, AI systems, and digital experiences.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:44 }}>
            <button onClick={() => scrollTo("projects")}
              style={{ padding:"15px 34px", borderRadius:100, border:"none", cursor:"pointer", background:GRD, color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, display:"flex", alignItems:"center", gap:8, boxShadow:"0 0 40px rgba(0,212,255,0.22)", transition:"all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 50px rgba(0,212,255,0.42)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 0 40px rgba(0,212,255,0.22)"; }}>
              View Projects <ArrowRight size={16} />
            </button>
            <a href="https://new-portfolio-sable-iota.vercel.app" target="_blank" rel="noreferrer"
              style={{ padding:"15px 34px", borderRadius:100, background:GL, border:`1px solid ${BDR}`, color:"rgba(255,255,255,0.78)", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:15, textDecoration:"none", display:"flex", alignItems:"center", gap:8, transition:"all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.background=GL; e.currentTarget.style.borderColor=BDR; }}>
              <Globe size={15} /> Live Portfolio
            </a>
          </div>

          {/* Social links */}
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            {[
              { icon:<FiGithub size={17}/>,   href:"https://github.com/GauravYadav1430" },
              { icon:<FiLinkedin size={17}/>, href:"https://www.linkedin.com/in/gaurav-yadav-b016972a6/" },
              { icon:<Mail size={17}/>,     href:"mailto:gauravyadav14370@gmail.com" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                style={{ width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:GL, border:`1px solid ${BDR}`, color:"rgba(255,255,255,0.5)", textDecoration:"none", transition:"all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(0,212,255,0.1)"; e.currentTarget.style.color=BLUE; e.currentTarget.style.borderColor="rgba(0,212,255,0.32)"; }}
                onMouseLeave={e => { e.currentTarget.style.background=GL; e.currentTarget.style.color="rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor=BDR; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <button onClick={() => scrollTo("about")} style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.22)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>scroll</span>
          <ChevronDown size={15} className="float" />
        </button>
      </section>

      {/* ══════════════════════════ ABOUT ═════════════════════════════ */}
      <section id="about" style={{ padding:"120px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:60 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", color:BLUE, fontSize:12, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>001 — About</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(34px,5vw,60px)", lineHeight:1.05 }}>The Story So Far</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1.15fr 0.85fr", gap:72, alignItems:"start" }}>
            {/* Bio */}
            <div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:25, fontWeight:700, color:"rgba(255,255,255,0.88)", lineHeight:1.45, marginBottom:22 }}>
                CS Engineer at NIT Jalandhar building at the intersection of AI, full-stack, and elegant design.
              </h3>
              <p style={{ color:"rgba(255,255,255,0.47)", lineHeight:1.9, fontSize:15, marginBottom:18 }}>
                I'm Gaurav, a Computer Science student (Roll No. 23103055) who bridges the gap between intelligent systems and beautiful user experiences — from training deep learning models to crafting pixel-perfect UIs.
              </p>
              <p style={{ color:"rgba(255,255,255,0.47)", lineHeight:1.9, fontSize:15, marginBottom:36 }}>
                My work spans competitive programming (75+ DSA solved), AI/ML with real-world accuracy metrics, and full-stack applications trusted by campus communities. I think in systems, build with precision, and ship with purpose.
              </p>
              <div style={{ display:"flex", gap:12 }}>
                <a href="https://github.com/GauravYadav1430" target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:7, textDecoration:"none", padding:"12px 22px", borderRadius:100, border:"1px solid rgba(0,212,255,0.3)", color:BLUE, fontSize:14, transition:"all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(0,212,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <FiGithub size={14} /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/gaurav-yadav-b016972a6/" target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:7, textDecoration:"none", padding:"12px 22px", borderRadius:100, border:`1px solid ${BDR}`, color:"rgba(255,255,255,0.58)", fontSize:14, transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.58)"; }}>
                  <FiLinkedin size={14} /> LinkedIn
                </a>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ paddingLeft:28, position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:10, bottom:10, width:1, background:`linear-gradient(180deg,${BLUE},${VIO} 65%,transparent)` }} />
              {TIMELINE.map((item, i) => {
                const dc = { now:BLUE, ai:VIO, win:"#F59E0B" }[item.type] || "rgba(255,255,255,0.2)";
                return (
                  <div key={i} style={{ position:"relative", marginBottom:32 }}>
                    <div style={{ position:"absolute", left:-34, top:6, width:11, height:11, borderRadius:"50%", background:dc, border:`2px solid ${dc}`, boxShadow: item.type==="now" ? `0 0 14px ${dc}` : "none" }} />
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:BLUE, letterSpacing:1, marginBottom:4, opacity:0.72 }}>{item.year}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"#fff", marginBottom:5 }}>{item.title}</div>
                    <div style={{ color:"rgba(255,255,255,0.38)", fontSize:13, lineHeight:1.72 }}>{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ marginTop:80, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
            {STATS.map((s, i) => (
              <div key={i}
                style={{ textAlign:"center", padding:"30px 20px", background:GL, border:`1px solid ${BDR}`, borderRadius:20, backdropFilter:"blur(12px)", transition:"border-color 0.3s, transform 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,212,255,0.38)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=BDR; e.currentTarget.style.transform="none"; }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:46, background:GRD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>{SV[i]}{s.suffix}</div>
                <div style={{ color:"rgba(255,255,255,0.37)", fontSize:13, marginTop:7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ SKILLS ════════════════════════════ */}
      <section id="skills" style={{ padding:"120px 48px", background:"rgba(255,255,255,0.013)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:60 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", color:VIO, fontSize:12, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>002 — Skills</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(34px,5vw,60px)", lineHeight:1.05 }}>Tech Arsenal</h2>
          </div>

          <div style={{ display:"flex", gap:8, marginBottom:44, flexWrap:"wrap" }}>
            {Object.keys(SKILL_TABS).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 24px", borderRadius:100, cursor:"pointer", background: tab===t ? GRD : GL, border: tab===t ? "none" : `1px solid ${BDR}`, color: tab===t ? "#fff" : "rgba(255,255,255,0.48)", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:14, transition:"all 0.3s", boxShadow: tab===t ? "0 4px 24px rgba(0,212,255,0.2)" : "none" }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {SKILL_TABS[tab].map((s, i) => <SkillBar key={s.name} name={s.name} pct={s.pct} delay={i * 90} />)}
          </div>

          <div style={{ marginTop:72 }}>
            <div style={{ textAlign:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.22)", letterSpacing:3, textTransform:"uppercase", marginBottom:28 }}>Core Stack</div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
              {["React","Node.js","Python","JavaScript","TypeScript","TensorFlow.js","C++","Java","Claude API","MongoDB","Git","Scikit-learn","OpenCV","Vercel","Express"].map(t => (
                <div key={t} style={{ padding:"8px 18px", borderRadius:100, background:GL, border:`1px solid ${BDR}`, color:"rgba(255,255,255,0.47)", fontSize:12, fontFamily:"'JetBrains Mono',monospace", transition:"all 0.25s", cursor:"default" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(0,212,255,0.08)"; e.currentTarget.style.color=BLUE; e.currentTarget.style.borderColor="rgba(0,212,255,0.28)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=GL; e.currentTarget.style.color="rgba(255,255,255,0.47)"; e.currentTarget.style.borderColor=BDR; }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ PROJECTS ══════════════════════════ */}
      <section id="projects" style={{ padding:"120px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:60 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", color:BLUE, fontSize:12, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>003 — Projects</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(34px,5vw,60px)", lineHeight:1.05 }}>What I've Built</h2>
          </div>

          {/* ── Featured ── */}
          <div style={{ marginBottom:28, background:GL, border:"1px solid rgba(0,212,255,0.22)", borderRadius:28, padding:"44px 48px", position:"relative", overflow:"hidden", backdropFilter:"blur(16px)" }}>
            <div style={{ position:"absolute", top:-80, right:-80, width:340, height:340, borderRadius:"50%", background:BLUE, opacity:0.05, filter:"blur(70px)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:VIO, opacity:0.06, filter:"blur(60px)", pointerEvents:"none" }} />

            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:BLUE, letterSpacing:3, textTransform:"uppercase", marginBottom:24 }}>★ Featured Project</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>
              <div>
                <div style={{ fontSize:48, marginBottom:14 }}>🌿</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:38, color:"#fff", marginBottom:6, lineHeight:1.1 }}>AgriVision</h3>
                <div style={{ color:BLUE, fontFamily:"'JetBrains Mono',monospace", fontSize:13, marginBottom:22 }}>AI-Powered Crop Disease Detection System</div>
                <p style={{ color:"rgba(255,255,255,0.47)", lineHeight:1.88, marginBottom:28, fontSize:15 }}>
                  Dual AI pipeline combining TensorFlow.js CNN (MobileNetV2) with Claude Vision API for real-time potato leaf disease detection. Side-by-side model comparison, session accuracy tracking, and resolved CORS challenges for local file serving.
                </p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28 }}>
                  {["TensorFlow.js","Claude API","React","Python","OpenCV"].map(t =>
                    <span key={t} style={{ padding:"5px 14px", borderRadius:100, background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.28)", color:BLUE, fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>
                  )}
                </div>
                <div style={{ display:"flex", gap:12 }}>
                  <a href="https://github.com/GauravYadav1430/agrivision" target="_blank" rel="noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", padding:"13px 26px", borderRadius:100, background:GRD, color:"#fff", fontSize:14, fontFamily:"'Syne',sans-serif", fontWeight:600, boxShadow:"0 4px 24px rgba(0,212,255,0.22)", transition:"opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    <FiGithub size={15} /> View Code
                  </a>
                  <a href="https://agrivision-1e1f.onrender.com/" target="_blank" rel="noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", padding:"13px 26px", borderRadius:100, background:GL, border:`1px solid ${BDR}`, color:"rgba(255,255,255,0.68)", fontSize:14, fontFamily:"'Syne',sans-serif", fontWeight:600, transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background=GL; e.currentTarget.style.color="rgba(255,255,255,0.68)"; }}>
                    <ExternalLink size={15} /> Live Demo
                  </a>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[{v:"95%+",l:"Detection Accuracy"},{v:"2×",l:"AI Model Comparison"},{v:"Real-time",l:"Inference Speed"},{v:"CORS-free",l:"Local File Support"}].map(({v,l}) => (
                  <div key={l}
                    style={{ padding:"24px 18px", borderRadius:16, textAlign:"center", background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.16)", transition:"transform 0.25s, border-color 0.25s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor="rgba(0,212,255,0.38)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="rgba(0,212,255,0.16)"; }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, background:GRD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
                    <div style={{ color:"rgba(255,255,255,0.36)", fontSize:11, marginTop:6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Project grid ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {PROJECTS.filter(p => !p.featured).map(p => <ProjectCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CONTACT ═══════════════════════════ */}
      <section id="contact" style={{ padding:"120px 48px", background:"rgba(255,255,255,0.013)" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", color:VIO, fontSize:12, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>004 — Contact</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(34px,5vw,60px)", lineHeight:1.05, marginBottom:18 }}>Let's Build Together</h2>
            <p style={{ color:"rgba(255,255,255,0.43)", fontSize:16, maxWidth:460, margin:"0 auto" }}>Open to internships, freelance, and full-time roles. Let's create something exceptional.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
            {/* Info card */}
            <div style={{ padding:32, borderRadius:24, background:GL, border:`1px solid ${BDR}` }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:100, background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.22)", fontSize:11, color:BLUE, fontFamily:"'JetBrains Mono',monospace", marginBottom:22 }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:BLUE, animation:"dot-pulse 2s ease-in-out infinite" }} /> Available Now
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:22, marginBottom:4 }}>Gaurav Yadav</div>
              <div style={{ color:"rgba(255,255,255,0.36)", fontSize:13, marginBottom:28 }}>NIT Jalandhar · Punjab, India 🇮🇳</div>
              <ContactLink icon={<Mail size={15}/>}     label="Email"     val="gauravyadav14370@gmail.com"  href="mailto:gauravyadav14370@gmail.com" />
              <ContactLink icon={<FiGithub size={15}/>}   label="GitHub"    val="GauravYadav1430"             href="https://github.com/GauravYadav1430" />
              <ContactLink icon={<FiLinkedin size={15}/>} label="LinkedIn"  val="gaurav-yadav-b016972a6"     href="https://www.linkedin.com/in/gaurav-yadav-b016972a6/" />
              <ContactLink icon={<Globe size={15}/>}    label="Portfolio" val="portfolio.vercel.app"        href="https://new-portfolio-sable-iota.vercel.app" />
            </div>

            {/* Form */}
            <div style={{ padding:32, borderRadius:24, background:GL, border:`1px solid ${BDR}` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:19, marginBottom:24 }}>Send a Message</div>
              {[{k:"name",lbl:"Your Name",ph:"John Doe",type:"text"},{k:"email",lbl:"Email Address",ph:"john@example.com",type:"email"}].map(f => (
                <div key={f.k} style={{ marginBottom:14 }}>
                  <label style={{ display:"block", color:"rgba(255,255,255,0.28)", fontSize:10, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:7 }}>{f.lbl}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.k]} onChange={e => setForm(p => ({...p,[f.k]:e.target.value}))}
                    style={{ width:"100%", padding:"13px 16px", borderRadius:11, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor="rgba(0,212,255,0.42)"}
                    onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                </div>
              ))}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"block", color:"rgba(255,255,255,0.28)", fontSize:10, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:7 }}>Message</label>
                <textarea placeholder="Let's build something amazing..." value={form.msg} onChange={e => setForm(p => ({...p,msg:e.target.value}))} rows={4}
                  style={{ width:"100%", padding:"13px 16px", borderRadius:11, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontSize:14, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor="rgba(0,212,255,0.42)"}
                  onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
              </div>
              <a href={`mailto:gauravyadav14370@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.msg)}`}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", padding:"15px", borderRadius:11, background:GRD, color:"#fff", fontSize:15, fontFamily:"'Syne',sans-serif", fontWeight:700, textDecoration:"none", boxShadow:"0 4px 28px rgba(0,212,255,0.22)", transition:"box-shadow 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow="0 8px 44px rgba(0,212,255,0.42)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="0 4px 28px rgba(0,212,255,0.22)"}>
                <Send size={15} /> Send Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ════════════════════════════ */}
      <footer style={{ padding:"36px 48px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:GRD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>GY.</div>
        <div style={{ color:"rgba(255,255,255,0.22)", fontSize:13 }}>© 2026 Gaurav Yadav · Built with ❤️ and ☕</div>
        <div style={{ display:"flex", gap:10 }}>
          {[{icon:<FiGithub size={15}/>,href:"https://github.com/GauravYadav1430"},{icon:<FiLinkedin size={15}/>,href:"https://www.linkedin.com/in/gaurav-yadav-b016972a6/"}].map((s,i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer"
              style={{ width:34, height:34, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:GL, border:`1px solid ${BDR}`, color:"rgba(255,255,255,0.42)", textDecoration:"none", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color=BLUE; e.currentTarget.style.borderColor="rgba(0,212,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.42)"; e.currentTarget.style.borderColor=BDR; }}>
              {s.icon}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
