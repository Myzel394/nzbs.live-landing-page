import { SIGNUP_URL } from "@/config";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>nzbs.live</span>
      <a href="#forgets">How it works</a>
      <a href={SIGNUP_URL}>Start monitoring</a>
      <span>Uptime monitoring for your NZBs.</span>
    </footer>
  );
}
