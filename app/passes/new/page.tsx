"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import { BoardingPass, BoardingPassClass } from "@/types";
import { ArrowLeft, Check, Plane } from "lucide-react";

const AIRLINES = [
  "American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines",
  "British Airways", "Air France", "Lufthansa", "Emirates", "Qatar Airways",
  "Singapore Airlines", "Cathay Pacific", "Japan Airlines", "Air Canada",
  "KLM", "Turkish Airlines", "Ryanair", "EasyJet", "Norwegian",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

export default function NewBoardingPassPage() {
  const router = useRouter();
  const { addBoardingPass, user } = useStore();

  const [airline, setAirline] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [originCode, setOriginCode] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationCode, setDestinationCode] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [seat, setSeat] = useState("");
  const [gate, setGate] = useState("");
  const [terminal, setTerminal] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [passengerName, setPassengerName] = useState(
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""
  );
  const [cabinClass, setCabinClass] = useState<BoardingPassClass>("economy");
  const [saving, setSaving] = useState(false);

  const canSave = airline && flightNumber && originCode && destinationCode &&
    departureDate && departureTime && arrivalTime && seat && bookingRef && passengerName;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    const pass: BoardingPass = {
      id: uid(),
      airline, flightNumber,
      origin, originCode: originCode.toUpperCase(),
      destination, destinationCode: destinationCode.toUpperCase(),
      departureDate, departureTime, arrivalTime,
      seat: seat.toUpperCase(),
      gate: gate || undefined,
      terminal: terminal || undefined,
      bookingRef: bookingRef.toUpperCase(),
      passengerName: passengerName.toUpperCase(),
      class: cabinClass,
      createdAt: new Date().toISOString(),
    };
    await addBoardingPass(pass);
    router.replace("/passes");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-stone-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-stone-900 text-lg">Add Boarding Pass</h1>
          <p className="text-xs text-stone-400">Stored securely in your account</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
        {/* Cabin class */}
        <Field label="Cabin class">
          <div className="grid grid-cols-3 gap-2">
            {(["economy", "business", "first"] as BoardingPassClass[]).map((c) => (
              <button
                key={c}
                onClick={() => setCabinClass(c)}
                className={`py-2 rounded-xl text-sm font-medium border transition-colors capitalize ${
                  cabinClass === c
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-stone-300 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {c === "first" ? "First" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </Field>

        {/* Airline */}
        <Field label="Airline">
          <input
            list="airlines-list"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            placeholder="e.g. Emirates"
            className={inputCls}
          />
          <datalist id="airlines-list">
            {AIRLINES.map((a) => <option key={a} value={a} />)}
          </datalist>
        </Field>

        {/* Flight number + date */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Flight number">
            <input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="EK 203" className={inputCls} />
          </Field>
          <Field label="Date">
            <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className={inputCls} />
          </Field>
        </div>

        {/* Origin / Destination */}
        <div className="bg-stone-50 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <Field label="From city">
                <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="New York" className={inputCls} />
              </Field>
            </div>
            <div className="w-16">
              <Field label="Code">
                <input value={originCode} onChange={(e) => setOriginCode(e.target.value.toUpperCase())} placeholder="JFK" maxLength={3} className={inputCls + " text-center font-bold uppercase tracking-widest"} />
              </Field>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Plane size={18} className="text-blue-400 rotate-90" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <Field label="To city">
                <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="London" className={inputCls} />
              </Field>
            </div>
            <div className="w-16">
              <Field label="Code">
                <input value={destinationCode} onChange={(e) => setDestinationCode(e.target.value.toUpperCase())} placeholder="LHR" maxLength={3} className={inputCls + " text-center font-bold uppercase tracking-widest"} />
              </Field>
            </div>
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Departs">
            <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Arrives">
            <input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className={inputCls} />
          </Field>
        </div>

        {/* Seat / Gate / Terminal */}
        <div className="grid grid-cols-3 gap-3">
          <Field label="Seat">
            <input value={seat} onChange={(e) => setSeat(e.target.value.toUpperCase())} placeholder="14A" maxLength={4} className={inputCls + " uppercase"} />
          </Field>
          <Field label="Gate">
            <input value={gate} onChange={(e) => setGate(e.target.value.toUpperCase())} placeholder="B12" className={inputCls + " uppercase"} />
          </Field>
          <Field label="Terminal">
            <input value={terminal} onChange={(e) => setTerminal(e.target.value)} placeholder="T2" className={inputCls} />
          </Field>
        </div>

        {/* Passenger + booking ref */}
        <Field label="Passenger name">
          <input value={passengerName} onChange={(e) => setPassengerName(e.target.value.toUpperCase())} placeholder="SILAS HILLMAN" className={inputCls + " uppercase"} />
        </Field>

        <Field label="Booking reference">
          <input value={bookingRef} onChange={(e) => setBookingRef(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={10} className={inputCls + " uppercase tracking-widest font-mono"} />
        </Field>
      </div>

      {/* Save button */}
      <div className="px-4 pb-6 pt-3 border-t border-stone-100">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold disabled:opacity-40 transition-colors"
        >
          Save Boarding Pass <Check size={18} />
        </button>
      </div>
    </div>
  );
}
