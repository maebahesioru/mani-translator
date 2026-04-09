import Link from 'next/link';
import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'mani!?の利用規約。サービス内容、禁止事項、免責事項、著作権について。',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'ホーム', href: '/' },
          { name: '利用規約' },
        ]} />

        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">利用規約</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第1条（適用）</h2>
            <p className="text-gray-600 leading-relaxed">
              本規約は、Mani!?（以下「本サービス」）の利用に関する条件を定めるものです。
              本サービスを利用することで、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第2条（サービス内容）</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスは、AIを使用してテキストをヒカマニ語録に翻訳するサービスです。
              翻訳結果はAIによる自動生成であり、正確性を保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第3条（禁止事項）</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• 法令または公序良俗に違反する行為</li>
              <li>• 他者の権利を侵害する行為</li>
              <li>• サービスの運営を妨害する行為</li>
              <li>• 不正アクセスやシステムへの攻撃</li>
              <li>• 商用目的での無断利用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第4条（免責事項）</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
              翻訳結果の使用は自己責任でお願いします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第5条（著作権）</h2>
            <p className="text-gray-600 leading-relaxed">
              ヒカマニ語録の著作権は各権利者に帰属します。
              本サービスはパロディ・ファンアートとしての利用を目的としています。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第6条（規約の変更）</h2>
            <p className="text-gray-600 leading-relaxed">
              運営者は、必要に応じて本規約を変更できるものとします。
              変更後の規約は、本サービス上に掲載した時点で効力を生じます。
            </p>
          </section>

          <div className="text-sm text-gray-400 pt-4 border-t border-gray-100">
            最終更新日: 2025年1月5日
          </div>
        </div>
      </div>
    </div>
  );
}
