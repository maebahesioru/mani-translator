import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#3b82f6',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: '100px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size }
  );
}
