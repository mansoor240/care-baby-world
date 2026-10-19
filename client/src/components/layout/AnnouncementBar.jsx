import { storeConfig } from "../../config/store";

export default function AnnouncementBar() {
  return (
    <div className="bg-ink-900 text-white dark:bg-night-950 dark:border-b dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs sm:text-sm">
        {storeConfig.announcement}
      </div>
    </div>
  );
}