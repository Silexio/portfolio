import { MARK_CENTER } from "@/components/ui/Mark";

/**
 * Scripts inline du `<head>`, écrits en TypeScript et non en chaînes de caractères.
 *
 * Ni tsc ni eslint ne lisent une chaîne : un identifiant fautif y traverse le build et échoue en
 * silence dans le navigateur (`aimFacets` au lieu d'`aimParts` a coûté le clic de retaille de la
 * marque et toute la physique). `toString()` sérialise chaque fonction telle que le bundler l'a
 * émise, donc chacune doit rester **autonome** : aucun import, aucune variable de module, les
 * seules entrées passent en paramètres de l'appel.
 */

/** Pose le thème avant le premier paint (anti-FOUC). Son échec ne doit pas bloquer la suite. */
function applyTheme() {
  try {
    const stored = localStorage.getItem("silex_theme");
    const dark =
      stored === "dark" ||
      (!stored && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {
    // Un localStorage indisponible ne doit pas empêcher d'armer les reveals.
  }
}

/**
 * Deux observateurs : `data-in` révèle un bloc une fois pour toutes, `data-visible` suit l'entrée
 * et la sortie d'écran pour ne faire tourner une démonstration que sous les yeux de quelqu'un.
 * `data-reveal-js` conditionne l'état masqué : sans JS l'attribut manque et tout reste visible.
 */
function armReveals() {
  document.documentElement.dataset.revealJs = "";
  function arm() {
    const once = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-in", "");
          once.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      once.observe(el);
    });
    const visible = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.toggleAttribute("data-visible", entry.isIntersecting);
        });
      },
      { rootMargin: "120px" },
    );
    document
      .querySelectorAll("[data-reveal], .chore-map, .domain-art")
      .forEach(function (el) {
        visible.observe(el);
      });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", arm);
  else arm();
}

/**
 * Donne à chaque volume de la marque son axe de départ : le vecteur qui va du centre du tracé au
 * centre du volume. L'animation n'interpole que `translate` et `rotate`, donc une pièce se détache
 * sans grossir.
 */
function aimStoneParts(centerX: number, centerY: number) {
  function aim() {
    document
      .querySelectorAll<SVGGElement>(".knap__part")
      .forEach(function (part) {
        const box = part.getBBox();
        const dx = box.x + box.width / 2 - centerX;
        const dy = box.y + box.height / 2 - centerY;
        const length = Math.hypot(dx, dy) || 1;
        part.style.setProperty("--dx", (dx / length) * 190 + "px");
        part.style.setProperty("--dy", (dy / length) * 190 + "px");
        part.style.setProperty("--rot", (dx > 0 ? 5 : -5) + "deg");
      });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", aim);
  else aim();
}

/**
 * Retaille au clic. Le retrait puis la repose de `data-knapped` encadrent une lecture forcée de la
 * mise en page : une animation terminée ne redémarre pas sans que son `animation-name` change.
 * Inerte dès que la physique a pris la main, sinon les deux se neutralisent.
 */
function armKnapClick() {
  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;
    const stone = event.target.closest("[data-knap]");
    if (!stone || stone.hasAttribute("data-physics")) return;
    stone.removeAttribute("data-knapped");
    void stone.getBoundingClientRect();
    stone.setAttribute("data-knapped", "");
  });
}

/**
 * Ressort intégré image par image : les volumes s'écartent du curseur qui approche et reviennent.
 * Réservé aux pointeurs fins hors `prefers-reduced-motion`, et différé à l'inactivité — un
 * téléphone ne paie rien. En prenant la main, le module pose `data-physics` et coupe les
 * animations CSS des volumes : une animation terminée et remplie gagnerait sur le style en ligne.
 */
