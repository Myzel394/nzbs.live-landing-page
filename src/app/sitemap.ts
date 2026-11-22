import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config";

// One page. No lastModified: a build date would claim changes that didn't happen.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL }];
}
