import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLevelTitle } from '../store/gameStore';

interface LevelUpModalProps {
    isOpen: boolean;
    level: number;
    onClose: () => void;
}

const getLevelRewards = () => {
    return [
        { icon: <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />, label: "XP Boost" },
        { icon: <Crown className="h-5 w-5 text-purple-400" />, label: "New Title" },
    ];
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, level, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const random = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const title = getLevelTitle(level);
    const rewards = getLevelRewards();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 100 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-game-primary bg-game-bg p-8 text-center shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                            {/* Background Glow */}
                            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-game-primary/30 blur-3xl" />
                            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-game-secondary/30 blur-3xl" />

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-game-primary to-game-secondary p-1"
                            >
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-game-bg">
                                    <Trophy className="h-10 w-10 text-yellow-400" />
                                </div>
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-2 text-3xl font-bold text-game-text"
                            >
                                LEVEL UP!
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-2 text-game-muted"
                            >
                                You are now a
                            </motion.p>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="mb-6 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-secondary"
                            >
                                {title} (Lvl {level})
                            </motion.p>

                            <div className="grid grid-cols-3 gap-2 mb-8">
                                {rewards.map((reward, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className="flex flex-col items-center gap-2 rounded-xl bg-game-card/50 p-3 border border-game-card/10"
                                    >
                                        {reward.icon}
                                        <span className="text-[10px] font-bold text-game-text uppercase tracking-wide">{reward.label}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="w-full rounded-xl bg-gradient-to-r from-game-primary to-game-secondary py-3 font-bold text-white shadow-lg"
                            >
                                Awesome!
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
