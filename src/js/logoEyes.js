// js/logoEyes.js
import { gsap } from "gsap";

export function initLogoEyes() {
  const logos = gsap.utils.toArray(".navbar__logo svg, .footer__logo svg");
  if (!logos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MAX_X = 3;
  const MAX_Y = 2.2;
  const REACH = 400;
  const movers = [];

  logos.forEach((svg) => {
    const eyesGroup = svg.querySelector(".logo-eyes");
    const eyes = gsap.utils.toArray(".logo-eye", svg);
    if (!eyesGroup || !eyes.length) return;

    gsap.set(eyes, { transformBox: "fill-box", transformOrigin: "50% 50%" });

    gsap
      .timeline({ repeat: -1, repeatDelay: 3, delay: 3 })
      .to(eyes, { scaleY: 0.08, duration: 0.08, ease: "power2.in" })
      .to(eyes, { scaleY: 1, duration: 0.14, ease: "power2.out" });

    movers.push({
      svg,
      x: gsap.quickTo(eyesGroup, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(eyesGroup, "y", { duration: 0.35, ease: "power3.out" }),
    });
  });

  if (!movers.length || !window.matchMedia("(hover: hover)").matches) return;

  window.addEventListener("pointermove", (e) => {
    movers.forEach(({ svg, x, y }) => {
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / 195;
      const cx = rect.left + 28 * scale;
      const cy = rect.top + 9.5 * scale;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const strength = Math.min(dist / REACH, 1);

      x((dx / dist) * MAX_X * strength);
      y((dy / dist) * MAX_Y * strength);
    });
  });

  document.documentElement.addEventListener("pointerleave", () => {
    movers.forEach(({ x, y }) => {
      x(0);
      y(0);
    });
  });
}
