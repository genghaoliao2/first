// 前端类型定义

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
  selectedOption: number | null;
}

// 提交请求
export interface SubmitRequest {
  answers: Array<{
    questionId: string;
    selectedOption: number;
  }>;
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

// 题型信息
export interface QuizType {
  id: 'grammar' | 'vocabulary' | 'reading';
  name: string;
  description: string;
  icon: string;
  color: string;
}