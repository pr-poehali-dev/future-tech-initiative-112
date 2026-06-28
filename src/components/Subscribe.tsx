import { useState } from "react";
import func2url from "../../backend/func2url.json";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(func2url.subscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.status === "already_subscribed") {
        setStatus("duplicate");
      } else if (data.status === "ok") {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-white px-6 py-20 flex flex-col items-center text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
        Советы прямо в почту
      </h2>
      <p className="text-neutral-500 text-base md:text-lg max-w-md mb-10">
        Подпишитесь и получайте простые рецепты и лайфхаки по здоровому питанию каждую неделю
      </p>

      {status === "success" ? (
        <div className="text-green-600 font-medium text-lg">
          Готово! Вы подписались на советы по питанию.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            className="flex-1 border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors duration-200"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            {status === "loading" ? "..." : "Подписаться"}
          </button>
        </form>
      )}

      {status === "duplicate" && (
        <p className="mt-4 text-neutral-500 text-sm">Этот email уже подписан — всё в порядке!</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-500 text-sm">Что-то пошло не так. Попробуйте ещё раз.</p>
      )}
    </section>
  );
}
