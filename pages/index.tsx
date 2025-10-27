import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salam, aku Lorenzo de’ Medici — pelindung seni dan kebangkitan manusia. Apa yang ingin engkau tanyakan tentang masa Renaissance?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.reply) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan." },
      ]);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/9/9c/Old_parchment_background_texture.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Garamond', serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "rgba(102, 51, 0, 0.8)",
          color: "antiqueWhite",
          textAlign: "center",
          padding: "16px",
          fontSize: "24px",
          borderBottom: "4px solid #3e1f00",
          letterSpacing: "1px",
        }}
      >
        💫 Lorenzo de’ Medici — Suara dari Renaissance 💫
      </header>

      {/* CHAT AREA */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "rgba(90, 45, 0, 0.85)"
                  : "rgba(255, 248, 220, 0.85)",
              color: m.role === "user" ? "antiqueWhite" : "#2e1a07",
              padding: "12px 16px",
              borderRadius:
                m.role === "user"
                  ? "16px 16px 0 16px"
                  : "16px 16px 16px 0",
              maxWidth: "70%",
              fontSize: "16px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
              border: "1px solid rgba(60, 30, 10, 0.3)",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.role === "assistant" && (
              <b
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontFamily: "'Cinzel Decorative', serif",
                }}
              >
                Lorenzo:
              </b>
            )}
            {m.role === "user" && (
              <b
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontFamily: "'Cinzel Decorative', serif",
                }}
              >
                Kamu:
              </b>
            )}
            {m.content}
          </div>
        ))}
        {loading && (
          <p style={{ color: "#5a2d00", fontStyle: "italic" }}>
            Lorenzo sedang menulis di atas perkamen...
          </p>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <footer
        style={{
          padding: "14px",
          background: "rgba(255, 248, 220, 0.85)",
          borderTop: "2px solid #3e1f00",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Tuliskan pertanyaanmu di sini..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #3e1f00",
            background: "rgba(255,255,255,0.9)",
            fontFamily: "'Garamond', serif",
            fontSize: "16px",
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            background: "#5a2d00",
            color: "antiqueWhite",
            border: "none",
            borderRadius: "10px",
            padding: "0 20px",
            cursor: "pointer",
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "16px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          }}
        >
          Kirim
        </button>
      </footer>
    </main>
  );
}
