import React from 'react';
import { useGameStore, getXpForNextLevel, getLevelTitle } from '../store/gameStore';
import { Briefcase, Settings, CheckCircle, Calendar, Circle, Trophy } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { xp, level, jobs, name, visitVisaExpiry, dailyTasks, completeTask, achievements } = useGameStore();

    // Derived stats
    const nextLevelXp = getXpForNextLevel(level);
    const title = getLevelTitle(level);
    const totalTasks = dailyTasks.length;
    const completedTasks = dailyTasks.filter(t => t.isCompleted).length;
    const activeJobs = jobs.filter(j => j.status !== 'Rejected' && j.status !== 'Offer').length;

    // Calculate visa days remaining
    const getVisaDaysRemaining = () => {
        if (!visitVisaExpiry) return null;
        const today = new Date();
        const expiry = new Date(visitVisaExpiry);
        const diffTime = expiry.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysRemaining = getVisaDaysRemaining();

    const getVisaStatusColor = (days: number | null) => {
        if (days === null) return 'text-game-muted';
        if (days > 60) return 'text-game-accent';
        if (days > 30) return 'text-yellow-400';
        return 'text-game-secondary';
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Welcome Section - Glass Panel */}
            <div className="glass-panel rounded-[2rem] p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-game-primary/20 blur-[100px] rounded-full -mr-16 -mt-16 animate-pulse-slow"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-game-text mb-2 font-display tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-secondary">{name}</span>
                        </h1>
                        <p className="text-game-muted text-base md:text-lg font-light tracking-wide flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-game-accent" />
                            <span className="font-medium text-game-accent">{title}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-profile-modal'))}
                        className="px-6 py-3 rounded-2xl bg-game-card/5 hover:bg-game-card/10 border border-game-card/10 text-game-text font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-game-card/5 flex items-center gap-2 group"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />
                        <span>Edit Profile</span>
                    </button>
                </div>

                {/* XP Progress - Refined */}
                <div className="mt-8 relative">
                    <div className="flex justify-between text-sm font-medium mb-3">
                        <span className="text-game-muted uppercase tracking-widest text-xs">Level Progress</span>
                        <span className="text-game-text font-mono">{Math.floor((xp / nextLevelXp) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-game-card/10 rounded-full overflow-hidden ring-1 ring-game-card/10">
                        <div
                            className="h-full bg-gradient-to-r from-game-primary via-game-secondary to-game-primary bg-[length:200%_100%] animate-shimmer shadow-[0_0_15px_rgba(124,58,237,0.6)]"
                            style={{ width: `${(xp / nextLevelXp) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Stats Column */}
                <div className="space-y-4 md:space-y-6">
                    <div className="bento-card p-6 flex items-center gap-5 group">
                        <div className="p-4 rounded-2xl bg-game-primary/10 text-game-primary ring-1 ring-game-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <Briefcase className="h-8 w-8" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-game-muted text-sm font-medium uppercase tracking-wider">Active Applications</p>
                            <p className="text-3xl font-bold text-game-text font-display mt-1">{activeJobs}</p>
                        </div>
                    </div>

                    <div className="bento-card p-6 flex items-center gap-5 group">
                        <div className="p-4 rounded-2xl bg-game-secondary/10 text-game-secondary ring-1 ring-game-secondary/20 group-hover:scale-110 transition-transform duration-500">
                            <CheckCircle className="h-8 w-8" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-game-muted text-sm font-medium uppercase tracking-wider">Daily Tasks</p>
                            <p className="text-3xl font-bold text-game-text font-display mt-1">{completedTasks}/{totalTasks}</p>
                        </div>
                    </div>

                    {/* Visa Status Widget */}
                    <div className="bento-card p-6 flex items-center gap-5 group relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-10 ${getVisaStatusColor(daysRemaining).replace('text-', 'bg-')}`}></div>
                        <div className={`p-4 rounded-2xl bg-game-card/5 ring-1 ring-game-card/10 group-hover:scale-110 transition-transform duration-500 ${getVisaStatusColor(daysRemaining)}`}>
                            <Calendar className="h-8 w-8" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-game-muted text-sm font-medium uppercase tracking-wider">Visa Remaining</p>
                            <p className={`text-3xl font-bold font-display mt-1 ${getVisaStatusColor(daysRemaining)}`}>
                                {daysRemaining !== null ? `${daysRemaining} Days` : 'Not Set'}
                            </p>
                        </div>
                    </div>

                    {/* Next Achievement Widget */}
                    <div className="bento-card p-6 flex items-center gap-5 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy className="h-16 w-16 rotate-12" />
                        </div>
                        <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Trophy className="h-8 w-8" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-game-muted text-sm font-medium uppercase tracking-wider">Next Goal</p>
                            <p className="text-lg font-bold text-game-text font-display mt-1">
                                {achievements.find(a => !a.unlocked)?.title || 'All Unlocked!'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Daily Tasks - Spans 2 Columns */}
                <div className="md:col-span-2 bento-card p-6 md:p-8 relative group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                        <CheckCircle className="h-20 w-20 md:h-24 md:w-24 text-game-card/5 rotate-12" strokeWidth={1} />
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-game-text mb-6 md:mb-8 font-display flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-game-secondary" strokeWidth={1.5} />
                        Daily Tasks
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        {dailyTasks.map((task) => (
                            <button
                                key={task.id}
                                onClick={() => !task.isCompleted && completeTask(task.id)}
                                disabled={task.isCompleted}
                                className={`w-full group/item flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 text-left ${task.isCompleted
                                    ? 'bg-game-card/5 border-game-card/5 opacity-60'
                                    : 'bg-game-card/5 hover:bg-game-card/10 border-game-card/5 hover:border-game-card/10 hover:scale-[1.02]'
                                    }`}
                            >
                                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center ring-1 ring-game-card/10 transition-all duration-300 ${task.isCompleted
                                    ? 'bg-game-secondary/20 text-game-secondary'
                                    : 'bg-game-card/10 text-game-muted group-hover/item:bg-game-secondary/10 group-hover/item:text-game-secondary'
                                    }`}>
                                    {task.isCompleted ? (
                                        <CheckCircle className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
                                    ) : (
                                        <Circle className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium text-sm md:text-base transition-colors ${task.isCompleted ? 'text-game-muted line-through' : 'text-game-text'}`}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs md:text-sm text-game-muted mt-0.5">+{task.xpReward} XP</p>
                                </div>
                                {task.isCompleted && (
                                    <div className="text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-game-secondary/20 text-game-secondary border border-game-secondary/20">
                                        COMPLETED
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
