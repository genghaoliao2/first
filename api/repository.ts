import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Question, QuestionsData, Result, ResultsData } from './types';

// ESM模式下的__dirname替代方案
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

// 数据访问层 - 题目数据
export class QuestionRepository {
  // 获取所有题目数据
  async getAllQuestions(): Promise<QuestionsData> {
    const data = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  // 获取指定类型的题目
  async getQuestionsByType(type: 'grammar' | 'vocabulary' | 'reading'): Promise<Question[]> {
    const allQuestions = await this.getAllQuestions();
    return allQuestions[type] || [];
  }

  // 根据ID获取题目
  async getQuestionById(id: string): Promise<Question | null> {
    const allQuestions = await this.getAllQuestions();
    for (const type of ['grammar', 'vocabulary', 'reading'] as const) {
      const question = allQuestions[type].find(q => q.id === id);
      if (question) return question;
    }
    return null;
  }
}

// 数据访问层 - 结果数据
export class ResultRepository {
  // 获取所有结果
  async getAllResults(): Promise<ResultsData> {
    try {
      const data = await fs.readFile(RESULTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return { results: [] };
    }
  }

  // 根据ID获取结果
  async getResultById(id: string): Promise<Result | null> {
    const allResults = await this.getAllResults();
    return allResults.results.find(r => r.id === id) || null;
  }

  // 保存结果
  async saveResult(result: Result): Promise<void> {
    const allResults = await this.getAllResults();
    allResults.results.push(result);
    await fs.writeFile(RESULTS_FILE, JSON.stringify(allResults, null, 2));
  }
}