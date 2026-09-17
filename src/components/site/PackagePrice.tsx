import type { PackageOffer } from "@/lib/api/types";
import { formatBDT } from "@/lib/money";

/** A sailing's per-adult price, struck through when an offer applies.
 *
 *  Both figures come from the server's `offer` object — the browser never
 *  works out the discount for itself, or a card could show one number while
 *  the checkout charges another.
 *
 *  The old price is marked up with `<s>` rather than a line-through class:
 *  the strike is what makes the number mean "not this any more", and a screen
 *  reader announcing two prices with no relation between them is worse than
 *  announcing one.
 */
export function PackagePrice({
  adultPrice,
  offer,
  size = "md",
}: {
  adultPrice: string;
  offer: PackageOffer | null;
  /** "lg" for the package page's own header, "md" for cards. */
  size?: "md" | "lg";
}) {
  const now = offer ? offer.now_price : adultPrice;
  const nowClass = size === "lg" ? "text-3xl" : "text-xl";

  return (
    <span className="inline-flex items-baseline gap-2 flex-wrap">
      {offer && (
        <s className="text-sm text-muted-foreground decoration-muted-foreground/60">
          {formatBDT(offer.was_price)}
        </s>
      )}
      <span className={`font-display ${nowClass} text-gold-text`}>{formatBDT(now)}</span>
      <span className="text-xs text-muted-foreground">per adult</span>
    </span>
  );
}
