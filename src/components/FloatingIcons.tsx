import React, { useEffect, useState } from 'react';
import { Award, GraduationCap, Heart, Sparkles, Star, PartyPopper, Scroll, Smile } from 'lucide-react';

interface DriftingIcon {
  id: string;
  x: number; // percentage from left (0 to 100)
  size: number; // in pixels
  speed: number; // animation duration in seconds
  delay: number; // delay in seconds
  iconType: number; // index of icon to display
  rotation: number; // random start rotation
}

export default function FloatingIcons() {
  const [icons, setIcons] = useState<DriftingIcon[]>([]);

  // Array of beautiful Lucide icons matching a graduation theme
  const iconCollection = [
    GraduationCap,
    Heart,
    Star,
    Sparkles,
    PartyPopper,
    Award,
    Scroll,
    Smile,
  ];

  // Colors that fit the whimsical design guidelines
  const textColors = [
    'text-pink-400',
    'text-sky-400',
    'text-teal-400',
    'text-amber-400',
    'text-indigo-400',
  ];

  useEffect(() => {
    // Generate initial batch of elegant floating icons
    const initialIcons: DriftingIcon[] = Array.from({ length: 15 }).map((_, index) => ({
      id: `initial-${index}-${Math.random()}`,
      x: Math.random() * 90 + 5, // Keep some safety margins from the edge
      size: Math.random() * 16 + 18, // 18px to 34px
      speed: Math.random() * 12 + 10, // 10s to 22s for majestic, slow drift
      delay: Math.random() * 5, // staggered starts
      iconType: Math.floor(Math.random() * iconCollection.length),
      rotation: Math.random() * 360,
    }));
    setIcons(initialIcons);

    // Periodically spawn new drifting icons at the bottom
    const interval = setInterval(() => {
      setIcons((prev) => {
        // Limit total concurrently active icons to keep animation buttery-smooth
        const filtered = prev.filter((icon) => {
          // Keep icons from the last 25 seconds
          const timestamp = parseInt(icon.id.split('-')[1] || '0');
          return Date.now() - timestamp < 25000;
        });

        const newIcon: DriftingIcon = {
          id: `spawn-${Date.now()}-${Math.random()}`,
          x: Math.random() * 90 + 5,
          size: Math.random() * 14 + 18,
          speed: Math.random() * 10 + 12, // slow and smooth
          delay: 0,
          iconType: Math.floor(Math.random() * iconCollection.length),
          rotation: Math.random() * 360,
        };

        return [...filtered, newIcon];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {icons.map((icon) => {
        const IconComponent = iconCollection[icon.iconType];
        const colorClass = textColors[Math.floor(icon.x) % textColors.length];

        return (
          <div
            key={icon.id}
            className={`absolute bottom-0 opacity-0 transition-opacity duration-1000 ${colorClass}`}
            style={{
              left: `${icon.x}%`,
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              animationName: 'driftUp',
              animationDuration: `${icon.speed}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDelay: `${icon.delay}s`,
              transform: `rotate(${icon.rotation}deg)`,
            }}
          >
            <IconComponent size={icon.size} strokeWidth={1.5} className="drop-shadow-sm opacity-60 hover:opacity-100" />
          </div>
        );
      })}

      {/* Embedded drifting keyframes into standard CSS style */}
      <style>{`
        @keyframes driftUp {
          0% {
            transform: translateY(100px) rotate(0deg) translateX(0);
            opacity: 0;
          }
          5% {
            opacity: 0.55;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-50vh) rotate(180deg) translateX(15px);
            opacity: 0.6;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg) translateX(-15px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
