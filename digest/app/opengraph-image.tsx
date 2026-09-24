import { ImageResponse } from 'next/og';

export const alt = 'Tech Digest';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#05080b',
          color: '#f7f9fa',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 32,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.06)',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            TD
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>Tech Digest</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 920 }}>
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1.05 }}>
            A little less noise. A little more signal.
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#9cabb2' }}>digest.joaoac.com</div>
        </div>
      </div>
    ),
    size,
  );
}
