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
          Add your NZBs once. On the 1st of every month nzbs.live checks every article, keeps every result and tells
          you what went missing.
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
