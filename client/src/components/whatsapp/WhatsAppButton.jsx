import { MessageCircle } from "lucide-react";
import { whatsappLink, whatsappMessages } from "../../lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(whatsappMessages.general)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-sage-500 text-white shadow-soft hover:bg-sage-400 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} />
    </a>
  );
}