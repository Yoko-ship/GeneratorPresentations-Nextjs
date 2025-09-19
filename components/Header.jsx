import Profile from "./Profile";
import Link from "next/link";
import classes from "@/app/page.module.css"

function Header() {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <div className={classes.logo}>
            <li><Link href="/">PRESENT MAKER</Link></li>
          </div>
          <div className={classes.info_part}>
            <li><Link href="/">Главное Меню</Link></li>
            <li><Link href="/">О нас</Link></li>
            <li className={classes.auth}><Link href="/">Войти</Link></li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
