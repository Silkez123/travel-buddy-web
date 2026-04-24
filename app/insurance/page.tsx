"use client";
import { Shield, ExternalLink, ArrowRight, CheckCircle } from "lucide-react";

const PARTNERS = [
  {
    name: "SafetyWing",
    logo: "🛡️",
    description: "Subscription-based travel medical insurance — perfect for long-term travelers and nomads",
    badge: "Best for Nomads",
    badgeColor: "bg-indigo-100 text-indigo-700",
    url: "https://safetywing.com/nomad-insurance/?referenceId=travelbuddy",
    price: "From $56.28 / 4 weeks",
    highlights: ["Medical coverage in 185+ countries", "COVID-19 coverage included", "Cancel anytime subscription"],
  },
  {
    name: "World Nomads",
    logo: "🌍",
    description: "Comprehensive travel insurance with adventure sports coverage — built for explorers",
    badge: "Adventure Sports",
    badgeColor: "bg-emerald-100 text-emerald-700",
    url: "https://www.worldnomads.com/travel-insurance/?affiliate=travelbuddy",
    price: "From ~$50 / trip",
    highlights: ["Adventure activities covered", "Emergency evacuation", "Trip cancellation"],
  },
  {
    name: "InsureMyTrip",
    logo: "📋",
    description: "Compare 40+ travel insurance plans from top providers in one place",
    badge: "Compare Plans",
    badgeColor: "bg-blue-100 text-blue-700",
    url: "https://www.insuremytrip.com/",
    price: "Multiple plans",
    highlights: ["40+ insurance providers", "Side-by-side comparison", "Unbiased reviews"],
  },
  {
    name: "AIG Travel Guard",
    logo: "🏦",
    description: "Comprehensive trip protection from one of the world's leading insurers",
    badge: "Comprehensive",
    badgeColor: "bg-purple-100 text-purple-700",
    url: "https://www.travelguard.com/",
    price: "From ~$75 / trip",
    highlights: ["Cancel for any reason option", "Baggage loss coverage", "24/7 emergency assistance"],
  },
];

const WHY_ITEMS = [
  { emoji: "🏥", title: "Medical emergencies", sub: "Hospital stays abroad can cost tens of thousands of dollars" },
  { emoji: "✈️", title: "Flight cancellations", sub: "Protect yourself against unexpected trip disruptions" },
  { emoji: "🧳", title: "Lost luggage", sub: "Get reimbursed for lost, stolen, or delayed baggage" },
  { emoji: "🚁", title: "Emergency evacuation", sub: "Medical evacuations can cost $50,000+ without coverage" },
];

export default function InsurancePage() {
  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-violet-500 to-purple-700 text-white px-5 pt-12 pb-8 md:rounded-2xl md:mb-6">
        <p className="text-violet-200 text-sm font-medium tracking-wide uppercase">Book & Save</p>
        <h1 className="text-3xl font-bold mt-1 flex items-center gap-2"><Shield size={28} /> Travel Insurance</h1>
        <p className="text-violet-200 text-sm mt-1">Travel confidently knowing you're covered</p>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-5">
        {/* Why you need it */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <h2 className="font-bold text-stone-800 mb-4">Why travel insurance matters</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WHY_ITEMS.map((w) => (
              <div key={w.title} className="text-center p-3 bg-stone-50 rounded-xl">
                <p className="text-2xl mb-1">{w.emoji}</p>
                <p className="font-semibold text-stone-800 text-sm">{w.title}</p>
                <p className="text-stone-500 text-xs mt-0.5">{w.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-violet-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.logo}</span>
                  <div>
                    <p className="font-bold text-stone-900">{p.name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                  </div>
                </div>
                <ExternalLink size={16} className="text-stone-400 group-hover:text-violet-500 transition-colors mt-1" />
              </div>
              <p className="text-sm text-stone-500">{p.description}</p>
              <div className="flex flex-col gap-1">
                {p.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5 text-xs text-stone-600">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    {h}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-medium text-stone-500">{p.price}</span>
                <div className="flex items-center gap-1 text-violet-600 text-sm font-medium">
                  Get a quote <ArrowRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700">
          <span className="font-semibold">Disclosure:</span> Travel Buddy may earn a commission when you purchase through these links at no extra cost to you. We only recommend products we'd use ourselves.
        </div>
      </div>
    </div>
  );
}
