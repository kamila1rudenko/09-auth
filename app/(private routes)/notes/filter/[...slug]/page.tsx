import { Metadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { sFetchNotes } from "@/lib/api/serverApi";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagFromUrl = slug[0] || "All";
  const title = `Notes filtered by: ${tagFromUrl} — NoteHub`;
  const description = `Browse your notes filtered by "${tagFromUrl}" in NoteHub.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-livid.vercel.app/notes/filter/${tagFromUrl}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${tagFromUrl}`,
        },
      ],
    },
  };
}

export default async function Notes({ params }: Props) {
  const { slug } = await params;
  const rawTag = slug?.[0] ?? "All";

  const normalizedTag =
    rawTag && rawTag !== "All"
      ? rawTag.charAt(0).toUpperCase() + rawTag.slice(1).toLowerCase()
      : undefined;

  const page = 1;
  const search = "";

  const qc = new QueryClient();
  const queryKey = ["notes", { page, tag: normalizedTag ?? "", search }];

  await qc.prefetchQuery({
    queryKey,
    queryFn: () => sFetchNotes({ search, page, perPage: 12, tag: normalizedTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={rawTag} />
    </HydrationBoundary>
  );
}
