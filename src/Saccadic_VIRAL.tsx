import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Audio, staticFile } from 'remotion';

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
    <div style={{
      position: 'absolute',
      left: x - size,
      top: y - size,
      width: size * 2,
      height: size * 2,
      backgroundColor: 'white',
      borderRadius: '50%',
      border: '8px solid #333',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        position: 'absolute',
        left: size + lookOffset - size * 0.4,
        top: size - size * 0.4,
        width: size * 0.8,
        height: size * 0.8,
        backgroundColor: '#4834d4',
        borderRadius: '50%',
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: size * 0.3,
          height: size * 0.3,
          backgroundColor: 'black',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }} />
        <div style={{
          position: 'absolute',
          left: '60%',
          top: '20%',
          width: size * 0.2,
          height: size * 0.2,
          backgroundColor: 'white',
          borderRadius: '50%',
          opacity: 0.6
        }} />
      </div>
    </div>
  );
};

const NeuralGate: React.FC<{ frame: number; open: boolean }> = ({ frame, open }) => {
  const gateVal = spring({ frame, fps: FPS, config: { stiffness: 200 } });
  const gatePos = open ? interpolate(gateVal, [0, 1], [0, -500]) : interpolate(gateVal, [0, 1], [-500, 0]);

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: CY - 600 + gatePos,
        width: '100%',
        height: 600,
        backgroundColor: RED,
        opacity: 0.4,
        borderBottom: `10px solid ${RED}`,
        boxShadow: `0 0 50px ${RED}`
      }} />
      <div style={{
        position: 'absolute',
        left: 0,
        top: CY + gatePos,
        width: '100%',
        height: 600,
        backgroundColor: RED,
        opacity: 0.4,
        borderTop: `10px solid ${RED}`,
        boxShadow: `0 0 50px ${RED}`
      }} />
      <div style={{
        position: 'absolute',
        left: 0,
        top: CY - 80,
        width: '100%',
        height: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: WHITE,
        fontSize: 100,
        fontWeight: '900',
        fontFamily: 'Arial Black, sans-serif',
        textShadow: '0 0 20px black',
        zIndex: 10
      }}>
        <div>{open ? 'SIGNAL ON' : 'SIGNAL'}</div>
        <div style={{ color: open ? TEAL : RED }}>{open ? '✓' : 'BLOCKED ✗'}</div>
      </div>
    </div>
  );
};

export const SaccadicViral: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Fast jerky eye movements
  const t = frame / 10;
  const eyeMove = Math.sin(t) * 100 + Math.sin(t * 3) * 50;
  const velocity = Math.abs(Math.cos(t) * 10 + Math.cos(t * 3) * 15);
  const isBlocked = velocity > 15; 
  
  const activeSub = SUBS.find(s => frame >= s.f && frame <= s.t);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <Audio src="https://share.zapia.com/6g0i4ohhwatuqi0zgl9vxn" />
      
      {/* Background Grid */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: i * (H / 30), width: '100%', height: 2, backgroundColor: TEAL }} />
        ))}
      </div>

      {/* Main Animation Stage */}
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        
        {/* Mirror Scenario */}
        {frame < T.MECH_E && (
          <div style={{ 
            position: 'absolute',
            width: 700,
            height: 700,
            border: `12px solid ${WHITE}`,
            borderRadius: '40px',
            boxShadow: `0 0 60px rgba(255,255,255,0.2)`,
            transform: `scale(${sp(frame)})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}>
            <Eyeball frame={frame} x={350 - 160} y={350} size={110} lookAtX={eyeMove} />
            <Eyeball frame={frame} x={350 + 160} y={350} size={110} lookAtX={eyeMove} />
            
            <div style={{ 
              position: 'absolute', 
              top: -80, 
              color: WHITE, 
              fontSize: 50, 
              fontWeight: 'bold', 
              letterSpacing: 4,
              backgroundColor: BG,
              padding: '0 20px'
            }}>
              MIRROR
            </div>
          </div>
        )}

        {/* Neural Mechanism */}
        {frame > T.MECH_S && frame < T.PROOF_E && (
           <NeuralGate frame={frame - T.MECH_S} open={!isBlocked} />
        )}

        {/* The 40 Minutes Fact */}
        {frame > T.TWIST_S && (
          <div style={{ 
            position: 'absolute',
            color: GOLD, 
            fontSize: 220, 
            fontWeight: '900', 
            transform: `scale(${sp(frame - T.TWIST_S)}) rotate(${Math.sin(frame*0.1)*5}deg)`,
            textAlign: 'center',
            textShadow: `0 0 40px ${GOLD}66`
          }}>
            <div style={{ fontSize: 100, color: WHITE }}>TOTAL</div>
            40 MINS
            <div style={{ fontSize: 80, color: TEAL }}>DAILY</div>
          </div>
        )}
      </div>

      {/* Subtitles Overlay */}
      <div style={{ 
        position: 'absolute', 
        bottom: 250, 
        width: '100%', 
        display: 'flex',
        justifyContent: 'center',
        padding: '0 60px'
      }}>
        {activeSub && (
          <div style={{ 
            background: 'rgba(0,0,0,0.85)', 
            padding: '35px 45px', 
            borderRadius: '40px',
            border: `3px solid ${TEAL}`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.5)`,
            textAlign: 'center'
          }}>
             <div style={{ color: GOLD, fontSize: 60, fontWeight: '900', marginBottom: 15, lineHeight: 1.2 }}>{activeSub.h}</div>
             <div style={{ color: WHITE, fontSize: 35, fontStyle: 'italic', opacity: 0.9 }}>{activeSub.r}</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ position: 'absolute', top: 0, width: '100%', height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div style={{ width: `${(frame / T.TOTAL) * 100}%`, height: '100%', backgroundColor: TEAL, boxShadow: `0 0 25px ${TEAL}` }} />
      </div>

    </AbsoluteFill>
  );
};
