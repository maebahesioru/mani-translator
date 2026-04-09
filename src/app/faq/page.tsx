import Link from 'next/link';
import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'よくある質問',
  description: 'mani!?の使い方やヒカマニ語録についてのよくある質問と回答。翻訳機能、画像翻訳、高速/高精度モードなどについて解説。',
};

const faqs = [
  {
    question: 'ヒカマニ語録とは何ですか？',
    answer: 'ヒカマニ（Hikakin_Mania）は、ニコニコ動画で人気の音MADジャンルです。HIKAKINやSEIKIN、MasuoTVなどの動画素材を使用した独特な言い回しや語録が特徴です。',
  },
  {
    question: '翻訳は無料ですか？',
    answer: 'はい、完全無料でご利用いただけます。回数制限もありません。',
  },
  {
    question: '画像の翻訳はできますか？',
    answer: 'はい、画像内のテキストを読み取ってヒカマニ語録に翻訳できます。入力欄の右下にあるクリップアイコンから画像をアップロードしてください。',
  },
  {
    question: '高速モードと高精度モードの違いは？',
    answer: '高速モードは応答が速く、高精度モードはより正確な翻訳を行います。設定ボタン（歯車アイコン）から切り替えられます。',
  },
  {
    question: '翻訳履歴は保存されますか？',
    answer: 'はい、ブラウザのローカルストレージに保存されます。サイドバーから過去の翻訳を確認できます。',
  },
  {
    question: 'スマホでも使えますか？',
    answer: 'はい、PWA対応しているのでスマホのホーム画面に追加してアプリのように使えます。',
  },
  {
    question: '翻訳結果がおかしい場合は？',
    answer: 'AIによる翻訳のため、完璧ではない場合があります。翻訳スタイルを「直訳」に変更したり、高精度モードを試してみてください。',
  },
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'ホーム', href: '/' },
          { name: 'よくある質問' },
        ]} />

        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">よくある質問</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-start gap-2">
                <span className="text-blue-500">Q.</span>
                {faq.question}
              </h2>
              <p className="text-gray-600 pl-6">
                <span className="text-green-500 font-bold">A.</span> {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
