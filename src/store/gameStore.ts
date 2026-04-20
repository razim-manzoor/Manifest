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
    lastDailyResetDate: string | null;
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
    name: string;
    visitVisaExpiry: string | null;
    setName: (name: string) => void;
    setVisitVisaExpiry: (date: string | null) => void;
    resetState: () => void;
}

export const getXpForNextLevel = (level: number) => 300 + (level * 50);

export const getLevelTitle = (level: number) => {
    if (level <= 5) return 'Novice Hunter';
    if (level <= 10) return 'Networking Ninja';
    if (level <= 20) return 'Career Pro';
    return 'Dubai Tycoon';
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getStartOfLocalDay = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getDayDifference = (from: string, to: string) => {
    const fromDate = getStartOfLocalDay(from);
    const toDate = getStartOfLocalDay(to);

    return Math.round((toDate.getTime() - fromDate.getTime()) / MS_PER_DAY);
};

const countWeekdaysMissed = (from: string, to: string) => {
    const diff = getDayDifference(from, to);

    if (diff <= 1) {
        return 0;
    }

    let missedWeekdays = 0;
    const cursor = getStartOfLocalDay(from);

    for (let i = 1; i < diff; i += 1) {
        cursor.setDate(cursor.getDate() + 1);
        const day = cursor.getDay();

        if (day !== 0 && day !== 6) {
            missedWeekdays += 1;
        }
    }

    return missedWeekdays;
};

const getJobStatusXp = (status: JobStatus) => {
    if (status === 'Interview') return 300;
    if (status === 'Offer') return 1000;
    return 0;
};

const getContactInteractionXp = 50;

const createInitialDailyTasks = (): DailyTask[] => ([
    { id: '1', title: 'Apply to 5 jobs', xpReward: 250, isCompleted: false },
    { id: '2', title: 'Update resume', xpReward: 150, isCompleted: false },
    { id: '3', title: 'Network with 3 people', xpReward: 300, isCompleted: false },
]);

const createInitialAchievements = (): Achievement[] => ([
    { id: 'first-blood', title: 'First Blood', description: 'Apply to your first job', icon: '⚔️', unlocked: false },
    { id: 'networker', title: 'Social Butterfly', description: 'Add 5 contacts', icon: '🦋', unlocked: false },
    { id: 'streak-master', title: 'Consistent', description: 'Reach a 3-day streak', icon: '🔥', unlocked: false },
    { id: 'interview-ready', title: 'Showtime', description: 'Land an interview', icon: '🎤', unlocked: false },
]);

const syncRecurringState = (state: Pick<GameState, 'dailyTasks' | 'lastDailyResetDate' | 'lastCompletedDate' | 'streak'>) => {
    const todayKey = getLocalDateKey();
    const shouldResetTasks = state.lastDailyResetDate !== todayKey;
    const hasBrokenStreak = state.lastCompletedDate
        ? countWeekdaysMissed(state.lastCompletedDate, todayKey) > 0
        : false;

    return {
        dailyTasks: shouldResetTasks
            ? state.dailyTasks.map((task) => ({ ...task, isCompleted: false }))
            : state.dailyTasks,
        lastDailyResetDate: shouldResetTasks ? todayKey : state.lastDailyResetDate,
        streak: hasBrokenStreak ? 0 : state.streak,
    };
};

const calculateProgression = (currentXp: number, currentLevel: number, addedXp: number, currentShowModal: boolean) => {
    let xp = currentXp + addedXp;
    let level = currentLevel;
    let showLevelUpModal = currentShowModal;

    while (true) {
        const xpNeeded = getXpForNextLevel(level);
        if (xp >= xpNeeded) {
            xp -= xpNeeded;
            level += 1;
            showLevelUpModal = true;
        } else {
            break;
        }
    }

    return { xp, level, showLevelUpModal };
};

const createBaseState = () => ({
    xp: 0,
    level: 1,
    streak: 0,
    lastCompletedDate: null as string | null,
    lastDailyResetDate: getLocalDateKey(),
    jobs: [] as Job[],
    dailyTasks: createInitialDailyTasks(),
    contacts: [] as Contact[],
    achievements: createInitialAchievements(),
    lastUnlockedAchievement: null as Achievement | null,
    showLevelUpModal: false,
    name: 'Hunter',
    visitVisaExpiry: null as string | null,
});

export const useGameStore = create<GameState>()(persist((set, get) => ({
    ...createBaseState(),

    addXp: (amount) => set((state) => (
        calculateProgression(state.xp, state.level, amount, state.showLevelUpModal)
    )),

    levelUp: () => set((state) => (
        calculateProgression(state.xp, state.level, getXpForNextLevel(state.level), state.showLevelUpModal)
    )),

    closeLevelUpModal: () => set({ showLevelUpModal: false }),
    clearAchievementToast: () => set({ lastUnlockedAchievement: null }),

    addJob: (jobData) => {
        set((state) => {
            const newJob: Job = {
                ...jobData,
                id: uuidv4(),
                date: new Date().toISOString(),
            };

            const earnedXp = 150 + getJobStatusXp(jobData.status);
            const progression = calculateProgression(state.xp, state.level, earnedXp, state.showLevelUpModal);

            return {
                jobs: [...state.jobs, newJob],
                ...progression,
            };
        });
        get().checkAchievements();
    },

    updateJobStatus: (id, status) => {
        set((state) => {
            const currentJob = state.jobs.find((job) => job.id === id);
            if (!currentJob || currentJob.status === status) {
                return {};
            }

            const previousStatusXp = getJobStatusXp(currentJob.status);
            const nextStatusXp = getJobStatusXp(status);
            const bonusXp = nextStatusXp > previousStatusXp ? nextStatusXp - previousStatusXp : 0;
            const progression = calculateProgression(state.xp, state.level, bonusXp, state.showLevelUpModal);

            return {
                jobs: state.jobs.map((job) => (job.id === id ? { ...job, status } : job)),
                ...progression,
            };
        });
        get().checkAchievements();
    },

    deleteJob: (id) => set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
    })),

    completeTask: (id) => {
        set((state) => {
            const recurringState = syncRecurringState(state);
            const task = recurringState.dailyTasks.find((dailyTask) => dailyTask.id === id);
            if (!task || task.isCompleted) {
                return {};
            }

            let addedXp = task.xpReward;
            const updatedTasks = recurringState.dailyTasks.map((dailyTask) => (
                dailyTask.id === id ? { ...dailyTask, isCompleted: true } : dailyTask
            ));
            const allCompleted = updatedTasks.every((dailyTask) => dailyTask.isCompleted);
            let newStreak = recurringState.streak;
            let newLastCompletedDate = state.lastCompletedDate;

            if (allCompleted) {
                const todayKey = getLocalDateKey();

                if (state.lastCompletedDate) {
                    const missedWeekdays = countWeekdaysMissed(state.lastCompletedDate, todayKey);
                    newStreak = missedWeekdays === 0 ? newStreak + 1 : 1;
                } else {
                    newStreak = 1;
                }

                newLastCompletedDate = new Date().toISOString();
                addedXp += Math.floor(getXpForNextLevel(state.level) * 0.25);
            }

            const progression = calculateProgression(state.xp, state.level, addedXp, state.showLevelUpModal);

            return {
                dailyTasks: updatedTasks,
                streak: newStreak,
                lastCompletedDate: newLastCompletedDate,
                lastDailyResetDate: recurringState.lastDailyResetDate,
                ...progression,
            };
        });
        get().checkAchievements();
    },

    addContact: (contactData) => {
        set((state) => {
            const newContact: Contact = {
                ...contactData,
                id: uuidv4(),
                lastContacted: new Date().toISOString(),
                status: contactData.status ?? 'New',
                type: contactData.type ?? 'Other',
            };

            const progression = calculateProgression(
                state.xp,
                state.level,
                getContactInteractionXp,
                state.showLevelUpModal,
            );

            return {
                contacts: [...state.contacts, newContact],
                ...progression,
            };
        });
        get().checkAchievements();
    },

    updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...updates } : contact)),
    })),

    deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== id),
    })),

    logContactInteraction: (id) => {
        set((state) => {
            const contact = state.contacts.find((entry) => entry.id === id);
            if (!contact) {
                return {};
            }

            const progression = calculateProgression(
                state.xp,
                state.level,
                getContactInteractionXp,
                state.showLevelUpModal,
            );

            const newStatus = contact.status === 'New' ? 'Contacted' : contact.status;

            return {
                contacts: state.contacts.map((entry) => (
                    entry.id === id
                        ? { ...entry, lastContacted: new Date().toISOString(), status: newStatus }
                        : entry
                )),
                ...progression,
            };
        });
        get().checkAchievements();
    },

    setName: (name) => set({ name }),
    setVisitVisaExpiry: (date) => set({ visitVisaExpiry: date }),

    resetState: () => {
        useGameStore.persist.clearStorage();
        set(createBaseState());
    },

    checkAchievements: () => set((state) => {
        const newAchievements = [...state.achievements];
        let achievementUnlocked: Achievement | null = null;

        const check = (id: string, condition: boolean) => {
            const index = newAchievements.findIndex((achievement) => achievement.id === id);
            if (index !== -1 && !newAchievements[index].unlocked && condition) {
                newAchievements[index] = { ...newAchievements[index], unlocked: true };
                achievementUnlocked = newAchievements[index];
            }
        };

        check('first-blood', state.jobs.length > 0);
        check('networker', state.contacts.length >= 5);
        check('streak-master', state.streak >= 3);
        check('interview-ready', state.jobs.some((job) => job.status === 'Interview' || job.status === 'Offer'));

        if (!achievementUnlocked) {
            return {};
        }

        return {
            achievements: newAchievements,
            lastUnlockedAchievement: achievementUnlocked,
        };
    }),
}),
{
    name: 'job-hunter-storage',
    partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        lastCompletedDate: state.lastCompletedDate,
        lastDailyResetDate: state.lastDailyResetDate,
        jobs: state.jobs,
        dailyTasks: state.dailyTasks,
        contacts: state.contacts,
        achievements: state.achievements,
        lastUnlockedAchievement: state.lastUnlockedAchievement,
        name: state.name,
        visitVisaExpiry: state.visitVisaExpiry,
    }),
    onRehydrateStorage: () => (state) => {
        if (!state) {
            return;
        }

        useGameStore.setState(syncRecurringState(state));
    },
}));
