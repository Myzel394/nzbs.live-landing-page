import Link from "next/link";
import { SIGNUP_URL } from "@/config";
import { ButtonLink } from "./ButtonLink";
import { LogoMark } from "./LogoMark";
import styles from "./Nav.module.css";

export function Nav() {
  return (
    <nav aria-label="Main" className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <LogoMark className={styles.mark} />
        nzbs.live
      </Link>
      <div className={styles.links}>
        <a href="#forgets" className={styles.link}>
          How it works
        </a>
        <a href="#prom" className={styles.link}>
          For uploaders
        </a>
        <a href="#notify" className={styles.link}>
          Notifications
        </a>
        <ButtonLink href={SIGNUP_URL} size="small">
          Start monitoring
        </ButtonLink>
      </div>
    </nav>
  );
}
