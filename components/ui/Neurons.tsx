"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;
  pulse: number;
};

export function Neurons() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const computeAccent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    let accent = computeAccent();

    function seed(w: number, h: number) {
      const density = Math.min(1, Math.max(0.5, (w * h) / (700 * 500)));
      nodes = Array.from({ length: Math.round(34 * density) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        baseR: 1.4 + Math.random() * 1.4,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      if (!canvas || !container || !ctx) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      seed(rect.width, rect.height);
    }

    function tick() {
      if (!container || !ctx) return;
      const { width: w, height: h } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);

      const maxDist = Math.min(180, Math.max(120, Math.sqrt(w * h) * 0.18));
      const maxDistSq = maxDist * maxDist;
      const mouseR = 160;
      const mouseRSq = mouseR * mouseR;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.pulse += 0.012;

        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dsq = dx * dx + dy * dy;
          if (dsq < mouseRSq) {
            const f = (1 - dsq / mouseRSq) * 0.08;
            n.vx += dx * f * 0.01;
            n.vy += dy * f * 0.01;
          }
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        if (Math.hypot(n.vx, n.vy) < 0.05) {
          const a = Math.random() * Math.PI * 2;
          n.vx += Math.cos(a) * 0.04;
          n.vy += Math.sin(a) * 0.04;
        }
      }

      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dsq = dx * dx + dy * dy;
          if (dsq < maxDistSq) {
            const alpha = 1 - Math.sqrt(dsq) / maxDist;
            let boost = 0;
            if (mouse.active) {
              const md = Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2);
              if (md < mouseR) boost = (1 - md / mouseR) * 0.8;
            }
            ctx.strokeStyle = `color-mix(in oklch, ${accent} ${(alpha * 0.55 + boost) * 100}%, transparent)`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        let glow = 0;
        if (mouse.active) {
          const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (d < mouseR) glow = 1 - d / mouseR;
        }
        const r = n.baseR + Math.sin(n.pulse) * 0.4 + glow * 3;
        if (glow > 0.1) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
          g.addColorStop(0, `color-mix(in oklch, ${accent} ${glow * 70}%, transparent)`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fillRect(n.x - r * 6, n.y - r * 6, r * 12, r * 12);
        }
        ctx.fillStyle = `color-mix(in oklch, ${accent} ${75 + glow * 25}%, transparent)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouse.active = true;
    };

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const mo = new MutationObserver(() => {
      accent = computeAccent();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="neurons" aria-hidden="true" />;
}
