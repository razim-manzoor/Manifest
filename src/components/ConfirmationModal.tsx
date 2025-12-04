import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false,
    onConfirm,
    onCancel
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl border border-game-card/20 bg-game-bg p-6 shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className={`shrink-0 p-3 rounded-full ${isDangerous ? 'bg-red-500/10 text-red-500' : 'bg-game-primary/10 text-game-primary'}`}>
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-game-text mb-2 font-display">
                                        {title}
                                    </h3>
                                    <p className="text-game-muted leading-relaxed mb-6">
                                        {message}
                                    </p>

                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={onCancel}
                                            className="px-4 py-2 rounded-xl font-medium text-game-muted hover:bg-game-card/10 transition-colors"
                                        >
                                            {cancelText}
                                        </button>
                                        <button
                                            onClick={onConfirm}
                                            className={`px-4 py-2 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${isDangerous
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-game-primary hover:bg-game-primary/90'
                                                }`}
                                        >
                                            {confirmText}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={onCancel}
                                    className="text-game-muted hover:text-game-text transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
