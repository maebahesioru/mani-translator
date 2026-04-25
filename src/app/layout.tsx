import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "mani!? - ヒカマニ語録翻訳サイト",
    template: "%s | mani!?",
  },
  description: "AIがテキストをヒカマニ語録・平野光平語に翻訳します。ニコニコ動画で人気の音MAD「Hikakin_Mania」の語録を使った翻訳サービス。",
  keywords: ["ヒカマニ", "Hikakin_Mania", "語録", "翻訳", "音MAD", "ニコニコ動画", "HIKAKIN", "平野光平", "KOUHEITV", "AI翻訳"],
  authors: [{ name: "十字架_mania" }],
  creator: "十字架_mania",
  publisher: "十字架_mania",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "mani!?",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://mani-translator.vercel.app",
    siteName: "mani!?",
    title: "mani!? - ヒカマニ語録翻訳サイト",
    description: "AIがテキストをヒカマニ語録・平野光平語に翻訳します。ニコニコ動画で人気の音MAD「Hikakin_Mania」の語録を使った翻訳サービス。",
  },
  twitter: {
    card: "summary_large_image",
    title: "mani!? - ヒカマニ語録翻訳サイト",
    description: "AIがテキストをヒカマニ語録・平野光平語に翻訳します。",
    creator: "@maebahesioru2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://mani-translator.vercel.app",
  },
  verification: {
    // Google Search Console登録後にここに追加
    // google: 'your-google-verification-code',
    // Bing Webmaster Tools登録後にここに追加
    // other: { 'msvalidate.01': 'your-bing-verification-code' },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'mani!?',
    description: 'AIがテキストをヒカマニ語録・平野光平語に翻訳するサービス',
    url: 'https://mani-translator.vercel.app',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    author: {
      '@type': 'Person',
      name: '十字架_mania',
      url: 'https://x.com/maebahesioru2',
    },
  };

  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="http://120.75.187.71:2048" />
        <link rel="dns-prefetch" href="http://120.75.187.71:2048" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
