'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import TagsMenu from '../TagsMenu/TagsMenu';
import css from './Header.module.css';

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className={css.header}>
      <Link
        className={`${css.linkHeader} ${isHome ? css.active : ''}`}
        href="/"
        prefetch={false}
        aria-label="Home"
        aria-current={isHome ? 'page' : undefined}
      >
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link
              className={`${css.linkHeader} ${isHome ? css.active : ''}`}
              href="/"
              prefetch={false}
              aria-current={isHome ? 'page' : undefined}
            >
              Home
            </Link>
          </li>

          <li>
            <TagsMenu />
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
