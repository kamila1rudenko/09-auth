"use client";

import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import type { AxiosError } from 'axios';
import type { NotesHttpResponse } from '@/lib/api/clientApi';

import { fetchNotes } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";          
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Loading from "@/components/Loading/Loading";
import { ErrorMessageEmpty } from "@/components/ErrorMessageEmpty/ErrorMessageEmpty";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import css from "./Notes.module.css";

type NotesClientProps = { tag?: string };

export default function NotesClient({ tag }: NotesClientProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated); 

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const normalizedTag = useMemo(() => {
    if (!tag || tag === "All") return undefined;
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  }, [tag]);

const { data, isPending, isError, error, isFetching } =
  useQuery<NotesHttpResponse, AxiosError>({
    queryKey: ['notes', { page, tag: normalizedTag ?? '', search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({ search: debouncedSearch, page, perPage: 12, tag: normalizedTag }),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: (failureCount, axiosErr) =>
      axiosErr?.response?.status !== 401 && failureCount < 2, 
  });
  if (!isAuthenticated) return <Loading />;
  if (isError && error) throw error;

  const notes = data?.notes ?? [];
  const pageCount = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <ToastContainer />
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        {pageCount > 1 && (
          <Pagination
            totalPages={pageCount}
            currentPage={page}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
        {isFetching && data ? <span className={css.updating}>Updating…</span> : null}
      </header>

      {isPending && !data && <Loading />}
      {!isPending && (notes.length > 0 ? <NoteList notes={notes} /> : <ErrorMessageEmpty />)}
    </div>
  );
}
