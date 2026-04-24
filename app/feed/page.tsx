"use client";
import { useState, useEffect, useCallback } from "react";
import { Globe, Heart, Loader2, Send, RefreshCw, MapPin, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { FeedPost } from "@/app/api/feed/route";

export default function FeedPage() {
  const { postcards } = useStore();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleShare() {
    const postcard = postcards.find((p) => p.id === selectedId);
    if (!postcard) return;
    setSharing(true);
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: postcard.location,
          message: postcard.message,
          photo: postcard.photos[0],
          templateId: postcard.templateId,
          author: authorName.trim() || "Traveler",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const newPost: FeedPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      setShowShare(false);
      setSelectedId("");
      setAuthorName("");
    } catch {
      alert("Couldn't share postcard. Please try again.");
    } finally {
      setSharing(false);
    }
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const shareable = postcards.filter((p) => p.photos.length > 0);

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-rose-500 to-pink-700 text-white px-5 pt-12 pb-8 md:rounded-2xl md:mb-6">
        <p className="text-rose-200 text-sm font-medium tracking-wide uppercase">Community</p>
        <h1 className="text-3xl font-bold mt-1 flex items-center gap-2"><Globe size={28} /> Postcard Feed</h1>
        <p className="text-rose-200 text-sm mt-1">Postcards from travelers around the world</p>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-5">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowShare(true)}
            disabled={shareable.length === 0}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            <Send size={15} /> Share a postcard
          </button>
          <button onClick={load} className="p-2 rounded-full hover:bg-stone-100 text-stone-500">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Share modal */}
        {showShare && (
          <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm">
              <div className="p-5 border-b border-stone-100">
                <h2 className="font-bold text-stone-900">Share to Public Feed</h2>
                <p className="text-sm text-stone-500 mt-0.5">Choose one of your postcards to share with the world</p>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Select postcard</label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="">-- Choose a postcard --</option>
                    {shareable.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.location} {p.message.slice(0, 40)}{p.message.length > 40 ? "…" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Your name (optional)</label>
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Traveler"
                    className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowShare(false)}
                    className="flex-1 border border-stone-300 rounded-xl py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={!selectedId || sharing}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sharing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {sharing ? "Sharing…" : "Share"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-rose-400" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Globe size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No postcards yet</p>
            <p className="text-sm mt-1">Be the first to share one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                <div className="aspect-[3/2] relative overflow-hidden bg-stone-100">
                  <img
                    src={post.photo}
                    alt={post.location}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-medium">
                    <MapPin size={13} /> {post.location}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-stone-700 text-sm leading-relaxed">{post.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <User size={12} />
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                        likedIds.has(post.id) ? "text-rose-500" : "text-stone-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart size={14} fill={likedIds.has(post.id) ? "currentColor" : "none"} />
                      {post.likes + (likedIds.has(post.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
