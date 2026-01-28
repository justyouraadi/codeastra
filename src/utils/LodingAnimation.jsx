import { useEffect, useState } from "react";

export default function ProjectCreationLobby() {
  const steps = [
    "Allocating workspace",
    "Installing dependencies",
    "Generating UI components",
    "Linking routes",
    "Optimizing build",
    "Finalizing deployment",
  ];

  const logs = [
    "✔ Workspace allocated",
    "✔ React environment ready",
    "✔ Tailwind configured",
    "✔ Routes mapped",
    "✔ Assets optimized",
    "⏳ Final checks running...",
  ];

  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [finalizing, setFinalizing] = useState(false);

  /* ---------------- PROGRESS ENGINE (~1 MIN) ---------------- */
  useEffect(() => {
    if (progress >= 100) {
      setFinalizing(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 100));
    }, 3000); // ~60 seconds total

    return () => clearInterval(interval);
  }, [progress]);

  /* ---------------- STEP TRACKING ---------------- */
  useEffect(() => {
    if (progress >= 100) return;
    setActiveStep(Math.floor((progress / 100) * steps.length));
  }, [progress]);

  return (
    <div className="relative w-screen h-screen bg-[#050505] text-white overflow-hidden">
      {/* AMBIENT GRID */}
      <div className="absolute inset-0 opacity-[0.06] animate-[gridMove_24s_linear_infinite] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:72px_72px]" />

      <style>{`
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 144px 144px; }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes breathe {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full">
        {/* LEFT – BUILD QUEUE */}
        <aside className="hidden md:block lg:w-[18%] md:w-[28%] border-r border-white/10 p-6 lg:p-8">
          <p className="text-xs tracking-[0.25em] text-white/50 mb-6">
            BUILD QUEUE
          </p>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all ${
                  i <= activeStep ? "opacity-100" : "opacity-30"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < activeStep
                      ? "bg-emerald-400"
                      : i === activeStep && !finalizing
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-white/30"
                  }`}
                />
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER – BUILD CORE */}
        <main className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          {/* CORE */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl animate-[pulse_3.5s_ease-in-out_infinite]" />
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full border border-white/30 flex items-center justify-center animate-[breathe_4.5s_ease-in-out_infinite]">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/95 text-black flex items-center justify-center text-lg md:text-xl font-semibold">
                {progress}%
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="text-center space-y-2 max-w-md">
            <p className="text-xl md:text-2xl font-medium">
              {finalizing ? "Final checks running…" : "Creating your project"}
            </p>
            <p className="text-sm text-white/60">
              {finalizing
                ? "Making sure everything is ready before launch."
                : "You can safely wait here while everything is prepared."}
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full max-w-[420px] md:max-w-[720px] h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* MOBILE STEP */}
          <div className="md:hidden text-sm text-white/60 mt-4">
            {finalizing
              ? "Final checks running…"
              : steps[activeStep] || "Preparing…"}
          </div>
        </main>

        {/* RIGHT – SYSTEM LOGS */}
        <aside className="hidden lg:block lg:w-[22%] border-l border-white/10 p-8">
          <p className="text-xs tracking-[0.25em] text-white/50 mb-6">
            SYSTEM LOGS
          </p>

          <div className="space-y-3 text-xs font-mono text-white/70">
            {logs.slice(0, finalizing ? logs.length : activeStep + 1).map(
              (log, i) => (
                <div key={i}>{log}</div>
              )
            )}
            <div className="animate-pulse">▌</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
