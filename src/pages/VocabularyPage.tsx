import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { useVocabularyStore } from '@/store/vocabularyStore';
import type { VocabularyWord } from '@/types/vocabulary';

export default function VocabularyPage() {
  const { vocabulary, addWord, updateWord, deleteWord } = useVocabularyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  const [formData, setFormData] = useState({
    chinese: '',
    japanese: '',
    romaji: '',
    category: '',
  });

  const filteredWords = vocabulary.filter(
    (word) =>
      word.chinese.includes(searchTerm) ||
      word.japanese.includes(searchTerm) ||
      (word.romaji && word.romaji.includes(searchTerm))
  );

  const handleOpenModal = (word?: VocabularyWord) => {
    if (word) {
      setEditingWord(word);
      setFormData({
        chinese: word.chinese,
        japanese: word.japanese,
        romaji: word.romaji || '',
        category: word.category || '',
      });
    } else {
      setEditingWord(null);
      setFormData({
        chinese: '',
        japanese: '',
        romaji: '',
        category: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWord(null);
    setFormData({
      chinese: '',
      japanese: '',
      romaji: '',
      category: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chinese.trim() || !formData.japanese.trim()) return;

    if (editingWord) {
      updateWord(editingWord.id, {
        chinese: formData.chinese.trim(),
        japanese: formData.japanese.trim(),
        romaji: formData.romaji.trim() || undefined,
        category: formData.category.trim() || undefined,
      });
    } else {
      addWord({
        chinese: formData.chinese.trim(),
        japanese: formData.japanese.trim(),
        romaji: formData.romaji.trim() || undefined,
        category: formData.category.trim() || undefined,
      });
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个单词吗？')) {
      deleteWord(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E8] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#5A6C7D] hover:text-[#2C3E50] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#2C3E50]">词库管理</h1>
        </div>

        {/* 搜索和添加 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5A6C7D]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:border-[#88D8B0] focus:outline-none transition-colors"
                placeholder="搜索单词..."
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-[#88D8B0] text-white px-4 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>添加单词</span>
            </button>
          </div>
        </div>

        {/* 单词列表 */}
        {filteredWords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            {vocabulary.length === 0 ? (
              <>
                <p className="text-[#5A6C7D] mb-4">词库为空，点击上方按钮添加单词</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-[#88D8B0] text-white px-6 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors"
                >
                  立即添加
                </button>
              </>
            ) : (
              <p className="text-[#5A6C7D]">没有找到匹配的单词</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all border-l-4 border-[#FFB7C5]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#2C3E50] mb-1">
                      {word.chinese}
                    </h3>
                    <p className="text-lg text-[#5A6C7D] font-medium">
                      {word.japanese}
                    </p>
                    {word.romaji && (
                      <p className="text-sm text-[#AEC6CF] mt-1">
                        {word.romaji}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(word)}
                      className="p-2 text-[#5A6C7D] hover:bg-[#F0F0F0] rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="p-2 text-[#FFB7C5] hover:bg-[#FFF0F3] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-[#AEC6CF]">
                  <span>学习: {word.learningCount} 次</span>
                  <span>
                    正确率:{' '}
                    {word.learningCount > 0
                      ? Math.round((word.correctCount / word.learningCount) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-[#5A6C7D]">
            共计 {vocabulary.length} 个单词
          </p>
        </div>
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2C3E50]">
                {editingWord ? '编辑单词' : '添加单词'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[#5A6C7D] hover:text-[#2C3E50] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5A6C7D] mb-1">
                  中文意思 *
                </label>
                <input
                  type="text"
                  value={formData.chinese}
                  onChange={(e) =>
                    setFormData({ ...formData, chinese: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:border-[#88D8B0] focus:outline-none transition-colors"
                  placeholder="输入中文意思"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A6C7D] mb-1">
                  日语写法 *
                </label>
                <input
                  type="text"
                  value={formData.japanese}
                  onChange={(e) =>
                    setFormData({ ...formData, japanese: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:border-[#88D8B0] focus:outline-none transition-colors"
                  placeholder="输入日语写法"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A6C7D] mb-1">
                  罗马音
                </label>
                <input
                  type="text"
                  value={formData.romaji}
                  onChange={(e) =>
                    setFormData({ ...formData, romaji: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:border-[#88D8B0] focus:outline-none transition-colors"
                  placeholder="输入罗马音（可选）"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A6C7D] mb-1">
                  分类
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:border-[#88D8B0] focus:outline-none transition-colors"
                  placeholder="输入分类（可选）"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-[#F0F0F0] text-[#5A6C7D] px-4 py-2 rounded-lg hover:bg-[#E0E0E0] transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#88D8B0] text-white px-4 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors"
                >
                  {editingWord ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}