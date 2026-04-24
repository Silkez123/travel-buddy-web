"use client";
import { useState } from "react";
import { X, Printer, Loader2, CheckCircle } from "lucide-react";

interface Props {
  imageUrl: string;
  onClose: () => void;
}

export default function PrintOrderModal({ imageUrl, onClose }: Props) {
  const [form, setForm] = useState({
    recipientName: "", email: "", address1: "", address2: "",
    city: "", postCode: "", country: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleOrder() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gelato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Order failed");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = form.recipientName && form.email && form.address1 && form.city && form.postCode && form.country;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-bold text-stone-900 flex items-center gap-2">
            <Printer size={18} /> Print & Ship Postcard
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <CheckCircle size={48} className="text-emerald-500" />
            <h3 className="font-bold text-stone-900 text-lg">Order placed!</h3>
            <p className="text-stone-500 text-sm">Your postcard is being printed and will be shipped to the address provided.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium">Done</button>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            {/* Preview */}
            <div className="aspect-[3/2] rounded-xl overflow-hidden bg-stone-100">
              <img src={imageUrl} alt="Postcard preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-stone-500 text-center">6×4" glossy postcard · ~$4.99 + shipping</p>

            <div className="grid grid-cols-1 gap-3">
              {[
                { field: "recipientName", label: "Recipient name", placeholder: "Jane Smith" },
                { field: "email", label: "Email", placeholder: "jane@example.com", type: "email" },
                { field: "address1", label: "Address line 1", placeholder: "123 Main St" },
                { field: "address2", label: "Address line 2 (optional)", placeholder: "Apt 4B" },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">{label}</label>
                  <input
                    type={type ?? "text"}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">City</label>
                  <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="New York" className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Post code</label>
                  <input value={form.postCode} onChange={(e) => update("postCode", e.target.value)} placeholder="10001" className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Country (ISO code)</label>
                <input value={form.country} onChange={(e) => update("country", e.target.value.toUpperCase())} placeholder="US" maxLength={2} className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleOrder}
              disabled={!canSubmit || loading}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Placing order…</> : <><Printer size={16} /> Order Print</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
