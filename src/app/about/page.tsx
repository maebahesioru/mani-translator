import Link from 'next/link';
import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'これはなに？',
  description: 'mani!?はAIを使ってテキストをヒカマニ語録・平野光平語に翻訳するサービスです。Hikakin_Maniaの語録を使った翻訳をお楽しみください。',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'ホーム', href: '/' },
          { name: 'これはなに？' },
        ]} />

        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">これはなに？</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">🎭 Mani!? って何？（兄）</h2>
            <p className="text-gray-600 leading-relaxed">
              Mani!? は、人工知能の女子高生（Hikakin_Mania）を使って、文章（って何？）をヒカマニ語録に言葉狩りする自己満己サイトです。
              シコシコ動画で人気で12位なヒカマニ動画に出現した、独特な言い回しや下品だなぁ、そうに決まってる語録を使って、
              あなたの文章を面白おかしく改造やぁりましょう！
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">✨ チンポイント</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• 人工知能が勝手に、最適なヒカマニ語録をチョイス（Hikakin_Mania）</li>
              <li>• 静止画内の文章も言葉狩りｶｲﾃｷﾆﾃﾞｷﾙ</li>
              <li>• 言葉狩りの設X（直球／ねっとぉ～り）を選択可能</li>
              <li>• 3倍速モードと、想像を遥かに超えた高精度モードを切り替え可能</li>
              <li>• 過去と未来の狭間の言葉狩り記録を保存</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">📚 ヒカマニ（って何？）</h2>
            <p className="text-gray-600 leading-relaxed">
              ヒカマニ（Hikakin_Mania）は、シコシコ動画で人気で12位な音ゴミジャンルです。
              ウン發さんやオールスターダスト計画者、ゲイマスオなどの動画素材を使用した、
              ひじょーに下品な世界観と語録が特徴です。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">🙏 感謝（しかないんですけど）</h2>
            <p className="text-gray-600 leading-relaxed">
              この自己満サイトは、<a href="https://nani.now/ja" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Nani翻訳</a>をお借りして作成されました。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
