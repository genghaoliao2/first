// API调用函数

import type { Question, SubmitRequest, SubmitResponse } from './types';

const API_BASE = '/api';

// 获取指定类型的题目
export async function getQuestions(type: 'grammar' | 'vocabulary' | 'reading'): Promise<Question[]> {
  const response = await fetch(`${API_BASE}/questions/${type}`);
  if (!response.ok) {
    throw new Error('获取题目失败');
  }
  return response.json();
}

// 提交答案
export async function submitAnswers(request: SubmitRequest): Promise<SubmitResponse> {
  const response = await fetch(`${API_BASE}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error('提交答案失败');
  }
  return response.json();
}

// 获取结果详情
export async function getResult(resultId: string): Promise<SubmitResponse> {
  const response = await fetch(`${API_BASE}/result/${resultId}`);
  if (!response.ok) {
    throw new Error('获取结果失败');
  }
  return response.json();
}