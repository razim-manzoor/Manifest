import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, UserCircle, Building2, Briefcase, Calendar } from 'lucide-react';
import { useGameStore, type Contact, type ContactStatus, type ContactType } from '../store/gameStore';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    editContact?: Contact | null;
}

const STATUS_OPTIONS: ContactStatus[] = ['New', 'Contacted', 'Replied', 'Meeting', 'Connected'];
const TYPE_OPTIONS: ContactType[] = ['Recruiter', 'Hiring Manager', 'Peer', 'Mentor', 'Other'];

export const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, editContact }) => {
    const { addContact, updateContact } = useGameStore();
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState<ContactStatus>('New');
    const [type, setType] = useState<ContactType>('Other');
    const [nextFollowUp, setNextFollowUp] = useState('');

    useEffect(() => {
        if (editContact) {
            setName(editContact.name);
            setCompany(editContact.company);
            setRole(editContact.role);
            setLink(editContact.link || '');
            setStatus(editContact.status);
            setType(editContact.type);
            setNextFollowUp(editContact.nextFollowUp ? new Date(editContact.nextFollowUp).toISOString().split('T')[0] : '');
        } else {
            setName('');
            setCompany('');
            setRole('');
            setLink('');
            setStatus('New');
            setType('Other');
            setNextFollowUp('');
        }
    }, [editContact, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !company) return;

        const contactData = {
            name,
            company,
            role,
            link,
            status,
            type,
            nextFollowUp: nextFollowUp ? new Date(nextFollowUp).toISOString() : undefined,
        };

        if (editContact) {
            updateContact(editContact.id, contactData);
        } else {
            addContact(contactData);
        }
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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md rounded-[2rem] border border-game-card/10 bg-game-card p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
                            <div className="absolute inset-0 bg-gradient-to-br from-game-primary/10 to-transparent pointer-events-none" />

                            <h2 className="mb-6 text-2xl font-bold text-game-text font-display relative z-10">
                                {editContact ? 'Update Ally' : 'Recruit New Ally'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Name</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all"
                                            placeholder="Jane Doe"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Company</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                            <input
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all"
                                                placeholder="Acme Corp"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Role</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all"
                                                placeholder="Recruiter"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as ContactStatus)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 px-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all appearance-none"
                                        >
                                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value as ContactType)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 px-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all appearance-none"
                                        >
                                            {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Next Follow-up</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                        <input
                                            type="date"
                                            value={nextFollowUp}
                                            onChange={(e) => setNextFollowUp(e.target.value)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-game-muted uppercase tracking-wider ml-1">Profile Link</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className="w-full rounded-xl border border-game-card/10 bg-game-card/5 pl-9 pr-4 py-3 text-game-text focus:border-game-primary focus:bg-game-card/10 focus:outline-none transition-all"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 rounded-xl border border-game-card/10 bg-transparent py-3.5 font-bold text-game-muted hover:text-game-text hover:bg-game-card/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-game-primary py-3.5 font-bold text-white hover:bg-game-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-game-primary/20"
                                    >
                                        {editContact ? 'Update' : 'Recruit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
