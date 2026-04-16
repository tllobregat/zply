import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';

export const runtime: string = 'edge';

export const alt: string = 'Zply - Developer Toolbox';
export const size: { width: number; height: number } = {
  width: 1200,
  height: 630,
};

export const contentType: string = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }): Promise<ImageResponse> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  // Use t.raw to get the raw message string and strip tags
  const tagline: string = (t.raw('title') as string).replace(/<\/?span[^>]*>/g, '');

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0f1e', // matches .dark --background in globals.css
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
        {/* Background Gradients (matching layout.tsx) */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '50%',
            height: '50%',
            background: 'rgba(59, 130, 246, 0.12)', // zply-blue/12
            borderRadius: '100%',
            filter: 'blur(160px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '40%',
            height: '40%',
            background: 'rgba(139, 92, 246, 0.12)', // zply-purple/12 (#8b5cf6)
            borderRadius: '100%',
            filter: 'blur(140px)',
          }}
        />

        {/* Floating "Islands" decoration (smaller, more modern) */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            right: '12%',
            width: 140,
            height: 140,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 32,
            transform: 'rotate(12deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '10%',
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 24,
            transform: 'rotate(-15deg)',
          }}
        />

        {/* Main Content Card (Glassmorphism - Island Style) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '70px 90px',
            background: 'rgba(18, 26, 46, 0.6)', // Semi-transparent zinc-900 like
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 48,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* App Icon (Zap) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              background: '#3b82f6',
              borderRadius: 20,
              marginBottom: 32,
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="white"
              stroke="none"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.04em',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>Zply</span>
          </div>

          <div
            style={{
              fontSize: 34,
              color: '#f8fafc', // zinc-50 (foreground standard)
              fontWeight: 700,
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.2,
              marginBottom: 40,
              letterSpacing: '-0.01em',
            }}
          >
            {tagline}
          </div>

          {/* Features Row */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
            }}
          >
            {[
              { label: t('features.private'), color: 'rgba(34, 197, 94, 0.1)', textColor: '#22c55e' },
              { label: t('features.shareable'), color: 'rgba(249, 115, 22, 0.1)', textColor: '#f97316' },
              { label: t('features.fast'), color: 'rgba(59, 130, 246, 0.1)', textColor: '#3b82f6' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  background: feature.color,
                  border: `1px solid ${feature.textColor}22`,
                  borderRadius: 100,
                  fontSize: 18,
                  fontWeight: 800,
                  color: feature.textColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {feature.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Domain Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: 'rgba(255, 255, 255, 0.2)',
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.2em',
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
