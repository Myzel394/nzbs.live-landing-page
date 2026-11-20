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
          Your NZB files point to pieces of files stored on Usenet, and those pieces disappear over time.
          nzbs.live checks every one of them each month and tells you which are gone.
        </p>
        <p className={styles.fact}>One check per article, on the 1st of every month</p>
        <div className={styles.actions}>
          <ButtonLink href={SIGNUP_URL}>Start monitoring</ButtonLink>
          <ButtonLink href="#forgets" variant="ghost">
            See how it works
          </ButtonLink>
        </div>
      </div>
      <p className={styles.hint} aria-hidden="true">
        Move the pointer to aim the light
      </p>
      <MotionToggle className={styles.motion} />
    </header>
  );
}
