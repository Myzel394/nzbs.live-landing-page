// Every notification service nzbs.live can send to: what github.com/nicholas-fedor/shoutrrr v0.25.0
// routes (pkg/router/servicemap.go), minus its "logger". Order is the radar order: weight 3 is the
// inner ring, 1 the outer. URL formats are shortened from the Shoutrrr docs.
// Logos: Simple Icons (CC0) for most; homarr-labs/dashboard-icons for Slack, Gotify, Teams, Pushover,
// Twilio, Notifiarr, Lark, Webhooks and Bark; Lucide (ISC) for mail; the site icons of Signalgrid and WeCom.
// Join has no logo (the only icon found belongs to its maker's other app), so it shows a lettermark.

export type Service = {
  name: string;
  logo: string | null; // file in public/logos, or null for a lettermark
  weight: 1 | 2 | 3;
  url: string; // Shoutrrr URL format
};

export const SERVICES: readonly Service[] = [
  { name: "ntfy", logo: "ntfy.svg", weight: 3, url: "ntfy://HOST/TOPIC" },
  { name: "Discord", logo: "discord.svg", weight: 3, url: "discord://TOKEN@WEBHOOK_ID" },
  { name: "Telegram", logo: "telegram.svg", weight: 3, url: "telegram://TOKEN@telegram?chats=CHAT" },
  { name: "Slack", logo: "slack.svg", weight: 3, url: "slack://hook:TOKEN@webhook" },
  { name: "Email", logo: "email.svg", weight: 3, url: "smtp://USER:PASSWORD@HOST:PORT/?fromaddress=FROM&toaddresses=TO" },
  { name: "Signal", logo: "signal.svg", weight: 3, url: "signal://HOST/SOURCE_PHONE/RECIPIENT" },
  { name: "Matrix", logo: "matrix.svg", weight: 3, url: "matrix://USER:PASSWORD@HOST/?rooms=ROOM" },
  { name: "Gotify", logo: "gotify.svg", weight: 2, url: "gotify://HOST/TOKEN" },
  { name: "Microsoft Teams", logo: "microsoft-teams.svg", weight: 2, url: "teams://?host=WORKFLOW_URL" },
  { name: "Pushover", logo: "pushover.svg", weight: 2, url: "pushover://shoutrrr:API_TOKEN@USER_KEY/" },
  { name: "Home Assistant", logo: "homeassistant.svg", weight: 2, url: "homeassistant://LONG_LIVED_TOKEN@HOST" },
  { name: "Webhooks", logo: "webhook.svg", weight: 2, url: "generic://webhook.example.com/alert" },
  { name: "Mattermost", logo: "mattermost.svg", weight: 2, url: "mattermost://HOST/TOKEN" },
  { name: "Pushbullet", logo: "pushbullet.svg", weight: 2, url: "pushbullet://API_TOKEN" },
  { name: "Google Chat", logo: "googlechat.svg", weight: 2, url: "googlechat://chat.googleapis.com/v1/spaces/SPACE_ID/messages?key=KEY&token=TOKEN" },
  { name: "Rocket.Chat", logo: "rocketdotchat.svg", weight: 1, url: "rocketchat://HOST/INTEGRATION_ID/TOKEN" },
  { name: "Zulip", logo: "zulip.svg", weight: 1, url: "zulip://BOT_MAIL:BOT_KEY@HOST/?stream=STREAM" },
  { name: "Bark", logo: "bark.png", weight: 1, url: "bark://:DEVICE_KEY@HOST" },
  { name: "IFTTT", logo: "ifttt.svg", weight: 1, url: "ifttt://KEY/?events=EVENT" },
  { name: "Join", logo: null, weight: 1, url: "join://shoutrrr:API_KEY@join/?devices=DEVICE_ID" },
  { name: "Lark", logo: "lark.svg", weight: 1, url: "lark://HOST/TOKEN" },
  { name: "MQTT", logo: "mqtt.svg", weight: 1, url: "mqtt://broker.example.com:1883/home/alerts" },
  { name: "Notifiarr", logo: "notifiarr.svg", weight: 1, url: "notifiarr://API_KEY" },
  { name: "Opsgenie", logo: "opsgenie.svg", weight: 1, url: "opsgenie://api.opsgenie.com/API_KEY" },
  { name: "PagerDuty", logo: "pagerduty.svg", weight: 1, url: "pagerduty:///INTEGRATION_KEY" },
  { name: "Signalgrid", logo: "fav-signalgrid.co.png", weight: 1, url: "signalgrid://CLIENT_KEY@CHANNEL" },
  { name: "Twilio SMS", logo: "twilio.svg", weight: 1, url: "twilio://ACCOUNT_SID:AUTH_TOKEN@FROM_NUMBER/TO_NUMBER" },
  { name: "WeCom", logo: "fav-work.weixin.qq.com.png", weight: 1, url: "wecom://KEY" },
  { name: "XMPP", logo: "xmpp.svg", weight: 1, url: "xmpp://USER:PASSWORD@HOST/?to=RECIPIENT" },
];
