import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../store/gameStore';

interface AchievementToastProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-50 flex items-center gap-4 rounded-xl border border-game-accent/50 bg-game-card p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-game-accent/20 text-2xl">
                        {achievement.icon}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-game-accent uppercase tracking-wider">Achievement Unlocked</p>
                        <h4 className="font-bold text-game-text">{achievement.title}</h4>
                        <p className="text-sm text-game-muted">{achievement.description}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
