// 结果页面

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Clock, Home, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { SubmitResponse, WrongQuestion } from '../types';
import { getResult } from '../api';

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    getResult(id)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('加载结果失败');
        setLoading(false);
      });
  }, [id]);

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    navigate(-1);
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

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">结果不存在</div>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-blue-900">日语 N2 题库 - 结果</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 得分卡片 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-8 mb-8">
          <div className="text-center text-white">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">答题完成！</h2>
            <p className="text-xl mb-6">你的成绩如下</p>
            
            <div className="grid grid-cols-3 gap-8 mt-8">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-4xl font-bold mb-2">{result.score}</div>
                <div className="text-sm">得分</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-4xl font-bold mb-2">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-sm">正确题数</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold">{formatTime(result.timeSpent)}</span>
                </div>
                <div className="text-sm">用时</div>
              </div>
            </div>
          </div>
        </div>

        {/* 错题列表 */}
        {result.wrongQuestions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              错题解析 ({result.wrongQuestions.length}题)
            </h3>
            <div className="space-y-4">
              {result.wrongQuestions.map((wq: WrongQuestion) => (
                <div key={wq.question.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(wq.question.id)}
                    className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        ✗
                      </span>
                      <span className="text-gray-700 font-medium">
                        {wq.question.question.substring(0, 50)}...
                      </span>
                    </div>
                    {expandedQuestions.has(wq.question.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedQuestions.has(wq.question.id) && (
                    <div className="p-6 bg-white">
                      <div className="mb-4">
                        <p className="text-gray-700 whitespace-pre-line">
                          {wq.question.question}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-bold text-gray-600 mb-2">选项：</p>
                        {wq.question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`mb-2 p-3 rounded ${
                              index === wq.question.correctAnswer
                                ? 'bg-green-50 border-2 border-green-500 text-green-700'
                                : index === wq.userAnswer
                                ? 'bg-red-50 border-2 border-red-500 text-red-700'
                                : 'bg-gray-50'
                            }`}
                          >
                            <span className="font-bold">{index + 1}</span>
                            <span className="ml-2">{option}</span>
                            {index === wq.question.correctAnswer && (
                              <span className="ml-2 font-bold text-green-600"> ✓ 正确</span>
                            )}
                            {index === wq.userAnswer && index !== wq.question.correctAnswer && (
                              <span className="ml-2 font-bold text-red-600"> ✗ 你的选择</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-blue-900 mb-2">解析：</p>
                        <p className="text-gray-700">{wq.question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-medium hover:bg-gray-50 transition-all shadow"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow"
          >
            <RotateCcw className="w-5 h-5" />
            重做题目
          </button>
        </div>
      </main>
    </div>
  );
}