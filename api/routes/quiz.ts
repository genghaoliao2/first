import { Router } from 'express';
import type { Request, Response } from 'express';
import { QuestionService, ResultService } from '../service';
import type { SubmitRequest } from '../types';

const router = Router();
const questionService = new QuestionService();
const resultService = new ResultService();

// 获取指定类型的题目列表
router.get('/questions/:type', async (req: Request, res: Response) => {
  try {
    const type = req.params.type as 'grammar' | 'vocabulary' | 'reading';
    
    // 验证类型
    if (!['grammar', 'vocabulary', 'reading'].includes(type)) {
      return res.status(400).json({ error: '无效的题目类型' });
    }

    const questions = await questionService.getQuestionsByType(type);
    res.json(questions);
  } catch (error) {
    console.error('获取题目失败:', error);
    res.status(500).json({ error: '获取题目失败' });
  }
});

// 提交答案并触发自动评分pipeline
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const submitRequest: SubmitRequest = req.body;
    
    // 验证请求格式
    if (!submitRequest.answers || !submitRequest.startTime || !submitRequest.endTime) {
      return res.status(400).json({ error: '请求格式不正确' });
    }

    // 执行自动pipeline
    const result = await resultService.processSubmit(submitRequest);
    res.json(result);
  } catch (error) {
    console.error('提交答案失败:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : '提交答案失败' });
  }
});

// 获取答题结果详情
router.get('/result/:id', async (req: Request, res: Response) => {
  try {
    const resultId = req.params.id;
    const result = await resultService.getResultById(resultId);
    
    if (!result) {
      return res.status(404).json({ error: '结果不存在' });
    }

    res.json(result);
  } catch (error) {
    console.error('获取结果失败:', error);
    res.status(500).json({ error: '获取结果失败' });
  }
});

export default router;