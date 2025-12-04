import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type JobStatus = 'Applied' | 'Online Assessment' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
    id: string;
    company: string;
    position: string;
    status: JobStatus;
    date: string;
    notes?: string;
    link?: string;
}

export interface DailyTask {
    id: string;
    title: string;
    xpReward: number;
    isCompleted: boolean;
}

export type ContactStatus = 'New' | 'Contacted' | 'Replied' | 'Meeting' | 'Connected';
export type ContactType = 'Recruiter' | 'Hiring Manager' | 'Peer' | 'Mentor' | 'Other';

export interface Contact {
    id: string;
    name: string;
    company: string;
    role: string;
    status: ContactStatus;
    type: ContactType;
    lastContacted: string;
    nextFollowUp?: string;
    notes?: string;
    link?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

interface GameState {
    xp: number;
    level: number;
    streak: number;
    lastCompletedDate: string | null;
    jobs: Job[];
    dailyTasks: DailyTask[];
    contacts: Contact[];
    achievements: Achievement[];
    lastUnlockedAchievement: Achievement | null;
    showLevelUpModal: boolean;
    addXp: (amount: number) => void;
    levelUp: () => void;
    closeLevelUpModal: () => void;
    clearAchievementToast: () => void;
    addJob: (job: Omit<Job, 'id' | 'date'>) => void;
    updateJobStatus: (id: string, status: JobStatus) => void;
    deleteJob: (id: string) => void;
    completeTask: (id: string) => void;
    addContact: (contact: Omit<Contact, 'id' | 'lastContacted'>) => void;
    updateContact: (id: string, updates: Partial<Contact>) => void;
    deleteContact: (id: string) => void;
    logContactInteraction: (id: string) => void;
    checkAchievements: () => void;

