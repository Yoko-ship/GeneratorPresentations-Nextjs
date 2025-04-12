import Profile from "./Profile";
import Link from "next/link";
function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Создать презентацию</Link>
          </li>
          <li>
            <Link href="/contacts">Контакты</Link>
          </li>
          <Profile/>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
