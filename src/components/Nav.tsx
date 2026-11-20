import Link from "next/link";
import { SIGNUP_URL } from "@/config";
import { ButtonLink } from "./ButtonLink";
import { LogoMark } from "./LogoMark";

export function Nav() {
  return (
    <nav aria-label="Main">
      <Link href="/">
        <LogoMark />
        nzbs.live
      </Link>
      <div>
        <a href="#forgets">How it works</a>
        <a href="#prom">For uploaders</a>
        <a href="#notify">Notifications</a>
        <ButtonLink href={SIGNUP_URL} size="small">
          Start monitoring
        </ButtonLink>
      </div>
    </nav>
  );
}
