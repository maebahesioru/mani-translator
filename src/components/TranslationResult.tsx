'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { TranslationResult as Result } from '@/lib/api';

interface TranslationResultProps {
  result: Result | null;
  streamingText: string;
  streamingThought: string;
  isStreaming: boolean;
}

export default function TranslationResult({ result, streamingText, streamingThought, isStreaming }: TranslationResultProps) {
  const [showThought, setShowThought] = useState(false);
  
  if (!result && !streamingText && !streamingThought) return null;

  const thought = result?.thought || streamingThought;

  return (
    <div className="w-full space-y-4">
      {/* 推論（思考過程） */}
      {thought && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowThought(!showThought)}
            className="w-full px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🤔</span>
              <h3 className="font-bold text-gray-800">AIの思考過程</h3>
              {isStreaming && streamingThought && (
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">思考中...</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showThought ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {showThought && (
            <div className="p-4 bg-amber-50/30">
              <div className="prose prose-sm prose-amber max-w-none text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>{thought}</ReactMarkdown>
                {isStreaming && streamingThought && !streamingText && (
                  <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse ml-1" />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 翻訳結果 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎭</span>
            <h3 className="font-bold text-gray-800">翻訳結果</h3>
          </div>
        </div>
        <div className="p-4">
          {isStreaming ? (
            <div className="prose prose-gray max-w-none text-gray-800">
              {streamingText ? (
                <>
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>{streamingText}</ReactMarkdown>
                  <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
                </>
              ) : streamingThought ? (
                <span className="text-gray-400">思考中...</span>
              ) : null}
            </div>
          ) : result ? (
            <div className="prose prose-gray max-w-none text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>{result.translation}</ReactMarkdown>
            </div>
          ) : null}
        </div>
        {result && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(result.translation)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span>コピー</span>
            </button>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-400">シェア:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.translation + '\n\n#mani翻訳 #ヒカマニ')}&url=${encodeURIComponent('https://mani-translator.vercel.app')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                title="Xでシェア"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://bsky.app/intent/compose?text=${encodeURIComponent(result.translation + '\n\n#mani翻訳 #ヒカマニ\nhttps://mani-translator.vercel.app')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0085ff] text-white hover:bg-[#0070dd] transition-colors"
                title="Blueskyでシェア"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 解説 */}
      {result?.explanation && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <h3 className="font-bold text-gray-800">解説</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="prose prose-sm prose-green max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>{result.explanation}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
