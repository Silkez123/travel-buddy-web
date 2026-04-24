"use client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import TemplatePreview from "@/components/TemplatePreview";

export default function PostcardDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { postcards, trips, removePostcard } = useStore();
  const postcard = postcards.find((p) => p.id === id);

  if (!postcard) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400">
        <p>Postcard not found</p>
        <button onClick={() => router.back()} className="text-emerald-600 font-medium">Go back</button>
      </div>
    );
  }

  const trip = trips.find((t) => t.id === postcard.tripId);

  async function handleDelete() {
    if (!confirm("Delete this postcard?")) return;
    await removePostcard(postcard!.id);
    router.replace("/postcards");
  }

  async function handleShare() {
    if (!navigator.share) return alert("Sharing not supported on this device.");
    await navigator.share({ title: `Postcard from ${postcard!.location}`, text: postcard!.message });
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-stone-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-stone-100">
            <Share2 size={20} className="text-stone-500" />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-full hover:bg-red-50">
            <Trash2 size={20} className="text-red-400" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-4">
        <TemplatePreview
          templateId={postcard.templateId}
          photos={postcard.photos}
          message={postcard.message}
          location={postcard.location}
          stickers={postcard.stickers}
          messageColor={postcard.messageColor}
          messageFontSize={postcard.messageFontSize}
        />

        <div className="bg-stone-50 rounded-2xl p-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>Template</span>
            <span className="capitalize text-stone-700 font-medium">{postcard.templateId}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Created</span>
            <span className="text-stone-700 font-medium">{formatDate(postcard.createdAt)}</span>
          </div>
          {trip && (
            <div className="flex justify-between text-stone-500">
              <span>Trip</span>
              <span className="text-stone-700 font-medium">{trip.emoji} {trip.name}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-500">
            <span>Photos</span>
            <span className="text-stone-700 font-medium">{postcard.photos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
