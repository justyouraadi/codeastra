import { motion } from "framer-motion";
import { TextShimmer } from "@/components/ui/text-shimmer";

export default function ThinkingOverlay({ visible }) {
    if (!visible) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                {/* Main animated text */}
                <TextShimmer className="font-mono text-lg text-white" duration={1}>
                    Generating code
                </TextShimmer>

                {/* Animated dots */}
                <motion.div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </motion.div>

                {/* Sub text */}
                <p className="text-xs text-gray-300 tracking-wide">
                    Thinking · Building · Optimizing
                </p>
            </motion.div>
        </div>
    );
}