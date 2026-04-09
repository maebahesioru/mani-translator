import Link from 'next/link';
import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: '料金プラン',
  description: 'mani!?は完全無料でご利用いただけます。テキスト翻訳、画像翻訳、翻訳履歴など全機能が無料。',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'ホーム', href: '/' },
          { name: '料金プラン' },
        ]} />

        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">料金プラン</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">完全無料</h2>
            <p className="text-gray-600 mb-6">
              Mani!? はすべての機能を無料でご利用いただけます。
            </p>

            <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
              <h3 className="font-bold text-gray-800 mb-3">含まれる機能</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  無制限のテキスト翻訳
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  画像翻訳
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  高速/高精度モード
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  翻訳履歴
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  PWA対応
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
