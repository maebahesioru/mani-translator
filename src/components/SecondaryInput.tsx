'use client';

import { useState, useRef, useEffect } from 'react';
import { TranslateSettings } from './TranslatorInput';

interface SecondaryInputProps {
  onTranslate: (text: string, settings: TranslateSettings, image?: string) => void;
  isLoading: boolean;
}

export default function SecondaryInput({ onTranslate, isLoading }: SecondaryInputProps) {
  const [text, setText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [settings, setSettings] = useState<TranslateSettings>({
    style: 'natural',
    model: 'fast',
    enterToSend: false,
    translateMode: 'hikamani',
  });
  const settingsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 設定パネル外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || image) && !isLoading) {
      onTranslate(text.trim(), settings, image || undefined);
      setText('');
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && settings.enterToSend) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('画像サイズは10MB以下にしてください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1];
      setImage(base64Data);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full max-h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        {/* テキストエリア */}
        <div className="flex-1 p-4">
          {/* 画像プレビュー */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="アップロード画像" 
                className="max-h-24 rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-xs"
                title="画像を削除"
              >
                ×
              </button>
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={image ? "画像モード" : "別のテキストを翻訳"}
            className={`w-full h-full resize-none outline-none text-gray-800 placeholder-gray-400 ${image ? 'opacity-50' : ''}`}
            disabled={isLoading || !!image}
          />
        </div>

        {/* 下部ツールバー */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            {/* 設定ボタン */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="設定"
                aria-label="設定を開く"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              {/* 設定パネル */}
              {showSettings && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-[100]">
                  {/* 翻訳スタイル */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">翻訳スタイル</div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, style: 'literal' }))}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          settings.style === 'literal'
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        直訳
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, style: 'natural' }))}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          settings.style === 'natural'
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        自然
                      </button>
                    </div>
                  </div>

                  {/* AIモデル */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">AIモデル</div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, model: 'fast' }))}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          settings.model === 'fast'
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        高速
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, model: 'accurate' }))}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          settings.model === 'accurate'
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        高精度
                      </button>
                    </div>
                  </div>

                  {/* Enterキーで送信 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Enterキーで送信</div>
                      <div className="text-xs text-gray-400">Shift + Enterで改行</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, enterToSend: !s.enterToSend }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        settings.enterToSend ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      aria-label={settings.enterToSend ? 'Enterキーで送信をオフにする' : 'Enterキーで送信をオンにする'}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.enterToSend ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 画像アップロードボタン */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
              aria-label="画像ファイルを選択"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              title="画像をアップロード"
              aria-label="画像をアップロード"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
          </div>

          {/* 翻訳ボタン */}
          <button
            type="submit"
            disabled={(!text.trim() && !image) || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>翻訳中...</span>
              </>
            ) : (
              <span>翻訳する ↑</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
