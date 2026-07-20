import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VocabularyWord, LearningProgress, AppSettings } from '@/types/vocabulary';

interface VocabularyState {
  vocabulary: VocabularyWord[];
  progress: LearningProgress;
  settings: AppSettings;
  currentWordIndex: number;
  
  // Vocabulary actions
  addWord: (word: Omit<VocabularyWord, 'id' | 'learningCount' | 'correctCount' | 'createdAt'>) => void;
  updateWord: (id: string, updates: Partial<VocabularyWord>) => void;
  deleteWord: (id: string) => void;
  addWordsFromImage: (words: Array<{ chinese: string; japanese: string; romaji?: string }>) => void;
  
  // Learning actions
  startLearningSession: () => void;
  recordAnswer: (wordId: string, isCorrect: boolean) => void;
  nextWord: () => void;
  resetSession: () => void;
  
  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const STORAGE_KEY = 'japanese-vocabulary-app';

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      vocabulary: [],
      progress: {
        totalWords: 0,
        learnedWords: 0,
        correctRate: 0,
        currentSession: {
          startTime: new Date(),
          wordsLearned: 0,
          correctCount: 0,
        },
      },
      settings: {
        dailyGoal: 20,
        shuffleMode: true,
        showRomaji: false,
      },
      currentWordIndex: 0,

      addWord: (wordData) => {
        const newWord: VocabularyWord = {
          ...wordData,
          id: generateId(),
          learningCount: 0,
          correctCount: 0,
          createdAt: new Date(),
        };
        
        set((state) => ({
          vocabulary: [...state.vocabulary, newWord],
          progress: {
            ...state.progress,
            totalWords: state.vocabulary.length + 1,
          },
        }));
      },

      updateWord: (id, updates) => {
        set((state) => ({
          vocabulary: state.vocabulary.map((word) =>
            word.id === id ? { ...word, ...updates } : word
          ),
        }));
      },

      deleteWord: (id) => {
        set((state) => ({
          vocabulary: state.vocabulary.filter((word) => word.id !== id),
          progress: {
            ...state.progress,
            totalWords: Math.max(0, state.vocabulary.length - 1),
          },
        }));
      },

      addWordsFromImage: (words) => {
        const newWords: VocabularyWord[] = words.map((word) => ({
          ...word,
          id: generateId(),
          learningCount: 0,
          correctCount: 0,
          createdAt: new Date(),
        }));

        set((state) => ({
          vocabulary: [...state.vocabulary, ...newWords],
          progress: {
            ...state.progress,
            totalWords: state.vocabulary.length + newWords.length,
          },
        }));
      },

      startLearningSession: () => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentSession: {
              startTime: new Date(),
              wordsLearned: 0,
              correctCount: 0,
            },
          },
          currentWordIndex: state.settings.shuffleMode
            ? Math.floor(Math.random() * state.vocabulary.length)
            : 0,
        }));
      },

      recordAnswer: (wordId, isCorrect) => {
        set((state) => {
          const updatedVocabulary = state.vocabulary.map((word) =>
            word.id === wordId
              ? {
                  ...word,
                  learningCount: word.learningCount + 1,
                  correctCount: word.correctCount + (isCorrect ? 1 : 0),
                  lastLearned: new Date(),
                }
              : word
          );

          const totalLearningCount = updatedVocabulary.reduce(
            (sum, word) => sum + word.learningCount,
            0
          );
          const totalCorrectCount = updatedVocabulary.reduce(
            (sum, word) => sum + word.correctCount,
            0
          );

          return {
            vocabulary: updatedVocabulary,
            progress: {
              ...state.progress,
              learnedWords: updatedVocabulary.filter((w) => w.learningCount > 0).length,
              correctRate: totalLearningCount > 0 ? totalCorrectCount / totalLearningCount : 0,
              currentSession: {
                ...state.progress.currentSession,
                wordsLearned: state.progress.currentSession.wordsLearned + 1,
                correctCount: state.progress.currentSession.correctCount + (isCorrect ? 1 : 0),
              },
            },
          };
        });
      },

      nextWord: () => {
        set((state) => {
          if (state.vocabulary.length === 0) return state;

          let nextIndex: number;
          if (state.settings.shuffleMode) {
            nextIndex = Math.floor(Math.random() * state.vocabulary.length);
          } else {
            nextIndex = (state.currentWordIndex + 1) % state.vocabulary.length;
          }

          return { currentWordIndex: nextIndex };
        });
      },

      resetSession: () => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentSession: {
              startTime: new Date(),
              wordsLearned: 0,
              correctCount: 0,
            },
          },
          currentWordIndex: 0,
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        vocabulary: state.vocabulary,
        progress: state.progress,
        settings: state.settings,
      }),
    }
  )
);