// 首页 - 题型选择

import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Glasses } from 'lucide-react';
import type { QuizType } from '../types';

const quizTypes: QuizType[] = [
  {
    id: 'grammar',
    name: '语法',
    description: 'JLPT N2 语法练习题',
    icon: 'BookOpen',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'vocabulary',
    name: '词汇',
    description: 'JLPT N2 词汇理解题',
    icon: 'FileText',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'reading',
    name: '阅读',
    description: 'JLPT N2 阅读理解题',
    icon: 'Glasses',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleStartQuiz = (type: 'grammar' | 'vocabulary' | 'reading') => {
    navigate(`/quiz/${type}`);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-12 h-12" />;
      case 'FileText':
        return <FileText className="w-12 h-12" />;
      case 'Glasses':
        return <Glasses className="w-12 h-12" />;
      default:
        return <BookOpen className="w-12 h-12" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-900">日语 N2 题库</h1>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero区域 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            JLPT N2 练习平台
          </h2>
          <p className="text-xl text-gray-600">
            专为日语学习者设计的在线测试系统，助你轻松通过N2考试
          </p>
        </div>

        {/* 题型选择卡片 */}
        <div className="grid md:grid-cols-3 gap-8">
          {quizTypes.map((type) => (
            <div
              key={type.id}
              className="group cursor-pointer"
              onClick={() => handleStartQuiz(type.id)}
            >
              <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div
                  className={`bg-gradient-to-br ${type.color} rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto`}
                >
                  <div className="text-white">{getIcon(type.icon)}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {type.name}
                </h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <button
                  className={`w-full bg-gradient-to-r ${type.color} text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:opacity-90`}
                >
                  开始练习
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            选择题型开始练习，提交后将自动评分并显示详细解析
          </p>
        </div>
      </main>
    </div>
  );
}