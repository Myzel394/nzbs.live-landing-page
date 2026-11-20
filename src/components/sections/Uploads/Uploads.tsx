import { ScenePlaceholder } from "@/components/ScenePlaceholder";
import { ALERT_RULE, METRICS_SAMPLE } from "@/data/exporter";

export function Uploads() {
  return (
    <section id="prom" aria-labelledby="prom-title">
      {/* The availability chart, crosshair and month readout arrive in steps 4 and 8. */}
      <ScenePlaceholder
        scene="uploads"
        label="Nine NZBs as lines across a year of monthly checks. Two sink below the waterline at 0.99, Caminandes in July and Spring.2019 in November."
      />
      <div>
        <p>For uploaders: Prometheus exporter</p>
        <h2 id="prom-title">Watch how your uploads hold up</h2>
        <p>
          Upload to Usenet yourself? nzbs.live has a Prometheus exporter. Every NZB becomes a line in your graphs, so
          you see which uploads are fading and replace them before they sink.
        </p>
      </div>
      <div>
        <p>GET /metrics</p>
        <pre>
          <code>{METRICS_SAMPLE.join("\n")}</code>
        </pre>
      </div>
      <div>
        <p>Alert when an upload sinks</p>
        <code>{ALERT_RULE}</code>
        <p>Straight into Grafana, Alertmanager or the dashboards you already use.</p>
      </div>
    </section>
  );
}
