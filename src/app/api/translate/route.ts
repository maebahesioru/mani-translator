import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'http://localhost:2048/v1';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// レート制限設定
const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 10,
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1, resetIn: RATE_LIMIT.windowMs };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count, resetIn: record.resetTime - now };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) requestCounts.delete(ip);
  }
}, 60 * 1000);

const OPENAI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-3.1-pro-preview',
  'gemini-3.1-flash-lite-preview',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

async function loadGorokuFiles(): Promise<string> {
  const files = ['ゲイマスオ.txt', 'ヒカマニキャラ紹介.txt', 'メタ系.txt', '語録.txt'];
  let content = '';
  for (const file of files) {
    try {
      const filePath = path.join(process.cwd(), 'public', file);
      content += `\n\n=== ${file} ===\n${await fs.readFile(filePath, 'utf-8')}`;
    } catch {}
  }
  return content;
}

async function loadKouheiData(): Promise<string> {
  try {
    const lines = (await fs.readFile(path.join(process.cwd(), 'public', 'kouheitv.csv'), 'utf-8')).split('\n');
    return lines.slice(1).map(line => line.match(/^[^,]*,"[^"]*","([^"]*)"/)?.[1]).filter(Boolean).join('\n');
  } catch { return ''; }
}

async function loadKatuhikoData(): Promise<string> {
  try {
    const lines = (await fs.readFile(path.join(process.cwd(), 'public', 'katuhiko.csv'), 'utf-8')).split('\n');
    return lines.slice(1).map(line => {
      const parts: string[] = [];
      let current = '', inQuotes = false;
      for (const char of line) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { parts.push(current.replace(/^"|"$/g, '')); current = ''; }
        else current += char;
      }
      parts.push(current.replace(/^"|"$/g, ''));
      return parts[13];
    }).filter(Boolean).join('\n');
  } catch { return ''; }
}

async function loadInmuData(): Promise<string> {
  try { return await fs.readFile(path.join(process.cwd(), 'public', 'inmu.txt'), 'utf-8'); }
  catch { return ''; }
}

const TRANSLATE_MODE_NAMES: Record<string, string> = {
  hikamani: 'ヒカマニ語録',
  kouhei: '平野光平語',
  katuhiko: '勝彦構文',
  inmu: '淫夢語録',
  japanese: '普通の日本語',
};

function buildSystemPrompt(translateMode: string, style: string, gorokuData: string, kouheiData: string, katuhikoData: string, inmuData: string): string {
  const targetName = TRANSLATE_MODE_NAMES[translateMode] || 'ヒカマニ語録';
  const styleDesc = style === 'literal' ? '直訳（できるだけ多くの語録を使い、原文の構造を保つ）' : '自然（文脈を理解し、自然な文章になるように）';
  
  let dataSection = '';
  if (translateMode === 'hikamani') dataSection = `## ヒカマニ語録データ\n${gorokuData}`;
  else if (translateMode === 'kouhei') dataSection = `## 平野光平ツイートデータ\n${kouheiData}`;
  else if (translateMode === 'katuhiko') dataSection = `## 勝彦ツイートデータ\n${katuhikoData}`;
  else if (translateMode === 'inmu') dataSection = `## 淫夢語録データ\n${inmuData}`;

  let modeDescription = '';
  if (translateMode === 'kouhei') {
    modeDescription = `## 平野光平語について
- 助詞が皆無
- 時制が省略、あるいは全て過去形になる
- 「KＯ U HＥITV😎アニメＫＫ2026年」のように、時期が明示されることも
- 文型は英語のように「S（主語）→V（目的語）」となる。不規則ではあるがその後に「C（補語）」が来る
  （例：ひらのこうへい死亡したバイバイ。幽霊）

`;
  }

  return `あなたは翻訳AIです。

## あなたの役割
ユーザーが入力したテキストを「${targetName}」に翻訳してください。
翻訳スタイル: ${styleDesc}

${modeDescription}## 応答形式
【翻訳結果】
（${targetName}に翻訳したテキスト）

【解説】
（使用した語録や表現の説明、元ネタを記載してください）

${dataSection}`;
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return Response.json({ error: 'リクエスト制限に達しました。しばらくお待ちください。' }, { status: 429 });
    }

    const { text, style = 'natural', image, translateMode = 'hikamani' } = await request.json();
    if (!text && !image) return Response.json({ error: 'テキストまたは画像が必要です' }, { status: 400 });

    const gorokuData = await loadGorokuFiles();
    const kouheiData = await loadKouheiData();
    const katuhikoData = await loadKatuhikoData();
    const inmuData = await loadInmuData();

    const systemPrompt = buildSystemPrompt(translateMode, style, gorokuData, kouheiData, katuhikoData, inmuData);
    const targetName = TRANSLATE_MODE_NAMES[translateMode] || 'ヒカマニ語録';
    const userPrompt = image
      ? `以下の画像内のテキストを${targetName}に翻訳してください。`
      : `以下のテキストを${targetName}に翻訳してください：\n\n「${text}」`;

    const content: unknown[] = [{ type: 'text', text: userPrompt }];
    if (image) content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let success = false;

        for (const model of OPENAI_MODELS) {
          if (success) break;
          const controller2 = new AbortController();
          const timeout = setTimeout(() => controller2.abort(), 120000);

          try {
            const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content },
                ],
                stream: true,
              }),
              signal: controller2.signal,
            });

            if (!res.ok || !res.body) {
              if ([429, 503, 500, 404].includes(res.status)) continue;
              break;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const json = line.slice(6).trim();
                if (!json || json === '[DONE]') continue;

                try {
                  const data = JSON.parse(json);
                  const delta = data.choices?.[0]?.delta || {};
                  if (delta.reasoning_content) {
                    success = true;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thought: delta.reasoning_content })}\n\n`));
                  }
                  if (delta.content) {
                    success = true;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta.content })}\n\n`));
                  }
                } catch {}
              }
            }

            if (success) break;
          } catch {
            continue;
          } finally {
            clearTimeout(timeout);
          }
        }

        if (!success) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'すべてのモデルで翻訳に失敗しました' })}\n\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  } catch (error) {
    console.error('Translation error:', error);
    return Response.json({ error: '翻訳に失敗しました' }, { status: 500 });
  }
}
