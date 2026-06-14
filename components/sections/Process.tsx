import { ChatMock, type ChatLine } from "@/components/sections/ChatMock";
import { ProcessScenes } from "@/components/sections/ProcessScenes";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { CHAT, CHAT_UI, PROCESS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Process({ lang }: { lang: Locale }) {
  const online = t(CHAT_UI.online, lang);
  const chatScenes: ChatLine[][] = CHAT.map((scene) =>
    scene.map((msg) => ({
      me: msg.me,
      text: t(msg.text, lang),
      file: msg.file && t(msg.file, lang),
      meta: msg.meta && t(msg.meta, lang),
    })),
  );
  const captions = PROCESS.scenes.map((scene) => ({
    step: t(scene.step, lang),
    h: t(scene.h, lang),
    p: t(scene.p, lang),
  }));

  return (
    <section id="process" className="featured" aria-labelledby="process-title">
      <div className="featured__intro">
        <Reveal>
          <span className="featured__eyebrow">{t(PROCESS.eyebrow, lang)}</span>
          <h2 id="process-title" className="featured__title">
            {t(PROCESS.title, lang).split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
            <em>{t(PROCESS.titleEm, lang)}</em>
          </h2>
          <p className="featured__sub">{t(PROCESS.sub, lang)}</p>
          <div className="featured__promises">
            {PROCESS.promises.map((promise) => (
              <Chip key={promise.fr} variant="ember">
                {t(promise, lang)}
              </Chip>
            ))}
          </div>
        </Reveal>
      </div>

      <ProcessScenes captions={captions} chatScenes={chatScenes} online={online}>
        {captions.map((scene, i) => (
          <Reveal key={scene.step} className="featured__scene" delay={i * 80}>
            <div className="featured__scene-visual">
              <ChatMock scenes={chatScenes} activeScene={i} online={online} solo />
            </div>
            <div className="featured__scene-text">
              <div className="featured__scene-step">{scene.step}</div>
              <h3 className="featured__scene-h">{scene.h}</h3>
              <p className="featured__scene-p">{scene.p}</p>
            </div>
          </Reveal>
        ))}
      </ProcessScenes>

      <div className="featured__outro">
        <Btn href="#contact" variant="ember">{t(PROCESS.cta, lang)}</Btn>
      </div>
    </section>
  );
}
