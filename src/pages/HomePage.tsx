import { Link } from 'react-router-dom';
import { BookOpen, Library, Image, TrendingUp } from 'lucide-react';
import { useVocabularyStore } from '@/store/vocabularyStore';

export default function HomePage() {
  const { vocabulary, progress, settings } = useVocabularyStore();
  const todayProgress = Math.min(
    progress.currentSession.wordsLearned,
    settings.dailyGoal
  );
  const progressPercentage = (todayProgress / settings.dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E8] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-3">
            日语单词学习
          </h1>
          <p className="text-lg text-[#5A6C7D]">
            看中文写日文，高效记忆单词
          </p>
        </div>

        {/* 今日进度 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-[#FFB7C5]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFB7C5] rounded-full p-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#2C3E50]">今日进度</h2>
            </div>
            <span className="text-sm text-[#5A6C7D]">
              目标: {settings.dailyGoal} 个单词
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-[#F0F0F0] rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#88D8B0] to-[#7BC8A3] h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-[#5A6C7D]">
              <span>已学习 {todayProgress} 个</span>
              <span>
                正确率 {progress.currentSession.wordsLearned > 0
                  ? Math.round((progress.currentSession.correctCount / progress.currentSession.wordsLearned) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-[#FFB7C5] mb-1">
              {vocabulary.length}
            </p>
            <p className="text-sm text-[#5A6C7D]">词库总数</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-[#88D8B0] mb-1">
              {progress.learnedWords}
            </p>
            <p className="text-sm text-[#5A6C7D]">已学习</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-[#AEC6CF] mb-1">
              {Math.round(progress.correctRate * 100)}%
            </p>
            <p className="text-sm text-[#5A6C7D]">总正确率</p>
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 学习卡片 */}
          <Link
            to="/learn"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#FFB7C5] group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#FFB7C5] rounded-full p-3 group-hover:bg-[#FFA5B8] transition-colors">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">开始学习</h3>
            </div>
            <p className="text-[#5A6C7D] text-sm">
              看中文意思，输入日语写法
            </p>
          </Link>

          {/* 词库管理卡片 */}
          <Link
            to="/vocabulary"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#88D8B0] group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#88D8B0] rounded-full p-3 group-hover:bg-[#7BC8A3] transition-colors">
                <Library className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">词库管理</h3>
            </div>
            <p className="text-[#5A6C7D] text-sm">
              添加、编辑和删除单词
            </p>
          </Link>

          {/* 图片导入卡片 */}
          <Link
            to="/import"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#AEC6CF] group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#AEC6CF] rounded-full p-3 group-hover:bg-[#9EB6C7] transition-colors">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">图片导入</h3>
            </div>
            <p className="text-[#5A6C7D] text-sm">
              从图片中识别并导入单词
            </p>
          </Link>
        </div>

        {/* 空状态提示 */}
        {vocabulary.length === 0 && (
          <div className="mt-8 bg-[#FFFBF7] border border-[#FFB7C5] rounded-xl p-6 text-center">
            <p className="text-[#2C3E50] mb-3">
              词库为空，请先添加单词开始学习
            </p>
            <Link
              to="/vocabulary"
              className="inline-block bg-[#88D8B0] text-white px-6 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors"
            >
              前往添加
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}