import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface JobData {
    position: string;
    company: string;
    location: string;
    salary: string;
    status: 'Applied';
    link: string;
    description: string;
}

export const ClipperImport: React.FC = () => {
    const navigate = useNavigate();
    const { addJob } = useGameStore();
    const [status, setStatus] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [jobData, setJobData] = useState<JobData | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'MANIFEST_CLIPPER_DATA') {
                const payload = event.data.payload;
                console.log('Received Clipper Data:', payload);

                // Add to store
                const newJob = {
                    position: payload.title,
                    company: payload.company || 'Unknown Company',
                    location: 'Remote',
                    salary: '',
                    status: 'Applied' as const,
                    link: payload.url,
                    description: payload.description
                };

                addJob(newJob);
                setJobData(newJob);
                setStatus('success');
                toast.success('Job imported from Clipper!');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [addJob]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            {status === 'waiting' && (
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="h-8 w-8 text-purple-400 animate-spin-slow" />
                    </div>
                    <h2 className="text-2xl font-bold text-game-text">Waiting for Clipper...</h2>
                    <p className="text-game-muted mt-2">The extraction spell is being cast.</p>
                </div>
            )}

            {status === 'success' && jobData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md w-full glass-panel p-8 rounded-2xl border border-green-500/20">
                    <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto ring-1 ring-green-500/50">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Clip Successful!</h2>
                    <div className="bg-black/40 rounded-xl p-4 mb-6 text-left border border-white/5">
                        <h3 className="font-bold text-white text-lg truncate">{jobData.position}</h3>
                        <p className="text-purple-400 text-sm">{jobData.company}</p>
                    </div>

                    <button
                        onClick={() => navigate('/board')}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/20"
                    >
                        Go to Board
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};
