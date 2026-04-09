'use client';

import { useState, useRef, useEffect } from 'react';

export type TranslateMode = 'hikamani' | 'kouhei' | 'katuhiko' | 'inmu' | 'japanese';

export interface TranslateSettings {
  style: 'literal' | 'natural';
  model: 'fast' | 'accurate';
  enterToSend: boolean;
  translateMode: TranslateMode;
}

const TRANSLATE_MODE_LABELS: Record<TranslateMode, string> = {
  hikamani: 'ヒカマニ語録',
  kouhei: '平野光平語',
  katuhiko: '勝彦構文',
  inmu: '淫夢語録',
  japanese: '日本語',
};

interface TranslatorInputProps {
  onTranslate: (text: string, settings: TranslateSettings, image?: string) => void;
  isLoading: boolean;
  translateMode: TranslateMode;
  onTranslateModeChange: (mode: TranslateMode) => void;
}

export default function TranslatorInput({ onTranslate, isLoading, translateMode, onTranslateModeChange }: TranslatorInputProps) {
  const [text, setText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [settings, setSettings] = useState<TranslateSettings>({
    style: 'natural',
    model: 'fast',
    enterToSend: false,
    translateMode: 'hikamani',
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // テキストに応じて高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.max(120, Math.min(textarea.scrollHeight, 400));
      textarea.style.height = `${newHeight}px`;
    }
  }, [text]);

  // 設定パネル外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setShowModeDropdown(false);
      }
    };
    if (showSettings || showModeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings, showModeDropdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || image) && !isLoading) {
      onTranslate(text.trim(), settings, image || undefined);
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

    // 画像サイズチェック（10MB以下）
    if (file.size > 10 * 1024 * 1024) {
      alert('画像サイズは10MB以下にしてください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // data:image/jpeg;base64,... の形式からbase64部分を抽出
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
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* 翻訳モード選択（入力枠の右上） */}
        <div className="flex justify-end px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="relative" ref={modeDropdownRef}>
            <button
              type="button"
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>{TRANSLATE_MODE_LABELS[translateMode]}</span>
            </button>

            {showModeDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {(Object.keys(TRANSLATE_MODE_LABELS) as TranslateMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      onTranslateModeChange(mode);
                      setShowModeDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                      translateMode === mode ? 'text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    <span>{TRANSLATE_MODE_LABELS[mode]}</span>
                    {translateMode === mode && (
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pt-2">
          {/* 画像プレビュー */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="アップロード画像" 
                className="max-h-32 rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="画像を削除"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={image ? "画像モードではテキスト入力は使用されません" : "翻訳したいテキストを入力..."}
            className={`w-full min-h-[120px] max-h-[400px] resize-none outline-none text-gray-800 placeholder-gray-400 ${image ? 'opacity-50' : ''}`}
            disabled={isLoading || !!image}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {/* 設定ボタン */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              title="設定"
              aria-label="設定を開く"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
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
                    title={settings.enterToSend ? 'Enterキーで送信: オン' : 'Enterキーで送信: オフ'}
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

          <div className="flex items-center gap-2">
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
              className="p-2.5 text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 hover:border-gray-400 rounded-full transition-colors disabled:opacity-50"
              title="画像をアップロード"
              aria-label="画像をアップロード"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <button
              type="submit"
              disabled={(!text.trim() && !image) || isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
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
              <>
                <span>翻訳する ↑</span>
              </>
            )}
            </button>
          </div>
        </div>
      </div>
      {/* 説明文 */}
      <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 12l2 2 4-4" />
        </svg>
        <span>AIが言語を検出し、非ヒカマニ語録ならヒカマニ語録へ、それ以外ならヒカマニ語録から非ヒカマニ語録へ翻訳します</span>
      </div>
    </form>
  );
}
