import { SIGNUP_URL } from "@/config";

export function Footer() {
  return (
    <footer>
      <span>nzbs.live</span>
      <a href="#forgets">How it works</a>
      <a href={SIGNUP_URL}>Start monitoring</a>
      <span>Uptime monitoring for your NZBs.</span>
    </footer>
  );
}
