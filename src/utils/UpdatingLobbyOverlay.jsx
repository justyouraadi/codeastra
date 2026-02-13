import { useEffect, useState } from "react";

export default function UpdatingLobbyOverlay({ visible, statusMessage }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? 95 : p + 1));
      // 95 pe stop kar diya so backend complete kare
    }, 600);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">

        {/* Core */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-black/10 blur-2xl animate-pulse" />
          <div className="w-32 h-32 rounded-full border border-black/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
              {progress}%
            </div>
          </div>
        </div>

        {/* Dynamic Text */}
        <div className="text-center space-y-1">
          <p className="text-lg font-medium text-gray-900 transition-all duration-300">
            {statusMessage
              ? statusMessage
              : progress >= 100
                ? "Final checks running…"
                : "Updating changes"}
          </p>

          <p className="text-sm text-gray-600">
            Please wait while we safely apply updates.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
