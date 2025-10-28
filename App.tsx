import React from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, BookOpen, Files, Search, PlayCircle, CheckCircle2, Link as LinkIcon } from "lucide-react";

const IRODOV_CHAPTERS = [
  { code: "1", title: "Vectors & Basic Mathematics", href: "#" },
  { code: "2", title: "Kinematics", href: "#" },
  { code: "3", title: "Dynamics", href: "#" },
  { code: "4", title: "Work & Energy", href: "#" },
  { code: "5", title: "Momentum & Systems", href: "#" },
  { code: "6", title: "Rigid Body / Rotation", href: "#" },
  { code: "7", title: "Gravitation", href: "#" },
  { code: "8", title: "Oscillations & Waves", href: "#" },
  { code: "9", title: "Electrostatics", href: "#" },
  { code: "10", title: "Current Electricity", href: "#" },
  { code: "11", title: "Magnetism & EMI", href: "#" },
  { code: "12", title: "Optics", href: "#" },
  { code: "13", title: "Modern Physics", href: "#" },
];

const PATHFINDER_CHAPTERS = [
  { code: "1", title: "Kinematics & Vectors", href: "#" },
  { code: "2", title: "Newton's Laws", href: "#" },
  { code: "3", title: "Work, Power & Energy", href: "#" },
  { code: "4", title: "Centre of Mass & Collision", href: "#" },
  { code: "5", title: "Rotational Dynamics", href: "#" },
  { code: "6", title: "Gravitation", href: "#" },
  { code: "7", title: "Elasticity & SHM", href: "#" },
  { code: "8", title: "Fluid Mechanics", href: "#" },
  { code: "9", title: "Waves & Sound", href: "#" },
  { code: "10", title: "Electrostatics", href: "#" },
  { code: "11", title: "Current & Capacitance", href: "#" },
  { code: "12", title: "Magnetic Effects of Current", href: "https://docs.google.com/presentation/d/1vF7PNYfuG8kPm7AHZgSyZOM05sXaSi0k/edit?usp=sharing&ouid=103004252800691269516&rtpof=true&sd=true" },
  { code: "12A", title: "Electromagnetic Induction (EMI)", href: "#" },
  { code: "13", title: "AC & EM Waves", href: "#" },
  { code: "14", title: "Optics", href: "#" },
  { code: "15", title: "Modern Physics", href: "#" },
];

const JEE_PYQ_CHAPTERS = [
  { code: "1", title: "Kinematics", href: "#" },
  { code: "2", title: "Newton's Laws of Motion", href: "#" },
  { code: "3", title: "Work, Energy & Power", href: "#" },
  { code: "4", title: "System of Particles & Momentum", href: "#" },
  { code: "5", title: "Rotational Motion", href: "#" },
  { code: "6", title: "Gravitation", href: "#" },
  { code: "7", title: "Simple Harmonic Motion & Waves", href: "#" },
  { code: "8", title: "Thermal Physics & Thermodynamics", href: "#" },
  { code: "9", title: "Electrostatics", href: "#" },
  { code: "10", title: "Current Electricity & Capacitance", href: "#" },
  { code: "11", title: "Magnetic Effects of Current & Magnetism", href: "#" },
  { code: "12", title: "EMI & AC", href: "#" },
  { code: "13", title: "Optics (Ray + Wave)", href: "#" },
  { code: "14", title: "Modern Physics", href: "#" },
];

const WHATSAPP_NUMBER = "919330810498";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

function computeChapterProgress(solved: boolean, testScore: number) {
  const solvedPercent = solved ? 98 : 0;
  return Math.round((solvedPercent + (testScore || 0)) / 2);
}

function readStudentsHelped() {
  try { return Number(localStorage.getItem('sd_students_helped') || '0') || 0; } catch { return 0; }
}
function writeStudentsHelped(v: number) {
  try { localStorage.setItem('sd_students_helped', String(v)); } catch {}
}
function bumpStudentsHelped(delta = 1) {
  const v = readStudentsHelped() + delta;
  writeStudentsHelped(v);
  return v;
}

function SectionHeader({ icon, title, subtitle }:{icon: React.ReactNode; title: string; subtitle?: string}){
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          {icon} {title}
        </h2>
        {subtitle && <p className="text-neutral-300 mt-1 text-sm md:text-base">{subtitle}</p>}
      </div>
      <div className="hidden md:flex items-center gap-4">
        <a href="#how" className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
          <LinkIcon className="w-4 h-4" /> How to get access
        </a>
      </div>
    </div>
  );
}

