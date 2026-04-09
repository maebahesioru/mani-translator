'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Sidebar, { HistoryItem } from '@/components/Sidebar';
import TranslatorInput, { TranslateSettings, TranslateMode } from '@/components/TranslatorInput';
import TranslationResult from '@/components/TranslationResult';
import SecondaryInput from '@/components/SecondaryInput';
import { translateToHikamani, TranslationResult as Result } from '@/lib/api';

// タイプライターアニメーション用のカスタムフック
function useTypewriter(speed = 12) {
  const [displayedText, setDisplayedText] = useState('');
  const queueRef = useRef<string[]>([]);
  const fullTextRef = useRef('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      timerRef.current = null;
      return;
    }

    // 一度に複数文字を処理して高速化
    const charsToProcess = Math.min(3, queueRef.current.length);
    const chars = queueRef.current.splice(0, charsToProcess).join('');
    setDisplayedText(prev => prev + chars);

    timerRef.current = setTimeout(processQueue, speed);
  }, [speed]);

  const addText = useCallback((text: string) => {
    fullTextRef.current += text;
    queueRef.current.push(...text.split(''));
    
    if (!timerRef.current) {
      processQueue();
    }
  }, [processQueue]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    queueRef.current = [];
    fullTextRef.current = '';
    setDisplayedText('');
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    queueRef.current = [];
    setDisplayedText(fullTextRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { displayedText, addText, reset, flush, fullText: fullTextRef.current };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [originalText, setOriginalText] = useState('');
  const [hasTranslated, setHasTranslated] = useState(false);
  const [translateMode, setTranslateMode] = useState<TranslateMode>('hikamani');

  const textTypewriter = useTypewriter(10);
  const thoughtTypewriter = useTypewriter(8);

  // 履歴をローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('mani-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 新しい形式（result プロパティを持つ）のみをフィルタリング
        const validItems = parsed.filter((item: HistoryItem & { translated?: string }) => 
          item.result && item.result.translation
        );
        setHistory(validItems.map((item: HistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })));
        // 古い形式のデータがあった場合は新しい形式で保存し直す
        if (validItems.length !== parsed.length) {
          localStorage.setItem('mani-history', JSON.stringify(validItems));
        }
      } catch {
        // Invalid data - clear it
        localStorage.removeItem('mani-history');
      }
    }
  }, []);

  // 履歴をローカルストレージに保存
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('mani-history', JSON.stringify(history));
    }
  }, [history]);

  const handleTranslate = useCallback(async (text: string, settings: TranslateSettings, image?: string) => {
    setIsLoading(true);
    setIsStreaming(true);
    textTypewriter.reset();
    thoughtTypewriter.reset();
    setResult(null);
    setOriginalText(text);

    // translateModeをsettingsに追加
    const settingsWithMode = { ...settings, translateMode };

    try {
      const translationResult = await translateToHikamani(
        text,
        settingsWithMode,
        (chunk) => {
          textTypewriter.addText(chunk);
        },
        (thought) => {
          thoughtTypewriter.addText(thought);
        },
        image
      );

      // ストリーミング終了時に残りを即座に表示
      textTypewriter.flush();
      thoughtTypewriter.flush();
      
      setResult(translationResult);
      setIsStreaming(false);

      // 履歴に追加
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        original: text || '(画像翻訳)',
        result: translationResult,
        timestamp: new Date(),
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
      setHasTranslated(true);
    } catch (error) {
      console.error('Translation error:', error);
      textTypewriter.addText('翻訳に失敗しました。もう一度お試しください。');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  }, [textTypewriter, thoughtTypewriter, translateMode]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    // 履歴から選択した場合は保存された結果を表示
    setOriginalText(item.original);
    setResult(item.result);
    textTypewriter.reset();
    thoughtTypewriter.reset();
    setHasTranslated(true);
  }, [textTypewriter, thoughtTypewriter]);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== id);
      if (newHistory.length === 0) {
        localStorage.removeItem('mani-history');
      } else {
        localStorage.setItem('mani-history', JSON.stringify(newHistory));
      }
      return newHistory;
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <Sidebar
        history={history}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={handleDeleteHistory}
      />

      {/* サイドバーとメインの間のセカンダリ入力 */}
      {hasTranslated && (
        <div className="hidden lg:flex w-96 border-r border-gray-200 bg-[#f4f6f8] p-4 h-screen sticky top-0">
          <div className="w-full max-h-[calc(100vh-2rem)]">
            <SecondaryInput onTranslate={handleTranslate} isLoading={isLoading} />
          </div>
        </div>
      )}

      <main className="flex-1 lg:ml-0 flex flex-col min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12 flex-1">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              mani!? 翻訳
            </h1>
          </div>

          {/* 入力エリア */}
          <div className="mb-6">
            <TranslatorInput 
              onTranslate={handleTranslate} 
              isLoading={isLoading}
              translateMode={translateMode}
              onTranslateModeChange={setTranslateMode}
            />
          </div>

          {/* 結果表示 */}
          {(result || textTypewriter.displayedText || thoughtTypewriter.displayedText) && (
            <div className="mb-6">
              <TranslationResult
                result={result}
                streamingText={textTypewriter.displayedText}
                streamingThought={thoughtTypewriter.displayedText}
                isStreaming={isStreaming}
              />
            </div>
          )}

          {/* 元テキスト表示 */}
          {originalText && result && (
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <h3 className="font-bold text-gray-800">元のテキスト</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">{originalText}</p>
              </div>
            </div>
          )}

          {/* フッター情報 */}
          <div className="mt-12 text-center space-y-2">
            <div className="inline-flex items-center gap-4 text-sm text-gray-400">
              <span>ヒカマニ語録翻訳サイト</span>
              <span>•</span>
              <span>Powered by Gemini AI</span>
            </div>
            <div className="text-xs text-gray-400">
              元ネタ: <a href="https://nani.now/ja" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 underline">Nani翻訳</a>
            </div>
          </div>
        </div>

        {/* サイトフッター */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* ブランド */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">M</span>
                  <span className="text-lg font-bold text-gray-800">Mani!?</span>
                </div>
                <p className="text-xs text-gray-500">AIがヒカマニ語録に翻訳</p>
              </div>

              {/* リンク1 */}
              <nav aria-label="サービスリンク">
                <h4 className="text-sm font-medium text-gray-700 mb-3">サービス</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link href="/" className="hover:text-blue-500 transition-colors">ホーム</Link></li>
                  <li><Link href="/about" prefetch={true} className="hover:text-blue-500 transition-colors">これはなに？</Link></li>
                  <li><Link href="/pricing" prefetch={true} className="hover:text-blue-500 transition-colors">料金プラン</Link></li>
                  <li><Link href="/faq" prefetch={true} className="hover:text-blue-500 transition-colors">FAQ</Link></li>
                  <li><Link href="/terms" prefetch={false} className="hover:text-blue-500 transition-colors">利用規約</Link></li>
                </ul>
              </nav>

              {/* リンク2 */}
              <nav aria-label="サポートリンク">
                <h4 className="text-sm font-medium text-gray-700 mb-3">サポート</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="https://x.com/maebahesioru2" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">お問い合わせ / 障害情報</a></li>
                </ul>
              </nav>
            </div>

            <div className="border-t border-gray-100 mt-8 pt-6 text-center text-xs text-gray-400">
              <p>© 2025 Mani!? - Made with ヒカマニ by <a href="https://x.com/maebahesioru2" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">十字架_mania</a></p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