function stonePhysics() {
  function run() {
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const STIFFNESS = 130;
    const DAMPING = 13;
    const REACH = 1.15;
    const PUSH = 13;
    const IMPULSE = 1500;
    document.querySelectorAll("[data-knap]").forEach(function (stone) {
      const parts = Array.from(
        stone.querySelectorAll<SVGGElement>(".knap__part"),
      );
      if (parts.length === 0) return;
      const state = parts.map(function () {
        return { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
      });
      let ratios: { fx: number; fy: number }[] | null = null;
      let frame = 0;
      let hovering = false;

      function measure() {
        const box = stone.getBoundingClientRect();
        if (!box.width) return null;
        if (!ratios) {
          ratios = parts.map(function (part) {
            const r = part.getBoundingClientRect();
            return {
              fx: (r.x + r.width / 2 - box.x) / box.width,
              fy: (r.y + r.height / 2 - box.y) / box.height,
            };
          });
        }
        return box;
      }

      function tick() {
        frame = 0;
        let moving = false;
        for (let i = 0; i < state.length; i++) {
          const s = state[i];
          s.vx += (-STIFFNESS * (s.x - s.tx) - DAMPING * s.vx) / 60;
          s.vy += (-STIFFNESS * (s.y - s.ty) - DAMPING * s.vy) / 60;
          s.x += s.vx / 60;
          s.y += s.vy / 60;
          if (
            Math.abs(s.x - s.tx) > 0.05 ||
            Math.abs(s.vx) > 0.05 ||
            Math.abs(s.y - s.ty) > 0.05 ||
            Math.abs(s.vy) > 0.05
          )
            moving = true;
          parts[i].style.translate =
            s.x.toFixed(2) + "px " + s.y.toFixed(2) + "px";
        }
        if (moving || hovering) frame = requestAnimationFrame(tick);
      }

      function wake() {
        if (!frame) frame = requestAnimationFrame(tick);
      }

      function release() {
        if (stone.hasAttribute("data-physics")) return;
        stone.setAttribute("data-physics", "");
        stone.removeAttribute("data-knapped");
        parts.forEach(function (part) {
          part.style.animation = "none";
        });
      }

      function aim(event: MouseEvent) {
        const box = measure();
        if (!box || !ratios) return;
        const reach = box.width * REACH;
        for (let i = 0; i < state.length; i++) {
          const dx = box.x + ratios[i].fx * box.width - event.clientX;
          const dy = box.y + ratios[i].fy * box.height - event.clientY;
          const distance = Math.hypot(dx, dy) || 1;
          const falloff = Math.max(0, 1 - distance / reach);
          const force = falloff * falloff * PUSH;
          state[i].tx = (dx / distance) * force;
          state[i].ty = (dy / distance) * force;
        }
        wake();
      }

      function strike(event: MouseEvent) {
        const box = measure();
        if (!box || !ratios) return;
        for (let i = 0; i < state.length; i++) {
          const dx = box.x + ratios[i].fx * box.width - event.clientX;
          const dy = box.y + ratios[i].fy * box.height - event.clientY;
          const distance = Math.hypot(dx, dy) || 1;
          state[i].vx += (dx / distance) * IMPULSE;
          state[i].vy += (dy / distance) * IMPULSE;
        }
        wake();
      }

      const host = stone.closest("section") || stone.parentElement;
      if (!host) return;
      host.addEventListener("pointermove", function (event) {
        if (!(event instanceof MouseEvent)) return;
        release();
        hovering = true;
        aim(event);
      });
      host.addEventListener("pointerleave", function () {
        hovering = false;
        state.forEach(function (s) {
          s.tx = 0;
          s.ty = 0;
        });
        wake();
      });
      stone.addEventListener("pointerdown", function (event) {
        if (!(event instanceof MouseEvent)) return;
        release();
        strike(event);
      });
      window.addEventListener("resize", function () {
        ratios = null;
      });
    });
  }
  if ("requestIdleCallback" in window)
    requestIdleCallback(run, { timeout: 2500 });
  else setTimeout(run, 1800);
}

/** Le script unique du `<head>`, dans l'ordre : thème avant paint, puis le reste. */
export const BOOT_SCRIPT = [
  `(${applyTheme.toString()})();`,
  `(${armReveals.toString()})();`,
  `(${aimStoneParts.toString()})(${MARK_CENTER.x},${MARK_CENTER.y});`,
  `(${armKnapClick.toString()})();`,
  `(${stonePhysics.toString()})();`,
].join("\n");
