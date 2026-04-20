import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Sparkles, Bot, Wand2, Lock, Copy, Check, Loader2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { AIService } from '../services/aiService';

export const Oracle: React.FC = () => {
    const { apiKey, name, aiProvider, ollamaConfig, resumeContent, level } = useGameStore(); // Added level
    const [activeTab, setActiveTab] = useState<'scribe' | 'chameleon'>('scribe');

    const LEVEL_ADVANCED_TONES = 5;
    const LEVEL_CHAMELEON = 10;

    // Scribe State
    const [jobDescription, setJobDescription] = useState('');
    const [tone, setTone] = useState<'Professional' | 'Confident' | 'Urgent' | 'Witty'>('Professional');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // Chameleon State
    const [resumeText, setResumeText] = useState(resumeContent || '');
    const [analysisResult, setAnalysisResult] = useState<{ score: number; missingKeywords: string[]; tips: string[] } | null>(null);

    // Update local state if store changes (optional, but good for UX)
    React.useEffect(() => {
        if (resumeContent && !resumeText) {
            setResumeText(resumeContent);
        }
    }, [resumeContent]);

    const generateCoverLetter = async () => {
        if (aiProvider === 'gemini' && !apiKey) return;

        if (!jobDescription.trim()) {
            toast.error('Please enter a Job Description first.');
            return;
        }

        setIsGenerating(true);
        try {
            const aiService = new AIService({
                provider: aiProvider,
                apiKey: apiKey || undefined,
                ollamaUrl: ollamaConfig?.url,
                ollamaModel: ollamaConfig?.model
            });

            const prompt = `
                Context: You are an expert career coach helping a user named "${name}".
                Task: Write a highly personalized, compelling cover letter based on the following Job Description.
                Tone: ${tone}.
                ${resumeContent ? `User's Background (Resume): "${resumeContent.slice(0, 3000)}"` : ''}
                Input Job Description:
                "${jobDescription}"
                
                Requirements:
                - Do NOT use placeholders like [Your Name] or [Date] if possible, or keep them minimal.
                - Focus on why the user is a good match based on the description.
                - Keep it concise (under 400 words).
                - Use standard markdown formatting.
            `;

            const result = await aiService.generate(prompt);

            if (result.error) throw new Error(result.error);

            setGeneratedLetter(result.text);
            toast.success('The Oracle has spoken!');
        } catch (error) {
            console.error('AI Error:', error);
            toast.error(`The Oracle is silent... ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to parchment!');
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Simple PDF generation (Text only for now)
        const splitText = doc.splitTextToSize(generatedLetter.replace(/[#*`]/g, ''), 180);

        doc.setFontSize(20);
        doc.text("Cover Letter", 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(splitText, 15, 40);

        doc.save('manifest_cover_letter.pdf');
        toast.success('Scroll sealed and downloaded!');
    };

    const analyzeResume = async () => {
        if (aiProvider === 'gemini' && !apiKey) return;

        if (!jobDescription.trim() || !resumeText.trim()) {
            toast.error('Please provide both Resume content and Job Description.');
            return;
        }

        setIsGenerating(true);
        try {
            const aiService = new AIService({
                provider: aiProvider,
                apiKey: apiKey || undefined,
                ollamaUrl: ollamaConfig?.url,
                ollamaModel: ollamaConfig?.model
            });

            const prompt = `
                Context: You are an ATS (Applicant Tracking System) expert.
                Task: Analyze the fit between the following Resume and Job Description.
                Output JSON Format ONLY: { "score": number (0-100), "missingKeywords": string[], "tips": string[] }
                
                Resume: "${resumeText.slice(0, 5000)}"
                Job Description: "${jobDescription.slice(0, 5000)}"
            `;

            const result = await aiService.generate(prompt);
            if (result.error) throw new Error(result.error);

            // Basic cleaning to handle code blocks if AI adds them
            const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonStr);

            setAnalysisResult(data);
            toast.success('Analysis complete!');
        } catch (error) {
            console.error('AI Error:', error);
            toast.error(`Failed to analyze: ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const isConfigurationValid = () => {
        if (aiProvider === 'gemini') return !!apiKey;
        if (aiProvider === 'ollama') return true;
        return false;
    };

    if (!isConfigurationValid()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 glass-panel rounded-3xl animate-in fade-in zoom-in duration-500">
                <div className="p-6 bg-game-card/10 rounded-full mb-6 relative">
                    <Lock className="h-16 w-16 text-game-muted" />
                    <div className="absolute -bottom-2 -right-2 p-2 bg-purple-500 rounded-full">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-game-text mb-4 font-display">The Oracle is Sealed</h1>
                <p className="text-game-muted max-w-md mb-8">
                    To access the ancient AI wisdom, you must configure your AI Provider (Gemini or Ollama) in Profile Settings.
                </p>
                <Link
                    to="/profile"
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
                >
                    Go to Profile
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="glass-panel rounded-[2rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-game-text mb-2 font-display flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-purple-500" />
                        The Oracle
                    </h1>
                    <p className="text-game-muted text-lg">AI-powered tools to bend fate in your favor.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-game-card/10 pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('scribe')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all ${activeTab === 'scribe' ? 'bg-game-card/10 text-purple-400 border-b-2 border-purple-500' : 'text-game-muted hover:text-game-text hover:bg-white/5'}`}
                >
                    <Wand2 className="h-4 w-4" />
                    The Scribe (Cover Letter)
                </button>
                <div className="relative group">
                    <button
                        onClick={() => setActiveTab('chameleon')}
                        disabled={level < LEVEL_CHAMELEON}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all ${activeTab === 'chameleon'
                            ? 'bg-game-card/10 text-green-400 border-b-2 border-green-500'
                            : 'text-game-muted hover:text-game-text hover:bg-white/5'
                            } ${level < LEVEL_CHAMELEON ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {level < LEVEL_CHAMELEON ? <Lock className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        The Chameleon (Resume)
                    </button>
                    {level < LEVEL_CHAMELEON && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 text-white text-xs p-2 rounded-lg z-50 hidden group-hover:block border border-white/10 shadow-xl">
                            <div className="font-bold flex items-center gap-1 mb-1 text-red-400">
                                <Lock className="h-3 w-3" /> Locked until Lvl {LEVEL_CHAMELEON}
                            </div>
                            Analyze your resume against job descriptions.
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'scribe' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <div className="glass-panel p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-game-text mb-4 flex items-center gap-2">
                                    <Wand2 className="h-5 w-5 text-purple-500" />
                                    Job Details
                                </h3>

                                <label className="block text-sm font-medium text-game-muted mb-2">Target Job Description</label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full job description here..."
                                    className="w-full h-64 p-4 bg-game-card/5 border border-game-card/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-game-text text-sm resize-none mb-4 scrollbar-thin scrollbar-thumb-game-card/20"
                                />

                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-game-muted mb-2">Tone</label>
                                        <select
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value as any)}
                                            className="w-full p-3 bg-game-card/5 border border-game-card/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-game-text text-sm"
                                        >
                                            <option value="Professional">Professional (Standard)</option>
                                            <option value="Confident" disabled={level < LEVEL_ADVANCED_TONES}>Confident {level < LEVEL_ADVANCED_TONES && '🔒 (Lvl 5)'}</option>
                                            <option value="Urgent" disabled={level < LEVEL_ADVANCED_TONES}>Enthusiastic {level < LEVEL_ADVANCED_TONES && '🔒 (Lvl 5)'}</option>
                                            <option value="Witty" disabled={level < LEVEL_ADVANCED_TONES}>Creative/Witty {level < LEVEL_ADVANCED_TONES && '🔒 (Lvl 5)'}</option>
                                        </select>
                                        {level < LEVEL_ADVANCED_TONES && (
                                            <p className="text-xs text-game-muted mt-1 flex items-center gap-1">
                                                <Lock className="h-3 w-3" /> Reach Level {LEVEL_ADVANCED_TONES} to unlock more tones.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={generateCoverLetter}
                                    disabled={isGenerating || !jobDescription}
                                    className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Consulting the Stars...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5" />
                                            Ask The Oracle
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="glass-panel p-6 rounded-3xl flex flex-col h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-game-text flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-game-secondary" />
                                    The Scroll
                                </h3>
                                {generatedLetter && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 hover:bg-game-card/10 rounded-lg transition-colors text-game-muted hover:text-game-text"
                                            title="Copy to Clipboard"
                                        >
                                            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={downloadPDF}
                                            className="p-2 hover:bg-game-card/10 rounded-lg transition-colors text-game-muted hover:text-game-text"
                                            title="Download PDF"
                                        >
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-white/5 border border-game-card/10 rounded-xl p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-game-card/20 relative">
                                {generatedLetter ? (
                                    <div className="prose prose-invert max-w-none text-sm leading-relaxed text-game-text/90">
                                        <ReactMarkdown>{generatedLetter}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-game-muted/50">
                                        <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                                        <p>Awaiting your query...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'chameleon' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <div className="glass-panel p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-game-text mb-4 flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-green-500" />
                                    Analysis Data
                                </h3>

                                <label className="block text-sm font-medium text-game-muted mb-2">Your Resume Content</label>
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    className="w-full h-48 p-4 bg-game-card/5 border border-game-card/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-game-text text-sm resize-none mb-4 scrollbar-thin scrollbar-thumb-game-card/20"
                                />

                                <label className="block text-sm font-medium text-game-muted mb-2">Job Description</label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste job description..."
                                    className="w-full h-48 p-4 bg-game-card/5 border border-game-card/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-game-text text-sm resize-none mb-4 scrollbar-thin scrollbar-thumb-game-card/20"
                                />

                                <button
                                    onClick={analyzeResume}
                                    disabled={isGenerating || !resumeText || !jobDescription}
                                    className="w-full mt-2 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Analyzing Patterns...
                                        </>
                                    ) : (
                                        <>
                                            <Bot className="h-5 w-5" />
                                            Analyze Match
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl flex flex-col h-full">
                            <h3 className="text-xl font-bold text-game-text mb-4 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-game-accent" />
                                Analysis Report
                            </h3>

                            {analysisResult ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="text-center p-6 bg-game-card/5 rounded-2xl border border-game-card/10">
                                        <div className="text-sm text-game-muted uppercase tracking-widest mb-2">Match Score</div>
                                        <div className={`text-6xl font-bold mb-2 ${analysisResult.score > 80 ? 'text-green-500' :
                                            analysisResult.score > 50 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                            {analysisResult.score}%
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Missing Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-sm">
                                                    {kw}
                                                </span>
                                            ))}
                                            {analysisResult.missingKeywords.length === 0 && (
                                                <span className="text-game-muted text-sm italic">No major keywords missing!</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-game-secondary mb-3 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Optimization Tips
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysisResult.tips.map((tip, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-game-text/80 p-3 bg-game-card/5 rounded-xl">
                                                    <span className="text-game-secondary">•</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-game-muted/50 p-12 text-center">
                                    <Bot className="h-16 w-16 mb-4 opacity-30" />
                                    <p>Upload your data to receive The Chameleon's insight.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