function ProgressBar({ value }:{value:number}){
  return (
    <div className="w-full h-3 bg-neutral-800 rounded-xl overflow-hidden">
      <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export default function App(){
  const [q1, setQ1] = React.useState("");
  const [q2, setQ2] = React.useState("");
  const [chapterState, setChapterState] = React.useState<Record<string,{solved:boolean; testScore:number}>>(()=>{
    const s: Record<string,{solved:boolean; testScore:number}> = {};
    IRODOV_CHAPTERS.forEach(c => { s[c.code] = { solved:false, testScore:0 }; });
    return s;
  });
  const [activeTest, setActiveTest] = React.useState<null | { chapter: { code:string; title:string; sdHref?:string } }>(null);
  const [studentsHelped, setStudentsHelped] = React.useState(0);
  React.useEffect(()=>{ setStudentsHelped(readStudentsHelped()); },[]);

  const trackHelpedClick = React.useCallback(()=>{
    const v = bumpStudentsHelped(1);
    setStudentsHelped(v);
  },[]);

  const unlocked = Object.values(chapterState).every(s => s.solved && s.testScore >= 60);

  function openIrodovChapter(ch:any){
    setChapterState(prev => ({...prev, [ch.code]: { ...prev[ch.code], solved:true }}));
    trackHelpedClick();
    if (ch.href && ch.href !== "#") window.open(ch.href, "_blank");
  }
  function openPathfinderChapter(ch:any){
    trackHelpedClick();
    if (ch.href && ch.href !== "#") window.open(ch.href, "_blank");
  }
  function attemptSDForChapter(ch:any){
    const st = chapterState[ch.code] || { solved:false, testScore:0 };
    if (!st.solved){ alert("You must open/solve the Irodov solutions for this chapter first."); return; }
    setActiveTest({ chapter: ch });
  }
  function chapterProgressPercent(code:string){
    const s = chapterState[code] || { solved:false, testScore:0 };
    return computeChapterProgress(s.solved, s.testScore);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur border-b border-neutral-800/60 bg-neutral-950/70">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 grid place-content-center font-bold">SD</div>
            <span className="font-semibold tracking-wide">Soumil Dev Sir — JEE Physics</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#irodov" className="hover:text-white">I.E. Irodov</a>
            <a href="#pathfinder" className="hover:text-white">Pathfinder</a>
            <a href="#jee-pyq" className="hover:text-white">JEE PYQ Solutions</a>
            <a href="#sdq" className="hover:text-white">SD Questions</a>
            <a href="#videos" className="hover:text-white">Video Solutions</a>
            <a className="hover:text-white" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" onClick={trackHelpedClick}>WhatsApp</a>
            <span className="ml-2 px-2 py-1 rounded-lg border border-neutral-800 text-xs text-neutral-300">Students helped: {studentsHelped}</span>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-extrabold leading-tight">
            I.E. Irodov • Pathfinder • JEE Advanced —
            <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent"> solutions & video explanations</span>
          </motion.h1>
          <p className="mt-4 max-w-2xl text-neutral-300">Hand-picked solutions by Soumil Dev Sir. Complete Irodov to unlock <span className="font-medium">SD Questions</span>.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        <section id="irodov">
          <SectionHeader icon={<BookOpen className="w-6 h-6" />} title="I.E. Irodov — Chapterwise Solutions" subtitle="Direct links to Google Drive folders/files." />
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input value={q1} onChange={(e) => setQ1(e.target.value)} placeholder="Search Irodov chapters…" className="bg-transparent outline-none text-sm flex-1" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {IRODOV_CHAPTERS.map((c) => (
              <div key={c.code} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Ch {c.code}</div>
                    <div className="mt-1 font-medium">{c.title}</div>
                    <div className="mt-3 text-xs text-neutral-400">Google Drive →</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => openIrodovChapter(c)} className="px-3 py-1 rounded-lg bg-white text-neutral-900 text-sm">Open</button>
                    <a onClick={() => trackHelpedClick()} href="#" className="text-xs text-neutral-300 hover:underline">Questions relevant for JEE</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pathfinder">
          <SectionHeader icon={<Files className="w-6 h-6" />} title="Pathfinder — Chapterwise Solutions" subtitle="Click to open chapter solutions in Google Drive." />
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input value={q2} onChange={(e) => setQ2(e.target.value)} placeholder="Search Pathfinder chapters…" className="bg-transparent outline-none text-sm flex-1" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {PATHFINDER_CHAPTERS.map((c) => (
              <div key={c.code} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Ch {c.code}</div>
                    <div className="mt-1 font-medium">{c.title}</div>
                    <div className="mt-3 text-xs text-neutral-400">Google Drive →</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => openPathfinderChapter(c)} className="px-3 py-1 rounded-lg bg-white text-neutral-900 text-sm">Open</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="sdq">
          <SectionHeader icon={unlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />} title="SD Questions — Special JEE Advanced Sets" subtitle="Unlocks per chapter after Irodov + chapter test (60% required)." />
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {IRODOV_CHAPTERS.map((c) => {
              const pct = chapterProgressPercent(c.code);
              const st = chapterState[c.code] || { solved:false, testScore:0 };
              return (
                <div key={c.code} className={`rounded-2xl border ${pct >= 100 ? 'border-sky-600' : 'border-neutral-800'} bg-neutral-900/50 p-4`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">Ch {c.code} — {c.title}</div>
                      <div className="text-xs text-neutral-400 mt-1">Irodov solved: {st.solved ? 'Yes':'No'} | Last test: {st.testScore}%</div>
                    </div>
                    <div className="text-sm font-semibold">{pct}%</div>
                  </div>
                  <div className="mt-3"><ProgressBar value={pct} /></div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => attemptSDForChapter(c)} className="px-3 py-1 rounded-lg bg-white text-neutral-900 text-sm">Attempt SD Test / Unlock</button>
                    <a href={c.sdHref || '#'} onClick={trackHelpedClick} target="_blank" rel="noreferrer" className={`px-3 py-1 rounded-lg border text-sm ${pct >= 100 ? 'border-sky-600' : 'border-neutral-700 text-neutral-300'}`}>Open SD Drive</a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="jee-pyq">
          <SectionHeader icon={<CheckCircle2 className="w-6 h-6" />} title="JEE Advanced — Previous Year Solutions" subtitle="Chapterwise solutions. Click to open Google Drive." />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JEE_PYQ_CHAPTERS.map((c) => (
              <div key={c.code} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Ch {c.code}</div>
                    <div className="mt-1 font-medium">{c.title}</div>
                    <div className="mt-3 text-xs text-neutral-400">Google Drive →</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => { trackHelpedClick(); if (c.href && c.href !== '#') window.open(c.href, '_blank'); }} className="px-3 py-1 rounded-lg bg-white text-neutral-900 text-sm">Open</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="videos">
          <SectionHeader icon={<PlayCircle className="w-6 h-6" />} title="Video Solutions" subtitle="Playlist available only for SD Advanced Drills." />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["SD Advanced Drills"].map((name) => (
              <a key={name} href="#" onClick={trackHelpedClick} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-neutral-600 transition">
                <div className="text-xs text-neutral-400">Playlist</div>
                <div className="mt-1 font-medium">{name}</div>
                <div className="mt-3 text-xs text-neutral-400">YouTube →</div>
              </a>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h3 className="text-xl font-semibold">How to unlock SD Questions (per chapter)</h3>
          <ol className="list-decimal ml-5 mt-3 space-y-2 text-neutral-300">
            <li>Solve all <strong>I.E. Irodov</strong> questions of that chapter.</li>
            <li>Appear for a <strong>chapter-end test</strong> when you click SD Questions.</li>
            <li>Score <strong>≥ 60%</strong>. Access is enabled for that chapter.</li>
          </ol>
          <p className="text-sm text-neutral-400 mt-4">Need help? WhatsApp: <a href={WHATSAPP_LINK} onClick={trackHelpedClick} target="_blank" rel="noreferrer" className="underline">+91 93308 10498</a></p>
        </section>
      </main>
    </div>
  );
}

function TestModal({ chapter, onClose, onSubmit }:{ chapter:any; onClose:()=>void; onSubmit:(score:number)=>void }){
  const [answers, setAnswers] = React.useState<Record<number,string>>({});
  const questions = React.useMemo(()=> makeMockQuestions(chapter), [chapter]);
  function handleSubmit(){
    const correct = questions.reduce((acc:any,q:any,idx:number)=> acc + ((answers[idx]||'')===q.correct?1:0), 0);
    const score = Math.round((correct / questions.length) * 100);
    onSubmit(score);
  }
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 grid place-items-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Chapter Test — {chapter.title}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">Close</button>
        </div>
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-auto pr-1">
          {questions.map((q:any, idx:number) => (
            <div key={idx} className="rounded-xl border border-neutral-800 p-4">
              <div className="font-medium">Q{idx + 1}. {q.text}</div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {q.options.map((op:any) => (
                  <label key={op.key} className={`cursor-pointer rounded-lg border ${((answers[idx]||'')===op.key)?'border-sky-500':'border-neutral-800'} p-2 flex items-center gap-2`}>
                    <input type="radio" name={`q-${idx}`} value={op.key} checked={(answers[idx]||'')===op.key} onChange={()=> setAnswers(prev=>({...prev, [idx]: op.key}))} />
                    <span className="text-sm">{op.key}. {op.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">Score ≥ 60% to unlock this chapter's SD Questions.</p>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-white text-neutral-900 font-medium">Submit Test</button>
        </div>
      </div>
    </div>
  );
}

function makeMockQuestions(chapter:any){
  const base = [
    `A block of mass m on a smooth surface is pulled by a constant force F. Find acceleration (symbolic).`,
    `A particle moves in a circle of radius R with angular speed ω. What is its centripetal acceleration?`,
    `Two capacitors C and 2C in series across V. Charge on each is?`,
    `A body of mass m is dropped from height h. Ignore air resistance. Speed just before hitting?`,
    `A light ray incident at small angle θ on a plane mirror. Find deviation.`,
  ];
  const qs = [
    { text: base[0], options: [{key:'A',label:'F/m'},{key:'B',label:'m/F'},{key:'C',label:'F·m'},{key:'D',label:'0'}], correct: 'A' },
    { text: base[1], options: [{key:'A',label:'ω²R'},{key:'B',label:'ωR'},{key:'C',label:'R/ω'},{key:'D',label:'1/ω²R'}], correct: 'A' },
    { text: base[2], options: [{key:'A',label:'2CV'},{key:'B',label:'CV/2'},{key:'C',label:'2C·V/3'},{key:'D',label:'Same Q on both: Q = 2C·V/3'}], correct: 'B' },
    { text: base[3], options: [{key:'A',label:'√(2gh)'},{key:'B',label:'gh'},{key:'C',label:'2gh'},{key:'D',label:'h/2g'}], correct: 'A' },
    { text: base[4], options: [{key:'A',label:'2θ'},{key:'B',label:'θ'},{key:'C',label:'90°'},{key:'D',label:'0'}], correct: 'A' },
  ];
  return qs.sort(()=> Math.random() - 0.5);
}

function DevTestPanel(){
  const tests = [
    { name: 'No progress', input: { solved: false, testScore: 0 }, expect: 0 },
    { name: 'Solved only', input: { solved: true, testScore: 0 }, expect: 49 },
    { name: 'Solved + pass threshold', input: { solved: true, testScore: 60 }, expect: 79 },
    { name: 'Solved + perfect', input: { solved: true, testScore: 100 }, expect: 99 },
    { name: 'Test only (should be half)', input: { solved: false, testScore: 100 }, expect: 50 },
    { name: 'Solved + 30%', input: { solved: true, testScore: 30 }, expect: 64 },
    { name: 'Solved + 1% rounds to 50', input: { solved: true, testScore: 1 }, expect: 50 },
    { name: 'Solved + 59% rounds to 79', input: { solved: true, testScore: 59 }, expect: 79 },
    { name: 'Solved + 99% rounds to 99', input: { solved: true, testScore: 99 }, expect: 99 }
  ];
  const results = tests.map(t => {
    const got = computeChapterProgress(t.input.solved as any, t.input.testScore as any);
    return { ...t, got, pass: got === t.expect };
  });
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <h4 className="font-semibold">Dev Tests — Progress Calculator & Students Helped</h4>
      <ul className="mt-2 text-sm">
        {results.map((r, idx) => (
          <li key={idx} className={r.pass ? 'text-emerald-400' : 'text-rose-400'}>
            {r.pass ? 'PASS' : 'FAIL'} — {r.name}: expected {r.expect}, got {r.got}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm text-neutral-300">
        <button className="px-3 py-1 rounded-lg bg-white text-neutral-900" onClick={() => {
          const before = readStudentsHelped();
          const after = bumpStudentsHelped(1);
          alert(`Students helped incremented: ${before} → ${after}`);
        }}>
          Simulate Helped Click (dev)
        </button>
      </div>
    </section>
  );
}
