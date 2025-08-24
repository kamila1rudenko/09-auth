// lib/api/serverApi.ts
import api from "./api";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { NotesHttpResponse } from "./clientApi";

async function cookieHeader(): Promise<string> {
  const store = await cookies();
  return store.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
}

export type SessionResponse = { success: boolean } | User | null;

function isSuccessResponse(x: SessionResponse): x is { success: boolean } {
  return typeof x === "object" && x !== null && "success" in x;
}

export async function checkServerSession(): Promise<AxiosResponse<SessionResponse>> {
  return api.get<SessionResponse>("/auth/session", {
    headers: { Cookie: await cookieHeader() },
    withCredentials: true,
  });
}

export async function sHasSession(): Promise<boolean> {
  const res = await checkServerSession();
  const data = res.data;
  return isSuccessResponse(data) ? data.success : Boolean(data);
}

export async function sGetMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: await cookieHeader() },
  });
  return data;
}

type FetchNotesParams = { search?: string; page?: number; perPage?: number; tag?: string };

export async function sFetchNotes(params: FetchNotesParams = {}): Promise<NotesHttpResponse> {
  const { tag, perPage = 12, ...rest } = params;
  const finalParams = { perPage, ...rest, ...(tag && tag !== "All" ? { tag } : {}) };

  const { data } = await api.get<NotesHttpResponse>("/notes", {
    params: finalParams,
    headers: { Cookie: await cookieHeader() },
  });
  return data;
}

export async function sFetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: await cookieHeader() },
  });
  return data;
}
