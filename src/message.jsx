import { useState, useEffect, useRef } from "react";
import "./message.css";
import jahImg from "./assets/jah.jpeg"
import meImg  from "./assets/me.png"
import matchaImg from "./assets/matcha.jpg"

// ─────────────────────────────────────────────────────────────────────────────
// 🖼️  AVATAR IMAGES — paste your asset paths / URLs here
//    JAH_AVATAR  : shown in the header and beside Jah's bubbles
//    MY_AVATAR   : shown beside your own bubbles (optional — set to null to hide)
// ─────────────────────────────────────────────────────────────────────────────
const JAH_AVATAR = jahImg;   // e.g. "/assets/jah.jpg"  or  import jahImg from "./jah.jpg"
const MY_AVATAR  = meImg;   // e.g. "/assets/me.jpg"   or  import meImg  from "./me.jpg"

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  CUSTOMIZE YOUR SCRIPT HERE
//    Text message : { sender: "Jah" | "Me", text: "message content" }
//    Image message: { sender: "Jah",        image: "/assets/photo.jpg", caption: "optional caption" }
// ─────────────────────────────────────────────────────────────────────────────
export const SCRIPT = [
  { sender: "Jah", text: "wow peace" },
  { sender: "Me",  text: "nu na naman pinagsasabe mo?" },
  { sender: "Jah", text: "Sorry na, out of place yung nasabi ko about sa paglipat mo ng pwesto just because kay anes" },
  { sender: "Me",  text: "che! Pagkatapos mo kunin inis ko" },
  { sender: "Jah", text: "Pataasan ng walls tapos ikaw kalaban no?" },
  { sender: "Jah", text: "Joke, seryus mode" },
  { sender: "Me",  text: "…" },
  { sender: "Jah", text: "I'm really sorry about what I said and about teasing you. " },
  { sender: "Jah", text: "It was too much; I went too far, and I made it sound like umiikot lng mundo mo don and that hinahabol mo siya when, in fact, di naman kasi I know how strong-willed of a person you are, especially pag ayaw mo na, ayaw mo na."},
  { sender: "Jah", text: "You're a person who knows what she wants and who goes after what she wants, and I disrespected all of that by painting this image that you're adamant about chasing anes, when I know you aren't that kind of person." },
  { sender: "Jah", text: "Kaya I'm really sorry. Pramis, I know where to stand now. Sadyang nasobrahan lng pangangasar ko sau hehe. Bati na ba tayuu? 😀" },
  {
    sender: "Jah",
    image: matchaImg,
    caption: null,
  },
  { sender: "Me",  text: "uhlol hindi" },
  { sender: "Jah", text: "IH, bati na yan" },
  { sender: "Me",  text: "yaw ko" },
  { sender: "Jah", text: "Bati na ngaaaAAA" },
  { sender: "Me",  text: "Ano ka gold?" },

  // ── EXAMPLE IMAGE MESSAGE ──────────────────────────────────────────────────
  // Replace the `image` value with your own asset path or URL.
  // The `caption` field is optional — remove it if you don't need one.
  // ──────────────────────────────────────────────────────────────────────────
  {
    sender: "Jah",
    image: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnJzZWwxbHZxYTMyY3dsbHFpY2ZlOGlvcjh0bDZxZXJkY3Z0dnRldSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6v1v8O3go6r0uLI1xT/giphy.gif",
    caption: "Magsangkay na kit",
  },

  { sender: "Me",  text: "san mo nakuha bisaya mo? Google translate no?" },
  { sender: "Jah", text: "may tama ka tlga (oo), mag hampang na kita" },
  { sender: "Jah", text: "But seriously jam, I'm really sorry I made you feel that way." },
  { sender: "Jah", text: "I want you to know that you're special to me, and you have no idea how it made me feel to have done that to you, to have gone too far, and to have belittled you in that way, making you feel small." },
  { sender: "Jah", text: "That teasing was wrong of me to say, and I want you to know how morose I am over what happened. " },
  { sender: "Jah", text: "I don't want this to come between us, jam. Kaya, I really hope you appreciate this thing I made, let it be a testament of how much you mean to me. " },
  { sender: "Jah", text: "so again, i'm sorry :(((" },
  {
    sender: "Jah",
    image: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGMwem5vd2o2Z3VmOXU5cnQxdmFxNXNzajNtbXQ1M3RqY2M0ZG1kciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ffzhLUixCtlsc/giphy.gif",
    caption: null,
  },
  { sender: "Jah", text: "bati na ba tayo?" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const JAH_TYPING_SPEED = 28;
const JAH_MIN_DELAY    = 1500;
const JAH_MAX_DELAY    = 6500;
const SEND_PAUSE       = 420;

// ─────────────────────────────────────────────────────────────────────────────
const IGNORED_KEYS = new Set([
  "Shift","Control","Alt","Meta","CapsLock","Tab","Escape",
  "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
  "Home","End","PageUp","PageDown","Insert","Delete","Backspace",
  "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
  "ContextMenu","NumLock","ScrollLock","Pause","PrintScreen",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Avatar component — shows image if available, falls back to initial letter
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ src, initial, hidden = false, className = "" }) {
  return (
    <div className={`msg-avatar${hidden ? " msg-avatar--hidden" : ""} ${className}`}>
      {src
        ? <img src={src} alt={initial} className="msg-avatar__img" />
        : initial}
    </div>
  );
}

export default function MessagingSimulator({ script = SCRIPT }) {
  const [messages,     setMessages]     = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase,        setPhase]        = useState("idle");
  const [currentTyped, setCurrentTyped] = useState("");
  const [dotFrame,     setDotFrame]     = useState(0);

  const endRef     = useRef(null);
  const advanceRef = useRef(null);

  useEffect(() => {
    if (phase !== "jah-typing") return;
    const id = setInterval(() => setDotFrame(f => (f + 1) % 4), 400);
    return () => clearInterval(id);
  }, [phase]);

  const scrollToBottom = () =>
    endRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, currentTyped, phase]);

  // ── Core advance ──────────────────────────────────────────────────────────
  advanceRef.current = (idx) => {
    if (idx >= script.length) {
      setCurrentIndex(idx);
      setPhase("done");
      return;
    }
    setCurrentIndex(idx);
    const turn = script[idx];

    if (turn.sender === "Jah") {
      setPhase("jah-typing");
      // Image messages use a fixed short delay; text messages scale with length
      const delay = turn.image
        ? 1200
        : Math.min(Math.max(turn.text.length * JAH_TYPING_SPEED, JAH_MIN_DELAY), JAH_MAX_DELAY);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: `jah-${idx}`, sender: "Jah", text: turn.text, image: turn.image, caption: turn.caption },
        ]);
        advanceRef.current(idx + 1);
      }, delay);
    } else {
      setPhase("user-typing");
      setCurrentTyped("");
    }
  };

  useEffect(() => {
    const t = setTimeout(() => advanceRef.current(0), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "user-typing") return;
    const turn = script[currentIndex];
    if (!turn) return;

    const onKey = (e) => {
      if (IGNORED_KEYS.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) return;
      setCurrentTyped(prev => {
        if (prev.length >= turn.text.length) return prev;
        return turn.text.slice(0, prev.length + 1);
      });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, currentIndex, script]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const doSend = () => {
    const turn = script[currentIndex];
    if (!turn || currentTyped !== turn.text) return;
    setMessages(prev => [
      ...prev,
      { id: `me-${currentIndex}`, sender: "Me", text: turn.text },
    ]);
    const nextIdx = currentIndex + 1;
    setCurrentTyped("");
    setPhase("idle");
    setTimeout(() => advanceRef.current(nextIdx), SEND_PAUSE);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Enter" && canSend) doSend(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const currentTurn = currentIndex >= 0 && currentIndex < script.length
    ? script[currentIndex] : null;
  const canSend = phase === "user-typing" && currentTurn
    && currentTyped === currentTurn.text;
  const progress = phase === "user-typing" && currentTurn
    ? currentTyped.length / currentTurn.text.length : 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="chat-shell">

      {/* ── Header ── */}
      <div className="chat-header">
        {/* 🖼️ JAH_AVATAR — set the constant at the top of this file */}
        <div className="chat-header__avatar">
          {JAH_AVATAR
            ? <img src={JAH_AVATAR} alt="Jah" className="chat-header__avatar-img" />
            : "J"}
        </div>
        <div>
          <div className="chat-header__name">Jah</div>
          <div className="chat-header__status">
            {phase === "jah-typing" ? "typing..." : "● active now"}
          </div>
        </div>
        <div className="chat-header__actions">
          <span className="chat-header__icon" style={{ fontSize: 18 }}>📞</span>
          <span className="chat-header__icon" style={{ fontSize: 22 }}>⋮</span>
        </div>
      </div>

      {/* ── Date Chip ── */}
      <div className="date-chip">TODAY</div>

      {/* ── Messages ── */}
      <div className="message-list">
        {messages.map((msg, i) => {
          const isMe     = msg.sender === "Me";
          const prevSame = i > 0 && messages[i - 1].sender === msg.sender;

          return (
            <div
              key={msg.id}
              className={[
                "msg-row",
                "message-row",
                isMe ? "message-row--me" : "message-row--jah",
                prevSame ? "message-row--gap-small" : "message-row--gap-large",
              ].join(" ")}
            >
              {/* Jah's avatar — 🖼️ set JAH_AVATAR at the top of this file */}
              {!isMe && (
                <Avatar
                  src={JAH_AVATAR}
                  initial="J"
                  hidden={prevSame}
                />
              )}

              {/* Image message */}
              {msg.image ? (
                <div className="bubble bubble-enter bubble--jah bubble--image">
                  <img
                    src={msg.image}
                    alt={msg.caption || "image"}
                    className="msg-image"
                  />
                  {msg.caption && (
                    <p className="msg-image__caption">{msg.caption}</p>
                  )}
                </div>
              ) : (
                /* Text message */
                <div className={`bubble bubble-enter ${isMe ? "bubble--me" : "bubble--jah"}`}>
                  {msg.text}
                </div>
              )}

              {/* My avatar — 🖼️ set MY_AVATAR at the top of this file */}
              {isMe && MY_AVATAR && (
                <Avatar
                  src={MY_AVATAR}
                  initial="M"
                  hidden={prevSame}
                  className="msg-avatar--me"
                />
              )}
            </div>
          );
        })}

        {/* Jah typing indicator */}
        {phase === "jah-typing" && (
          <div className="msg-row typing-row">
            {/* 🖼️ JAH_AVATAR used here too */}
            <Avatar src={JAH_AVATAR} initial="J" />
            <div className="typing-bubble">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="typing-dot"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="done-banner">Jahreez is waiting for your answer...</div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="input-bar">
        <div className={`input-field ${phase === "user-typing" ? "input-field--active" : "input-field--idle"}`}>
          {phase === "user-typing" ? (
            <>
              <input
                className="input-real"
                type="text"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={currentTyped}
                onChange={e => {
                  const val = e.target.value;
                  const target = currentTurn?.text ?? "";
                  // Only accept characters that match the script
                  if (target.startsWith(val)) {
                    setCurrentTyped(val);
                  } else {
                    // Advance character by character to keep in sync
                    setCurrentTyped(target.slice(0, val.length));
                  }
                }}
                onKeyDown={e => { if (e.key === "Enter" && canSend) { e.preventDefault(); doSend(); }}}
                autoFocus
              />
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="char-count">
                {currentTyped.length} / {currentTurn?.text.length}
              </div>
            </>
          ) : (
            <div className="input-text">
              <span className="input-placeholder">
                {phase === "done"
                  ? "Conversation complete, it's your time to give an answer to jahreez on messenger"
                  : phase === "jah-typing"
                  ? "Jah is typing…"
                  : "Waiting…"}
              </span>
            </div>
          )}
        </div>

        <button
          className={`send-btn${canSend ? " send-btn--active" : ""}`}
          onClick={doSend}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* ── Hint ── */}
      {phase === "user-typing" && (
        <div className="input-hint">
          Tap the field to type · Enter or ▶ to send
        </div>
      )}
    </div>
  );
}