import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from 'remotion';

const W = 1080, H = 1920, CX = 540, CY = 960, FPS = 60;
const BG = '#0E1117';
const GOLD = '#FDCB6E';
const TEAL = '#00CEC9';
const WHITE = '#DFE6E9';
const RED = '#FF7675';

const T = {
  HOOK_S: 0, HOOK_E: 180,
  SET_S: 160, SET_E: 540,
  MECH_S: 520, MECH_E: 1260,
  PROOF_S: 1240, PROOF_E: 1800,
  TWIST_S: 1780, TWIST_E: 2380,
  OUT_S: 2360, OUT_E: 2700,
  TOTAL: 2700,
};

const SUBS = [
  { f: 10, t: 160, h: 'क्या आपने कभी अपनी आँखों को हिलते देखा है?', r: 'Kya aapne kabhi apni aankhon ko hilte dekha hai?', s: 'n' },
  { f: 190, t: 480, h: 'आपकी आँखों की "मूवमेंट" कभी नहीं दिखेगी।', r: 'Aapki aankhon ki "movement" kabhi nahi dikhegi.', s: 'b' },
  { f: 520, t: 840, h: 'इसे कहते हैं "Saccadic Masking"।', r: 'Is phenomenon ko "Saccadic Masking" kehte hain.', s: 'n' },
  { f: 870, t: 1200, h: 'ब्रेन ब्लर से बचने के लिए फीड ब्लॉक कर देता है।', r: 'Brain blur se bachne ke liye feed block kar deta hai.', s: 'b' },
  { f: 1260, t: 1740, h: 'आप रोज़ 40 मिनट तक "अंधे" होते हैं!', r: 'Aap roz 40 minutes tak "andhe" hote hain!', s: 'e' },
  { f: 1780, t: 2200, h: 'आपका ब्रेन आपके लिए दुनिया "एडिट" कर रहा है।', r: 'Aapka brain aapke liye duniya "edit" kar raha hai.', s: 'n' },
  { f: 2300, t: 2650, h: 'ज़ैक डी फिल्म्स की तरह साइंस सीखें!', r: 'Zack D Films ki tarah science seekhein!', s: 'n' },
];

const sp = (f: number, st = 120, dm = 14) => spring({ frame: f, fps: FPS, config: { stiffness: st, damping: dm } });

const Eyeball: React.FC<{ frame: number; x: number; y: number; size: number; lookAtX: number }> = ({ frame, x, y, size, lookAtX }) => {
  const lookOffset = interpolate(lookAtX, [-100, 100], [-size * 0.4, size * 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size} fill="white" stroke="black" strokeWidth={5} />
      <circle cx={lookOffset} r={size * 0.4} fill="#4834d4" />
      <circle cx={lookOffset + 10} cy={-10} r={size * 0.1} fill="white" opacity={0.6} />
      <circle cx={lookOffset} r={size * 0.15} fill="black" />
    </g>
  );
};

const NeuralGate: React.FC<{ frame: number; open: boolean }> = ({ frame, open }) => {
  const gateVal = spring({ frame, fps: FPS, config: { stiffness: 200 } });
  const gatePos = open ? interpolate(gateVal, [0, 1], [0, -300]) : interpolate(gateVal, [0, 1], [-300, 0]);

  return (
    <g>
      <rect x={CX - 500} y={CY - 400 + gatePos} width={1000} height={400} fill={RED} opacity={0.3} stroke={RED} strokeWidth={5} />
      <rect x={CX - 500} y={CY + gatePos} width={1000} height={400} fill={RED} opacity={0.3} stroke={RED} strokeWidth={5} />
      <text x={CX} y={CY - 10} textAnchor="middle" fill={WHITE} fontSize={60} fontFamily="Bebas Neue">
        {open ? 'SIGNAL ON' : 'SIGNAL BLOCKED'}
      </text>
    </g>
  );
};

export const SaccadicViral: React.FC = () => {
  const frame = useCurrentFrame();
  
  const eyeMove = Math.sin(frame * 0.1) * 100;
  const isBlocked = Math.abs(Math.cos(frame * 0.1)) < 0.2; // Block during high velocity phases
  
  const activeSub = SUBS.find(s => frame >= s.f && frame <= s.t);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Dynamic Background */}
      <AbsoluteFill opacity={0.2}>
         {Array.from({ length: 20 }).map((_, i) => (
           <rect key={i} x={0} y={i * 100} width={W} height={2} fill={TEAL} />
         ))}
      </AbsoluteFill>

      {/* Main Animation Stage */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Mirror Scenario */}
        {frame < T.MECH_E && (
          <g transform={`scale(${sp(frame)})`}>
            <rect x={CX - 300} y={CY - 300} width={600} height={600} fill="none" stroke={WHITE} strokeWidth={10} />
            <Eyeball frame={frame} x={CX - 150} y={CY} size={100} lookAtX={eyeMove} />
            <Eyeball frame={frame} x={CX + 150} y={CY} size={100} lookAtX={eyeMove} />
          </g>
        )}

        {/* Neural Mechanism */}
        {frame > T.MECH_S && frame < T.PROOF_E && (
           <NeuralGate frame={frame % 120} open={!isBlocked} />
        )}

        {/* The 40 Minutes Fact */}
        {frame > T.TWIST_S && (
          <div style={{ color: GOLD, fontSize: 180, fontWeight: 'bold', transform: `scale(${sp(frame - T.TWIST_S)})` }}>
            40 MINS
          </div>
        )}
      </AbsoluteFill>

      {/* Subtitles Overlay */}
      <div style={{ position: 'absolute', bottom: 250, width: '100%', textAlign: 'center', padding: '0 50px' }}>
        {activeSub && (
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '20px' }}>
             <p style={{ color: GOLD, fontSize: 55, fontWeight: 'bold', margin: '0 0 10px 0' }}>{activeSub.h}</p>
             <p style={{ color: WHITE, fontSize: 30, fontStyle: 'italic', opacity: 0.8 }}>{activeSub.r}</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ position: 'absolute', top: 0, width: '100%', height: 15, backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div style={{ width: `${(frame / T.TOTAL) * 100}%`, height: '100%', backgroundColor: TEAL }} />
      </div>

    </AbsoluteFill>
  );
};
