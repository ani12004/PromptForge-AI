export type GameMode = 'fixer' | 'builder' | 'battle' | 'precision';

export interface BaseChallenge {
    id: string;
    mode: GameMode;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    xpReward: number;
}

export interface FixerChallenge extends BaseChallenge {
    mode: 'fixer';
    badPrompt: string;
    hiddenIntent: string;
    successCriteria: string[]; // e.g. ["Must mention JSON", "Must specify tone"]
}

export interface BuilderChallenge extends BaseChallenge {
    mode: 'builder';
    steps: {
        id: string;
        label: string; // e.g., "Define the Persona"
        guidance: string;
        placeholder: string;
    }[];
}

export interface BattleChallenge extends BaseChallenge {
    mode: 'battle';
    scenario: string;
    promptA: { text: string; logic: string };
    promptB: { text: string; logic: string };
    winner: 'A' | 'B';
    explanation: string;
}

export interface PrecisionChallenge extends BaseChallenge {
    mode: 'precision';
    task: string;
    constraints: {
        type: 'regex' | 'length' | 'contains' | 'not_contains';
        value: string | number;
        message: string;
    }[];
}

export type Challenge = FixerChallenge | BuilderChallenge | BattleChallenge | PrecisionChallenge;

export interface UserProgress {
    totalXp: number;
    level: number;
    completedChallenges: string[]; // IDs
    unlockedTags: string[];
}

export interface AnalysisMetric {
    name: string;
    score: number;
    description: string;
}

export interface AnalysisResult {
    overallScore: number;
    metrics: AnalysisMetric[];
    strengths: string[];
    weaknesses: string[];
    improvements: string;
    tips: string[];
}
