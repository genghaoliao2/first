// 题目类型
export interface Question {
  id: string;
  type: 'grammar' | 'vocabulary' | 'reading';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// 用户答案
export interface UserAnswer {
  questionId: string;
  selectedOption: number;
}

// 提交请求
export interface SubmitRequest {
  answers: UserAnswer[];
  startTime: number;
  endTime: number;
}

// 错题信息
export interface WrongQuestion {
  question: Question;
  userAnswer: number;
}

// 提交响应
export interface SubmitResponse {
  resultId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  wrongQuestions: WrongQuestion[];
}

// 结果查询响应
export interface ResultResponse extends SubmitResponse {}

// 结果数据结构
export interface Result {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startTime: number;
  endTime: number;
  wrongQuestions: Array<{
    questionId: string;
    userAnswer: number;
  }>;
}

// 简化的错题信息（用于保存到文件）
export interface SimpleWrongQuestion {
  questionId: string;
  userAnswer: number;
}

// 题目数据结构
export interface QuestionsData {
  grammar: Question[];
  vocabulary: Question[];
  reading: Question[];
}

// 结果数据结构
export interface ResultsData {
  results: Result[];
}