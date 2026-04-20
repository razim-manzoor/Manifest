import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, UserCircle, Building2, Briefcase, Calendar } from 'lucide-react';
import { useGameStore, type Contact, type ContactStatus, type ContactType } from '../store/gameStore';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    editContact?: Contact | null;
}

interface ContactDraft {
    name: string;
    company: string;
    role: string;
    link: string;
    status: ContactStatus;
    type: ContactType;
    nextFollowUp: string;
}

const STATUS_OPTIONS: ContactStatus[] = ['New', 'Contacted', 'Replied', 'Meeting', 'Connected'];
const TYPE_OPTIONS: ContactType[] = ['Recruiter', 'Hiring Manager', 'Peer', 'Mentor', 'Other'];

const createDraft = (contact?: Contact | null): ContactDraft => ({
    name: contact?.name ?? '',
    company: contact?.company ?? '',
    role: contact?.role ?? '',
    link: contact?.link ?? '',
    status: contact?.status ?? 'New',
    type: contact?.type ?? 'Other',
    nextFollowUp: contact?.nextFollowUp ? new Date(contact.nextFollowUp).toISOString().split('T')[0] : '',
});

export const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, editContact }) => (
    <AnimatePresence>
        {isOpen && (
            <AddContactModalContent
                key={editContact?.id ?? 'new-contact'}
                onClose={onClose}
                editContact={editContact}
            />
        )}
    </AnimatePresence>
);

const AddContactModalContent: React.FC<Omit<AddContactModalProps, 'isOpen'>> = ({ onClose, editContact }) => {
    const { addContact, updateContact } = useGameStore();
    const [draft, setDraft] = useState<ContactDraft>(() => createDraft(editContact));

    const updateDraft = <K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) => {
        setDraft((current) => ({ ...current, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft.name || !draft.company) return;

        const contactData = {
            name: draft.name,
            company: draft.company,
            role: draft.role,
            link: draft.link,
            status: draft.status,
            type: draft.type,
            nextFollowUp: draft.nextFollowUp ? new Date(draft.nextFollowUp).toISOString() : undefined,
        };

        if (editContact) {
            updateContact(editContact.id, contactData);
        } else {
            addContact(contactData);
        }

        onClose();
    };

    return (
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
                <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-game-card/10 bg-game-card p-8 shadow-2xl scrollbar-hide">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-game-primary/10 to-transparent" />

                    <h2 className="relative z-10 mb-6 text-2xl font-bold text-game-text font-display">
                        {editContact ? 'Update Ally' : 'Recruit New Ally'}
                    </h2>
                    <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                        <div className="space-y-1.5">
                            <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Name</label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                <input
                                    type="text"
                                    value={draft.name}
                                    onChange={(e) => updateDraft('name', e.target.value)}
                                    className="w-full rounded-xl border border-game-card/10 bg-game-card/5 py-3 pl-9 pr-4 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none"
                                    placeholder="Jane Doe"
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Company</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                    <input
                                        type="text"
                                        value={draft.company}
                                        onChange={(e) => updateDraft('company', e.target.value)}
                                        className="w-full rounded-xl border border-game-card/10 bg-game-card/5 py-3 pl-9 pr-4 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none"
                                        placeholder="Acme Corp"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                    <input
                                        type="text"
                                        value={draft.role}
                                        onChange={(e) => updateDraft('role', e.target.value)}
                                        className="w-full rounded-xl border border-game-card/10 bg-game-card/5 py-3 pl-9 pr-4 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none"
                                        placeholder="Recruiter"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Status</label>
                                <select
                                    value={draft.status}
                                    onChange={(e) => updateDraft('status', e.target.value as ContactStatus)}
                                    className="w-full appearance-none rounded-xl border border-game-card/10 bg-game-card/5 px-4 py-3 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none"
                                >
                                    {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Type</label>
                                <select
                                    value={draft.type}
                                    onChange={(e) => updateDraft('type', e.target.value as ContactType)}
                                    className="w-full appearance-none rounded-xl border border-game-card/10 bg-game-card/5 px-4 py-3 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none"
                                >
                                    {TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Next Follow-up</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                <input
                                    type="date"
                                    value={draft.nextFollowUp}
                                    onChange={(e) => updateDraft('nextFollowUp', e.target.value)}
                                    className="w-full rounded-xl border border-game-card/10 bg-game-card/5 py-3 pl-9 pr-4 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="ml-1 text-xs font-medium uppercase tracking-wider text-game-muted">Profile Link</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-game-muted" />
                                <input
                                    type="url"
                                    value={draft.link}
                                    onChange={(e) => updateDraft('link', e.target.value)}
                                    className="w-full rounded-xl border border-game-card/10 bg-game-card/5 py-3 pl-9 pr-4 text-game-text transition-all focus:border-game-primary focus:bg-game-card/10 focus:outline-none"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-game-card/10 bg-transparent py-3.5 font-bold text-game-muted transition-all hover:bg-game-card/5 hover:text-game-text"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-game-primary py-3.5 font-bold text-white shadow-lg shadow-game-primary/20 transition-all hover:scale-105 hover:bg-game-primary/90 active:scale-95"
                            >
                                {editContact ? 'Update' : 'Recruit'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
};
