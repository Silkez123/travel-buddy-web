"use client";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import PostcardThumb from "@/components/PostcardThumb";

export default function PostcardsPage() {
  const { postcards } = useStore();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Postcards</h1>
        <Link href="/postcards/new" className="p-2 bg-emerald-600 text-white rounded-full">
          <PlusCircle size={20} />
        </Link>
      </div>

      <div className="px-4 pb-8">
        {postcards.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-stone-400">
            <span className="text-5xl">✉️</span>
            <p className="text-sm">No postcards yet</p>
            <Link href="/postcards/new" className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-full font-medium">
              Create your first
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {postcards.map((pc) => (
              <PostcardThumb key={pc.id} postcard={pc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
