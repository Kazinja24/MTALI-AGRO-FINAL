import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSetting } from "./api";

let settingsCache: SiteSetting[] | null = null;
let settingsPromise: Promise<SiteSetting[]> | null = null;

export async function fetchSiteSettings(): Promise<SiteSetting[]> {
  if (settingsCache) return settingsCache;
  if (!settingsPromise) {
    settingsPromise = getSiteSettings()
      .then((settings) => {
        settingsCache = settings;
        return settings;
      })
      .catch((err) => {
        settingsPromise = null;
        throw err;
      });
  }
  return settingsPromise;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings()
      .then((settings) => {
        if (mounted) setSettings(settings);
      })
      .catch(() => {
        if (mounted) setSettings([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}

export function getSettingValue(settings: SiteSetting[], key: string, fallback: string) {
  const setting = settings.find((item) => item.key === key);
  return setting?.value ?? fallback;
}
