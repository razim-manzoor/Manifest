import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIResponse {
    text: string;
    error?: string;
}

export interface AIConfig {
    provider: 'gemini' | 'openai' | 'ollama';
    apiKey?: string; // For Gemini/OpenAI
    ollamaUrl?: string; // For Ollama
    ollamaModel?: string; // For Ollama
}

export class AIService {
    private config: AIConfig;

    constructor(config: AIConfig) {
        this.config = config;
    }

    async generate(prompt: string): Promise<AIResponse> {
        try {
            if (this.config.provider === 'ollama') {
                return await this.generateOllama(prompt);
            } else if (this.config.provider === 'gemini') {
                return await this.generateGemini(prompt);
            }
            return { text: '', error: 'Unsupported provider' };
        } catch (error: any) {
            console.error('AI Service Error:', error);
            return { text: '', error: error.message || 'Unknown error' };
        }
    }

    private async generateGemini(prompt: string): Promise<AIResponse> {
        if (!this.config.apiKey) throw new Error('API Key missing for Gemini');

        const genAI = new GoogleGenerativeAI(this.config.apiKey);

        // Fallback Strategy: Try newest efficient models first, then robust, then legacy.
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return { text: response.text() };
            } catch (error: any) {
                console.warn(`AI Service: Failed with ${modelName}. Retrying...`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        throw new Error(`Oracle Error: Could not connect to any Gemini model. Last error: ${lastError?.message}`);
    }

    private async generateOllama(prompt: string): Promise<AIResponse> {
        const url = this.config.ollamaUrl || 'http://localhost:11434';
        const model = this.config.ollamaModel || 'llama3';

        const response = await fetch(`${url}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { text: data.response };
    }
}
