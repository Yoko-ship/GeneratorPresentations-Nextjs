"use client";
import Link from "next/link";
import classes from "@/app/page.module.css";
import { useSession, signOut } from "next-auth/react";

function Header() {
  const session = useSession();

  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <div className={classes.logo}>
            <li>
              <Link href="/">PRESENT MAKER</Link>
            </li>
          </div>
          <div className={classes.info_part}>
            <li>
              <Link href="/">Главное Меню</Link>
            </li>
            <li>
              <Link href="/contacts">О нас</Link>
            </li>
            {!session.data ? (
              <>
                <li className={classes.auth}>
                  <Link href="/api/auth/signin" className={classes.signing}>Войти</Link>
                </li>
              </>
            ) : (
              <>
                <li className={classes.auth}>
                  <Link href="/profile">Профиль</Link>
                </li>
                <li className={classes.auth}>
                  <Link href="#" onClick={() => signOut({ callbackUrl: "/" })} className={classes.signing}>
                    Выйти
                  </Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
