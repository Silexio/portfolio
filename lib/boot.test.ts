import { describe, expect, it, vi } from "vitest";
import { BOOT_SCRIPT } from "@/lib/boot";
import { MARK_CENTER } from "@/components/ui/Mark";

/**
 * Le script du `<head>` est sérialisé, donc exécuté hors de tout typage : on le fait tourner ici
 * sur un DOM minimal pour prouver qu'il ne lève rien. Un identifiant fautif — le cas réel qui a
 * coupé la retaille de la marque — échoue sur ce test au lieu d'échouer en silence chez le
 * visiteur. Chaque branche doit donc être réellement atteinte : un `matchMedia` qui répond vrai à
 * tout ferait sortir la physique avant sa première ligne, et le test ne prouverait plus rien.
 */

type Listener = (event: unknown) => void;

const BBOX = { x: 400, y: 600, width: 200, height: 160 };
const RECT = { x: 10, y: 20, width: 300, height: 240 };

function fakeElement() {
  const attributes = new Map<string, string>();
  const listeners = new Map<string, Listener>();
  return {
    listeners,
    style: { setProperty: vi.fn(), translate: "", animation: "" },
    dataset: {} as Record<string, string>,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
    hasAttribute: (name: string) => attributes.has(name),
    toggleAttribute: vi.fn(),
    getBBox: () => BBOX,
    getBoundingClientRect: () => RECT,
    closest: () => null,
    parentElement: null,
    querySelectorAll: () => [] as unknown[],
    addEventListener: (type: string, listener: Listener) =>
      listeners.set(type, listener),
  };
}

function install(readyState: "loading" | "complete") {
  const part = fakeElement();
  const host = fakeElement();
  const stone = fakeElement();
  stone.querySelectorAll = () => [part];
  stone.closest = () => host as unknown as null;
  const documentListeners = new Map<string, Listener>();
  const observed: unknown[] = [];

  const document = {
    readyState,
    documentElement: { dataset: {} as Record<string, string> },
    querySelectorAll: (selector: string) =>
      selector.includes("knap__part") ? [part] : [stone],
    addEventListener: (type: string, listener: Listener) =>
      documentListeners.set(type, listener),
  };

  class FakeObserver {
    observe(target: unknown) {
      observed.push(target);
    }
    unobserve() {}
  }

  /** Un pointeur fin, sans demande de mouvement réduit : la physique doit s'installer. */
  const matchMedia = (query: string) => ({
    matches: !query.includes("reduce"),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });

  vi.stubGlobal("document", document);
  vi.stubGlobal("window", { addEventListener: vi.fn() });
  vi.stubGlobal("localStorage", { getItem: () => "dark" });
  vi.stubGlobal("matchMedia", matchMedia);
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  let frames = 0;
  vi.stubGlobal("requestAnimationFrame", (fn: () => void) => {
    if (frames++ < 3) fn();
    return frames;
  });
  vi.stubGlobal("requestIdleCallback", (fn: () => void) => fn());
  vi.stubGlobal("setTimeout", (fn: () => void) => fn());
  // `event.target instanceof Element` doit pouvoir s'évaluer, et le script ne lit d'un événement
  // que ses coordonnées.
  class ElementLike {
    closest(): unknown {
      return null;
    }
  }
  class PointerLike {
    clientX = 0;
    clientY = 0;
  }
  vi.stubGlobal("Element", ElementLike);
  vi.stubGlobal("MouseEvent", PointerLike);

  // Seule façon d'exécuter un script sérialisé. La source est notre propre module, constante et
  // sans aucune entrée extérieure : rien d'interpolé, donc rien à injecter.
  const run = () => new Function(BOOT_SCRIPT)();
  return {
    run,
    document,
    documentListeners,
    observed,
    part,
    stone,
    host,
    ElementLike,
    PointerLike,
  };
}

/** Le vecteur que le script doit poser, recalculé ici depuis la même source. */
function expectedOffset() {
  const dx = BBOX.x + BBOX.width / 2 - MARK_CENTER.x;
  const dy = BBOX.y + BBOX.height / 2 - MARK_CENTER.y;
  const length = Math.hypot(dx, dy) || 1;
  return { dx: `${(dx / length) * 190}px`, dy: `${(dy / length) * 190}px` };
}

describe("script d'amorçage", () => {
  it("s'exécute sans erreur et arme tout pendant le chargement", () => {
    const boot = install("loading");
    expect(boot.run).not.toThrow();
    expect(boot.document.documentElement.dataset.theme).toBe("dark");
    expect(boot.document.documentElement.dataset.revealJs).toBe("");
    expect(boot.documentListeners.has("DOMContentLoaded")).toBe(true);
    expect(boot.documentListeners.has("click")).toBe(true);
    vi.unstubAllGlobals();
  });

  it("vise chaque volume depuis le centre du tracé de la marque", () => {
    const boot = install("complete");
    boot.run();
    expect(boot.observed.length).toBeGreaterThan(0);
    const { dx, dy } = expectedOffset();
    expect(boot.part.style.setProperty).toHaveBeenCalledWith("--dx", dx);
    expect(boot.part.style.setProperty).toHaveBeenCalledWith("--dy", dy);
    vi.unstubAllGlobals();
  });

  it("retaille la pierre au clic tant que la physique n'a pas pris la main", () => {
    const boot = install("complete");
    boot.run();
    const click = boot.documentListeners.get("click");
    const target = Object.assign(new boot.ElementLike(), {
      closest: () => boot.stone,
    });
    expect(() => click?.({ target })).not.toThrow();
    expect(boot.stone.hasAttribute("data-knapped")).toBe(true);
    vi.unstubAllGlobals();
  });

  it("installe la physique et déplace les volumes au passage du curseur", () => {
    const boot = install("complete");
    boot.run();
    const move = boot.host.listeners.get("pointermove");
    expect(move).toBeDefined();
    const event = Object.assign(new boot.PointerLike(), {
      clientX: RECT.x,
      clientY: RECT.y,
    });
    expect(() => move?.(event)).not.toThrow();
    // La physique prend la main : elle le déclare, et coupe l'animation CSS des volumes.
    expect(boot.stone.hasAttribute("data-physics")).toBe(true);
    expect(boot.part.style.animation).toBe("none");
    // Le ressort a tourné : le volume porte une translation chiffrée.
    expect(boot.part.style.translate).toMatch(/^-?\d+\.\d\dpx -?\d+\.\d\dpx$/);
    // Les deux axes doivent avoir bougé : un seul ressort cassé passerait sinon.
    expect(boot.part.style.translate).not.toMatch(/(^|\s)0\.00px/);
    vi.unstubAllGlobals();
  });
});
