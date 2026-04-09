'use client';

import { useState } from 'react';
import { TranslationResult } from '@/lib/api';

export interface HistoryItem {
  id: string;
  original: string;
  result: TranslationResult;
  timestamp: Date;
}

interface SidebarProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

export default function Sidebar({ history, onSelectHistory, onDeleteHistory }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* モバイル用トグルボタン */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-gray-200"
        aria-label="メニューを開く"
        title="メニュー"
      >
        <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <header className="p-4 border-b border-gray-100">
            <a href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:rotate-3 transition-transform">
                M
              </span>
              <span className="text-xl font-bold text-gray-800">mani!?</span>
            </a>
            <p className="text-xs text-gray-500 mt-1">ヒカマニ語録翻訳サイト</p>
          </header>

          {/* 新規翻訳ボタン */}
          <div className="p-4">
            <a
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-gray-200 rounded-full text-gray-700 font-medium hover:border-gray-300 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>あたらしく翻訳</span>
            </a>
          </div>

          {/* 履歴 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">翻訳履歴</span>
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  履歴はありません
                </p>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="group relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectHistory(item);
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-2 pr-8 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm text-gray-700 truncate">
                          {item.original}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          → {item.result?.translation?.slice(0, 30) || '...'}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(item.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="削除"
                        aria-label="この履歴を削除"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* フッター */}
          <footer className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Made with ヒカマニ by <a href="https://x.com/maebahesioru2" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 underline">十字架_mania</a>
            </p>
          </footer>
        </div>
      </aside>
    </>
  );
}
