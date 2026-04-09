export interface TranslationResult {
  translation: string;
  explanation: string;
  rating: number;
  rawResponse: string;
  thought: string;
}

export type TranslateMode = 'hikamani' | 'kouhei' | 'katuhiko' | 'inmu' | 'japanese';

export interface TranslateSettings {
  style: 'literal' | 'natural';
  model: 'fast' | 'accurate';
  enterToSend: boolean;
  translateMode: TranslateMode;
}

export async function translateToHikamani(
  text: string,
  settings: TranslateSettings,
  onChunk?: (chunk: string) => void,
  onThought?: (thought: string) => void,
  image?: string
): Promise<TranslationResult> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      text,
      style: settings.style,
      model: settings.model,
      image,
      translateMode: settings.translateMode,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  let fullResponse = '';
  let fullThought = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    // 完全な行を処理
    const lines = buffer.split('\n');
    // 最後の不完全な行はバッファに残す
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;

      try {
        const data = JSON.parse(jsonStr);
        if (data.error) {
          throw new Error(data.error);
        }
        // 推論（thought）は別で処理
        if (data.thought) {
          fullThought += data.thought;
          if (onThought) {
            onThought(data.thought);
          }
        }
        // 本文（text）
        if (data.text) {
          fullResponse += data.text;
          if (onChunk) {
            onChunk(data.text);
          }
        }
      } catch {
        // Skip invalid JSON (might be incomplete)
      }
    }
  }

  // 残りのバッファを処理
  if (buffer.startsWith('data: ')) {
    const jsonStr = buffer.slice(6).trim();
    if (jsonStr && jsonStr !== '[DONE]') {
      try {
        const data = JSON.parse(jsonStr);
        if (data.thought) {
          fullThought += data.thought;
          if (onThought) onThought(data.thought);
        }
        if (data.text) {
          fullResponse += data.text;
          if (onChunk) onChunk(data.text);
        }
      } catch {
        // Skip
      }
    }
  }

  return parseResponse(fullResponse, fullThought);
}

function parseResponse(rawResponse: string, thought: string = ''): TranslationResult {
  let translation = '';
  let explanation = '';

  console.log('Raw response:', rawResponse);

  // 翻訳結果を抽出
  const translationMatch = rawResponse.match(/【翻訳結果】\s*([\s\S]*?)(?=【解説】|$)/);
  if (translationMatch) {
    translation = translationMatch[1].trim();
  }

  // 解説を抽出
  const explanationMatch = rawResponse.match(/【解説】\s*([\s\S]*?)$/);
  if (explanationMatch) {
    explanation = explanationMatch[1].trim();
  }

  console.log('Parsed translation:', translation);
  console.log('Parsed explanation:', explanation);

  // フォーマットが見つからない場合は全体を翻訳結果として扱う
  if (!translation) {
    translation = rawResponse;
  }

  return {
    translation,
    explanation,
    rating: 0,
    rawResponse,
    thought,
  };
}
