import type { IconType } from "react-icons";
import { BsMicrosoftTeams, BsSlack } from "react-icons/bs";
import { CgTwilio } from "react-icons/cg";
import { RiMailFill, RiWebhookFill } from "react-icons/ri";
import {
  SiDiscord,
  SiGooglechat,
  SiHomeassistant,
  SiIfttt,
  SiMatrix,
  SiMattermost,
  SiMqtt,
  SiNtfy,
  SiOpsgenie,
  SiPagerduty,
  SiPushbullet,
  SiRocketdotchat,
  SiSignal,
  SiTelegram,
  SiXmpp,
  SiZulip,
} from "react-icons/si";
import { TbBrandPushover } from "react-icons/tb";

type Service = {
  name: string;
  /** Logo; services no permissive icon pack covers show their name only. */
  icon?: IconType;
  /** Radar ring: 3 is the inner ring, 1 the outer. */
  weight: 1 | 2 | 3;
  /** Shoutrrr URL format, shortened from the Shoutrrr docs. */
  url: string;
};

// Every service nzbs.live can notify through: what github.com/nicholas-fedor/shoutrrr v0.25.0 routes
// (pkg/router/servicemap.go), minus its "logger", in radar order.
// Logos come from react-icons, permissive packs only: Simple Icons (CC0), Bootstrap, css.gg and Tabler (MIT),
// Remix (Apache-2.0). This is a Server Component, so the icon packs never reach the browser.
export const SERVICES: readonly Service[] = [
  { name: "ntfy", icon: SiNtfy, weight: 3, url: "ntfy://HOST/TOPIC" },
  { name: "Discord", icon: SiDiscord, weight: 3, url: "discord://TOKEN@WEBHOOK_ID" },
  { name: "Telegram", icon: SiTelegram, weight: 3, url: "telegram://TOKEN@telegram?chats=CHAT" },
  { name: "Slack", icon: BsSlack, weight: 3, url: "slack://hook:TOKEN@webhook" },
  { name: "Email", icon: RiMailFill, weight: 3, url: "smtp://USER:PASSWORD@HOST:PORT/?fromaddress=FROM&toaddresses=TO" },
  { name: "Signal", icon: SiSignal, weight: 3, url: "signal://HOST/SOURCE_PHONE/RECIPIENT" },
  { name: "Matrix", icon: SiMatrix, weight: 3, url: "matrix://USER:PASSWORD@HOST/?rooms=ROOM" },
  { name: "Gotify", weight: 2, url: "gotify://HOST/TOKEN" },
  { name: "Microsoft Teams", icon: BsMicrosoftTeams, weight: 2, url: "teams://?host=WORKFLOW_URL" },
  { name: "Pushover", icon: TbBrandPushover, weight: 2, url: "pushover://shoutrrr:API_TOKEN@USER_KEY/" },
  { name: "Home Assistant", icon: SiHomeassistant, weight: 2, url: "homeassistant://LONG_LIVED_TOKEN@HOST" },
  { name: "Webhooks", icon: RiWebhookFill, weight: 2, url: "generic://webhook.example.com/alert" },
  { name: "Mattermost", icon: SiMattermost, weight: 2, url: "mattermost://HOST/TOKEN" },
  { name: "Pushbullet", icon: SiPushbullet, weight: 2, url: "pushbullet://API_TOKEN" },
  { name: "Google Chat", icon: SiGooglechat, weight: 2, url: "googlechat://chat.googleapis.com/v1/spaces/SPACE_ID/messages?key=KEY&token=TOKEN" },
  { name: "Rocket.Chat", icon: SiRocketdotchat, weight: 1, url: "rocketchat://HOST/INTEGRATION_ID/TOKEN" },
  { name: "Zulip", icon: SiZulip, weight: 1, url: "zulip://BOT_MAIL:BOT_KEY@HOST/?stream=STREAM" },
  { name: "Bark", weight: 1, url: "bark://:DEVICE_KEY@HOST" },
  { name: "IFTTT", icon: SiIfttt, weight: 1, url: "ifttt://KEY/?events=EVENT" },
  { name: "Join", weight: 1, url: "join://shoutrrr:API_KEY@join/?devices=DEVICE_ID" },
  { name: "Lark", weight: 1, url: "lark://HOST/TOKEN" },
  { name: "MQTT", icon: SiMqtt, weight: 1, url: "mqtt://broker.example.com:1883/home/alerts" },
  { name: "Notifiarr", weight: 1, url: "notifiarr://API_KEY" },
  { name: "Opsgenie", icon: SiOpsgenie, weight: 1, url: "opsgenie://api.opsgenie.com/API_KEY" },
  { name: "PagerDuty", icon: SiPagerduty, weight: 1, url: "pagerduty:///INTEGRATION_KEY" },
  { name: "Signalgrid", weight: 1, url: "signalgrid://CLIENT_KEY@CHANNEL" },
  { name: "Twilio SMS", icon: CgTwilio, weight: 1, url: "twilio://ACCOUNT_SID:AUTH_TOKEN@FROM_NUMBER/TO_NUMBER" },
  { name: "WeCom", weight: 1, url: "wecom://KEY" },
  { name: "XMPP", icon: SiXmpp, weight: 1, url: "xmpp://USER:PASSWORD@HOST/?to=RECIPIENT" },
];

type RadarItem = Service & {
  left: number; // % of the radar's width
  top: number; // % of the radar's height
  depth: number; // scale, 0.84 (back) to 1 (front)
  zIndex: number;
  sweepDeg: number; // conic-gradient angle (0 = up, clockwise), for the radar sweep
};

/**
 * Places every service on its ring (inner ring first), spread evenly from the ring's start angle.
 * The rings are ellipses (the radar is tilted), so y uses 44.6% instead of 50%.
 */
export function radarLayout(services: readonly Service[] = SERVICES): RadarItem[] {
  return [
    { weight: 3, radius: 0.34, startDeg: -80 },
    { weight: 2, radius: 0.6, startDeg: -62 },
    { weight: 1, radius: 0.88, startDeg: -95 },
  ].flatMap((ring) => {
    const items = services.filter((s) => s.weight === ring.weight);
    return items.map((service, k) => {
      const a = ((ring.startDeg + (360 * k) / items.length) * Math.PI) / 180;
      const sin = Math.sin(a);
      return {
        ...service,
        left: 50 + Math.cos(a) * ring.radius * 50,
        top: 50 + sin * ring.radius * 44.6,
        depth: 0.84 + (0.16 * (1 + sin)) / 2,
        zIndex: Math.trunc(10 + sin * 5),
        sweepDeg: ((((a * 180) / Math.PI + 90) % 360) + 360) % 360,
      };
    });
  });
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title">
      <div>
        <p>{SERVICES.length} services, through Shoutrrr</p>
        <h2 id="services-title">Wherever you already look</h2>
        <p>Chat apps, push services, email, smart-home hubs or a plain webhook. Pick one, or several.</p>
      </div>
      {/* Rings and the radar sweep arrive in steps 4 and 8. */}
      <ul aria-label="Supported notification services">
        {SERVICES.map(({ name, icon: Icon }) => (
          <li key={name}>
            {Icon && <Icon aria-hidden="true" focusable="false" />}
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
