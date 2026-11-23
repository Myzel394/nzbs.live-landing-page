import { ImmersiveSection } from "@/components/ImmersiveSection";
import { SectionIntro } from "@/components/SectionIntro";
import { Phone } from "./Phone";
import styles from "./Notify.module.css";

export function Notify() {
  return (
    <ImmersiveSection id="notify" aria-labelledby="notify-title" className={styles.section}>
      <span className={styles.beam} aria-hidden="true" />
      <SectionIntro label="On the 1st" title="One message, when the check is done" titleId="notify-title" variant="inline">
        <p>
          nzbs.live periodically checks all your NZBs and sends one short message: how many NZBs lost articles,
          and how many articles. On a quiet month it tells you everything is good.
        </p>
      </SectionIntro>
      <Phone />
    </ImmersiveSection>
  );
}
