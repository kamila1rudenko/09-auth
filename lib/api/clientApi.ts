// lib/api/clientApi.ts
import api from "./api";
import { User } from "@/types/user";
import { Note, CreateNotePayload } from "@/types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}


export async function registerUser(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/register", { email, password });
  return data;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getSession(): Promise<User | null> {
  const { data } = await api.get<User | null>("/auth/session");
  return data ?? null;
}

export async function checkClientSession(): Promise<boolean> {
  const user = await getSession();
  return Boolean(user);
}


export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}
export async function updateUser(payload: { username?: string; email?: string }): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

export async function fetchNotes(params: {
  search?: string;
  page?: number;
  perPage?: number; 
  tag?: string;
}): Promise<NotesHttpResponse> {
  const { tag, ...rest } = params ?? {};
  const finalParams = { ...rest, ...(tag && tag !== "All" ? { tag } : {}) };

  const { data } = await api.get<NotesHttpResponse>("/notes", { params: finalParams });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
