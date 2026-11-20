import { ButtonLink } from "@/components/ButtonLink";
import { ScenePlaceholder } from "@/components/ScenePlaceholder";
import { SIGNUP_URL } from "@/config";

export function Closing() {
  return (
    <section id="start" aria-labelledby="start-title">
      {/* The lighthouse on a dark horizon arrives in step 6. */}
      <ScenePlaceholder scene="closing" />
      <div>
        <p>nzbs.live</p>
        <h2 id="start-title">Usenet keeps forgetting. Now you know.</h2>
        <p>
          Add your NZBs once. On the 1st of every month nzbs.live checks every article, keeps every result and tells
          you what went missing.
        </p>
        <div>
          <ButtonLink href={SIGNUP_URL}>Start monitoring</ButtonLink>
          <ButtonLink href="#forgets" variant="ghost">
            How it works
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
