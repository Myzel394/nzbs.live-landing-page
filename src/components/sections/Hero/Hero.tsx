import { ButtonLink } from "@/components/ButtonLink";
import { ScenePlaceholder } from "@/components/ScenePlaceholder";
import { SIGNUP_URL } from "@/config";

export function Hero() {
  return (
    <header id="hero">
      {/* Lighthouse canvas, the pointer hint and "Pause motion" arrive in step 6. */}
      <ScenePlaceholder scene="hero" />
      <div>
        <h1>Uptime monitoring for your NZBs</h1>
        <p>
          Your NZB files point to pieces of files stored on Usenet, and those pieces disappear over time.
          nzbs.live checks every one of them each month and tells you which are gone.
        </p>
        <p>One check per article, on the 1st of every month</p>
        <div>
          <ButtonLink href={SIGNUP_URL}>Start monitoring</ButtonLink>
          <ButtonLink href="#forgets" variant="ghost">
            See how it works
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
