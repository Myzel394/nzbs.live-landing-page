"use client";

import dynamic from "next/dynamic";
import styles from "./Story.module.css";

// The scene's text alternative: on the placeholder first, then on the canvas.
const LABEL =
  "An NZB file. A block of cubes, the file it stands for, grows out of it, then comes apart into its parts and articles, which scatter. The NZB is a list of them. A downloader joins them again, until articles drop out and the file cannot be joined.";

// The canvas code loads in its own chunk, after the page is interactive. Until then (and without
// JavaScript) an empty box of the same size holds its place and its text alternative.
const StoryCanvas = dynamic(() => import("./StoryCanvas").then((m) => m.StoryCanvas), {
  ssr: false,
  loading: () => <div className={styles.canvas} role="img" aria-label={LABEL} />,
});

/** The cube scene of "Usenet forgets, slowly", driven by scrolling through the list `stepsId`. */
export function StoryScene({ stepsId }: { stepsId: string }) {
  return <StoryCanvas label={LABEL} stepsId={stepsId} />;
}
