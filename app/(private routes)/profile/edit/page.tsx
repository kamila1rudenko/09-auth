"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { updateUser } from "@/lib/api/clientApi"; 
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    setUsername(user?.username || "");
  }, [user]);

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) return Promise.reject("No user");
      return updateUser({ username, email: user.email });
    },
    onSuccess: (data) => {
      setUser(data);
      router.push("/profile");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

    if (!user) return <div>Loading...</div>;
    
     const avatarSrc =
    user.avatar && user.avatar.trim().length > 0 ? user.avatar : "/avatar.png";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
       <Image
            src={avatarSrc}
            alt={`${username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
          />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>

          {mutation.isError && (
            <p className={css.error}>Error updating profile</p>
          )}
        </form>
      </div>
    </main>
  );
}