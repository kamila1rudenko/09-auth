import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { sHasSession, sGetMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile — NoteHub",
  description: "Your NoteHub profile page",
  openGraph: {
    title: "Profile — NoteHub",
    description: "Your NoteHub profile page",
    url: "https://09-auth-navy-psi.vercel.app/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Profile",
      },
    ],
  },
};

export default async function ProfilePage() {
  const ok = await sHasSession();
  if (!ok) redirect("/sign-in");

  const user = await sGetMe();

  const avatar = user.avatar?.trim() ? user.avatar : "/avatar.png";
  const username = user.username || user.email.split("@")[0];

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
