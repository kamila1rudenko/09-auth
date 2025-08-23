import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";
import { sFetchNoteById } from "@/lib/api/serverApi"; // ⬅️ серверная версия

type NoteDetailsProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await sFetchNoteById(id); // ⬅️
  return {
    title: `Note : ${note.title}`,
    description: note.content.slice(0, 30) || "",
    openGraph: {
      title: `Note : ${note.title}`,
      description: note.content.slice(0, 30) || "",
      url: `https://09-auth-livid.vercel.app/notes/${id}`,
      images: [{ url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg", width: 1200, height: 630, alt: "Note Open Graph Image" }],
    },
  };
}

export default async function NotePage({ params }: NoteDetailsProps) {
  const { id } = await params;
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => sFetchNoteById(id), // ⬅️
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
