export interface VocabularyWord {
  id: string;
  chinese: string;
  japanese: string;
  romaji?: string;
  category?: string;
  level?: string;
  learningCount: number;
  correctCount: number;
  lastLearned?: Date;
  createdAt: Date;
}

export interface LearningProgress {
  totalWords: number;
  learnedWords: number;
  correctRate: number;
  currentSession: {
    startTime: Date;
    wordsLearned: number;
    correctCount: number;
  };
}

export interface AppSettings {
  dailyGoal: number;
  shuffleMode: boolean;
  showRomaji: boolean;
}