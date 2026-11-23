import { ButtonLink } from "@/components/ButtonLink";
import { MotionToggle } from "@/components/MotionToggle";
import { Lighthouse } from "@/components/lighthouse/Lighthouse";
import { SIGNUP_URL } from "@/config";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <header id="hero" className={styles.hero}>
      <Lighthouse variant="hero" />
      <div className={styles.copy}>
        <h1>Uptime monitoring for your NZBs</h1>
        <p className={styles.sub}>
          Your NZB files point to articles stored on the Usenet, and those articles disappear over time.
          nzbs.live checks every one of them periodically and tells you which are gone, so you can act quickly and fetch your NZBs while par2 repair is still possible.
        </p>
        <div className={styles.actions}>
          <ButtonLink href={SIGNUP_URL}>Start monitoring</ButtonLink>
          <ButtonLink href="#forgets" variant="ghost">
            See how it works
          </ButtonLink>
        </div>
      </div>
      <MotionToggle className={styles.motion} />
    </header>
  );
}
