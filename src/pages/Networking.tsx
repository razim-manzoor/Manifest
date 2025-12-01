import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, Mail, Building2, UserCircle, ExternalLink, Pencil, Calendar, Tag } from 'lucide-react';
import { useGameStore, type Contact } from '../store/gameStore';
import { AddContactModal } from '../components/AddContactModal';
import clsx from 'clsx';

export const Networking: React.FC = () => {
    const { contacts, deleteContact, logContactInteraction } = useGameStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Replied': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Meeting': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'Connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-game-card/20 text-game-muted border-game-card/30';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-8">
            <div className="glass-panel rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-game-text font-display tracking-tight">Alliance Network</h1>
                    <p className="text-game-muted text-lg font-light">Build your professional guild</p>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-2xl bg-game-primary px-6 py-3 font-bold text-white transition-all hover:bg-game-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-game-primary/20"
                >
                    <Plus className="h-5 w-5" strokeWidth={2} />
                    <span>Add Ally</span>
                </button>
            </div>

            {/* Contact List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact) => (
                    <motion.div
                        key={contact.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bento-card p-6 group relative"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-game-card/5 border border-game-card/10 group-hover:scale-110 transition-transform duration-500">
                                    <UserCircle className="h-8 w-8 text-game-primary" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-game-text text-lg">{contact.name}</h3>
                                    <p className="text-sm text-game-primary font-medium">{contact.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleEdit(contact)}
                                    className="p-2 rounded-xl hover:bg-game-primary/10 text-game-muted hover:text-game-primary transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                                <button
                                    onClick={() => deleteContact(contact.id)}
                                    className="p-2 rounded-xl hover:bg-red-500/10 text-game-muted hover:text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className={clsx('px-2.5 py-0.5 rounded-lg text-xs font-medium border', getStatusColor(contact.status))}>
                                {contact.status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-game-card/10 text-game-muted border border-game-card/10 flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {contact.type}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-game-muted group-hover:text-game-text/80 transition-colors">
                                <Building2 className="h-4 w-4" strokeWidth={1.5} />
                                <span>{contact.company}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-game-muted group-hover:text-game-text/80 transition-colors">
                                <Mail className="h-4 w-4" strokeWidth={1.5} />
                                <span>Last contacted: {new Date(contact.lastContacted).toLocaleDateString()}</span>
                            </div>
                            {contact.nextFollowUp && (
                                <div className="flex items-center gap-3 text-sm text-orange-400/80 font-medium">
                                    <Calendar className="h-4 w-4" strokeWidth={1.5} />
                                    <span>Follow-up: {new Date(contact.nextFollowUp).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-4 flex gap-2">
                            {contact.link ? (
                                <a
                                    href={contact.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-game-primary/10 hover:bg-game-primary/20 border border-game-primary/20 py-3 text-sm font-bold text-game-primary transition-all duration-300"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Open Profile
                                </a>
                            ) : (
                                <button
                                    onClick={() => logContactInteraction(contact.id)}
                                    className="flex-1 rounded-xl bg-game-card/5 hover:bg-game-card/10 border border-game-card/5 hover:border-game-card/10 py-3 text-sm font-medium text-game-text transition-all duration-300 hover:shadow-lg hover:shadow-game-card/5 active:scale-95"
                                >
                                    Send Signal (+15 XP)
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}

                {contacts.length === 0 && (
                    <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-[2rem] border border-dashed border-game-card/10 bg-game-card/[0.02]">
                        <Users className="mb-4 h-16 w-16 text-game-card/10" strokeWidth={1} />
                        <p className="text-game-muted text-lg">No allies recruited yet</p>
                    </div>
                )}
            </div>

            <AddContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editContact={editingContact}
            />
        </div>
    );
};
