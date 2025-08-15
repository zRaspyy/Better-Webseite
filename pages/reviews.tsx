"use client";

import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, push, onValue, update } from "firebase/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { X, ThumbsUp, ThumbsDown } from "lucide-react";
import BackgroundGlow from "@/components/BackgroundGlow";

type Review = {
  id?: string;
  name: string;
  text: string;
  stars: number;
  created: number;
  likes?: number;
  dislikes?: number;
};

function getStats(reviews: Review[]) {
  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
  const avg = total ? sum / total : 0;
  return { avg, total };
}

function getReviewId(r: Review) {
  return r.id || `${r.created}_${r.name}`;
}

function StarSvg({ filled, size = 24 }: { filled: boolean; size?: number }) {
  return (
    <svg className={`${filled ? "text-yellow-300" : "text-gray-300"}`} width={size} height={size} aria-hidden="true" fill="currentColor" viewBox="0 0 22 20">
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reviewsRef = ref(db, "bewertungen");
    return onValue(reviewsRef, (snap) => {
      const val = snap.val() || {};
      const arr: Review[] = Object.entries(val).map(([id, r]: [string, any]) => ({
        ...r,
        id,
        likes: r.likes || 0,
        dislikes: r.dislikes || 0,
      }));
      arr.sort((a, b) => b.created - a.created);
      setReviews(arr);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || stars < 1 || stars > 5) return;
    setLoading(true);
    await push(ref(db, "bewertungen"), {
      name: name.trim(),
      text: text.trim(),
      stars,
      created: Date.now(),
      likes: 0,
      dislikes: 0,
    });
    setName("");
    setText("");
    setStars(5);
    setLoading(false);
    setShowForm(false);
  };

  const handleLike = (id: string) => {
    const key = `review_like_${id}`;
    if (localStorage.getItem(key)) return;
    update(ref(db, `bewertungen/${id}`), { likes: (reviews.find(r => r.id === id)?.likes || 0) + 1 });
    localStorage.setItem(key, "1");
  };
  const handleDislike = (id: string) => {
    const key = `review_dislike_${id}`;
    if (localStorage.getItem(key)) return;
    update(ref(db, `bewertungen/${id}`), { dislikes: (reviews.find(r => r.id === id)?.dislikes || 0) + 1 });
    localStorage.setItem(key, "1");
  };

  const stats = getStats(reviews);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <BackgroundGlow />
      {/* Kein Glow hinter Cards */}
      <main className="flex flex-col items-center justify-center flex-1 px-0 pb-12 w-full">
        {/* Überschrift mit Abstand */}
        <div className="w-full flex flex-col items-center mt-20 mb-8">
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              {[1,2,3,4,5].map(n => (
                <StarSvg key={n} filled={stats.avg >= n} size={28} />
              ))}
              <p className="ms-3 text-2xl font-bold text-white">{stats.avg.toFixed(2)}</p>
              <span className="w-1 h-1 mx-2 bg-gray-500 rounded-full"></span>
              <span className="text-xl font-medium text-white underline">{stats.total} Bewertungen</span>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="ml-8 px-8 py-3 rounded-xl bg-[#ff3c3c] hover:bg-[#d32d2f] text-white font-bold text-lg shadow transition"
            >
              Bewertung abgeben
            </button>
          </div>
        </div>
        {/* Reviews Grid */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-6 grid-rows-3 gap-7 w-full px-8">
            {reviews.slice(0, 18).map((r) => (
              <article
                key={getReviewId(r)}
                className="bg-[#18181b] border border-[#ff3c3c] rounded-2xl shadow-lg p-5 flex flex-col gap-3 relative transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  minHeight: 210,
                  maxWidth: 320,
                  margin: "0 auto"
                }}
              >
                <div className="flex items-center mb-2">
                  <img className="w-9 h-9 me-3 rounded-full bg-[#23232a] object-cover border border-[#ff3c3c]" src="/Logo.png" alt="" />
                  <div className="font-bold text-base text-white">
                    {r.name}
                    <time className="block text-xs text-gray-500 font-normal">{new Date(r.created).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</time>
                  </div>
                </div>
                <div className="flex items-center mb-1 space-x-1">
                  {[1,2,3,4,5].map(n => (
                    <StarSvg key={n} filled={r.stars >= n} size={22} />
                  ))}
                  <span className="ms-2 text-sm font-semibold text-yellow-300">{r.stars} / 5</span>
                </div>
                <p className="mb-2 text-base text-gray-200 font-medium">{r.text}</p>
                <div className="w-full h-1.5 bg-[#23232a] rounded-lg mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] rounded-lg"
                    style={{ width: `${(r.stars / 5) * 100}%`, transition: "width 0.5s" }}
                  />
                </div>
                <aside>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded bg-[#23232a] hover:bg-yellow-300 text-gray-300 hover:text-black transition font-bold text-xs"
                      onClick={() => handleLike(getReviewId(r))}
                      disabled={typeof window !== "undefined" && !!localStorage.getItem(`review_like_${getReviewId(r)}`)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{r.likes || 0}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded bg-[#23232a] hover:bg-yellow-300 text-gray-300 hover:text-black transition font-bold text-xs"
                      onClick={() => handleDislike(getReviewId(r))}
                      disabled={typeof window !== "undefined" && localStorage.getItem(`review_dislike_${getReviewId(r)}`) !== null}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{r.dislikes || 0}</span>
                    </button>
                    <button className="px-2 py-1 text-xs font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-yellow-700 transition">Helpful</button>
                    <button className="ps-2 text-xs font-medium text-yellow-400 underline hover:no-underline border-gray-200 ms-2 border-s">Report abuse</button>
                  </div>
                </aside>
              </article>
            ))}
          </div>
        </div>
        {/* Modal für Bewertung abgeben */}
        {showForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-[#18181b] border border-[#23232a] rounded-2xl shadow-2xl p-7 w-full max-w-md mx-auto flex flex-col gap-4">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                onClick={() => setShowForm(false)}
                aria-label="Schließen"
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-2 text-white">Bewertung abgeben</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-[#23232a] text-white border border-[#23232a] focus:outline-none focus:border-[#ff3c3c] transition"
                  maxLength={32}
                  required
                />
                <textarea
                  placeholder="Deine Bewertung"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-[#23232a] text-white border border-[#23232a] focus:outline-none focus:border-[#ff3c3c] transition resize-none"
                  rows={3}
                  maxLength={300}
                  required
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Sterne:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className="focus:outline-none"
                      onClick={() => setStars(n)}
                      aria-label={`Bewertung ${n} Sterne`}
                    >
                      <StarSvg filled={stars >= n} size={22} />
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 px-6 py-3 rounded-lg bg-[#ff3c3c] hover:bg-[#d32d2f] text-white font-bold text-lg transition"
                >
                  {loading ? "Wird gesendet..." : "Bewertung absenden"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
