import Link from "next/link";
import { SIGNUP_URL } from "@/config";
import { ButtonLink } from "./ButtonLink";
import { LogoMark } from "./LogoMark";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#forgets", label: "How it works" },
  { href: "#prom", label: "For uploaders" },
  { href: "#notify", label: "Notifications" },
] as const;

export function Nav() {
  return (
    <nav aria-label="Main" className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <LogoMark className={styles.mark} />
        nzbs.live
      </Link>
      <div className={styles.links}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.link}>
            {l.label}
          </a>
        ))}
        <ButtonLink href={SIGNUP_URL} size="small">
          Start monitoring
        </ButtonLink>
      </div>
    </nav>
  );
}