    // UAE Specific State
    name: string;
    visitVisaExpiry: string | null; // ISO Date string
    setName: (name: string) => void;
    setVisitVisaExpiry: (date: string | null) => void;
    resetState: () => void;
}

export const getXpForNextLevel = (level: number) => 300 + (level * 50);

export const getLevelTitle = (level: number) => {
    if (level <= 5) return "Novice Hunter";
    if (level <= 10) return "Networking Ninja";
    if (level <= 20) return "Career Pro";
    return "Dubai Tycoon";
};

const calculateProgression = (currentXp: number, currentLevel: number, addedXp: number, currentShowModal: boolean) => {
    let xp = currentXp + addedXp;
    let level = currentLevel;
    let showLevelUpModal = currentShowModal;

    while (true) {
        const xpNeeded = getXpForNextLevel(level);
        if (xp >= xpNeeded) {
            xp -= xpNeeded;
            level++;
            showLevelUpModal = true;
        } else {
            break;
        }
    }

    return { xp, level, showLevelUpModal };
};

export const useGameStore = create<GameState>()(persist((set, get) => ({
    xp: 0,
    level: 1,
    streak: 0,
    lastCompletedDate: null,
    jobs: [],
    dailyTasks: [
        { id: '1', title: 'Apply to 5 jobs', xpReward: 250, isCompleted: false },
        { id: '2', title: 'Update resume', xpReward: 150, isCompleted: false },
        { id: '3', title: 'Network with 3 people', xpReward: 300, isCompleted: false },
    ],
    contacts: [],
    achievements: [
        { id: 'first-blood', title: 'First Blood', description: 'Apply to your first job', icon: '⚔️', unlocked: false },
        { id: 'networker', title: 'Social Butterfly', description: 'Add 5 contacts', icon: '🦋', unlocked: false },
        { id: 'streak-master', title: 'Consistent', description: 'Reach a 3-day streak', icon: '🔥', unlocked: false },
        { id: 'interview-ready', title: 'Showtime', description: 'Land an interview', icon: '🎤', unlocked: false },
    ],
    lastUnlockedAchievement: null,
    showLevelUpModal: false,

    addXp: (amount) => set((state) => {
        return calculateProgression(state.xp, state.level, amount, state.showLevelUpModal);
    }),

    levelUp: () => set((state) => ({
        level: state.level + 1,
        showLevelUpModal: true
    })),

    closeLevelUpModal: () => set({ showLevelUpModal: false }),
    clearAchievementToast: () => set({ lastUnlockedAchievement: null }),

    addJob: (jobData) => {
        set((state) => {
            const newJob: Job = {
                ...jobData,
                id: uuidv4(),
                date: new Date().toISOString(),
            };

            // Gamification: Add job = +150 XP (Boosted)
            const progression = calculateProgression(state.xp, state.level, 150, state.showLevelUpModal);

            return {
                jobs: [...state.jobs, newJob],
                ...progression
            };
        });
        get().checkAchievements?.();
    },

    updateJobStatus: (id, status) => {
        set((state) => {
            let bonusXp = 0;
            if (status === 'Interview') bonusXp = 300; // Boosted
            if (status === 'Offer') bonusXp = 1000; // Boosted

            const progression = calculateProgression(state.xp, state.level, bonusXp, state.showLevelUpModal);

            return {
                jobs: state.jobs.map((j) => (j.id === id ? { ...j, status } : j)),
                ...progression
            };
        });
        get().checkAchievements?.();
    },

    deleteJob: (id) => set((state) => ({
        jobs: state.jobs.filter((j) => j.id !== id)
    })),

    completeTask: (id) => {
        set((state) => {
            const task = state.dailyTasks.find((t) => t.id === id);
            if (!task || task.isCompleted) return {};

            let addedXp = task.xpReward;

            const updatedTasks = state.dailyTasks.map((t) =>
                t.id === id ? { ...t, isCompleted: true } : t
            );
            const allCompleted = updatedTasks.every((t) => t.isCompleted);
            let newStreak = state.streak;
            let newLastCompletedDate = state.lastCompletedDate;

            if (allCompleted) {
                // Smart Streak Logic (Weekend Exempt)
                const today = new Date();
                const lastDate = state.lastCompletedDate ? new Date(state.lastCompletedDate) : null;

                if (lastDate) {
                    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat

                    // Logic:
                    // 1. If last completed was yesterday (diffDays <= 1), increment.
                    // 2. If today is Mon (1) and last was Fri (diffDays <= 3), increment.
                    // 3. If today is Sat/Sun, always increment (bonus days).

                    const isConsecutive = diffDays <= 1;
                    const isWeekendSafe = (dayOfWeek === 1 && diffDays <= 3); // Monday check

                    if (isConsecutive || isWeekendSafe) {
                        newStreak += 1;
                    } else {
                        newStreak = 1; // Reset if streak broken
                    }
                } else {
                    newStreak = 1; // First time
                }

                newLastCompletedDate = new Date().toISOString();

                // Dynamic Streak Bonus: 25% of current level requirement
                const levelReq = getXpForNextLevel(state.level);
                const bonus = Math.floor(levelReq * 0.25);

                addedXp += bonus;
            }

            const progression = calculateProgression(state.xp, state.level, addedXp, state.showLevelUpModal);

            return {
                dailyTasks: updatedTasks,
                streak: newStreak,
                lastCompletedDate: newLastCompletedDate,
                ...progression
            };
        });
        get().checkAchievements?.();
    },

    addContact: (contactData) => {
        set((state) => {
            const newContact: Contact = {
                ...contactData,
                id: uuidv4(),
                lastContacted: new Date().toISOString(),
                status: 'New',
                type: 'Other',
            };

            const progression = calculateProgression(state.xp, state.level, 50, state.showLevelUpModal);

            return {
                contacts: [...state.contacts, newContact],
                ...progression
            };
        });
        get().checkAchievements?.();
    },

    updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })),

    deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id)
    })),

    logContactInteraction: (id) => {
        set((state) => {
            const contact = state.contacts.find((c) => c.id === id);
            if (!contact) return {};

            // XP Logic
            const progression = calculateProgression(state.xp, state.level, 50, state.showLevelUpModal);

            // Status Logic
            let newStatus = contact.status;
            if (newStatus === 'New') newStatus = 'Contacted';

            return {
                contacts: state.contacts.map((c) =>
                    c.id === id
                        ? { ...c, lastContacted: new Date().toISOString(), status: newStatus }
                        : c
                ),
                ...progression
            };
        });
        get().checkAchievements?.();
    },

    // UAE Specific State Initialization
    name: 'Hunter',
    visitVisaExpiry: null,

    setName: (name) => set({ name }),
    setVisitVisaExpiry: (date) => set({ visitVisaExpiry: date }),

    resetState: () => {
        useGameStore.persist.clearStorage();
    },

    // Helper to check achievements (called after actions)
    checkAchievements: () => set((state) => {
        const newAchievements = [...state.achievements];
        let achievementUnlocked: Achievement | null = null;

        const check = (id: string, condition: boolean) => {
            const idx = newAchievements.findIndex(a => a.id === id);
            if (idx !== -1 && !newAchievements[idx].unlocked && condition) {
                newAchievements[idx] = { ...newAchievements[idx], unlocked: true };
                achievementUnlocked = newAchievements[idx];
            }
        };

        check('first-blood', state.jobs.length > 0);
        check('networker', state.contacts.length >= 5);
        check('streak-master', state.streak >= 3);
        check('interview-ready', state.jobs.some(j => j.status === 'Interview'));

        if (achievementUnlocked) {
            return {
                achievements: newAchievements,
                lastUnlockedAchievement: achievementUnlocked
            };
        }
        return {};
    }),
}),
    {
        name: 'job-hunter-storage',
        partialize: (state) => ({
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            lastCompletedDate: state.lastCompletedDate,
            jobs: state.jobs,
            dailyTasks: state.dailyTasks,
            contacts: state.contacts,
            achievements: state.achievements,
            lastUnlockedAchievement: state.lastUnlockedAchievement,
            name: state.name,
            visitVisaExpiry: state.visitVisaExpiry,
        }),
    }
));
