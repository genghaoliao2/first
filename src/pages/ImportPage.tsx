import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useVocabularyStore } from '@/store/vocabularyStore';

interface ExtractedWord {
  id: string;
  text: string;
  selected: boolean;
  chinese: string;
  japanese: string;
  romaji: string;
}

export default function ImportPage() {
  const { addWordsFromImage } = useVocabularyStore();
  const [image, setImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedWords, setExtractedWords] = useState<ExtractedWord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setExtractedWords([]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setExtractedWords([]);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const recognizeText = async () => {
    if (!image) return;

    setIsRecognizing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(image, 'jpn', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text;
      const lines = text.split('\n').filter((line) => line.trim());

      // 简单的单词解析逻辑（实际应用中需要更智能的解析）
      const words: ExtractedWord[] = lines.map((line, index) => {
        const cleanedLine = line.trim();
        return {
          id: `${index}-${Date.now()}`,
          text: cleanedLine,
          selected: true,
          chinese: '',
          japanese: cleanedLine,
          romaji: '',
        };
      });

      setExtractedWords(words);
    } catch (error) {
      console.error('识别失败:', error);
      alert('图片识别失败，请重试');
    } finally {
      setIsRecognizing(false);
      setProgress(0);
    }
  };

  const toggleWordSelection = (id: string) => {
    setExtractedWords((words) =>
      words.map((word) =>
        word.id === id ? { ...word, selected: !word.selected } : word
      )
    );
  };

  const updateWordData = (id: string, field: string, value: string) => {
    setExtractedWords((words) =>
      words.map((word) =>
        word.id === id ? { ...word, [field]: value } : word
      )
    );
  };

  const importSelectedWords = () => {
    const selectedWords = extractedWords
      .filter((word) => word.selected && word.chinese.trim() && word.japanese.trim())
      .map((word) => ({
        chinese: word.chinese.trim(),
        japanese: word.japanese.trim(),
        romaji: word.romaji.trim() || undefined,
      }));

    if (selectedWords.length === 0) {
      alert('请至少选择一个单词并填写完整信息');
      return;
    }

    addWordsFromImage(selectedWords);
    alert(`成功导入 ${selectedWords.length} 个单词`);
    setImage(null);
    setExtractedWords([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          <h1 className="text-2xl font-bold text-[#2C3E50]">图片导入</h1>
        </div>

        {/* 上传区域 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">上传图片</h2>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              image
                ? 'border-[#88D8B0] bg-[#F0FFF4]'
                : 'border-[#E0E0E0] hover:border-[#AEC6CF] bg-[#FAFAFA]'
            }`}
          >
            {image ? (
              <div className="space-y-4">
                <img
                  src={image}
                  alt="上传的图片"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setExtractedWords([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-sm text-[#FFB7C5] hover:text-[#FFA5B8] transition-colors"
                >
                  清除图片
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="bg-[#AEC6CF] rounded-full p-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-[#5A6C7D]">
                  拖拽图片到这里，或点击下方按钮上传
                </p>
                <p className="text-xs text-[#AEC6CF]">
                  支持 JPG、PNG 格式
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            
            {!image && (
              <label
                htmlFor="image-upload"
                className="inline-block mt-4 bg-[#88D8B0] text-white px-6 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors cursor-pointer"
              >
                选择图片
              </label>
            )}
          </div>
        </div>

        {/* 识别按钮 */}
        {image && !isRecognizing && extractedWords.length === 0 && (
          <button
            onClick={recognizeText}
            className="w-full bg-[#88D8B0] text-white px-6 py-3 rounded-xl hover:bg-[#7BC8A3] transition-colors font-medium mb-6"
          >
            开始识别
          </button>
        )}

        {/* 识别进度 */}
        {isRecognizing && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-[#88D8B0] animate-spin" />
              <span className="text-[#5A6C7D]">正在识别中... {progress}%</span>
            </div>
            <div className="w-full bg-[#F0F0F0] rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-[#88D8B0] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 识别结果 */}
        {extractedWords.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2C3E50]">
                识别结果 ({extractedWords.length} 个)
              </h2>
              <button
                onClick={importSelectedWords}
                className="bg-[#88D8B0] text-white px-4 py-2 rounded-lg hover:bg-[#7BC8A3] transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                导入选中单词
              </button>
            </div>

            <div className="space-y-3">
              {extractedWords.map((word) => (
                <div
                  key={word.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    word.selected
                      ? 'border-[#88D8B0] bg-[#F0FFF4]'
                      : 'border-[#E0E0E0] bg-[#FAFAFA]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleWordSelection(word.id)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        word.selected
                          ? 'bg-[#88D8B0] border-[#88D8B0] text-white'
                          : 'border-[#E0E0E0] text-transparent'
                      }`}
                    >
                      {word.selected && <Check className="w-3 h-3" />}
                    </button>

                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-[#AEC6CF] mb-2">
                        识别文本: {word.text}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-[#5A6C7D] mb-1">
                            中文意思 *
                          </label>
                          <input
                            type="text"
                            value={word.chinese}
                            onChange={(e) =>
                              updateWordData(word.id, 'chinese', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-[#E0E0E0] rounded text-sm focus:border-[#88D8B0] focus:outline-none"
                            placeholder="中文"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5A6C7D] mb-1">
                            日语写法 *
                          </label>
                          <input
                            type="text"
                            value={word.japanese}
                            onChange={(e) =>
                              updateWordData(word.id, 'japanese', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-[#E0E0E0] rounded text-sm focus:border-[#88D8B0] focus:outline-none"
                            placeholder="日语"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5A6C7D] mb-1">
                            罗马音
                          </label>
                          <input
                            type="text"
                            value={word.romaji}
                            onChange={(e) =>
                              updateWordData(word.id, 'romaji', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-[#E0E0E0] rounded text-sm focus:border-[#88D8B0] focus:outline-none"
                            placeholder="罗马音"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-[#FFFBF7] border border-[#FFB7C5] rounded-xl p-4">
          <h3 className="font-semibold text-[#2C3E50] mb-2">使用说明</h3>
          <ul className="text-sm text-[#5A6C7D] space-y-1">
            <li>1. 上传包含日语文字的图片</li>
            <li>2. 点击"开始识别"按钮进行 OCR 识别</li>
            <li>3. 识别完成后，选择需要导入的单词</li>
            <li>4. 填写中文意思和日语写法（必填）</li>
            <li>5. 点击"导入选中单词"完成导入</li>
          </ul>
        </div>
      </div>
    </div>
  );
}