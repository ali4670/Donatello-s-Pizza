import { useState } from 'react';

interface Particle {
  id: number;
  emoji: string;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

function generateParticles(): Particle[] {
  const emojis = ['🍕', '🍕', '🍕', '🧀', '🌶️', '🍃', '🍕', '🍕'];
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    size: 16 + Math.random() * 28,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 10,
  }));
}

export default function FloatingParticles() {
  const [particles] = useState(() => generateParticles());

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute floating-particle animate-drift-slow"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
