import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Zap, Sun, Moon, User, Sparkles } from 'lucide-react';
import { useGameStore, getXpForNextLevel } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';
import { LevelUpModal } from './LevelUpModal';
import { AchievementToast } from './AchievementToast';
import { ProfileModal } from './ProfileModal';
import { AddJobModal } from './AddJobModal';

export const Layout: React.FC = () => {
    const {
        level,
        xp,
        showLevelUpModal,
        closeLevelUpModal,
        lastUnlockedAchievement,
        clearAchievementToast
    } = useGameStore();

    const { theme, toggleTheme } = useTheme();
    const nextLevelXp = getXpForNextLevel(level);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleOpenProfileModal = () => setIsProfileModalOpen(true);
        window.addEventListener('open-profile-modal', handleOpenProfileModal);
        return () => window.removeEventListener('open-profile-modal', handleOpenProfileModal);
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-transparent text-game-text font-sans selection:bg-game-primary/30 transition-colors duration-500">
            {/* Desktop Sidebar - Liquid Glass */}
            <aside className="hidden md:flex w-72 flex-col glass border-r border-game-card/10 fixed h-full z-40 transition-all duration-300">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-game-primary/50 blur-xl rounded-full animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-br from-game-primary to-game-secondary p-2.5 rounded-2xl shadow-lg shadow-game-primary/20 ring-1 ring-white/20">
                                    <Sparkles className="h-7 w-7 text-game-primary" strokeWidth={1.5} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-text to-game-text/70 font-display tracking-tight">
                                    Manifest
                                </h1>
                                <span className="text-xs font-medium text-game-primary tracking-widest uppercase opacity-90">UAE Edition</span>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <NavLink to="/" icon={<LayoutDashboard size={20} strokeWidth={1.5} />} label="Dashboard" active={location.pathname === '/'} />
                        <NavLink to="/tracker" icon={<Briefcase size={20} strokeWidth={1.5} />} label="Job Tracker" active={location.pathname === '/tracker'} />
                        <NavLink to="/networking" icon={<Users size={20} strokeWidth={1.5} />} label="Networking" active={location.pathname === '/networking'} />
                        <NavLink to="/profile" icon={<User size={20} strokeWidth={1.5} />} label="Profile" active={location.pathname === '/profile'} />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-game-card/5 bg-game-card/[0.02]">
                    <button
                        onClick={toggleTheme}
                        className="mb-6 flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-game-muted hover:bg-game-card/5 hover:text-game-text transition-all duration-300 group"
                    >
                        <div className="p-1.5 rounded-lg bg-game-card/5 group-hover:bg-game-card/10 transition-colors">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </div>
                        <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <div className="bg-game-card/20 rounded-2xl p-5 backdrop-blur-sm border border-game-card/5 shadow-inner">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-game-muted uppercase tracking-wider">Level {level}</span>
                            <span className="text-xs font-bold text-game-text font-mono">{xp} / {nextLevelXp} XP</span>
                        </div>
                        <div className="h-2 w-full bg-game-card/40 rounded-full overflow-hidden ring-1 ring-game-card/5">
                            <div
                                className="h-full bg-gradient-to-r from-game-primary via-game-secondary to-game-primary bg-[length:200%_100%] animate-shimmer transition-all duration-700 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                style={{ width: `${(xp / nextLevelXp) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Theme Toggle (Floating) */}
            <button
                onClick={toggleTheme}
                className="md:hidden fixed top-4 right-4 z-50 p-3 rounded-full glass text-game-text shadow-lg active:scale-95 transition-all"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Bottom Navigation - Liquid Glass */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-game-card/10 pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    <MobileNavLink to="/" icon={<LayoutDashboard size={22} strokeWidth={1.5} />} label="Home" active={location.pathname === '/'} />
                    <MobileNavLink to="/tracker" icon={<Briefcase size={22} strokeWidth={1.5} />} label="Jobs" active={location.pathname === '/tracker'} />
                    <div className="relative -top-5">
                        <div className="absolute inset-0 bg-game-primary/50 blur-xl rounded-full animate-pulse-slow"></div>
                        <button
                            onClick={() => setIsAddJobModalOpen(true)}
                            className="relative bg-gradient-to-br from-game-primary to-game-secondary p-3.5 rounded-full shadow-lg shadow-game-primary/30 ring-2 ring-white/20 transform transition-transform active:scale-95"
                        >
                            <Zap className="h-6 w-6 text-game-accent" strokeWidth={1.5} />
                        </button>
                    </div>
                    <MobileNavLink to="/networking" icon={<Users size={22} strokeWidth={1.5} />} label="Network" active={location.pathname === '/networking'} />
                    <MobileNavLink to="/profile" icon={<User size={22} strokeWidth={1.5} />} label="Profile" active={location.pathname === '/profile'} />
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                </div>
            </main>

            <LevelUpModal
                isOpen={showLevelUpModal}
                level={level}
                onClose={closeLevelUpModal}
            />
            <AchievementToast
                achievement={lastUnlockedAchievement}
                onClose={clearAchievementToast}
            />
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
            <AddJobModal isOpen={isAddJobModalOpen} onClose={() => setIsAddJobModalOpen(false)} />
        </div>
    );
};

const NavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active
            ? 'bg-game-card/10 text-game-text shadow-lg shadow-game-card/5 ring-1 ring-game-card/10 font-medium'
            : 'text-game-muted hover:bg-game-card/5 hover:text-game-text hover:translate-x-1'
            }`}
    >
        <span className={`transition-colors duration-300 ${active ? 'text-game-primary' : 'group-hover:text-game-primary'}`}>
            {icon}
        </span>
        <span className="tracking-wide">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-game-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />}
    </Link>
);

const MobileNavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
    <Link
        to={to}
        className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-300 ${active ? 'text-game-primary scale-105' : 'text-game-muted hover:text-game-text'
            }`}
    >
        <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-game-card/10 shadow-inner' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-medium mt-0.5 tracking-wide">{label}</span>
    </Link>
);
