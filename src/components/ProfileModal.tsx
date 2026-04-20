import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Calendar } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { name, visitVisaExpiry } = useGameStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <ProfileModalContent
                    key={`${name}-${visitVisaExpiry ?? 'no-expiry'}`}
                    onClose={onClose}
                    initialName={name}
                    initialExpiry={visitVisaExpiry ?? ''}
                />
            )}
        </AnimatePresence>
    );
};

const ProfileModalContent: React.FC<{ onClose: () => void; initialName: string; initialExpiry: string }> = ({
    onClose,
    initialName,
    initialExpiry,
}) => {
    const { setName, setVisitVisaExpiry } = useGameStore();
    const [tempName, setTempName] = useState(initialName);
    const [tempExpiry, setTempExpiry] = useState(initialExpiry);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName(tempName.trim() || 'Hunter');
        setVisitVisaExpiry(tempExpiry || null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ y: '100%', opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: '100%', opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md overflow-hidden rounded-t-[2rem] border-t border-game-card/10 glass-panel shadow-2xl md:rounded-[2rem] md:border"
            >
                <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-game-card/10 bg-game-card p-8 shadow-2xl">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-game-primary/10 to-transparent" />

                    <div className="relative z-10 mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-game-text font-display tracking-tight">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-game-muted transition-colors hover:bg-game-card/10 hover:text-game-text"
                        >
                            <X className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 pl-1 text-sm font-medium text-game-muted">
                                <User className="h-4 w-4" strokeWidth={1.5} />
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full rounded-2xl border border-game-card/10 bg-game-card/5 px-5 py-4 text-game-text placeholder-game-muted/50 shadow-inner transition-all focus:border-game-primary focus:outline-none focus:ring-1 focus:ring-game-primary"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 pl-1 text-sm font-medium text-game-muted">
                                <Calendar className="h-4 w-4" strokeWidth={1.5} />
                                Visit Visa Expiry
                            </label>
                            <input
                                type="date"
                                value={tempExpiry}
                                onChange={(e) => setTempExpiry(e.target.value)}
                                className="w-full rounded-2xl border border-game-card/10 bg-game-card/5 px-5 py-4 text-game-text placeholder-game-muted/50 shadow-inner transition-all focus:border-game-primary focus:outline-none focus:ring-1 focus:ring-game-primary [color-scheme:dark]"
                            />
                            <p className="pl-1 text-xs text-game-muted/70">Used to track remaining days in UAE.</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl px-6 py-3 text-sm font-medium text-game-muted transition-colors hover:bg-game-card/5 hover:text-game-text"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-xl bg-game-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-game-primary/20 transition-all hover:scale-105 hover:bg-game-primary/90 hover:shadow-game-primary/40"
                            >
                                <Save className="h-4 w-4" strokeWidth={1.5} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
