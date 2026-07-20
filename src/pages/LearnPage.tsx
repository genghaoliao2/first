import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useVocabularyStore } from '@/store/vocabularyStore';

export default function LearnPage() {
  const navigate = useNavigate();
  const {
    vocabulary,
    progress,
    settings,
    currentWordIndex,
    startLearningSession,
    recordAnswer,
    nextWord,
  } = useVocabularyStore();

  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = vocabulary[currentWordIndex];

  useEffect(() => {
    if (vocabulary.length > 0 && !hasStarted) {
      startLearningSession();
      setHasStarted(true);
    }
  }, [vocabulary.length, hasStarted, startLearningSession]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWordIndex]);

  const checkAnswer = () => {
    if (!currentWord || !userInput.trim()) return;

    const correct = userInput.trim() === currentWord.japanese;
    setIsCorrect(correct);
    setShowResult(true);
    recordAnswer(currentWord.id, correct);
  };

  const handleNext = () => {
    setUserInput('');
    setShowResult(false);
    nextWord();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!showResult) {
        checkAnswer();
      } else {
        handleNext();
      }
    }
  };

  if (vocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E8] px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-[#5A6C7D] mb-4">词库为空，请先添加单词</p>
            <Link
              to="/vocabulary"
              className="inline-block bg-[#88D8B0] text-white px-6 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors"
            >
              前往添加
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E8] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#5A6C7D] hover:text-[#2C3E50] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>
          <div className="text-sm text-[#5A6C7D]">
            已学习: {progress.currentSession.wordsLearned} | 
            正确率: {progress.currentSession.wordsLearned > 0
              ? Math.round((progress.currentSession.correctCount / progress.currentSession.wordsLearned) * 100)
              : 0}%
          </div>
        </div>

        {/* 学习卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* 单词展示区 */}
          <div className="text-center mb-8">
            <p className="text-sm text-[#88D8B0] mb-2 font-medium">中文意思</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">
              {currentWord?.chinese}
            </h2>
            {settings.showRomaji && currentWord?.romaji && (
              <p className="text-sm text-[#AEC6CF]">
                罗马音: {currentWord.romaji}
              </p>
            )}
          </div>

          {/* 输入区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#5A6C7D] mb-2">
              请输入日语写法
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={showResult}
              className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-xl focus:border-[#88D8B0] focus:outline-none transition-colors text-lg disabled:bg-[#F8F8F8] disabled:cursor-not-allowed"
              placeholder="输入日语..."
              autoFocus
            />
          </div>

          {/* 结果显示 */}
          {showResult && (
            <div
              className={`p-4 rounded-xl mb-6 ${
                isCorrect
                  ? 'bg-[#E8F5E9] border border-[#88D8B0]'
                  : 'bg-[#FFEBEE] border border-[#FFB7C5]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-[#88D8B0]" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#FFB7C5]" />
                )}
                <span
                  className={`font-semibold ${
                    isCorrect ? 'text-[#88D8B0]' : 'text-[#FFB7C5]'
                  }`}
                >
                  {isCorrect ? '正确!' : '错误'}
                </span>
              </div>
              {!isCorrect && (
                <div className="mt-2">
                  <p className="text-sm text-[#5A6C7D]">正确答案:</p>
                  <p className="text-xl font-bold text-[#2C3E50]">
                    {currentWord?.japanese}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 按钮区域 */}
          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={checkAnswer}
                disabled={!userInput.trim()}
                className="flex-1 bg-[#88D8B0] text-white px-6 py-3 rounded-xl hover:bg-[#7BC8A3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                提交答案
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-[#AEC6CF] text-white px-6 py-3 rounded-xl hover:bg-[#9EB6C7] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                下一个单词
              </button>
            )}
          </div>
        </div>

        {/* 进度信息 */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between text-sm text-[#5A6C7D]">
            <span>词库总数: {vocabulary.length}</span>
            <span>
              进度: {currentWordIndex + 1} / {vocabulary.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}