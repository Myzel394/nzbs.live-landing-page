import { Phone } from "./Phone";

export function Notify() {
  return (
    <section id="notify" aria-labelledby="notify-title">
      <div>
        <p>On the 1st</p>
        <h2 id="notify-title">One message, when the check is done</h2>
        <p>
          A few minutes after midnight on the 1st, nzbs.live sends one short message: how many NZBs lost articles,
          and how many articles. On a quiet month it tells you everything is good.
        </p>
      </div>
      <Phone />
    </section>
  );
}
