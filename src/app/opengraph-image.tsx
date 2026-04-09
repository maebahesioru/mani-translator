import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'mani!? - ヒカマニ語録翻訳サイト';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              background: 'white',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#3b82f6',
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: '96px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            mani!?
          </div>
        </div>
        <div
          style={{
            fontSize: '48px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '16px',
          }}
        >
          ヒカマニ語録翻訳サイト
        </div>
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          AIがテキストをヒカマニ語録・平野光平語に翻訳
        </div>
      </div>
    ),
    { ...size }
  );
}
