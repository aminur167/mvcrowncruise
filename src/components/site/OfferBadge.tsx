import { Tag } from "lucide-react";
import type { PackageOffer } from "@/lib/api/types";
import { readOffer } from "@/lib/offer";

/** The offer's name, and what it takes off.
 *
 *  Renders nothing when there is no offer, so a card can drop it in
 *  unconditionally rather than guarding at every call site.
 *
 *  The saving is read off the server's own figures rather than recomputed
 *  here: a badge that did its own arithmetic could advertise a discount the
 *  checkout then refuses.
 *
 *  ⚠ This badge sits on a PHOTOGRAPH on all three cards, which is why it is
 *  a solid fill and not a tint. A translucent gold over a mid-tone photo
 *  measured 1.65:1 against a 4.5:1 floor — legible on the dark sample image
 *  and effectively invisible on a bright one. text-ocean on the gradient's
 *  dark end was 4.25:1, still short; midnight is 5.58:1 at its worst.
 */
export function OfferBadge({
  offer,
  className = "",
}: {
  offer: PackageOffer | null;
  className?: string;
}) {
  const live = readOffer(offer);
  // Null when the payload carries no readable amount — better no badge than a
  // badge reading "৳NaN off per cabin", which is what an unguarded
  // parseFloat put on the live site across a photograph.
  if (!live) return null;

  const amount = Number.parseFloat(live.value).toLocaleString("en-BD");
  // A fixed amount says "per cabin" out loud. It comes off the cabin, not the
  // person, and a reader who assumes otherwise is reading it as worse value
  // than it is — four travellers share one discount, not a quarter each.
  const saving = live.type === "percent" ? `${amount}% off` : `৳${amount} off per cabin`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full gradient-gold text-midnight px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] shadow-luxe ${className}`}
    >
      <Tag aria-hidden="true" className="size-3 shrink-0" />
      {/* The label steps back by WEIGHT, never opacity: faded, this measured
          2.77:1 on the same photographs. What it steps back FROM is the
          saving, which is the part worth reading across a room. */}
      <span className="font-semibold">{live.label || saving}</span>
      {live.label && <span className="font-extrabold">· {saving}</span>}
    </span>
  );
}
