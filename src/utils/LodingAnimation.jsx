import { useEffect, useState } from "react";

export default function LodingAnimation() {
    const cards = [
        { id: 1, title: "Creating Your App", file: "app/globals.css" },
        { id: 2, title: "Building UI Layout", file: "app/layout.js" },
        { id: 3, title: "Rendering Home Page", file: "app/page.js" },
    ];

    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState("card");

    useEffect(() => {
        let timer;
        if (phase === "card") {
            timer = setTimeout(() => setPhase("lines"), 900);
        } else if (phase === "lines") {
            timer = setTimeout(() => setPhase("boxes"), 1600);
        } else if (phase === "boxes") {
            timer = setTimeout(() => {
                setIndex((prev) => (prev + 1) % cards.length);
                setPhase("card");
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [phase]);



    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative p-4">

            <style>{`
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(30px) scale(.88); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-anim { animation: cardIn 0.9s cubic-bezier(.18,.9,.22,1) forwards; }

        @keyframes lineIn {
          0% { transform: translateX(-40px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes boxGrow {
          0% { transform: scale(.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

            <div className="relative w-full max-w-[1250px] flex items-center justify-center">

                {cards.map((c, i) => {
                    const isCenter = i === index;
                    const isLeft = i === (index - 1 + cards.length) % cards.length;
                    const isRight = i === (index + 1) % cards.length;

                    return (
                        <div
                            key={c.id}
                            className={`
                absolute rounded-3xl border backdrop-blur-xl shadow-2xl
                ${isCenter ? "border-white" : "border-white/20"}
                bg-white/5 overflow-hidden
                transition-all duration-[950ms]
                ${isCenter ? "z-30 scale-100 opacity-100" : "z-10 scale-[.70] opacity-30 blur-[2px]"}
                ${isLeft ? "lg:-translate-x-[420px] md:-translate-x-[280px]" : ""}
                ${isRight ? "lg:translate-x-[420px] md:translate-x-[280px]" : ""}
                ${isCenter && phase === "card" ? "card-anim" : ""}
              `}
                            style={{
                                width: "min(90vw, 520px)",
                                height: "min(88vh, 500px)",
                            }}
                        >

                            {/* TOP BAR */}
                            <div className="px-6 pt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-white"></div>
                                    <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                                    <div className="w-3 h-3 rounded-full bg-blue-400 border border-white"></div>
                                </div>
                                <p className="text-sm text-white">{c.file}</p>
                            </div>

                            {/* TITLE */}
                            {isCenter && (
                                <p className="text-center mt-4 text-2xl font-semibold text-white tracking-wide">
                                    {c.title}
                                </p>
                            )}

                            {/* LINES */}
                            {isCenter && phase === "lines" && (
                                <div className="px-6 mt-6 space-y-3">
                                    {Array.from({ length: 14 }).map((_, line) => (
                                        <div
                                            key={line}
                                            className="h-4 rounded-lg bg-white/90 opacity-0"
                                            style={{
                                                width: `${70 + Math.random() * 25}%`,
                                                animation: `lineIn 1s ease forwards`,
                                                animationDelay: `${line * 120}ms`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            )}

                            {/* BOXES (responsive layout) */}
                            {isCenter && phase === "boxes" && (
                                <div className="px-6 pt-2 pb-4 mt-6 w-full h-[calc(100%-120px)] flex flex-col gap-3">
                                    {/* Card 1 → 4 boxes */}
                                    {index === 0 && (
                                        <>
                                            <div className="flex gap-3 flex-1">
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `0ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `140ms` }}></div>
                                            </div>
                                            <div className="flex gap-3 flex-1">
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `280ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `420ms` }}></div>
                                            </div>
                                        </>
                                    )}

                                    {/* Card 2 → 5 boxes */}
                                    {index === 1 && (
                                        <>
                                            <div className="flex gap-3 flex-1">
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `0ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `140ms` }}></div>
                                            </div>
                                            <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `280ms` }}></div>
                                            <div className="flex gap-3 flex-1">
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `420ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `560ms` }}></div>
                                            </div>
                                        </>
                                    )}

                                    {/* Card 3 → 6 boxes */}
                                    {index === 2 && (
                                        <>
                                            <div className="flex gap-3 flex-1">
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `0ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `140ms` }}></div>
                                            </div>
                                            <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `280ms` }}></div>
                                            <div className="flex gap-3 flex-1">
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `420ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `560ms` }}></div>
                                                <div className="flex-1 rounded-2xl border border-white border-dashed opacity-0" style={{ animation: `boxGrow .7s forwards`, animationDelay: `700ms` }}></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}



                        </div>
                    );
                })}
            </div>

            {/* DOTS */}
            <div className="absolute bottom-10 md:bottom-12 flex gap-3">
                {cards.map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${i === index ? "scale-125" : "opacity-40"}`}
                        style={{
                            background: i === 0 ? "#F6C84C" : i === 1 ? "#F44444" : "#4EA3F5",
                        }}
                    ></div>
                ))}
            </div>

        </div>
    );
}
