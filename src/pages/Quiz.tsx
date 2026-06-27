// 答题页面

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import type { Question, UserAnswer } from '../types';
import { getQuestions, submitAnswers } from '../api';

export default function Quiz() {
  const { type } = useParams<{ type: 'grammar' | 'vocabulary' | 'reading' }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!type) return;
    
    setLoading(true);
    getQuestions(type)
      .then((data) => {
        setQuestions(data);
        setAnswers(data.map(q => ({ questionId: q.id, selectedOption: null })));
        setStartTime(Date.now());
        setLoading(false);
      })
      .catch((err) => {
        setError('加载题目失败');
        setLoading(false);
      });
  }, [type]);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex].selectedOption = optionIndex;
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    // 检查是否所有题目都已作答
    const unanswered = answers.filter(a => a.selectedOption === null);
    if (unanswered.length > 0) {
      alert(`还有 ${unanswered.length} 道题目未作答`);
      return;
    }

    try {
      const result = await submitAnswers({
        answers: answers.map(a => ({
          questionId: a.questionId,
          selectedOption: a.selectedOption!
        })),
        startTime,
        endTime: Date.now(),
      });

      navigate(`/result/${result.resultId}`);
    } catch (err) {
      alert('提交失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">暂无题目</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-900">日语 N2 题库</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-medium">
              {new Date(Date.now() - startTime).toISOString().substr(11, 8)}
            </span>
          </div>
        </div>
      </nav>

      {/* 进度条 */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">答题进度</span>
            <span className="font-bold text-blue-900">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 题目区域 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 题目文本 */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-blue-900 mb-4">
              问题 {currentIndex + 1}
            </h2>
            <p className="text-xl leading-relaxed whitespace-pre-line">
              {currentQuestion.question}
            </p>
          </div>

          {/* 选项列表 */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentAnswer.selectedOption === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{index + 1}</span>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-900 hover:bg-gray-50 shadow'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一题
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
              提交答案
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}