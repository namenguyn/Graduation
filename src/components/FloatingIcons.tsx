import React, { useEffect, useRef, useState } from 'react';
import { Award, GraduationCap, Heart, Sparkles, Star, PartyPopper, Scroll, Smile } from 'lucide-react';

interface DriftingIcon {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number;
  iconType: number; // index of icon to display
  rotation: number; // random start rotation
  spin: number;
  colorIndex: number;
}

const ICON_COUNT = 15;
const MAX_SPEED = 55;
const MIN_SPEED = 18;
const WALL_BOUNCE = 0.92;
const ICON_BOUNCE = 0.96;
const WANDER_FORCE = 14;
const WANDER_DAMPING = 0.94;

export default function FloatingIcons() {
  const [icons, setIcons] = useState<DriftingIcon[]>([]);
  const iconsRef = useRef<DriftingIcon[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const viewportRef = useRef({ width: 0, height: 0 });

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

  const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

  const createIcon = (index: number, width: number, height: number): DriftingIcon => {
    const size = randomBetween(18, 34);
    const safeX = Math.max(width - size, 1);
    const safeY = Math.max(height - size, 1);
    const speed = randomBetween(MIN_SPEED, MAX_SPEED);
    const angle = Math.random() * Math.PI * 2;

    return {
      id: `icon-${Date.now()}-${index}-${Math.random()}`,
      x: Math.random() * safeX,
      y: Math.random() * safeY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      ax: randomBetween(-WANDER_FORCE, WANDER_FORCE),
      ay: randomBetween(-WANDER_FORCE, WANDER_FORCE),
      size,
      iconType: Math.floor(Math.random() * iconCollection.length),
      rotation: Math.random() * 360,
      spin: randomBetween(-18, 18),
      colorIndex: index % textColors.length,
    };
  };

  const resolveWallBounce = (icon: DriftingIcon, width: number, height: number) => {
    const maxX = Math.max(width - icon.size, 0);
    const maxY = Math.max(height - icon.size, 0);

    if (icon.x <= 0) {
      icon.x = 0;
      icon.vx = Math.abs(icon.vx) * WALL_BOUNCE;
    } else if (icon.x >= maxX) {
      icon.x = maxX;
      icon.vx = -Math.abs(icon.vx) * WALL_BOUNCE;
    }

    if (icon.y <= 0) {
      icon.y = 0;
      icon.vy = Math.abs(icon.vy) * WALL_BOUNCE;
    } else if (icon.y >= maxY) {
      icon.y = maxY;
      icon.vy = -Math.abs(icon.vy) * WALL_BOUNCE;
    }
  };

  const resolveIconCollision = (a: DriftingIcon, b: DriftingIcon) => {
    const ax = a.x + a.size / 2;
    const ay = a.y + a.size / 2;
    const bx = b.x + b.size / 2;
    const by = b.y + b.size / 2;
    const dx = bx - ax;
    const dy = by - ay;
    const distance = Math.hypot(dx, dy) || 0.0001;
    const minDistance = (a.size + b.size) / 2;

    if (distance >= minDistance) {
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minDistance - distance;

    a.x -= nx * overlap * 0.5;
    a.y -= ny * overlap * 0.5;
    b.x += nx * overlap * 0.5;
    b.y += ny * overlap * 0.5;

    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;
    const velAlongNormal = rvx * nx + rvy * ny;

    if (velAlongNormal > 0) {
      return;
    }

    const impulse = (-(1 + ICON_BOUNCE) * velAlongNormal) / 2;
    const ix = impulse * nx;
    const iy = impulse * ny;

    a.vx -= ix;
    a.vy -= iy;
    b.vx += ix;
    b.vy += iy;

    const aSpeed = Math.hypot(a.vx, a.vy);
    const bSpeed = Math.hypot(b.vx, b.vy);
    const aCap = Math.max(MIN_SPEED, Math.min(aSpeed, MAX_SPEED));
    const bCap = Math.max(MIN_SPEED, Math.min(bSpeed, MAX_SPEED));

    if (aSpeed > 0) {
      const scale = aCap / aSpeed;
      a.vx *= scale;
      a.vy *= scale;
    }

    if (bSpeed > 0) {
      const scale = bCap / bSpeed;
      b.vx *= scale;
      b.vy *= scale;
    }
  };

  useEffect(() => {
    const updateViewport = () => {
      viewportRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    updateViewport();

    const initialIcons: DriftingIcon[] = Array.from({ length: ICON_COUNT }).map((_, index) =>
      createIcon(index, viewportRef.current.width, viewportRef.current.height),
    );

    iconsRef.current = initialIcons;
    setIcons(initialIcons);

    const onResize = () => {
      updateViewport();
      iconsRef.current = iconsRef.current.map((icon) => ({
        ...icon,
        x: Math.min(icon.x, Math.max(viewportRef.current.width - icon.size, 0)),
        y: Math.min(icon.y, Math.max(viewportRef.current.height - icon.size, 0)),
      }));
      setIcons([...iconsRef.current]);
    };

    const animate = (time: number) => {
      const deltaSeconds = lastTimeRef.current === null ? 0 : Math.min((time - lastTimeRef.current) / 1000, 0.032);
      lastTimeRef.current = time;

      if (deltaSeconds > 0) {
        const nextIcons = iconsRef.current.map((icon) => ({ ...icon }));

        for (const icon of nextIcons) {
          const wanderX = Math.sin((time * 0.0012) + icon.rotation) * icon.ax;
          const wanderY = Math.cos((time * 0.0016) + icon.rotation) * icon.ay;

          icon.vx = (icon.vx + wanderX * deltaSeconds) * WANDER_DAMPING;
          icon.vy = (icon.vy + wanderY * deltaSeconds) * WANDER_DAMPING;

          if (Math.abs(icon.vx) < MIN_SPEED * 0.45) {
            icon.vx += Math.sign(icon.vx || (Math.random() - 0.5)) * MIN_SPEED * 0.25;
          }

          if (Math.abs(icon.vy) < MIN_SPEED * 0.45) {
            icon.vy += Math.sign(icon.vy || (Math.random() - 0.5)) * MIN_SPEED * 0.25;
          }

          icon.x += icon.vx * deltaSeconds;
          icon.y += icon.vy * deltaSeconds;
          icon.rotation = (icon.rotation + icon.spin * deltaSeconds) % 360;
          resolveWallBounce(icon, viewportRef.current.width, viewportRef.current.height);
        }

        for (let i = 0; i < nextIcons.length; i += 1) {
          for (let j = i + 1; j < nextIcons.length; j += 1) {
            resolveIconCollision(nextIcons[i], nextIcons[j]);
          }
        }

        iconsRef.current = nextIcons;
        setIcons(nextIcons);
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener('resize', onResize);
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {icons.map((icon) => {
        const IconComponent = iconCollection[icon.iconType];
        const colorClass = textColors[icon.colorIndex];

        return (
          <div
            key={icon.id}
            className={`absolute ${colorClass}`}
            style={{
              left: `${icon.x}px`,
              top: `${icon.y}px`,
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              transform: `rotate(${icon.rotation}deg)`,
              willChange: 'transform',
            }}
          >
            <IconComponent size={icon.size} strokeWidth={1.5} className="drop-shadow-sm opacity-60 hover:opacity-100" />
          </div>
        );
      })}
    </div>
  );
}
