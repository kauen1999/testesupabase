import { useState, useEffect, FormEvent } from "react";

type Entry = { id: number; text: string };

export default function Home() {
  const [list, setList] = useState<Entry[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    const res = await fetch("/api/entries");
    const data = await res.json();
    if (Array.isArray(data)) setList(data);
    else setError(data.error);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    await fetchEntries();
  };

  return (
    <main style={{ padding: 16 }}>
      <h1>Prisma + Supabase Test</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite algo"
        />
        <button type="submit">Salvar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {list.map((e) => (
          <li key={e.id}>{e.text}</li>
        ))}
      </ul>
    </main>
);
}
