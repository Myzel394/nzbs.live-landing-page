import { ButtonLink } from "@/components/ButtonLink";
import { ImmersiveSection } from "@/components/ImmersiveSection";
import { Lighthouse } from "@/components/lighthouse/Lighthouse";
import { SectionIntro } from "@/components/SectionIntro";
import { SIGNUP_URL } from "@/config";
import styles from "./Closing.module.css";

export function Closing() {
  return (
    <ImmersiveSection id="start" aria-labelledby="start-title">
      <Lighthouse variant="closing" />
      <SectionIntro label="nzbs.live" title="Usenet keeps forgetting. Now you know." titleId="start-title">
        <p>
          Check your NZBs using nzbs.live to handle early, when it's still possible to repair them.
          nzbs.live keeps every result, so you can see which articles went missing and when.
        </p>
        <div className={styles.actions}>
          <ButtonLink href={SIGNUP_URL}>Start monitoring</ButtonLink>
          <ButtonLink href="#forgets" variant="ghost">
            How it works
          </ButtonLink>
        </div>
      </SectionIntro>
    </ImmersiveSection>
  );
}
