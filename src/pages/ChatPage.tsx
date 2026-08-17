import { ArrowLeft, Bot, Paperclip, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialMessages = [
  {
    id: 1,
    sender: "bot" as const,
    text: "Привет! Я помогу разобраться с питанием, блюдами и их составом.",
  },
  {
    id: 2,
    sender: "user" as const,
    text: "Что можно приготовить на полезный ужин?",
  },
  {
    id: 3,
    sender: "bot" as const,
    text: "Попробуйте боул с курицей, киноа и свежими овощами. Он сытный и хорошо сбалансирован по белкам, жирам и углеводам.",
  },
];

export function ChatPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  function sendMessage() {
    const text = message.trim();
    if (!text) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), sender: "user", text },
    ]);
    setMessage("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  }

  return (
    <main className="app-theme chat-theme flex h-[100dvh] flex-col overflow-auto bg-[var(--app-page)] font-[Manrope,sans-serif] text-[var(--app-text)]">
      <header className="flex items-center gap-3 bg-[var(--app-surface)] px-4 py-3">
        <button
          aria-label="Назад"
          className="grid h-10 w-10 place-items-center rounded-full text-[var(--app-text-muted)] transition-colors hover:bg-white/10"
          onClick={() => navigate("/home")}
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--app-accent)] text-[var(--app-accent-text)]">
          <Bot size={21} />
        </span>
        <div>
          <h1 className="text-[15px] font-bold">Food Assistant</h1>
          <p className="mt-0.5 text-[10px] text-[var(--app-text-subtle)]">В сети</p>
        </div>
      </header>

      <section
        aria-label="Сообщения"
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
      >
        {/* <p className="mx-auto mb-1 rounded-full bg-[#25315d] px-3 py-1 text-[10px] text-[#cbd5fb]">
          Сегодня
        </p> */}
        {messages.map(({ id, sender, text }) => (
          <article
            className={`max-w-[82%] rounded-[18px] px-3.5 py-2.5 text-[12px] leading-relaxed ${sender === "user" ? "ml-auto rounded-br-md bg-[var(--app-accent)] text-[var(--app-accent-text)]" : "rounded-bl-md border border-[var(--app-border)]/15 bg-[var(--app-surface-raised)] text-[var(--app-text)]"}`}
            key={id}
          >
            {text}
          </article>
        ))}
      </section>

      <form
        className="flex items-center gap-2 bg-[var(--app-surface)] px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <button
          aria-label="Прикрепить файл"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--app-text-subtle)] hover:bg-white/10"
          type="button"
        >
          <Paperclip size={19} />
        </button>
        <textarea
          className="min-h-11 max-h-[120px] min-w-0 flex-1 resize-none overflow-y-auto rounded-[18px] border border-[var(--app-border)]/20 bg-[var(--app-surface-raised)] px-4 py-3 text-[12px] leading-[18px] text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-subtle)] focus:border-[var(--app-text-muted)]"
          onChange={(event) => setMessage(event.target.value)}
          onInput={(event) => {
            const textarea = event.currentTarget;
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
          }}
          placeholder="Напишите сообщение..."
          ref={inputRef}
          rows={1}
          value={message}
        />
        <button
          aria-label="Отправить сообщение"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] bg-[var(--app-accent)] text-[var(--app-accent-text)] transition-transform hover:-translate-y-0.5 disabled:opacity-45"
          disabled={!message.trim()}
          type="submit"
        >
          <SendHorizontal size={19} />
        </button>
      </form>
    </main>
  );
}
