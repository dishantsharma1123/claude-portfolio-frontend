"use client";

import { useRef } from "react";

interface ClaudeLogoProps {
  className?: string;
  /** Pulse each ray and slowly rotate, like Claude's "thinking" indicator */
  animated?: boolean;
  /** Squish on press and spring back on release, like Claude.ai's spark */
  squeezable?: boolean;
}

const REST = "scale(1, 1)";
const PRESSED = "scale(0.8, 0.68)";
const PRESS_FRAMES: Keyframe[] = [{ transform: REST }, { transform: PRESSED }];
const RELEASE_FRAMES: Keyframe[] = [
  { transform: PRESSED },
  { transform: "scale(1.12, 1.14)", offset: 0.45 },
  { transform: "scale(0.97, 0.96)", offset: 0.75 },
  { transform: REST },
];

// [angle in degrees (0 = right), length from centre] — irregular like the real spark
const RAYS: [number, number][] = [
  [-90, 44], [-61, 37], [-31, 45], [-2, 39], [27, 44], [57, 36],
  [88, 45], [118, 38], [149, 44], [179, 40], [209, 45], [239, 37],
];
const CENTER = 50;

const rays = RAYS.map(([angle, length], i) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: (CENTER + Math.cos(rad) * length).toFixed(2),
    y: (CENTER + Math.sin(rad) * length).toFixed(2),
    // Stagger so the pulse travels around the spark
    delay: `${((i * 1.4) / RAYS.length).toFixed(2)}s`,
  };
});

export function ClaudeLogo({ className = "", animated = false, squeezable = false }: ClaudeLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const pressedRef = useRef(false);

  // Web Animations API on the <svg> root, so it never fights the rays' CSS animation
  const play = (frames: Keyframe[], duration: number, fill: FillMode = "none") => {
    const el = svgRef.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animationRef.current?.cancel();
    animationRef.current = el.animate(frames, { duration, easing: "ease-out", fill });
  };

  const press = () => {
    pressedRef.current = true;
    play(PRESS_FRAMES, 140, "forwards");
  };

  const release = () => {
    if (!pressedRef.current) return;
    pressedRef.current = false;
    play(RELEASE_FRAMES, 460);
  };

  // Decorative easter egg: stays aria-hidden since the squeeze conveys nothing
  const squeezeHandlers = squeezable
    ? { onPointerDown: press, onPointerUp: release, onPointerLeave: release, onPointerCancel: release }
    : {};

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      {...squeezeHandlers}
      className={`claude-spark shrink-0 text-claude-accent ${animated ? "claude-spark--animated" : ""} ${
        squeezable ? "cursor-pointer touch-manipulation select-none" : ""
      } ${className}`}
    >
      <g className="claude-spark-rays">
        {rays.map((ray, i) => (
          <line
            key={i}
            className="claude-spark-ray"
            x1={CENTER}
            y1={CENTER}
            x2={ray.x}
            y2={ray.y}
            stroke="currentColor"
            strokeWidth={8.5}
            strokeLinecap="round"
            style={{ animationDelay: ray.delay }}
          />
        ))}
      </g>
    </svg>
  );
}
