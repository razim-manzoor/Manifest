import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useGameStore, type JobStatus } from '../store/gameStore';
import { JobCard } from '../components/JobCard';
import { AddJobModal } from '../components/AddJobModal';

const columns: { title: string; status: JobStatus }[] = [
    { title: 'Applied', status: 'Applied' },
    { title: 'Assessments', status: 'Online Assessment' },
    { title: 'Interviews', status: 'Interview' },
    { title: 'Offers', status: 'Offer' },
    { title: 'Rejected', status: 'Rejected' },
];

export const JobTracker: React.FC = () => {
    const { jobs } = useGameStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="glass-panel rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-game-text font-display tracking-tight">Mission Control</h1>
                    <p className="text-game-muted text-lg font-light">Track your active applications</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-game-muted" />
                        <input
                            type="text"
                            placeholder="Search missions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 rounded-2xl border border-game-card/10 bg-game-card/5 pl-11 pr-4 py-3 text-sm text-game-text placeholder-game-muted focus:border-game-primary/50 focus:bg-game-card/10 focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-2xl bg-game-primary px-6 py-3 font-bold text-white transition-all hover:bg-game-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-game-primary/20"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2} />
                        <span className="hidden md:inline">New Quest</span>
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex h-full min-w-max gap-6 px-1">
                    {columns.map((column) => {
                        const columnJobs = filteredJobs.filter(job => job.status === column.status);

                        return (
                            <div key={column.title} className="flex h-full w-80 flex-col rounded-[2rem] bg-game-card/[0.02] border border-game-card/[0.05] p-4 backdrop-blur-sm">
                                <div className="mb-4 flex items-center justify-between px-2">
                                    <h3 className="font-bold text-game-muted text-sm uppercase tracking-wider">{column.title}</h3>
                                    <span className="rounded-full bg-game-card/10 px-2.5 py-0.5 text-xs font-medium text-game-text border border-game-card/5">
                                        {columnJobs.length}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-game-card/10 hover:scrollbar-thumb-game-card/20">
                                    {columnJobs.map((job) => (
                                        <div key={job.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                                            <JobCard job={job} />
                                        </div>
                                    ))}

                                    {columnJobs.length === 0 && (
                                        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-game-card/10 bg-game-card/[0.01]">
                                            <p className="text-sm text-game-muted/50">No active quests</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
