'use client';

import { useState, useEffect } from 'react';

/* --- brand tokens ------------------------------------------------ */
const PINK_DEEP = '#be185d'; // text headings
const PINK_BRAND = '#df2b80'; // accents / wax seal / stamp
const PINK_MID = '#ec4899'; // flap gradient stop
const PINK_LIGHT = '#f472b6'; // flap gradient tip / bokeh
const PINK_PALE = '#f9a8d4'; // borders / dividers
const PINK_BLUSH = '#fce7f3'; // background tints
const CREAM = '#fffbfd'; // envelope body

/* --- envelope geometry ------------------------------------------- */
const EW = 340; // envelope width  (px)
const EH = 220; // envelope height (px)
const FLAP_TIP = 120; // depth of top-flap triangle

/* --- petal data (fixed - no Math.random) ------------------------ */
type PetalDef = { x: number; delay: number; dur: number; size: number; rot: number; color: string };
const PETALS: PetalDef[] = [
  { x: 7, delay: 0.0, dur: 7.5, size: 16, rot: 22, color: PINK_PALE },
  { x: 18, delay: 1.6, dur: 6.0, size: 12, rot: -38, color: PINK_MID },
  { x: 31, delay: 3.0, dur: 8.5, size: 20, rot: 58, color: PINK_LIGHT },
  { x: 46, delay: 0.8, dur: 6.5, size: 11, rot: -14, color: '#fda4af' },
  { x: 62, delay: 3.5, dur: 7.2, size: 18, rot: 45, color: PINK_PALE },
  { x: 77, delay: 1.9, dur: 6.3, size: 14, rot: -55, color: PINK_MID },
  { x: 90, delay: 0.5, dur: 8.2, size: 16, rot: 30, color: PINK_LIGHT },
  { x: 13, delay: 4.4, dur: 9.0, size: 10, rot: -25, color: '#fda4af' },
  { x: 86, delay: 2.5, dur: 5.5, size: 19, rot: 70, color: PINK_PALE },
  { x: 42, delay: 4.0, dur: 7.8, size: 13, rot: -48, color: PINK_LIGHT },
  { x: 57, delay: 5.4, dur: 6.2, size: 15, rot: 14, color: PINK_MID },
  { x: 24, delay: 1.3, dur: 8.3, size: 17, rot: -33, color: '#fda4af' },
];

/* --- sparkles that burst from the seal when flap opens ---------- */
type SparkDef = { dx: number; dy: number; delay: number; size: number };
const SPARKS: SparkDef[] = [
  { dx: -65, dy: -55, delay: 0.0, size: 9 },
  { dx: 55, dy: -75, delay: 0.07, size: 7 },
  { dx: 88, dy: -28, delay: 0.14, size: 11 },
  { dx: -88, dy: -18, delay: 0.21, size: 8 },
  { dx: 18, dy: -95, delay: 0.28, size: 7 },
  { dx: -45, dy: -82, delay: 0.1, size: 6 },
  { dx: 65, dy: -58, delay: 0.24, size: 10 },
  { dx: -72, dy: -64, delay: 0.17, size: 7 },
];

/* --- CSS keyframes injected once -------------------------------- */
const ANIM_CSS = `
  /* Petals fall and drift across screen */
  @keyframes petalFall {
    0%   { transform: translateY(-20px) rotate(var(--pr)) scale(0.72); opacity: 0; }
    10%  { opacity: 0.88; }
    85%  { opacity: 0.55; }
    100% { transform: translateY(108vh) rotate(calc(var(--pr) + 270deg)) scale(1.05); opacity: 0; }
  }
  /* Envelope rises from below on load */
  @keyframes envAppear {
    0%   { opacity: 0; transform: translateY(100px) scale(0.76); filter: blur(6px); }
    55%  { filter: blur(0); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  /* Envelope "breathes" gently while waiting */
  @keyframes envBreath {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  /* Wax seal pulses with glow before opening */
  @keyframes sealGlow {
    0%, 100% { box-shadow: 0 0 12px 4px rgba(223,43,128,0.55), 0 5px 18px rgba(223,43,128,0.40); }
    50%       { box-shadow: 0 0 30px 11px rgba(223,43,128,0.92), 0 6px 26px rgba(223,43,128,0.68); }
  }
  @keyframes sealPulse {
    0%, 100% { transform: translateX(-50%) scale(1);    }
    50%       { transform: translateX(-50%) scale(1.12); }
  }
  /* Sparkle particles burst when seal opens */
  @keyframes sparkle {
    0%   { transform: translate(0,0) scale(0.3); opacity: 1; }
    65%  { opacity: 0.85; }
    100% { transform: translate(var(--sx),var(--sy)) scale(0); opacity: 0; }
  }
  /* Shimmer sweep across "You are invited!" text */
  @keyframes shimmerText {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  /* Shine sweep across the letter card */
  @keyframes letterShine {
    0%   { left: -90%; opacity: 0; }
    12%  { opacity: 0.55; }
    88%  { opacity: 0.35; }
    100% { left: 140%; opacity: 0; }
  }
  /* "Tap anywhere" softly blinks */
  @keyframes ctaBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  /* Flap folds open – rotates back from closed (0) to open (-180deg) */
  @keyframes flapOpen {
    0%   { transform: rotateX(0deg); }
    40%  { transform: rotateX(-95deg); }   /* brief hesitation at 90° */
    100% { transform: rotateX(-182deg); } /* slightly past flat so it stays behind */
  }
  /* Flap shadow that grows as flap lifts */
  @keyframes flapShadow {
    0%   { opacity: 0; transform: scaleX(1);    }
    40%  { opacity: 0.22; }
    100% { opacity: 0; transform: scaleX(0.6); }
  }
`;

