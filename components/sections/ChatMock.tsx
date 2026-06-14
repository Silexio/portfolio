import Image from "next/image";

export type ChatLine = {
  me: boolean;
  text: string;
  file?: string;
  meta?: string;
};

type ChatMockProps = {
  scenes: ChatLine[][];
  online: string;
  activeScene?: number;
  solo?: boolean;
};

export function ChatMock({ scenes, online, activeScene = 0, solo = false }: ChatMockProps) {
  const visible = solo ? scenes[activeScene] : scenes.slice(0, activeScene + 1).flat();
  return (
    <div className="chat" aria-hidden="true">
      <div className="chat__head">
        <Image src="/silexio-mark.png" alt="" width={18} height={18} className="chat__mark" draggable={false} />
        <span className="chat__name">SILEXIO</span>
        <span className="chat__status">
          <span className="chat__dot" />
          {online}
        </span>
      </div>
      <div className="chat__body">
        {visible.map((msg, i) => (
          <div key={`${activeScene}-${i}`} className={msg.me ? "msg msg--me" : "msg"}>
            {msg.file && (
              <div className="msg__file">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M7 1H3a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V4L7 1z"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                  />
                  <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                </svg>
                {msg.file}
              </div>
            )}
            <div className="msg__bubble">{msg.text}</div>
            {msg.meta && <div className="msg__meta">{msg.meta}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
