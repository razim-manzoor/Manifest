import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Trash2, ArrowRight, ExternalLink, XCircle } from 'lucide-react';
import { type Job, useGameStore } from '../store/gameStore';
import clsx from 'clsx';

interface JobCardProps {
    job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
    const { deleteJob, updateJobStatus } = useGameStore();

    const statusColors = {
        'Applied': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        'Online Assessment': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
        'Interview': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        'Offer': 'bg-green-500/20 text-green-400 border-green-500/50',
        'Rejected': 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    const getNextStatus = (currentStatus: Job['status']): Job['status'] | null => {
        if (currentStatus === 'Applied') return 'Online Assessment';
        if (currentStatus === 'Online Assessment') return 'Interview';
        if (currentStatus === 'Interview') return 'Offer';
        return null;
    };

    const nextStatus = getNextStatus(job.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative rounded-xl border border-game-card bg-game-card/50 p-4 hover:border-game-primary/50 transition-colors"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-game-bg border border-game-card">
                        <Briefcase className="h-5 w-5 text-game-muted" />
                    </div>
                    <div>
                        <h3 className="font-bold text-game-text">{job.position}</h3>
                        <p className="text-sm text-game-muted">{job.company}</p>
                    </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1 text-game-muted hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className={clsx(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium border',
                    statusColors[job.status]
                )}>
                    {job.status}
                </span>

                <div className="flex items-center gap-1 text-xs text-game-muted">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(job.date).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex gap-2">
                {job.link && (
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-lg bg-game-card hover:bg-game-primary/10 hover:text-game-primary px-3 py-1.5 text-xs font-medium transition-colors border border-game-card"
                        title="Open Job Link"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}

                {job.status !== 'Rejected' && (
                    <button
                        onClick={() => updateJobStatus(job.id, 'Rejected')}
                        className="flex items-center justify-center rounded-lg bg-game-card hover:bg-red-500/10 hover:text-red-500 px-3 py-1.5 text-xs font-medium transition-colors border border-game-card group/reject"
                        title="Mark as Rejected"
                    >
                        <XCircle className="h-3.5 w-3.5" />
                    </button>
                )}

                {nextStatus && (
                    <button
                        onClick={() => updateJobStatus(job.id, nextStatus)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-game-card hover:bg-game-primary/20 hover:text-game-primary py-1.5 text-xs font-medium transition-colors border border-game-card"
                    >
                        <span>Advance to {nextStatus}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};
