import type { Question, SubmitRequest, SubmitResponse, WrongQuestion, Result, SimpleWrongQuestion } from './types';
import { QuestionRepository, ResultRepository } from './repository';

const questionRepo = new QuestionRepository();
const resultRepo = new ResultRepository();

// 生成唯一ID
function generateResultId(): string {
  return `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 服务层 - 题目服务
export class QuestionService {
  async getQuestionsByType(type: 'grammar' | 'vocabulary' | 'reading'): Promise<Question[]> {
    return questionRepo.getQuestionsByType(type);
  }

  async getQuestionById(id: string): Promise<Question | null> {
    return questionRepo.getQuestionById(id);
  }
}

// 服务层 - 结果服务（包含自动pipeline）
export class ResultService {
  // 自动评分pipeline
  async processSubmit(request: SubmitRequest): Promise<SubmitResponse> {
    // 1. 数据验证
    if (!request.answers || request.answers.length === 0) {
      throw new Error('答案数据为空');
    }

    // 2. 计算得分
    const wrongQuestions: WrongQuestion[] = [];
    const simpleWrongQuestions: SimpleWrongQuestion[] = [];
    let correctCount = 0;

    for (const answer of request.answers) {
      const question = await questionRepo.getQuestionById(answer.questionId);
      if (!question) {
        throw new Error(`题目ID ${answer.questionId} 不存在`);
      }

      if (answer.selectedOption === question.correctAnswer) {
        correctCount++;
      } else {
        wrongQuestions.push({
          question,
          userAnswer: answer.selectedOption
        });
        simpleWrongQuestions.push({
          questionId: question.id,
          userAnswer: answer.selectedOption
        });
      }
    }

    // 3. 时间计算
    const timeSpent = request.endTime - request.startTime;

    // 4. 结果生成
    const resultId = generateResultId();
    const score = Math.round((correctCount / request.answers.length) * 100);

    const result: Result = {
      id: resultId,
      score,
      totalQuestions: request.answers.length,
      correctAnswers: correctCount,
      startTime: request.startTime,
      endTime: request.endTime,
      wrongQuestions: simpleWrongQuestions
    };

    // 5. 数据持久化
    await resultRepo.saveResult(result);

    // 6. 返回结果
    return {
      resultId,
      score,
      totalQuestions: request.answers.length,
      correctAnswers: correctCount,
      timeSpent,
      wrongQuestions
    };
  }

  // 获取结果详情
  async getResultById(id: string): Promise<SubmitResponse | null> {
    const result = await resultRepo.getResultById(id);
    if (!result) return null;

    // 重新构建完整的结果信息
    const wrongQuestions: WrongQuestion[] = [];
    for (const wq of result.wrongQuestions) {
      const question = await questionRepo.getQuestionById(wq.questionId);
      if (question) {
        wrongQuestions.push({
          question,
          userAnswer: wq.userAnswer
        });
      }
    }

    return {
      resultId: result.id,
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      timeSpent: result.endTime - result.startTime,
      wrongQuestions
    };
  }
}