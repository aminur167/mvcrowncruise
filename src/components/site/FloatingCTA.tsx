import { MessageCircle, Phone } from "lucide-react";
import { primaryPhone, telHref, whatsappUrl } from "@/lib/company";

export function FloatingCTA() {
  return (
    <div className="fixed right-4 md:right-6 bottom-6 z-40 flex flex-col gap-3">
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        className="size-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-luxe hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="size-6" />
      </a>
      <a
        href={telHref(primaryPhone)}
        className="size-14 rounded-full gradient-gold text-ocean grid place-items-center shadow-gold hover:scale-110 transition-transform"
        aria-label="Call"
      >
        <Phone className="size-5" />
      </a>
    </div>
  );
}
