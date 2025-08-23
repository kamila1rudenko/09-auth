"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TAGS = [
  "All",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
  "Todo",
];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className={css.menuContainer}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={css.menuButton}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Notes {isOpen ? "▴" : "▾"}
      </button>

      {isOpen && (
        <ul ref={menuRef} className={css.menuList} role="menu">
          {TAGS.map((tag) => {
            const href =
              tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`;
            return (
              <li key={tag} className={css.menuItem} role="none">
                <Link
                  href={href}
                  className={css.menuLink}
                  role="menuitem"
                  onClick={handleLinkClick}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}