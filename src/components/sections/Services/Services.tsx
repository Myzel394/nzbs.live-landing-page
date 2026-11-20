import { SERVICES } from "@/data/services";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title">
      <div>
        <p>{SERVICES.length} services, through Shoutrrr</p>
        <h2 id="services-title">Wherever you already look</h2>
        <p>Chat apps, push services, email, smart-home hubs or a plain webhook. Pick one, or several.</p>
      </div>
      {/* Logos, rings and the radar sweep arrive in steps 4 and 8. */}
      <ul aria-label="Supported notification services">
        {SERVICES.map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>
    </section>
  );
}
