import React, { useState } from 'react';
import { useGameStore, getXpForNextLevel } from '../store/gameStore';
import { Trophy, Lock, Medal, Star, Zap, Crown } from 'lucide-react';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const Profile: React.FC = () => {
    const { level, xp, streak, achievements } = useGameStore();
    const [showResetModal, setShowResetModal] = useState(false);
    const nextLevelXp = getXpForNextLevel(level);
    const progress = (xp / nextLevelXp) * 100;

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalAchievements = achievements.length;

    return (
        <div className="space-y-8 pb-20 md:pb-0">
            {/* Header */}
            <div className="glass-panel rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-game-primary/20 blur-[100px] rounded-full -mr-16 -mt-16 animate-pulse-slow"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-game-text mb-2 font-display tracking-tight">
                        Player Profile
                    </h1>
                    <p className="text-game-muted text-lg font-light">Your career legacy</p>
                </div>
            </div>

            {/* Player Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Level Card */}
                <div className="bento-card p-6 flex flex-col items-center justify-center text-center group">
                    <div className="mb-4 p-4 rounded-full bg-game-primary/10 text-game-primary ring-1 ring-game-primary/20 group-hover:scale-110 transition-transform duration-500">
                        <Crown className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-game-muted text-sm font-medium uppercase tracking-wider">Current Level</h3>
                    <p className="text-4xl font-bold text-game-text font-display mt-2">{level}</p>
                    <div className="w-full mt-4">
                        <div className="flex justify-between text-xs text-game-muted mb-1">
                            <span>{Math.floor(progress)}% to Lvl {level + 1}</span>
                            <span>{xp} / {nextLevelXp} XP</span>
                        </div>
                        <div className="h-2 w-full bg-game-card/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-game-primary to-game-secondary"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div className="bento-card p-6 flex flex-col items-center justify-center text-center group">
                    <div className="mb-4 p-4 rounded-full bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-game-muted text-sm font-medium uppercase tracking-wider">Daily Streak</h3>
                    <p className="text-4xl font-bold text-game-text font-display mt-2">{streak} Days</p>
                    <p className="text-xs text-game-muted mt-2">Keep it up for bonus XP!</p>
                </div>

                {/* Achievements Stat */}
                <div className="bento-card p-6 flex flex-col items-center justify-center text-center group">
                    <div className="mb-4 p-4 rounded-full bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Medal className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-game-muted text-sm font-medium uppercase tracking-wider">Badges Earned</h3>
                    <p className="text-4xl font-bold text-game-text font-display mt-2">{unlockedCount}/{totalAchievements}</p>
                    <p className="text-xs text-game-muted mt-2">Unlock all to become a Legend</p>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="bento-card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-game-text mb-6 font-display flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-yellow-500" strokeWidth={1.5} />
                    Achievements Hall
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`relative p-4 rounded-2xl border transition-all duration-300 ${achievement.unlocked
                                ? 'bg-game-card/5 border-game-card/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-game-primary/5'
                                : 'bg-game-card/2 border-game-card/5 opacity-60 grayscale'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${achievement.unlocked ? 'bg-game-primary/10 ring-1 ring-game-primary/20' : 'bg-game-card/10'
                                    }`}>
                                    {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6 text-game-muted" />}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-base ${achievement.unlocked ? 'text-game-text' : 'text-game-muted'}`}>
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm text-game-muted mt-1 leading-relaxed">
                                        {achievement.description}
                                    </p>
                                    {achievement.unlocked && (
                                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-game-primary bg-game-primary/10 px-2 py-0.5 rounded-full">
                                            <Star className="h-3 w-3 fill-current" />
                                            Unlocked
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Danger Zone */}
            <div className="mt-12 border-t border-red-500/20 pt-8">
                <h2 className="text-xl font-bold text-red-500 mb-4 font-display flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Danger Zone
                </h2>
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-game-text">Reset Progress</h3>
                        <p className="text-sm text-game-muted mt-1">
                            This will permanently delete all your progress, jobs, and contacts.
                            <br />
                            <span className="text-red-400 font-medium">This action cannot be undone.</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowResetModal(true)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors border border-red-500/20"
                    >
                        Reset Everything
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showResetModal}
                title="Reset All Progress?"
                message="This will permanently delete your XP, Level, Jobs, and Contacts. This action cannot be undone."
                confirmText="Yes, Reset Everything"
                cancelText="Cancel"
                isDangerous={true}
                onConfirm={() => {
                    useGameStore.getState().resetState();
                    window.location.reload();
                }}
                onCancel={() => setShowResetModal(false)}
            />
        </div>
    );
};
