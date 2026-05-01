"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, CheckCircle } from "lucide-react";

type Mode = "signin" | "sent";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setMode("sent");
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  if (mode === "sent") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 w-full max-w-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Check your email</h2>
          <p className="text-stone-500 text-sm mb-6">
            We sent a sign-in link to <span className="font-medium text-stone-700">{email}</span>. Click it to continue.
          </p>
          <button
            onClick={() => setMode("signin")}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">✈️</span>
          <div>
            <h1 className="text-xl font-bold text-stone-900">Travel Buddy</h1>
            <p className="text-xs text-stone-400">Sign in to sync across devices</p>
          </div>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-stone-300 rounded-2xl py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors mb-4"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400">or</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Magic link form */}
        <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {error && <p className="text-xs text-red-500 px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Send magic link
          </button>
        </form>

        <p className="text-xs text-stone-400 text-center mt-6">
          No password needed. We'll email you a sign-in link.
        </p>

        <button
          onClick={() => router.back()}
          className="w-full text-center text-xs text-stone-400 hover:text-stone-600 mt-4 transition-colors"
        >
          ← Back to app
        </button>
      </div>
    </div>
  );
}
