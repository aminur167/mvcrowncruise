import { Tag } from "lucide-react";
import type { PackageOffer } from "@/lib/api/types";

/** The offer's name, and what it takes off.
 *
 *  Renders nothing when there is no offer, so a card can drop it in
 *  unconditionally rather than guarding at every call site.
 *
 *  The saving is read off the server's own figures rather than recomputed
 *  here: a badge that did its own arithmetic could advertise a discount the
 *  checkout then refuses.
 */
export function OfferBadge({
  offer,
  className = "",
}: {
  offer: PackageOffer | null;
  className?: string;
}) {
  if (!offer) return null;

  const saving =
    offer.discount_type === "percent"
      ? `${Number.parseFloat(offer.discount_value)}% off`
      : `৳${Number.parseFloat(offer.discount_value).toLocaleString("en-BD")} off`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gold/15 text-gold-text px-3 py-1 text-[11px] font-semibold ${className}`}
    >
      <Tag aria-hidden="true" className="size-3" />
      {offer.label || saving}
      {offer.label && <span className="font-normal opacity-80">· {saving}</span>}
    </span>
  );
}
