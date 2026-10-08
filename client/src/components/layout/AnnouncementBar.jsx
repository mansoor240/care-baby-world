import { storeConfig } from "../../config/store";

const messages = [
  "🚚 Free delivery on orders above ₹999",
  "🎁 Use code WELCOME10 for 10% off your first order",
  "⭐ Trusted by 10,000+ parents in Hyderabad",
  "🎉 New arrivals every week",
];

export default function AnnouncementBar() {
  return (
    <div className="bg-ink-900 text-white overflow-hidden">
      <div className="relative flex whitespace-nowrap py-2 text-xs sm:text-sm">
        {/* Duplicate messages twice for seamless loop */}
        {[0, 1].map((group) => (
          <div
            key={group}
            className="flex animate-[marquee_30s_linear_infinite] gap-12 px-6"
            aria-hidden={group === 1}
          >
            {messages.map((m, i) => (
              <span key={i} className="flex items-center gap-2">
                {m}
                <span className="text-white/40">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}