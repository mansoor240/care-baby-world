import { storeConfig } from "../../config/store";

export default function AnnouncementBar() {
  return (
    <div className="bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs sm:text-sm">
        {storeConfig.announcement}
      </div>
    </div>
  );
}