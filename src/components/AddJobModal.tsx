import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Building, Plus, Link as LinkIcon } from 'lucide-react';
import { useGameStore, type JobStatus } from '../store/gameStore';

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
    const { addJob } = useGameStore();
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [status, setStatus] = useState<JobStatus>('Applied');
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!company || !position) return;

        addJob({
            company,
            position,
            status,
            link,
            notes
        });

        // Reset form
        setCompany('');
        setPosition('');
        setStatus('Applied');
        setLink('');
        setNotes('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-game-card bg-game-bg shadow-2xl">
                            <div className="flex items-center justify-between border-b border-game-card p-4">
                                <h2 className="text-lg font-bold text-game-text">New Quest</h2>
                                <button onClick={onClose} className="rounded-lg p-1 text-game-muted hover:bg-game-card/10 hover:text-game-text transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-game-muted uppercase">Company</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-2.5 text-sm text-game-text placeholder-game-muted focus:border-game-primary focus:outline-none"
                                            placeholder="e.g. Cyberdyne Systems"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-game-muted uppercase">Position</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                        <input
                                            type="text"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-2.5 text-sm text-game-text placeholder-game-muted focus:border-game-primary focus:outline-none"
                                            placeholder="e.g. Senior Netrunner"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-game-muted uppercase">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as JobStatus)}
                                        className="w-full rounded-xl border border-game-card/10 bg-game-card/5 px-4 py-2.5 text-sm text-game-text focus:border-game-primary focus:outline-none appearance-none"
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Online Assessment">Online Assessment</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offer">Offer</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-game-muted uppercase">Link (Optional)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-2.5 text-sm text-game-text placeholder-game-muted focus:border-game-primary focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-game-muted uppercase">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full rounded-xl border border-game-card/10 bg-game-card/5 px-4 py-2.5 text-sm text-game-text placeholder-game-muted focus:border-game-primary focus:outline-none min-h-[80px]"
                                        placeholder="Any additional intel..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-game-primary py-3 font-bold text-white shadow-lg shadow-game-primary/20 transition-transform active:scale-95 hover:bg-game-primary/90"
                                >
                                    <Plus className="h-5 w-5" />
                                    Start Quest
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