interface EnvelopeAnimationProps {
  onComplete: () => void;
}

export function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  /* phase sequence: idle -> opening -> letter -> done */
  const [phase, setPhase] = useState<'idle' | 'opening' | 'letter' | 'done'>('idle');

  /*
   * Cinematic timeline:
   *  0 ms   – envelope slides in (envAppear 1.2s)
   *  1 600ms – flap starts rotating (1.0s flip)
   *  2 800ms – sparkles burst + letter starts rising (0.95s spring)
   *  3 700ms – "You are invited!" text fades in
   */
  useEffect(() => {
    const t = setTimeout(() => setPhase('opening'), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'opening') {
      /* wait for flap to finish (1 000ms) + 200ms pause */
      const t = setTimeout(() => setPhase('letter'), 1200);
      return () => clearTimeout(t);
    }
    if (phase === 'letter') {
      const t = setTimeout(() => setPhase('done'), 950);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleTap = () => {
    if (phase === 'done') setTimeout(onComplete, 160);
  };

  const flapOpen = phase !== 'idle';
  const letterUp = phase === 'letter' || phase === 'done';
  const textReady = phase === 'done';

  /* -- helpers --------------------------------------------------- */
  const cx = EW / 2;
  const cy = EH / 2;

  return (
    <>
      <style>{ANIM_CSS}</style>

      {/* -- Full-screen backdrop ----------------------------------- */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(155deg, #fff1f5 0%, #ffffff 35%, #fce7f3 65%, #fbd5e8 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          overflow: 'hidden',
          userSelect: 'none',
        }}
        onClick={handleTap}
      >
        {/* -- Ambient bokeh blobs ----------------------------------- */}
        {(
          [
            { size: 220, top: '4%', left: '6%', op: 0.1 },
            { size: 170, top: '55%', right: '5%', op: 0.08 },
            { size: 140, bottom: '5%', left: '3%', op: 0.07 },
            { size: 200, top: '10%', right: '3%', op: 0.09 },
            { size: 110, top: '42%', left: '0%', op: 0.06 },
          ] as Array<{
            size: number;
            top?: string;
            left?: string;
            right?: string;
            bottom?: string;
            op: number;
          }>
        ).map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(223,43,128,${b.op}), transparent 72%)`,
            }}
          />
        ))}

        {/* -- Falling rose petals ----------------------------------- */}
        {PETALS.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              top: '-30px',
              left: `${p.x}%`,
              ['--pr' as string]: `${p.rot}deg`,
              animation: `petalFall ${p.dur}s ${p.delay}s ease-in infinite`,
            }}
          >
            {/* Proper teardrop petal shape */}
            <svg width={p.size * 1.4} height={p.size * 1.8} viewBox="0 0 20 28">
              <path
                d="M10 0 C10 0 20 10 20 17 C20 22.5 15.5 27 10 27 C4.5 27 0 22.5 0 17 C0 10 10 0 10 0Z"
                fill={p.color}
                opacity="0.82"
              />
              <path
                d="M10 4 C10 4 17 12 17 17 C17 20.8 13.9 24 10 24"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            ENVELOPE + LETTER SCENE
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            perspective: '1000px',
            animation:
              phase === 'idle'
                ? 'envAppear 1.2s cubic-bezier(0.22,1,0.36,1) both, envBreath 3.5s 1.8s ease-in-out infinite'
                : 'envAppear 1.2s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          {/* -- Letter / invitation card ------------------------------ */}
          <div
            style={{
              position: 'absolute',
              width: EW * 0.64,
              bottom: EH * 0.44,
              left: '50%',
              transform: `translateX(-50%) translateY(${letterUp ? '-125px' : '10px'})`,
              opacity: letterUp ? 1 : 0,
              transition: 'transform 0.85s cubic-bezier(0.34,1.42,0.64,1), opacity 0.5s ease',
              zIndex: 14,
              pointerEvents: 'none',
            }}
          >
            {/* card glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderRadius: '6px',
                background: `rgba(223,43,128,0.14)`,
                filter: 'blur(14px)',
                transform: 'translateY(10px)',
              }}
            />

            {/* card face */}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(165deg, #fffbfc 0%, #fff8fb 55%, #fef2f8 100%)',
                border: `1.5px solid ${PINK_PALE}`,
                borderRadius: '6px',
                padding: '20px 16px 17px',
                textAlign: 'center',
                boxShadow: '0 10px 34px rgba(223,43,128,0.14), 0 2px 10px rgba(0,0,0,0.06)',
              }}
            >
              {/* shine sweep when letter appears */}
              {letterUp && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '55%',
                    pointerEvents: 'none',
                    background:
                      'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
                    animation: 'letterShine 1.0s 0.15s ease-in-out both',
                    zIndex: 10,
                  }}
                />
              )}
              {/* SVG corner flourishes */}
              {(
                [
                  { top: 4, left: 4, transform: 'rotate(0deg)' },
                  { top: 4, right: 4, transform: 'rotate(90deg)' },
                  { bottom: 4, right: 4, transform: 'rotate(180deg)' },
                  { bottom: 4, left: 4, transform: 'rotate(270deg)' },
                ] as Array<{
                  top?: number;
                  left?: number;
                  right?: number;
                  bottom?: number;
                  transform: string;
                }>
              ).map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: c.top,
                    left: c.left,
                    right: c.right,
                    bottom: c.bottom,
                    width: 18,
                    height: 18,
                    transform: c.transform,
                    pointerEvents: 'none',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path
                      d="M2 16 Q2 2 16 2"
                      stroke={PINK_LIGHT}
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx="2" cy="16" r="1.4" fill={PINK_LIGHT} />
                    <circle cx="16" cy="2" r="1.4" fill={PINK_LIGHT} />
                  </svg>
                </div>
              ))}

              {/* inner border frame */}
              <div
                style={{
                  border: `1px solid ${PINK_BLUSH}`,
                  borderRadius: '4px',
                  padding: '12px 10px',
                }}
              >
                {/* ornament row */}
                <div
                  style={{
                    color: PINK_BRAND,
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    marginBottom: '6px',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  ✦&nbsp;♥&nbsp;✦
                </div>

                <p
                  style={{
                    fontFamily: 'Georgia, "Libre Baskerville", serif',
                    fontSize: '9px',
                    color: '#9d174d',
                    fontStyle: 'italic',
                    letterSpacing: '0.07em',
                    lineHeight: 1.5,
                  }}
                >
                  You are cordially
                </p>

                <p
                  style={{
                    fontFamily: 'Georgia, "Libre Baskerville", serif',
                    fontSize: '18px',
                    color: PINK_DEEP,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    marginTop: '2px',
                    lineHeight: 1.2,
                  }}
                >
                  Invited
                </p>

                {/* ribbon divider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    margin: '8px 0 6px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      background: `linear-gradient(to right, transparent, ${PINK_PALE})`,
                    }}
                  />
                  <span style={{ color: PINK_BRAND, fontSize: '8px' }}>♥</span>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      background: `linear-gradient(to left, transparent, ${PINK_PALE})`,
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: '7px',
                    color: PINK_MID,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  Schatzie's Events
                </p>
              </div>
            </div>
          </div>

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
              ENVELOPE BODY
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          <div
            style={{
              position: 'relative',
              width: EW,
              height: EH,
              filter:
                'drop-shadow(0 22px 55px rgba(223,43,128,0.22)) ' +
                'drop-shadow(0 5px 14px rgba(0,0,0,0.10))',
            }}
          >
            {/* cream base */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderRadius: '5px',
                background: `linear-gradient(170deg, ${CREAM} 0%, #fef5fb 60%, #fdeef8 100%)`,
                border: `1.8px solid ${PINK_PALE}`,
              }}
            />

            {/* -- Main SVG: side flaps + address lines -- */}
            <svg
              width={EW}
              height={EH}
              viewBox={`0 0 ${EW} ${EH}`}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="lgLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fce7f3" />
                  <stop offset="100%" stopColor="#fdf2f8" />
                </linearGradient>
                <linearGradient id="lgRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fdf2f8" />
                  <stop offset="100%" stopColor="#fbcfe8" />
                </linearGradient>
                <linearGradient id="lgBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fde8f3" />
                  <stop offset="100%" stopColor="#fbcfe8" />
                </linearGradient>
              </defs>

              {/* left flap triangle */}
              <polygon
                points={`1,1 1,${EH - 1} ${cx},${cy}`}
                fill="url(#lgLeft)"
                stroke={PINK_PALE}
                strokeWidth="0.8"
              />
              {/* right flap triangle */}
              <polygon
                points={`${EW - 1},1 ${EW - 1},${EH - 1} ${cx},${cy}`}
                fill="url(#lgRight)"
                stroke={PINK_PALE}
                strokeWidth="0.8"
              />
              {/* bottom flap triangle */}
              <polygon
                points={`1,${EH - 1} ${EW - 1},${EH - 1} ${cx},${cy}`}
                fill="url(#lgBottom)"
                stroke={PINK_PALE}
                strokeWidth="0.8"
              />

              {/* fold crease lines */}
              {[
                [1, 1],
                [EW - 1, 1],
                [1, EH - 1],
                [EW - 1, EH - 1],
              ].map(([x, y], i) => (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={cx}
                  y2={cy}
                  stroke={PINK_PALE}
                  strokeWidth="0.55"
                  strokeOpacity="0.55"
                />
              ))}

              {/* address lines (lower-left of body) */}
              {[0.62, 0.73, 0.83].map((ratio, i) => (
                <line
                  key={i}
                  x1="22"
                  y1={EH * ratio}
                  x2={EW * (0.56 - i * 0.04)}
                  y2={EH * ratio}
                  stroke={PINK_BLUSH}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* -- Postage stamp (top-right) -- */}
            <div
              style={{
                position: 'absolute',
                top: 13,
                right: 18,
                zIndex: 30,
              }}
            >
              {/* perforated outer border â€” dotted trick */}
              <div
                style={{
                  padding: '3px',
                  background: PINK_BLUSH,
                  borderRadius: '2px',
                  border: `1.5px dotted ${PINK_PALE}`,
                }}
              >
                {/* stamp face */}
                <div
                  style={{
                    width: 36,
                    height: 44,
                    background: 'linear-gradient(145deg, #fff0f6, #fce7f3)',
                    border: `1px solid ${PINK_PALE}`,
                    borderRadius: '1px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1, color: PINK_BRAND }}>♥</span>
                  <div style={{ width: '26px', height: '1px', background: PINK_PALE }} />
                  <span
                    style={{
                      fontSize: '5px',
                      color: PINK_DEEP,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Love
                  </span>
                </div>
              </div>
            </div>

            {/* -- Flap lift shadow (ellipse that fades as flap opens) -- */}
            {flapOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: FLAP_TIP - 8,
                  left: '10%',
                  width: '80%',
                  height: 18,
                  borderRadius: '50%',
                  background: 'rgba(223,43,128,0.18)',
                  filter: 'blur(8px)',
                  zIndex: 19,
                  pointerEvents: 'none',
                  animation: 'flapShadow 1.1s cubic-bezier(0.4,0,0.2,1) both',
                }}
              />
            )}

            {/* -- Top flap (3D rotateX open) -- */}
            {/* Wrapper gives the perspective so rotateX works in 3D */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: EW,
                height: FLAP_TIP + 6,
                perspective: '900px',
                perspectiveOrigin: '50% 0%',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  transformOrigin: '50% 0%',
                  transformStyle: 'preserve-3d',
                  /* Use animation when opening, snap back instantly if re-mounted in idle */
                  animation: flapOpen ? 'flapOpen 1.1s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
                }}
              >
                <svg width={EW} height={FLAP_TIP + 6} viewBox={`0 0 ${EW} ${FLAP_TIP + 6}`}>
                  <defs>
                    <linearGradient id="flapFront" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={PINK_BRAND} />
                      <stop offset="55%" stopColor={PINK_MID} />
                      <stop offset="100%" stopColor={PINK_LIGHT} />
                    </linearGradient>
                    {/* subtle inner highlight on flap */}
                    <linearGradient id="flapHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>

                  {/* main flap triangle */}
                  <polygon
                    points={`1,0 ${EW - 1},0 ${cx},${FLAP_TIP}`}
                    fill="url(#flapFront)"
                    stroke="#e879a8"
                    strokeWidth="1"
                  />
                  {/* sheen */}
                  <polygon
                    points={`22,0 ${EW - 22},0 ${cx},${FLAP_TIP * 0.8}`}
                    fill="url(#flapHighlight)"
                  />
                  {/* bottom edge shadow line */}
                  <line
                    x1="1"
                    y1="0"
                    x2={cx}
                    y2={FLAP_TIP}
                    stroke="rgba(0,0,0,0.08)"
                    strokeWidth="1"
                  />
                  <line
                    x1={EW - 1}
                    y1="0"
                    x2={cx}
                    y2={FLAP_TIP}
                    stroke="rgba(0,0,0,0.08)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* -- Sparkle burst when flap opens -- */}
            {SPARKS.map((s, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: FLAP_TIP - 6,
                  left: '50%',
                  zIndex: 24,
                  pointerEvents: 'none',
                  ['--sx' as string]: `${s.dx}px`,
                  ['--sy' as string]: `${s.dy}px`,
                  opacity: 0,
                  animation: flapOpen
                    ? `sparkle 0.7s ${s.delay}s cubic-bezier(0.25,0.46,0.45,0.94) both`
                    : 'none',
                }}
              >
                <svg width={s.size} height={s.size} viewBox="0 0 24 24">
                  <path
                    d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z"
                    fill={PINK_BRAND}
                    opacity="0.9"
                  />
                </svg>
              </div>
            ))}

            {/* -- Wax seal -- */}
            <div
              style={{
                position: 'absolute',
                top: FLAP_TIP - 29,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 22,
                opacity: flapOpen ? 0 : 1,
                transition: 'opacity 0.22s ease',
                pointerEvents: 'none',
                animation: !flapOpen ? 'sealPulse 1.8s 1.0s ease-in-out infinite' : 'none',
              }}
            >
              {/* outer glow ring */}
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 33% 28%,
                    ${PINK_LIGHT} 0%,
                    ${PINK_BRAND} 42%,
                    #9d174d        100%)`,
                  border: '2.5px solid rgba(255,255,255,0.70)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'sealGlow 1.8s 1.0s ease-in-out infinite',
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontSize: '27px',
                    lineHeight: 1,
                    textShadow: '0 1px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.25)',
                  }}
                >
                  ♥
                </span>
              </div>
            </div>
          </div>
          {/* end envelope body */}
        </div>
        {/* end scene */}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            "You are invited!" TEXT
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div
          style={{
            marginTop: 50,
            padding: '0 28px',
            textAlign: 'center',
            opacity: textReady ? 1 : 0,
            transform: textReady ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 0.85s ease, transform 0.85s ease',
          }}
        >
          {/* shimmer heading */}
          <h1
            style={{
              fontFamily: 'Georgia, "Libre Baskerville", serif',
              fontSize: 'clamp(2rem, 9.5vw, 3.6rem)',
              fontWeight: 'bold',
              letterSpacing: '0.015em',
              lineHeight: 1.15,
              marginBottom: '14px',
              /* shimmer effect using background-clip */
              background: `linear-gradient(90deg,
                  ${PINK_DEEP} 0%,
                  ${PINK_BRAND} 30%,
                  #ff6eb4       50%,
                  ${PINK_BRAND} 70%,
                  ${PINK_DEEP} 100%)`,
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmerText 4s linear infinite',
            }}
          >
            You are invited!
          </h1>

          {/* decorative ♥ divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                height: '1px',
                width: '55px',
                background: `linear-gradient(to right, transparent, ${PINK_PALE})`,
              }}
            />
            <span style={{ color: PINK_MID, fontSize: '15px' }}>♥</span>
            <div
              style={{
                height: '1px',
                width: '55px',
                background: `linear-gradient(to left, transparent, ${PINK_PALE})`,
              }}
            />
          </div>

          <p
            style={{
              color: PINK_MID,
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              animation: 'ctaBlink 2.2s 0.8s ease-in-out infinite',
            }}
          >
            Tap anywhere to continue
          </p>
        </div>

        {/* bounce arrow */}
        {textReady && (
          <div className="absolute bottom-8 animate-bounce" style={{ pointerEvents: 'none' }}>
            <span style={{ color: PINK_PALE, fontSize: '1.3rem' }}>↓</span>
          </div>
        )}
      </div>
    </>
  );
}
