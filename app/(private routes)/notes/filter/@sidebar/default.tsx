import css from './SidebarNotes.module.css';

import Link from 'next/link';

const tags = [
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

interface SidebarNotesProps {
  currentTag: string;
}

export default function SidebarNotes({ currentTag }: SidebarNotesProps) {
  return (
    <ul className={css.menuList}>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={`${css.menuLink} ${currentTag === tag ? css.active : ""}`}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
