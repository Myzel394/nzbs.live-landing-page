import styles from "./Story.module.css";
import { StoryScene } from "./StoryScene";

// The eight scroll steps of "Usenet forgets, slowly". The cube scene follows them.
const STEPS = [
  {
    title: "It starts with an NZB",
    text: "A small file from an indexer, a few hundred kilobytes. You hand it to your downloader and get a whole film back.",
  },
  {
    title: "Behind it, one big file",
    text: "The NZB stands for a film, a show, a full folder, or just one file, many gigabytes.",
  },
  {
    title: "Split into articles",
    text: "Before it is posted, the file is split into many parts, and every part is cut into small pieces called articles. Repair files, par2, travel with them.",
  },
  {
    title: "Spread across Usenet",
    text: "Every article is posted on its own.",
  },
  {
    title: "The NZB is only the list",
    text: "The NZB you started with does not contain the actual file. It is a map and points to every article that makes up the file.",
  },
  {
    title: "Your downloader puts it back",
    text: "SABnzbd or NZBGet read the map, fetch every article and join the pieces into the file again.",
  },
  {
    title: "Then Usenet forgets",
    text: "Providers drop articles over time, for example when retention runs out. The NZB never changes. The pieces it points to do.",
  },
  {
    title: "One gap is enough",
    text: "With pieces gone, the file cannot be joined. par2 repair data covers a few gaps, until there are too many. Your downloader might only find out at 97%.",
  },
] as const;

const STEPS_ID = "forgets-steps";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Usenet forgets, slowly": a pinned canvas with the steps scrolling over it. The section heading
 * opens the first step, as in the mockup.
 */
export function Story() {
  return (
    <section id="forgets" aria-labelledby="forgets-title" className={styles.story}>
      <div className={styles.pin}>
        <StoryScene stepsId={STEPS_ID} />
      </div>
      <ol id={STEPS_ID} className={styles.steps} role="list">
        {STEPS.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <div className={styles.card}>
              {i === 0 && (
                <>
                  <p className={styles.label}>How an NZB works</p>
                  <h2 id="forgets-title" className={styles.title}>
                    Usenet forgets, slowly
                  </h2>
                  <p className={styles.lede}>
                    First, let's find out what an NZB file actually is.{" "}
                    <a className={styles.skip} href="#early">
                      Know how Usenet works? Skip ahead
                    </a>
                  </p>
                </>
              )}
              <p className={styles.number} aria-hidden="true">
                {pad(i + 1)} / {pad(STEPS.length)}
              </p>
              <h3 className={styles.heading}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
