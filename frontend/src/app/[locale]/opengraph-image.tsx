import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ResolveIQ — Kannada-First Agentic Civic Grievance System';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params: { locale } }: { params: { locale: string } }) {
  const isKn = locale === 'kn';
  const tagline = isKn ? 'ನಿಮ್ಮ ದೂರು, ನಮ್ಮ ಜವಾಬ್ದಾರಿ' : 'Every complaint is a promise. We prove it was kept.';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#060B16',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: '#0D1526',
            border: '1px solid #1E2A44',
            color: '#38BDF8',
            fontSize: '18px',
            marginBottom: '24px',
          }}
        >
          Problem Statement AA-02: Civic Resolution Assistant
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: '76px',
            fontWeight: 800,
            color: '#E6EDF7',
            letterSpacing: '-2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Resolve<span style={{ color: '#38BDF8' }}>IQ</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            color: '#8A97B2',
            maxWidth: '900px',
            textAlign: 'center',
            marginTop: '20px',
            lineHeight: 1.4,
          }}
        >
          {tagline}
        </div>

        {/* Modalities */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
            fontSize: '16px',
            color: '#38BDF8',
          }}
        >
          <span>Kannada</span> • <span>Kanglish</span> • <span>Voice</span> • <span>Clustering</span> • <span>Verified Closure</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

