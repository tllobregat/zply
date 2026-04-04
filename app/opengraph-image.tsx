import { ImageResponse } from 'next/og';

export const runtime: string = 'edge';

export const alt: string = 'Zply - High Quality Developer Toolbox';
export const size: { width: number; height: number } = {
  width: 1200,
  height: 630,
};

export const contentType: string = 'image/png';

export default async function Image(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b', // zinc-950
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Gradients */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background: 'rgba(59, 130, 246, 0.15)', // zply-blue/15
            borderRadius: '100%',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            background: 'rgba(168, 85, 247, 0.15)', // zply-purple/15
            borderRadius: '100%',
            filter: 'blur(100px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 128,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.05em',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#3b82f6' }}>Z</span>
            <span>ply</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#a1a1aa', // zinc-400
              fontWeight: 500,
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            A fast, privacy-focused toolbox for developers.
            Zero backend, zero cookies, zero database.
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 100,
            color: '#71717a', // zinc-500
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          zply.dev
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
