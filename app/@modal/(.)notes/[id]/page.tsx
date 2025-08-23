import { sFetchNoteById } from "@/lib/api/serverApi";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client";

type Props = { params: Promise<{ id: string }> };

export default async function NoteDetailsModal({ params }: Props) {
  const { id } = await params;
  const qc = new QueryClient();
  await qc.prefetchQuery({ queryKey: ["note", id], queryFn: () => sFetchNoteById(id) }); 
  return <HydrationBoundary state={dehydrate(qc)}><NotePreviewClient /></HydrationBoundary>;
}
